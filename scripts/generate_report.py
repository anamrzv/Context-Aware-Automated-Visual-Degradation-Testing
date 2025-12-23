import os
import glob
import json
import datetime

# Configuration
ARTIFACTS_DIR = "test-artifacts"
BASELINES_DIR = "tests/baselines"
OUTPUT_FILE = "visual_report.html"
AI_REPORT_FILE = "ai-report.json"
AI_FLAG_FILE = "diff_detected.txt"

def load_ai_results():
    if not os.path.exists(AI_REPORT_FILE):
        return {}
    try:
        with open(AI_REPORT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            grouped = {}
            for field in data.get("fields", []):
                fname = field.get("file")
                if fname:
                    if fname not in grouped: grouped[fname] = []
                    grouped[fname].append(field)
            return grouped
    except Exception as e:
        print(f"Error loading AI results: {e}")
        return {}

def generate_html():
    print("Generating report")
    
    ai_results = load_ai_results()
    
    ai_status = "Skipped (No Changes)"
    ai_class = "success"
    if os.path.exists(AI_FLAG_FILE):
        ai_status = "AI Analysis Triggered"
        ai_class = "danger"

    affected_files = list(ai_results.keys())
    
    gen_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Visual Regression Report</title>
        <style>
            body {{ font-family: sans-serif; padding: 20px; background: #f4f4f9; }}
            .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
            h1 {{ text-align: center; color: #333; margin-bottom: 5px; }}
            .meta {{ text-align: center; color: #777; font-size: 0.9em; margin-bottom: 20px; }}
            .status-bar {{ padding: 15px; text-align: center; font-weight: bold; color: white; border-radius: 4px; margin-bottom: 30px; }}
            .success {{ background-color: #28a745; }}
            .danger {{ background-color: #dc3545; }}
            .test-case {{ border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 30px; }}
            .case-title {{ font-size: 1.2em; margin-bottom: 10px; font-weight: bold; color: #555; }}
            .comparison-row {{ display: flex; gap: 15px; margin-bottom: 20px; }}
            .image-col {{ flex: 1; text-align: center; }}
            .image-col img {{ width: 100%; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            .image-label {{ font-weight: bold; margin-bottom: 5px; display: block; color: #555; }}
            
            table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9em; }}
            th, td {{ padding: 8px 12px; border: 1px solid #ddd; text-align: left; }}
            th {{ background-color: #f8f9fa; }}
            .badge {{ padding: 3px 6px; border-radius: 3px; color: white; font-size: 0.8em; font-weight: bold; }}
            .bg-problematic {{ background-color: #dc3545; }}
            .bg-plain-error {{ background-color: #dc3545; }}
            .bg-medium {{ background-color: #fd7e14; }}
            .bg-low {{ background-color: #ffc107; color: #333; }}
            .bg-no-problem {{ background-color: #28a745; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Visual Regression Report</h1>
            <div class="meta">Generated: {gen_time}</div>
            
            <div class="status-bar {ai_class}">
                AI Status: {ai_status}
            </div>

            <h3>Visual Changes Findings</h3>
    """

    if not affected_files:
        html += "<h2 style='text-align:center; color: green;'>No visual differences detected.</h2>"
    else:
        for filename in affected_files:
            base_name = filename.replace(".diff.png", "")
            
            baseline_path = os.path.join(BASELINES_DIR, f"{base_name}.png")
            diff_path = os.path.join(ARTIFACTS_DIR, filename)
            
            issues = ai_results.get(filename, [])

            html += f"""
            <div class="test-case">
                <div class="case-title">{base_name}</div>
                <div class="comparison-row">
                    <div class="image-col">
                        <span class="image-label">Expected (Baseline)</span>
                        <a href="{baseline_path}" target="_blank"><img src="{baseline_path}" onerror="this.style.display='none'"></a>
                    </div>
                    <div class="image-col">
                        <span class="image-label">Difference (AI Input)</span>
                        <a href="{diff_path}" target="_blank"><img src="{diff_path}"></a>
                    </div>
                </div>
            """
            
            if issues:
                html += """
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%">Box</th>
                            <th style="width: 15%">Severity</th>
                            <th style="width: 35%">Content</th>
                            <th style="width: 40%">Suggestion</th>
                        </tr>
                    </thead>
                    <tbody>
                """
                for i in issues:
                    sev = i.get("severity", "").lower().replace(" ", "-")
                    html += f"""
                        <tr>
                            <td>{i.get("field_name")}</td>
                            <td><span class="badge bg-{sev}">{i.get("severity")}</span></td>
                            <td>{i.get("content_description")}</td>
                            <td>{i.get("improvement_suggestion")}</td>
                        </tr>
                    """
                html += "</tbody></table>"
            
            html += "</div>"

    html += """
        </div>
    </body>
    </html>
    """

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html)
    
    print(f"Report generated: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_html()