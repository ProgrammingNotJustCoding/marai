import os
import json

def check_and_delete_empty_files(directory):
    """Check for empty JSON files (containing just []) and delete them."""
    count = 0

    for filename in os.listdir(directory):
        if not filename.endswith('.json'):
            continue

        filepath = os.path.join(directory, filename)

        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                data = json.load(file)

            if isinstance(data, list) and len(data) == 0:

                os.remove(filepath)
                print(f"Deleted empty file: {filepath}")
                count += 1

        except Exception as e:
            print(f"Error checking file {filepath}: {str(e)}")

    return count

def main():
    output_folder = './scripts/processed-laws'

    if not os.path.exists(output_folder):
        print(f"Directory {output_folder} does not exist!")
        return

    deleted_count = check_and_delete_empty_files(output_folder)
    print(f"Deleted {deleted_count} empty files.")

if __name__ == "__main__":
    main()
