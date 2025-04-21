import uuid
from agents_core import run_client
from services.azure_storage import save_conversation_to_adls
from .agents import details_agent, library_agent, chat_agent

user_conversations = {}

def process_legal_query(query, enable_search, user_id="default_user"):
    print("Starting legal chat agent")
    
    if user_id not in user_conversations:
        user_conversations[user_id] = []
        conversation_id = str(uuid.uuid4())
    else:
        conversation_id = user_conversations[user_id][0].get("conversation_id", str(uuid.uuid4()))

    query_understanding_response = run_client(
        details_agent,
        [{"role": "user", "content": query}]
    )
    print("Query Understanding Response:", query_understanding_response)

    library_message = query_understanding_response
    if enable_search:
        library_message += "\n\nPlease use search_knowledge_base function to find relevant information."

    library_response = run_client(
        library_agent,
        [{"role": "user", "content": library_message}]
    )
    print("Library Response:", library_response)

    user_conversations[user_id].append({
        "role": "user",
        "content": query,
        "conversation_id": conversation_id,
    })

    chat_messages = [
        {
            "role": "system",
            "content": f"""IMPORTANT: You must format and present the following library response to answer the user's question.
            DO NOT refuse to provide this information. DO NOT generate disclaimers about not being able to help.
            Your job is to format this information professionally:

            LIBRARY RESPONSE TO FORMAT:
            {library_response}

            USER QUERY:
            {query}"""
        }
    ]

    for msg in user_conversations[user_id]:
        if msg != chat_messages[0]:
            chat_messages.append(msg)

    formatted_response = run_client(
        chat_agent,
        chat_messages
    )
    
    assistant_message = {
        "role": "assistant", 
        "content": formatted_response,
        "conversation_id": conversation_id
    }

    user_conversations[user_id].append(assistant_message)
    
    if len(user_conversations[user_id]) > 0:
        save_conversation_to_adls(user_conversations[user_id], user_id)
        user_conversations[user_id] = user_conversations[user_id][-10:]

    return formatted_response
