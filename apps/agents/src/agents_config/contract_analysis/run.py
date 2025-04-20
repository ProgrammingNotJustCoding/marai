import base64
import os
import tempfile
from io import BytesIO
from typing import List, Dict, Any, Optional
import logging
import fitz  
from PIL import Image

from agents_core.agents_factory import run_client
from .agents import (
    document_analyzer_agent,
    clause_extractor_agent,
    risk_assessment_agent,
    summarization_agent,
    query_response_agent
)

logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler("/tmp/contract_analysis.log"),
                             logging.StreamHandler()])

def encode_image_to_base64(file_content, file_type=None):
    try:
        if file_type == "application/pdf":
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                temp_pdf.write(file_content)
                temp_pdf_path = temp_pdf.name
            
            try:
                pdf_document = fitz.open(temp_pdf_path)
                
                if pdf_document.page_count > 0:
                    page = pdf_document.load_page(0)
                    
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                    img_data = pix.tobytes("jpeg", quality=95)
                    
                    img_str = base64.b64encode(img_data).decode('utf-8')
                    pdf_document.close()
                    return img_str
                else:
                    logging.error("PDF has no pages")
                    return None
            finally:
                os.unlink(temp_pdf_path)
        else:
            image = Image.open(BytesIO(file_content))
            buffered = BytesIO()
            image.save(buffered, format="JPEG", quality=95)
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            return img_str
    except Exception as e:
        logging.error(f"Error encoding image: {str(e)}")
        return None
    
def analyze_pdf_document(file_content):
    import io
    import tempfile
    import os
    from pdf2image import convert_from_bytes
    import pytesseract
    from PyPDF2 import PdfReader
    from pdfminer.high_level import extract_text as pdfminer_extract_text
    
    try:
        text_content = ""
        pdf = PdfReader(io.BytesIO(file_content))
        for page in pdf.pages:
            text_content += page.extract_text() + "\n"
  

        if len(text_content.strip()) > 200:
            logging.info("Successfully extracted text using PyPDF2")
            return text_content
    except Exception as e:
        logging.error(f"PyPDF2 extraction failed: {str(e)}")
        
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
            temp_pdf.write(file_content)
            temp_pdf_path = temp_pdf.name
        
        try:
            text_content = pdfminer_extract_text(temp_pdf_path)
            
            if len(text_content.strip()) > 200:
                logging.info("Successfully extracted text using PDFMiner")
                os.unlink(temp_pdf_path)
                return text_content
        finally:
            os.unlink(temp_pdf_path)
    except Exception as e:
        logging.error(f"PDFMiner extraction failed: {str(e)}")
    
    try:
        logging.info("Attempting OCR with Tesseract")
        with tempfile.TemporaryDirectory() as temp_dir:
            images = convert_from_bytes(file_content)
            
            text_content = ""
            for i, image in enumerate(images):
                image_path = os.path.join(temp_dir, f'page_{i+1}.png')
                image.save(image_path, 'PNG')
                
                text_content += pytesseract.image_to_string(image_path) + "\n"
                logging.info(f"OCR processed page {i+1}")
            
            return text_content
    except Exception as e:
        logging.error(f"OCR extraction failed: {str(e)}")
        
    logging.warning("All text extraction methods failed, falling back to image-based analysis")
    return None

