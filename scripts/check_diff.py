import requests
import json
import base64
import sys
import glob
import os
import datetime
from PIL import Image

LOG_FILE = "ai.log"

def append_log(message):
    timestamp = datetime.datetime.now().strftime("%a %b %d %H:%M:%S UTC %Y")
    entry = f"[{timestamp}] [AI-ANALYSIS] {message}"
    print(entry)
    with open(LOG_FILE, "a") as f:
        f.write(entry + "\n")

def has_green_boxes(image_path):
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGBA")
            data = img.getdata()
            for pixel in data:
                if pixel[0] == 0 and pixel[1] == 255 and pixel[2] == 0:
                    return True
        return False
    except Exception as e:
        append_log(f"Error checking image {image_path}: {e}")
        return True

FLAG_FILE = "diff_detected.txt"

if not os.path.exists(FLAG_FILE):
    append_log("No 'diff_detected.txt' found. Skipping AI analysis completely.")
    with open("ai-report.json", "w", encoding="utf-8") as f:
        json.dump({"fields": []}, f)
    sys.exit(0)

api_key = os.environ.get("AI_API_KEY")
if not api_key:
    append_log("CRITICAL: AI_API_KEY environment variable is not set!")
    sys.exit(1)

diff_files = glob.glob("test-artifacts/*-linux.diff.png")

if not diff_files:
    append_log("No diff images found in test-artifacts.")
    sys.exit(0)

append_log(f"Found {len(diff_files)} potential diff images. Checking for bounding boxes...")

all_results = []

prompt = """
You are analyzing an image that contains several green overlay boxes with red titles such as "BB1", "BB2", etc.

Your task:
1. Identify **every green box** in the image. It is possible that there are no boxes!
2. For each box, read the **exact contents inside the box only**.
3. Use the rest of the webpage *only as context* to determine potential UI issues, but do NOT include external elements in the description.
4. Ignore the green box borders; they are not part of the actual UI.
5. If a box contains no content, this is allowed unless it creates a layout or usability issue.
6. Check each box for:
   - layout issues
   - broken or inconsistent UI elements
   - visual spacing problems
   - missing elements
   - typos or spelling issues
   - alignment or readability issues
7. For each field, generate an object in the JSON array matching the schema below.

Important formatting rules:
- Return **only valid JSON** that matches the schema exactly.
- Do NOT include explanations, markdown, or comments.
- Do NOT add extra fields or text outside the JSON.
- The `"design_estimation"` must be either `"good"` or `"bad"`.
- The `"severity"` must be one of:
  `"no-problem" | "low" | "medium" | "problematic" | "plain error"`.

Return JSON in the following exact format:

{
  "fields": [
    {
      "field_name": "<title of the green box>",
      "content_description": "<describe only what is inside the box>",
      "design_estimation": "good or bad",
      "type": "<if there is a type: describe the problem, if there is typo: No typo>",
      "severity": "no-problem | low | medium | problematic | plain error",
      "improvement_suggestion": "<how to fix the detected issue or leave empty if none>"
    }
  ],
  "full_page_suggestion": "<write design suggestions for the entire page>"
}
"""

url = 'https://chat.intern-ai.org.cn/api/v1/chat/completions'
headers = {
    'Content-Type': 'application/json',
    "Authorization": f"Bearer {api_key}"
}

files_processed = 0

for image_path in diff_files:
    filename = os.path.basename(image_path)
    
    if not has_green_boxes(image_path):
        append_log(f"Skipping {filename}.")
        continue

    append_log(f"Sending {filename} to AI...")
    files_processed += 1

    try:
        with open(image_path, "rb") as f1:
            encoded_image1 = base64.b64encode(f1.read()).decode("utf-8")

        data = {
            "model": "internvl3.5-241b-a28b",  
            "messages": [
                {
                    "role": "user",
                    "content": [                                   
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image1}"}}
                    ]
                }
            ],
            "n": 1,
            "temperature": 0.0,
            "top_p": 1.0
        }

        res = requests.post(url, headers=headers, data=json.dumps(data))
        
        if res.status_code != 200:
            append_log(f"API Error for {filename}: {res.status_code} - {res.text}")
            continue

        raw = res.json()["choices"][0]["message"]["content"]
        clean_raw = raw.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_raw)
        
        fields = parsed.get("fields", [])
        append_log(f"Received {len(fields)} insights from AI.")

        for field in fields:
            field['file'] = filename
            
        all_results.extend(fields)

    except Exception as e:
        append_log(f"Exception processing {filename}: {e}")

with open("ai-report.json", "w", encoding="utf-8") as f:
    json.dump({"fields": all_results}, f, ensure_ascii=False, indent=2)

append_log(f"AI Analysis completed. Processed {files_processed} images.")
sys.exit(0)