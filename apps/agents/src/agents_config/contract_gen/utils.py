import datetime
from .templates import TEMPLATES

def get_template_list():
    return {key: value["title"] for key, value in TEMPLATES.items()}

def get_template_requirements(template_id):
    if template_id not in TEMPLATES:
        return None

    required_vars = []
    for section in TEMPLATES[template_id]["structure"]:
        required_vars.extend(section["required_vars"])

    return list(set(required_vars))

def format_contract_for_frontend(contract_text, contract_data):
    """Format the contract into a structure suitable for frontend display."""
    today = datetime.datetime.now().strftime("%Y-%m-%d")

    return {
        "status": "success",
        "contract": {
            "title": contract_data["template_title"],
            "generated_date": today,
            "document_text": contract_text,
            "metadata": {
                "template_id": contract_data["template_id"],
                "case_reference": contract_data.get("case_reference", ""),
            },
            "parties": extract_parties_from_data(contract_data)
        }
    }

def extract_parties_from_data(contract_data):
    parties = []

    party_key_pairs = [

        ("party1_name", "party1_address"),
        ("party2_name", "party2_address"),
        ("employer_name", "employer_address"),
        ("employee_name", "employee_address"),

        ("provider_name", "provider_address"),
        ("client_name", "client_address")
    ]

    for name_key, address_key in party_key_pairs:
        if name_key in contract_data and contract_data[name_key]:
            parties.append({
                "name": contract_data[name_key],
                "address": contract_data.get(address_key, "")
            })

    return parties
