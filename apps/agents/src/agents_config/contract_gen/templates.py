TEMPLATES = {
    "nda": {
        "title": "NON-DISCLOSURE AGREEMENT",
        "structure": [
            {"section": "PARTIES", "required_vars": ["party1_name", "party1_address", "party2_name", "party2_address"]},
            {"section": "RECITALS", "required_vars": ["purpose"]},
            {"section": "DEFINITION OF CONFIDENTIAL INFORMATION", "required_vars": ["confidential_info_definition"]},
            {"section": "OBLIGATIONS", "required_vars": ["obligations"]},
            {"section": "TERM", "required_vars": ["term_length"]},
            {"section": "GOVERNING LAW", "required_vars": ["governing_law"]},
            {"section": "SIGNATURES", "required_vars": ["party1_name", "party2_name"]}
        ],
        "template": """
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (this "Agreement") is made and entered into as of {effective_date} by and between:

{party1_name}, located at {party1_address} ("Disclosing Party"), and
{party2_name}, located at {party2_address} ("Receiving Party").

RECITALS:

WHEREAS, {purpose};

NOW, THEREFORE, in consideration of the mutual covenants contained in this Agreement, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
   {confidential_info_definition}

2. OBLIGATIONS
   {obligations}

3. TERM
   {term_length}

4. GOVERNING LAW
   {governing_law}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

{party1_name}

By: ________________________
Name:
Title:

{party2_name}

By: ________________________
Name:
Title:
"""
    },

    "employment_contract": {
        "title": "EMPLOYMENT AGREEMENT",
        "structure": [
            {"section": "PARTIES", "required_vars": ["employer_name", "employer_address", "employee_name", "employee_address"]},
            {"section": "POSITION AND DUTIES", "required_vars": ["position_title", "duties"]},
            {"section": "COMPENSATION", "required_vars": ["salary", "payment_schedule", "benefits"]},
            {"section": "TERM AND TERMINATION", "required_vars": ["start_date", "termination_terms"]},
            {"section": "CONFIDENTIALITY", "required_vars": ["confidentiality_terms"]},
            {"section": "GOVERNING LAW", "required_vars": ["governing_law"]},
            {"section": "SIGNATURES", "required_vars": ["employer_name", "employee_name"]}
        ],
        "template": """
EMPLOYMENT AGREEMENT

This Employment Agreement (this "Agreement") is made and entered into as of {effective_date} by and between:

{employer_name}, located at {employer_address} ("Employer"), and
{employee_name}, residing at {employee_address} ("Employee").

1. POSITION AND DUTIES
   {position_title}
   {duties}

2. COMPENSATION AND BENEFITS
   {salary}
   {payment_schedule}
   {benefits}

3. TERM AND TERMINATION
   {start_date}
   {termination_terms}

4. CONFIDENTIALITY
   {confidentiality_terms}

5. GOVERNING LAW
   {governing_law}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

{employer_name}

By: ________________________
Name:
Title:

{employee_name}

By: ________________________
"""
    },

    "service_agreement": {
        "title": "SERVICE AGREEMENT",
        "structure": [
            {"section": "PARTIES", "required_vars": ["provider_name", "provider_address", "client_name", "client_address"]},
            {"section": "SERVICES", "required_vars": ["services_description"]},
            {"section": "PAYMENT", "required_vars": ["payment_terms", "payment_schedule"]},
            {"section": "TERM", "required_vars": ["start_date", "end_date"]},
            {"section": "TERMINATION", "required_vars": ["termination_terms"]},
            {"section": "GOVERNING LAW", "required_vars": ["governing_law"]},
            {"section": "SIGNATURES", "required_vars": ["provider_name", "client_name"]}
        ],
        "template": """
SERVICE AGREEMENT

This Service Agreement (this "Agreement") is made and entered into as of {effective_date} by and between:

{provider_name}, located at {provider_address} ("Service Provider"), and
{client_name}, located at {client_address} ("Client").

1. SERVICES
   {services_description}

2. PAYMENT
   {payment_terms}
   {payment_schedule}

3. TERM
   {start_date}
   {end_date}

4. TERMINATION
   {termination_terms}

5. GOVERNING LAW
   {governing_law}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

{provider_name}

By: ________________________
Name:
Title:

{client_name}

By: ________________________
Name:
Title:
"""
    }
}
