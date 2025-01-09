import os
from fastapi import FastAPI
from routes.app_routes import router as app_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(prefix="/api", router=app_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT"))
    uvicorn.run(app, host="127.0.0.1", port=port)
