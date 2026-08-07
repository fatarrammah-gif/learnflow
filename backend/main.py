import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from api.routers import goals, criteria, uploads, roadmaps, nodes, resources, progress

settings = get_settings()

app = FastAPI(
    title="LearnFlow API",
    description="AI-powered YouTube tutorial learning management system",
    version="0.1.0",
)

# CORS — allows the frontend (Vercel/localhost) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    """Create upload directory and initialize database tables on startup."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    # Create all tables (for development — use Alembic for production)
    from db.database import engine, Base
    import db.models  # noqa: F401 — import to register models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok"}


# Register all API routers under /api/v1
prefix = "/api/v1"
app.include_router(goals.router, prefix=prefix)
app.include_router(criteria.router, prefix=prefix)
app.include_router(uploads.router, prefix=prefix)
app.include_router(roadmaps.router, prefix=prefix)
app.include_router(nodes.router, prefix=prefix)
app.include_router(resources.router, prefix=prefix)
app.include_router(progress.router, prefix=prefix)
