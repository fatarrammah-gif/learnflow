"""
Claude AI client for roadmap generation.
Phase 3 will implement the full roadmap generation prompt.
Currently a placeholder with the interface defined.
"""
from config import get_settings


class AnthropicClient:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.ANTHROPIC_API_KEY

    async def generate_roadmap(self, prompt: str) -> dict:
        """
        Call Claude to generate a structured roadmap JSON.
        Will be implemented in Phase 3 using the Anthropic SDK.
        """
        raise NotImplementedError("Claude integration coming in Phase 3")
