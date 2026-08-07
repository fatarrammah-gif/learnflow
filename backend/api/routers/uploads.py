import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.database import get_db
from db.models import InspirationUpload, LearningGoal
from api.schemas.upload import UploadResponse
from config import get_settings

router = APIRouter(tags=["uploads"])
settings = get_settings()


def detect_upload_type(url: str) -> str:
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    return "webpage"


@router.post("/goals/{goal_id}/uploads", response_model=UploadResponse, status_code=201)
async def create_upload(
    goal_id: int,
    url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
):
    goal_result = await db.execute(select(LearningGoal).where(LearningGoal.id == goal_id))
    if not goal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Goal not found")

    upload_type = "webpage"
    file_path = None
    original_url = url
    parsed_content = None

    if file:
        # Save file to uploads directory
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(settings.UPLOAD_DIR, f"{goal_id}_{file.filename}")
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        ext = (file.filename or "").split(".")[-1].lower()
        if ext in ("jpg", "jpeg", "png", "gif", "webp"):
            upload_type = "image"
        elif ext == "pdf":
            upload_type = "pdf"
        parsed_content = f"Uploaded file: {file.filename}"
    elif url:
        upload_type = detect_upload_type(url)
        parsed_content = f"URL: {url}"
    else:
        raise HTTPException(status_code=400, detail="Provide either a file or a URL")

    upload = InspirationUpload(
        goal_id=goal_id,
        upload_type=upload_type,
        original_url=original_url,
        file_path=file_path,
        parsed_content=parsed_content,
    )
    db.add(upload)
    await db.commit()
    await db.refresh(upload)
    return upload


@router.get("/goals/{goal_id}/uploads", response_model=List[UploadResponse])
async def list_uploads(goal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InspirationUpload)
        .where(InspirationUpload.goal_id == goal_id)
        .order_by(InspirationUpload.created_at)
    )
    return result.scalars().all()


@router.delete("/goals/{goal_id}/uploads/{upload_id}", status_code=204)
async def delete_upload(goal_id: int, upload_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InspirationUpload).where(
            InspirationUpload.id == upload_id,
            InspirationUpload.goal_id == goal_id
        )
    )
    upload = result.scalar_one_or_none()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    if upload.file_path and os.path.exists(upload.file_path):
        os.remove(upload.file_path)
    await db.delete(upload)
    await db.commit()
