import os
import json
import re
import uuid

def extract_text_from_nested(content):
    """Recursively extract text from nested 'contains' structures."""
    if isinstance(content, dict):
        if "text" in content and "contains" in content:
            text = content["text"]
            contains_text = extract_text_from_nested(content["contains"])
            return f"{text} {contains_text}"
        elif "contains" in content:
            return extract_text_from_nested(content["contains"])
        else:
            return " ".join(extract_text_from_nested(value) for key, value in content.items())
    elif isinstance(content, list):
        return " ".join(extract_text_from_nested(item) for item in content)
    elif isinstance(content, str):
        return content
    return ""

def process_paragraphs(paragraphs):
    """Extract and concatenate text from paragraphs."""
    full_text = []

    for key, content in paragraphs.items():
        if isinstance(content, dict):
            if "text" in content and "contains" in content:
                text = content["text"]
                contains_text = extract_text_from_nested(content["contains"])
                full_text.append(f"{text} {contains_text}")
            else:
                full_text.append(extract_text_from_nested(content))
        elif isinstance(content, str):
            full_text.append(content)

    return " ".join(full_text)

def normalize_section_number(section_number):
    """Normalize section number format."""
    section_number = section_number.strip()
    match = re.match(r'[sS]ection\s*(\d+[a-zA-Z]*)\.?', section_number)
    if match:
        return f"Section {match.group(1)}."
    return section_number

def transform_json(input_data):
    """Transform the input JSON to the desired output format."""
    results = []

    act_title = input_data.get("actTitle", input_data.get("Act Title", ""))
    act_id = input_data.get("actId", input_data.get("Act ID", ""))
    enactment_date = input_data.get("enactmentDate", input_data.get("Enactment Date", ""))

    chapters_data = input_data.get("Chapters", {})
    if not chapters_data and "Parts" in input_data:
        chapters_data = input_data.get("Parts", {})

    for chapter_key, chapter_data in chapters_data.items():
        chapter_id = chapter_data.get("ID", f"CHAPTER {chapter_key}")
        chapter_name = chapter_data.get("Name", "")

        sections = chapter_data.get("Sections", {})
        for section_key, section_data in sections.items():
            section_number = normalize_section_number(section_key)
            section_heading = section_data.get("heading", "")

            paragraphs = section_data.get("paragraphs", {})
            content = process_paragraphs(paragraphs)

            unique_id = f"{act_id.replace(' ', '_')}_{chapter_id.replace(' ', '_')}_{section_number.replace(' ', '_').replace('.', '')}"

            result = {
                "id": unique_id,
                "actTitle": act_title,
                "actId": act_id,
                "enactmentDate": enactment_date,
                "chapterId": chapter_id,
                "chapterName": chapter_name,
                "sectionNumber": section_number,
                "sectionHeading": section_heading,
                "content": content
            }

            results.append(result)

    return results

def process_file(filepath, output_dir):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            data = json.load(file)

        transformed_data = transform_json(data)

        filename = os.path.basename(filepath)
        output_path = os.path.join(output_dir, f"processed_{filename}")

        with open(output_path, 'w', encoding='utf-8') as out_file:
            json.dump(transformed_data, out_file, ensure_ascii=False, indent=2)

        print(f"Successfully processed: {filepath} -> {output_path}")

    except Exception as e:
        print(f"Error processing {filepath}: {str(e)}")

def main():
    input_folder = './scripts/laws-details'
    output_folder = './scripts/processed-laws'

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith('.json'):
            filepath = os.path.join(input_folder, filename)
            process_file(filepath, output_folder)

if __name__ == "__main__":
    main()
