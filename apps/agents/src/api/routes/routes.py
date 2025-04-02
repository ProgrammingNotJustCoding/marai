from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": 200,
            "message": "OK",
            "prettyMessage": "The service is running.",
        },
        status_code=200
    )