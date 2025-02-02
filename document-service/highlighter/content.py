import fitz
import docx

def extract_text_from_pdf(pdf_file: str):
    text = ""
    with fitz.open(pdf_file) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def extract_text_from_docx(docx_file: str):
    doc = docx.Document(docx_file)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text