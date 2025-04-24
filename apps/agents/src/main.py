from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from config import get_logger
from api.routes import router

logger = get_logger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.exception_handler(404)
async def custom_404_handler(request: Request, _):
    return JSONResponse(
        content={
            "status": 404,
            "message": "NOT_FOUND",
            "prettyMessage": "The requested resource was not found.",
        },
        status_code=404
    )

if __name__ == "__main__":
    import uvicorn
    from config import env

    logger.info("Starting server...")

    uvicorn.run(
        app,
        host=env["HOST"],
        port=int(env["PORT"]),
    )
