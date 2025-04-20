import json
from typing import List, Dict, Any
from agents_core import run_client
from .agents import (
    template_selector_agent,
    details_extractor_agent,
    contract_generator_agent,
    contract_reviewer_agent
)
from .templates import TEMPLATES
from .utils import (
    get_template_requirements,
    format_contract_for_frontend
)

def generate_contract(case_details: str) -> Dict[str, Any]:
    try:
        template_response = run_client(
            template_selector_agent,
            [{"role": "user", "content": f"Select the appropriate template for this case:\n\n{case_details}"}]
        ).strip().lower()

        valid_templates = list(TEMPLATES.keys())
        if template_response not in valid_templates:

            template_id = "employment_contract" if "salary" in case_details.lower() else "nda"
        else:
            template_id = template_response

        template_data = TEMPLATES[template_id]
        template_title = template_data["title"]

        required_fields = get_template_requirements(template_id)
        if not required_fields:
            return {
                "status": "error",
                "message": "Failed to determine required fields for template"
            }

        extractor_prompt = f"""
        Extract information for a {template_title} based on these case details:

        {case_details}

        I need values for these fields: {', '.join(required_fields)}

        Return only a JSON object with these fields. Ensure the JSON is valid - use only string, number, boolean,
        null, array, or object values. Do not include any JavaScript expressions or calculations.
        """

        extracted_details_str = run_client(
            details_extractor_agent,
            [{"role": "user", "content": extractor_prompt}]
        )

        try:
            extracted_details = json.loads(extracted_details_str)
        except json.JSONDecodeError:

            json_start = extracted_details_str.find('{')
            json_end = extracted_details_str.rfind('}') + 1

            if json_start >= 0 and json_end > json_start:
                try:
                    json_str = extracted_details_str[json_start:json_end]

                    import re

                    json_str = re.sub(r'(\d+)\s*\+\s*\(\s*(\d+)\s*-\s*(\d+)\s*\)',
                                      lambda m: str(int(m.group(1)) + (int(m.group(2)) - int(m.group(3)))),
                                      json_str)
                    extracted_details = json.loads(json_str)
                except Exception as e:
                    return {
                        "status": "error",
                        "message": f"Failed to extract valid contract details: {str(e)}"
                    }
            else:
                return {
                    "status": "error",
                    "message": "Failed to extract contract details - no JSON object found"
                }

        extracted_details["template_id"] = template_id
        extracted_details["template_title"] = template_title

        template = template_data["template"]

        generator_prompt = f"""
        I need to generate a {template_title} using this template:

        {template}

        And these values:

        {json.dumps(extracted_details, indent=2)}

        Please fill in the template with these values and return the complete contract.
        """

        generated_contract = run_client(
            contract_generator_agent,
            [{"role": "user", "content": generator_prompt}]
        )

        reviewer_prompt = f"""
        Please review this {template_title} for clarity, completeness, and legal correctness:

        {generated_contract}

        Fix any issues and return the final contract text.
        """

        final_contract = run_client(
            contract_reviewer_agent,
            [{"role": "user", "content": reviewer_prompt}]
        )

        return format_contract_for_frontend(final_contract, extracted_details)

    except Exception as e:
        return {
            "status": "error",
            "message": f"Contract generation failed: {str(e)}"
        }
