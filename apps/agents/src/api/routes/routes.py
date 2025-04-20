from fastapi import APIRouter, Body, UploadFile, File
from fastapi.responses import JSONResponse

from ..handlers import handle_legal_chat, handle_contract_generation, handle_contract_analysis

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

@router.post("/legal-chat")
async def legal_chat(query: str = Body(..., embed=True), enable_search: bool = Body(False, embed=True)):
    response, status_code = handle_legal_chat(query, enable_search)
    return JSONResponse(content=response, status_code=status_code)

@router.post("/contract-generate")
async def contract_generate(case_details: str = Body(..., embed=True)):
    response, status_code = handle_contract_generation(case_details)
    return JSONResponse(content=response, status_code=status_code)

@router.post("/contract-analysis")
async def contract_analysis(file: UploadFile = File(...), query: str = Body(None, embed=True)):
    response, status_code = await handle_contract_analysis(file, query)
    return JSONResponse(content=response, status_code=status_code)
