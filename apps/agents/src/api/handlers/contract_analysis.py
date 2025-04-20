from fastapi import UploadFile
from typing import Tuple, Dict, Any, Optional
import os
import logging

from agents_config.contract_analysis import run_contract_analysis

async def handle_contract_analysis(file: UploadFile, query: Optional[str] = None) -> Tuple[Dict[str, Any], int]:
    try:
        file_content = await file.read()
        
        logging.info(f"Processing file: {file.filename}, content type: {file.content_type}, size: {len(file_content)} bytes")
        
        file_type = file.content_type or "application/octet-stream"
        

        _, file_ext = os.path.splitext(file.filename.lower())
        if file_ext == '.pdf':
            logging.info("PDF file detected by extension")
            file_type = "application/pdf"
            

        supported_types = [
            "application/pdf", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg", 
            "image/png", 
            "text/plain"
        ]
        
        supported_extensions = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png']
        
        if file_type not in supported_types and file_ext not in supported_extensions:
            logging.warning(f"Unsupported file type: {file_type}, extension: {file_ext}")
            return {
                "status": "error",
                "message": f"Unsupported file type: {file_type}. Supported files: PDF, Word documents, images, and text files."
            }, 400
            
        result, status_code = run_contract_analysis(file_content, file_type, query)
        
        return result, status_code

    except Exception as e:
        logging.error(f"Error in contract_analysis handler: {str(e)}")
        return {
            "status": "error",
            "message": f"An error occurred while processing the contract: {str(e)}"
        }, 500