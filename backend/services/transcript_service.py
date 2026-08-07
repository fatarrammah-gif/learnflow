"""
Transcript fetching and intelligent sampling for long videos.

Sampling strategy (Phase 4):
1. Fetch via youtube-transcript-api
2. Count tokens with tiktoken
3. If < 4000 tokens: use full transcript
4. If >= 4000 tokens:
   - Try chapter detection from video description timestamps
   - Fall back to TF-IDF window sampling (60-second windows)
"""


class TranscriptService:
    async def fetch_transcript(self, video_id: str) -> dict:
        """
        Fetch and optionally sample a video's transcript.
        Returns {full_text, is_sampled, sampled_chunks, token_count}
        Phase 4 implementation.
        """
        raise NotImplementedError("Transcript service coming in Phase 4")
