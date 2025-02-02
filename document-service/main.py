import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from highlighter.routes import router

app = FastAPI()

app.include_router(prefix="/api", router=router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("PORT", 5002)))