from typing import Dict, Any, Tuple
from agents_config.contract_gen import generate_contract

def handle_contract_generation(case_details: str) -> Tuple[Dict[str, Any], int]:
    try:
        if not case_details or case_details.strip() == "":
            return {
                "status": "error",
                "message": "Case details cannot be empty"
            }, 400

        contract_result = generate_contract(case_details)

        if contract_result.get("status") == "error":
            return contract_result, 400

        return contract_result, 200

    except Exception as e:
        return {
            "status": "error",
            "message": f"Contract generation failed: {str(e)}"
        }, 500
