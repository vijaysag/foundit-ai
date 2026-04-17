from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from contextlib import asynccontextmanager
from models.database import setup_indexes
from routes import auth_routes, item_routes, claim_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup database indexes on startup
    await setup_indexes()
    yield

app = FastAPI(title="FoundIt AI API", lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_routes.router, prefix="/api")
app.include_router(item_routes.router, prefix="/api")
app.include_router(claim_routes.router, prefix="/api")

# Static files for uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
