from agents_config.legal_chat.run import process_legal_query

def handle_legal_chat(query: str, enable_search):
    try:
        response = process_legal_query(query, enable_search)
        return {
            "status": 200,
            "message": "Success",
            "response": response
        }, 200
    except Exception as e:
        return {
            "status": 500,
            "message": "Error",
            "error": str(e)
        }, 500
