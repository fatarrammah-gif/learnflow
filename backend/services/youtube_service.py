"""YouTube Data API v3 integration for video search and metadata."""


class YoutubeService:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search_videos(self, query: str, max_results: int = 20) -> list:
        """
        Search YouTube for videos matching the query.
        Returns list of video metadata dicts.
        Phase 4 implementation.
        """
        raise NotImplementedError("YouTube search coming in Phase 4")

    async def get_video_metadata(self, video_id: str) -> dict:
        """Get title, duration, channel, thumbnail for a video. Phase 4."""
        raise NotImplementedError("Video metadata coming in Phase 4")
