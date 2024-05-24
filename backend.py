from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transformers import BartForConditionalGeneration, BartTokenizer
import pdfplumber
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
import re
import os
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load pre-trained BART model and tokenizer
model_output_dir = "trained_bart_model"
tokenizer = BartTokenizer.from_pretrained(model_output_dir)
model = BartForConditionalGeneration.from_pretrained(model_output_dir)


# Function to extract text from PDF file
def extract_text_from_pdf(pdf_file):
    try:
        print("Extracting text from PDF...")
        with pdfplumber.open(pdf_file) as pdf:
            extracted_text = ""
            for page in pdf.pages:
                extracted_text += page.extract_text()
        return extracted_text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None


# Function to generate a summary from an input paragraph
def generate_summary(input_text):
    print("Generating summary...")
    input_ids = tokenizer(input_text, return_tensors="pt", max_length=1024, truncation=True, padding=True)["input_ids"]
    summary_ids = model.generate(input_ids, num_beams=4, max_length=1024, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True, clean_up_tokenization_spaces=False)
    return summary


# Function to format text according to dyslexia guidelines
def format_text(text):
    print("Formatting text...")
    formatted_text = ""
    lines = text.split("\n")
    paragraph = ""
    for line in lines:
        # Check if the line is a heading (e.g., starts with a large font size)
        if re.match(r'<h\d+>', line):
            if paragraph:
                formatted_text += paragraph + "\n\n"  # Add the current paragraph
                paragraph = ""  # Reset paragraph
            formatted_text += line + "\n\n"  # Preserve the heading and add extra spacing
        else:
            # Append line to current paragraph
            paragraph += line + "\n"
    # Add the last paragraph if not empty
    if paragraph:
        formatted_text += paragraph + "\n\n"
    return formatted_text


# Function to replace serif fonts with sans-serif fonts
def clear_and_simple_fonts(text):
    print("Replacing fonts...")
    return text.replace("Times New Roman", "Arial").replace("Georgia", "Verdana")


# Function to increase line spacing
def ample_line_spacing(text):
    print("Increasing line spacing...")
    lines = text.split('\n')
    spaced_text = '\n\n'.join(lines)
    return spaced_text


@app.route("/process_pdf", methods=["POST"])
def process_pdf():
    try:
        print("Request received...")
        pdf_file = request.files["pdf_file"]
        apply_summarization = request.form.get("apply_summarization") == "true"

        pdf_file_path = "uploaded_file.pdf"
        pdf_file.save(pdf_file_path)
        print("PDF file saved at:", pdf_file_path)

        extracted_text = extract_text_from_pdf(pdf_file_path)
        if extracted_text:
            formatted_text = ""
            if apply_summarization:
                print("Applying summarization...")
                with pdfplumber.open(pdf_file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if len(page_text.split()) > 1024:
                            page_text = " ".join(page_text.split()[:1024])
                        summary = generate_summary(page_text)
                        formatted_text += format_text(summary) + "\n\n"
            else:
                print("Not applying summarization...")
                formatted_text = format_text(extracted_text)

            formatted_text = clear_and_simple_fonts(formatted_text)
            formatted_text = ample_line_spacing(formatted_text)

            pdf_output_file = BytesIO()
            doc = SimpleDocTemplate(pdf_output_file, pagesize=(595, 842))

            style_normal = ParagraphStyle(
                "Custom",
                fontSize=16,
                leading=16 * 2,
                textColor=colors.black,
                leftIndent=1,
                rightIndent=0,
                firstLineIndent=1,
                alignment=0,
                fontName="Helvetica",
            )
            style_normal.spaceBefore = 10
            style_normal.spaceAfter = 10

            paragraphs = [Paragraph(text, style_normal) for text in formatted_text.split("\n") if text.strip()]

            doc.build(paragraphs)
            pdf_output_file.seek(0)

            os.remove(pdf_file_path)

            print("Sending PDF file...")
            return send_file(pdf_output_file, mimetype='application/pdf')
        else:
            print("Failed to extract text from PDF.")
            return jsonify({"error": "Failed to extract text from PDF."})
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
