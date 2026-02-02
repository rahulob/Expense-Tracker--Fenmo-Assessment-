from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import create_indexes
from src.routes.ExpenseRouter import router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_origin_regex=r"https://.*\.vercel\.app", # For vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# health check
@app.get("/api/health")
def health_check():
    return {"message": "API is running"}

# create indexes
@app.on_event("startup")
async def startup_event():
    await create_indexes()

# include routers
app.include_router(router)