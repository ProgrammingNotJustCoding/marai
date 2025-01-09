import time
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from utils.format import format_uptime

router = APIRouter()

START_TIME = time.time()


@router.get("/health")
def get_health():
    uptime_seconds = time.time() - START_TIME

    content = {
        "status": "UP",
        "message": "Service is healthy",
        "prettyMessage": f"Service is healthy, active for {format_uptime(uptime_seconds)}",
        "data": {
            "uptime": uptime_seconds
        }
    }
    return JSONResponse(content=content)


@router.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"])
async def catch_all(request: Request, path_name: str):
    return JSONResponse(
        status_code=404,
        content={
            "status": 404,
            "message": f"Route '{request.method} /{path_name}' not found",
            "prettyMessage": "The requested route was not found on this server",
        }
    )
