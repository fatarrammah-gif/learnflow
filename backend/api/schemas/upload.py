from typing import Optional
from pydantic import BaseModel, ConfigDict


class UploadUrlRequest(BaseModel):
    url: str


class UploadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    goal_id: int
    upload_type: str
    original_url: Optional[str]
    file_path: Optional[str]
    parsed_content: Optional[str]
