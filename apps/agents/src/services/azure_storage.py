import json
from datetime import datetime
from azure.storage.blob import BlobServiceClient

from config.env import env

connection_string = env["AZURE_STORAGE_CONNECTION_STRING"]
container_name = env["AZURE_STORAGE_CONTAINER_NAME"]

blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)

def save_conversation_to_adls(messages, user_id):
    try:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        conversation_id = messages[0].get("conversation_id", "unknown")
        blob_path = f"raw/{user_id}/{conversation_id}/{timestamp}.json"
        
        conversation_json = json.dumps(messages, indent=2)
        
        blob_client = container_client.get_blob_client(blob_path)
        
        blob_client.upload_blob(conversation_json, overwrite=True)
        print(f"Conversation saved to ADLS at {blob_path}")
    except Exception as e:
        print(f"Error saving conversation to ADLS: {e}")
