import json

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def compare_keys(file1, file2):
    keys1 = set(file1.keys())
    keys2 = set(file2.keys())

    missing_in_file2 = keys1 - keys2
    missing_in_file1 = keys2 - keys1

    return missing_in_file1, missing_in_file2

def main():
    # Adjust the paths if necessary
    english_file_path = 'C:/Users/user/Documents/GitHub/fujairah-municipality-front-end/data-viz/public/locales/en/translation.json'
    arabic_file_path = 'C:/Users/user/Documents/GitHub/fujairah-municipality-front-end/data-viz/public/locales/ar/translation.json'

    english_json = load_json(english_file_path)
    arabic_json = load_json(arabic_file_path)

    missing_in_arabic, missing_in_english = compare_keys(english_json, arabic_json)

    if missing_in_arabic:
        print("Keys missing in Arabic file:")
        for key in missing_in_arabic:
            print(f"- {key}")

    if missing_in_english:
        print("\nKeys missing in English file:")
        for key in missing_in_english:
            print(f"- {key}")

if __name__ == "__main__":
    main()
