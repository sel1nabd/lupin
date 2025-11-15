"""
Perplexity AI Integration for Exploit Discovery
Uses Perplexity Sonar API to search for known prompt injection exploits
"""

import os
import httpx
from typing import List, Dict, Optional
from datetime import datetime
import re


class PerplexityService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai"
        self.model = "llama-3.1-sonar-large-128k-online"

    async def search_exploits(self, query: Optional[str] = None) -> List[Dict]:
        """
        Search for prompt injection exploits using Perplexity
        Returns structured exploit data
        """
        if not self.api_key:
            raise ValueError("Perplexity API key not found")

        # Default query if none provided
        if not query:
            query = """Find recent prompt injection exploits, jailbreak techniques, and LLM security vulnerabilities.
            Include the technique name, description, type (jailbreak/injection/bypass), and severity level.
            Focus on well-documented exploits from 2023-2024."""

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a cybersecurity expert specializing in LLM security. Provide structured, factual information about prompt injection exploits."
                            },
                            {
                                "role": "user",
                                "content": query
                            }
                        ],
                        "temperature": 0.2,
                        "max_tokens": 2000
                    },
                    timeout=30.0
                )

                if response.status_code != 200:
                    raise Exception(f"Perplexity API error: {response.status_code}")

                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

                # Parse the response into structured exploits
                exploits = self._parse_exploits(content)
                return exploits

            except Exception as e:
                print(f"Error searching exploits with Perplexity: {e}")
                return []

    def _parse_exploits(self, content: str) -> List[Dict]:
        """
        Parse Perplexity response into structured exploit data
        This is a simple parser - in production you'd want more sophisticated NLP
        """
        exploits = []

        # Try to extract exploit information from the text
        # Look for common patterns like numbered lists or bullet points
        lines = content.split('\n')

        current_exploit = {}
        for line in lines:
            line = line.strip()

            # Skip empty lines
            if not line:
                if current_exploit and 'title' in current_exploit:
                    exploits.append(current_exploit)
                    current_exploit = {}
                continue

            # Look for titles (numbered or bullet points)
            if re.match(r'^(\d+\.|\*|-)\s+', line):
                if current_exploit and 'title' in current_exploit:
                    exploits.append(current_exploit)

                title = re.sub(r'^(\d+\.|\*|-)\s+', '', line)
                # Remove **markdown** formatting
                title = re.sub(r'\*\*(.*?)\*\*', r'\1', title)

                current_exploit = {
                    'title': title.strip(),
                    'description': '',
                    'exploit_type': self._detect_type(title),
                    'severity': 'medium',  # Default
                    'source': 'Perplexity AI',
                    'source_type': 'perplexity'
                }

            # Look for description
            elif current_exploit and 'title' in current_exploit:
                # Check for severity indicators
                lower_line = line.lower()
                if 'high' in lower_line or 'critical' in lower_line or 'severe' in lower_line:
                    current_exploit['severity'] = 'high'
                elif 'low' in lower_line:
                    current_exploit['severity'] = 'low'

                # Append to description
                if current_exploit['description']:
                    current_exploit['description'] += ' ' + line
                else:
                    current_exploit['description'] = line

        # Add the last exploit if any
        if current_exploit and 'title' in current_exploit:
            exploits.append(current_exploit)

        # Generate CVE IDs and clean up
        for i, exploit in enumerate(exploits, 1):
            if not exploit.get('description'):
                exploit['description'] = exploit['title']

            # Ensure we have required fields
            exploit.setdefault('exploit_type', 'unknown')
            exploit.setdefault('severity', 'medium')

        return exploits[:10]  # Limit to top 10 results

    def _detect_type(self, text: str) -> str:
        """Detect exploit type from text"""
        text_lower = text.lower()

        if 'jailbreak' in text_lower or 'dan' in text_lower:
            return 'jailbreak'
        elif 'injection' in text_lower:
            return 'injection'
        elif 'bypass' in text_lower:
            return 'bypass'
        elif 'override' in text_lower:
            return 'override'
        elif 'extraction' in text_lower or 'leak' in text_lower:
            return 'extraction'
        elif 'obfuscation' in text_lower or 'encoding' in text_lower:
            return 'obfuscation'
        else:
            return 'unknown'


async def discover_exploits_with_perplexity(api_key: str) -> List[Dict]:
    """
    Main function to discover exploits using Perplexity
    """
    service = PerplexityService(api_key)
    return await service.search_exploits()
