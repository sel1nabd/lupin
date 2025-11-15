"""
LUPIN Backend Server
LLM Security Testing Platform API
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os
from dotenv import load_dotenv

from app.database import get_db, init_db, engine
from app.models import Exploit, Base
from app.services.perplexity_service import PerplexityService

load_dotenv()

app = FastAPI(title="LUPIN API", version="1.0.0")

cors_origins_env = os.getenv(
    "CORS_ALLOW_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:5175",
)
allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class ExploitCreate(BaseModel):
    cve_id: str
    title: str
    description: str
    exploit_content: str
    exploit_type: str
    severity: str
    source: Optional[str] = "manual"
    source_type: Optional[str] = "manual"
    target_models: Optional[List[str]] = []
    mitigation: Optional[str] = None
    discovered_date: Optional[datetime] = None

class ExploitResponse(BaseModel):
    id: str
    cve_id: str
    title: str
    description: str
    exploit_content: str
    exploit_type: str
    severity: str
    source: Optional[str]
    source_type: str
    target_models: Optional[List[str]]
    mitigation: Optional[str]
    status: str
    discovered_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ExploitFilter(BaseModel):
    severity: Optional[str] = None
    exploit_type: Optional[str] = None
    status: Optional[str] = None
    search: Optional[str] = None

# Initialize database on startup
@app.on_event("startup")
async def startup():
    await init_db()
    print("🔒 LUPIN Backend Server Started")
    print("📡 API available at http://localhost:5000")

@app.get("/")
async def root():
    return {
        "name": "LUPIN API",
        "version": "1.0.0",
        "status": "running",
        "message": "LLM Security Testing Platform - Backend API"
    }

@app.get("/api/health")
async def health():
    return {"status": "ok", "database": "connected"}

# Exploits endpoints
@app.get("/api/exploits", response_model=List[ExploitResponse])
async def get_exploits(
    severity: Optional[str] = None,
    exploit_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all exploits with optional filtering"""
    query = select(Exploit)

    # Apply filters
    if severity:
        query = query.where(Exploit.severity == severity)
    if exploit_type:
        query = query.where(Exploit.exploit_type == exploit_type)
    if status:
        query = query.where(Exploit.status == status)
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Exploit.title.like(search_pattern)) |
            (Exploit.description.like(search_pattern)) |
            (Exploit.cve_id.like(search_pattern))
        )

    query = query.order_by(Exploit.created_at.desc())
    result = await db.execute(query)
    exploits = result.scalars().all()

    return exploits

@app.get("/api/exploits/{exploit_id}", response_model=ExploitResponse)
async def get_exploit(exploit_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific exploit by ID"""
    result = await db.execute(select(Exploit).where(Exploit.id == exploit_id))
    exploit = result.scalar_one_or_none()

    if not exploit:
        raise HTTPException(status_code=404, detail="Exploit not found")

    return exploit

@app.post("/api/exploits", response_model=ExploitResponse)
async def create_exploit(exploit_data: ExploitCreate, db: AsyncSession = Depends(get_db)):
    """Create a new exploit"""
    # Check if CVE ID already exists
    result = await db.execute(select(Exploit).where(Exploit.cve_id == exploit_data.cve_id))
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(status_code=400, detail="Exploit with this CVE ID already exists")

    exploit = Exploit(
        cve_id=exploit_data.cve_id,
        title=exploit_data.title,
        description=exploit_data.description,
        exploit_content=exploit_data.exploit_content,
        exploit_type=exploit_data.exploit_type,
        severity=exploit_data.severity,
        source=exploit_data.source,
        source_type=exploit_data.source_type,
        target_models=exploit_data.target_models,
        mitigation=exploit_data.mitigation,
        discovered_date=exploit_data.discovered_date or datetime.now(),
        status='active'
    )

    db.add(exploit)
    await db.commit()
    await db.refresh(exploit)

    return exploit

@app.delete("/api/exploits/{exploit_id}")
async def delete_exploit(exploit_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an exploit"""
    result = await db.execute(select(Exploit).where(Exploit.id == exploit_id))
    exploit = result.scalar_one_or_none()

    if not exploit:
        raise HTTPException(status_code=404, detail="Exploit not found")

    await db.execute(delete(Exploit).where(Exploit.id == exploit_id))
    await db.commit()

    return {"message": "Exploit deleted successfully", "id": exploit_id}

@app.get("/api/exploits/stats/summary")
async def get_exploit_stats(db: AsyncSession = Depends(get_db)):
    """Get summary statistics about exploits"""
    result = await db.execute(select(Exploit))
    all_exploits = result.scalars().all()

    high_severity = sum(1 for e in all_exploits if e.severity == 'high')

    return {
        "total": len(all_exploits),
        "high_severity": high_severity,
        "by_type": {},
        "by_severity": {
            "low": sum(1 for e in all_exploits if e.severity == 'low'),
            "medium": sum(1 for e in all_exploits if e.severity == 'medium'),
            "high": high_severity,
            "critical": sum(1 for e in all_exploits if e.severity == 'critical')
        }
    }

@app.post("/api/exploits/discover")
async def discover_exploits(api_key: str, db: AsyncSession = Depends(get_db)):
    """Discover new exploits using Perplexity AI"""
    try:
        service = PerplexityService(api_key)
        discovered = await service.search_exploits()

        added_exploits = []
        for exploit_data in discovered:
            # Generate unique CVE ID
            existing_count = len((await db.execute(select(Exploit))).scalars().all())
            cve_id = f"PIE-2024-{str(existing_count + 1).zfill(3)}"

            # Check if similar exploit already exists
            result = await db.execute(
                select(Exploit).where(Exploit.title == exploit_data['title'])
            )
            if result.scalar_one_or_none():
                continue  # Skip duplicates

            exploit = Exploit(
                cve_id=cve_id,
                title=exploit_data['title'],
                description=exploit_data['description'],
                exploit_content=exploit_data['description'],  # Use description as content for now
                exploit_type=exploit_data.get('exploit_type', 'unknown'),
                severity=exploit_data.get('severity', 'medium'),
                source=exploit_data.get('source', 'Perplexity AI'),
                source_type='perplexity',
                target_models=[],
                discovered_date=datetime.now(),
                status='active'
            )

            db.add(exploit)
            added_exploits.append(exploit)

        await db.commit()

        return {
            "message": f"Discovered and added {len(added_exploits)} new exploits",
            "count": len(added_exploits),
            "exploits": [
                {"cve_id": e.cve_id, "title": e.title, "severity": e.severity}
                for e in added_exploits
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error discovering exploits: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