def analyze_contract(file_content, file_type: str):
    if file_type == "application/pdf":
        try:
            text_content = analyze_pdf_document(file_content)
            
            if text_content and len(text_content.strip()) > 100:
                logging.info(f"Successfully extracted {len(text_content)} characters of text from PDF")
                messages = [
                    {"role": "user", "content": f"Please analyze this contract document in detail. This is the text content extracted from a PDF file:\n\n{text_content[:20000]}"}
                ]
                document_analysis = run_client(document_analyzer_agent, messages)
                return document_analysis
            
            logging.info("Text extraction insufficient, using image-based analysis")
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                temp_pdf.write(file_content)
                temp_pdf_path = temp_pdf.name
            
            try:
                pdf_document = fitz.open(temp_pdf_path)
                
                if pdf_document.page_count > 0:
                    max_pages = min(3, pdf_document.page_count)
                    
                    content = [
                        {"type": "text", "text": "Please analyze this contract document in detail. Extract all text carefully and accurately. This is a legal document."}
                    ]
                    
                    for i in range(max_pages):
                        page = pdf_document.load_page(i)
                        pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), alpha=False)
                        img_data = pix.tobytes("jpeg")
                        img_str = base64.b64encode(img_data).decode('utf-8')
                        
                        content.append(
                            {"type": "text", "text": f"Page {i+1} of {min(max_pages, pdf_document.page_count)}:"}
                        )
                        
                        content.append(
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                        )
                    
                    messages = [{"role": "user", "content": content}]
                    pdf_document.close()
                else:
                    return {"error": "The PDF file contains no pages"}, 400
            finally:
                os.unlink(temp_pdf_path)
                
        except Exception as e:
            logging.error(f"Failed to process PDF: {str(e)}")
            return {"error": f"Failed to process PDF: {str(e)}"}, 400

    elif file_type.startswith('image/'):
        base64_image = encode_image_to_base64(file_content)
        if not base64_image:
            return {"error": "Failed to process image"}, 400

        messages = [
            {"role": "user", "content": [
                {"type": "text", "text": "Please analyze this contract document in detail."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ]
    else:
        try:
            content = file_content.decode('utf-8')
            messages = [
                {"role": "user", "content": f"Please analyze this contract document in detail:\n\n{content}"}
            ]
        except UnicodeDecodeError:
            return {"error": "Unsupported file format"}, 400

    try:
        logging.info("Sending document to analysis agent")
        document_analysis = run_client(document_analyzer_agent, messages)
        logging.info("Analysis completed successfully")
        return document_analysis
    except Exception as e:
        logging.error(f"Analysis failed: {str(e)}")
        return {"error": f"Analysis failed: {str(e)}"}, 500

def extract_clauses(document_analysis: str):
    messages = [
        {"role": "user", "content": f"Based on this contract analysis, extract and organize the key clauses:\n\n{document_analysis}"}
    ]

    clauses = run_client(clause_extractor_agent, messages)
    return clauses

def assess_risks(document_analysis: str, clauses: str):
    messages = [
        {"role": "user", "content": f"Based on this contract analysis and extracted clauses, identify and rate potential legal risks:\n\nANALYSIS:\n{document_analysis}\n\nCLAUSES:\n{clauses}"}
    ]

    risk_assessment = run_client(risk_assessment_agent, messages)
    return risk_assessment

def summarize_contract(document_analysis: str, clauses: str, risks: str):
    messages = [
        {"role": "user", "content": f"Create a concise executive summary of this contract based on the following information:\n\nANALYSIS:\n{document_analysis}\n\nCLAUSES:\n{clauses}\n\nRISKS:\n{risks}"}
    ]

    summary = run_client(summarization_agent, messages)
    return summary

def answer_query(query: str, document_analysis: str, clauses: str, risks: str):
    messages = [
        {"role": "user", "content": f"Based on this contract analysis, please answer the following query:\n\nQUERY: {query}\n\nANALYSIS:\n{document_analysis}\n\nCLAUSES:\n{clauses}\n\nRISKS:\n{risks}"}
    ]

    answer = run_client(query_response_agent, messages)
    return answer

def run_contract_analysis(file_content, file_type: str, query: Optional[str] = None):
    """Main function to run the full contract analysis pipeline"""
    try:
        logging.info(f"Starting contract analysis for file type: {file_type}")
        
        analysis_result = analyze_contract(file_content, file_type)
        if isinstance(analysis_result, tuple):
            return analysis_result
            
        document_analysis = analysis_result
        logging.info("Document analysis completed, extracting clauses")
        
        clauses = extract_clauses(document_analysis)
        logging.info("Clause extraction completed, assessing risks")
        
        risks = assess_risks(document_analysis, clauses)
        logging.info("Risk assessment completed, creating summary")
        
        summary = summarize_contract(document_analysis, clauses, risks)
        logging.info("Summary created")
        
        query_answer = None
        if query:
            logging.info(f"Answering specific query: {query}")
            query_answer = answer_query(query, document_analysis, clauses, risks)
        
        result = {
            "status": "success",
            "contract_analysis": {
                "document_analysis": document_analysis,
                "clauses": clauses,
                "risks": risks,
                "summary": summary
            }
        }
        
        if query_answer:
            result["contract_analysis"]["query_answer"] = query_answer
        
        logging.info("Contract analysis pipeline completed successfully")
        return result, 200
        
    except Exception as e:
        logging.error(f"Error in contract analysis pipeline: {str(e)}")
        return {"error": f"Contract analysis failed: {str(e)}"}, 500