from datetime import datetime
from fastapi import APIRouter, File, UploadFile, HTTPException
from .content import extract_text_from_pdf, extract_text_from_docx
from .model import elaborate_on

router = APIRouter()

time = datetime.now()

@router.get("/health")
def health():
    return {
        "status": 200,
        "message": "OK",
        "prettyMessage": "The service is up and running",
        "uptime": str(datetime.now() - time)
    }

@router.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    if file.content_type == "application/pdf":
        with open(file.filename, "wb") as f:
            f.write(await file.read())
        text = extract_text_from_pdf(file.filename)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        with open(file.filename, "wb") as f:
            f.write(await file.read())
        text = extract_text_from_docx(file.filename)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    elaboration = elaborate_on(text)
    
    return {
        "status": 200,
        "message": "OK",
        "prettyMessage": "Text extracted successfully",
        "data": {
            "elaboration": elaboration
        }
    }