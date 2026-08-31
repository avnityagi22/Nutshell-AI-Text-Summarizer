from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import os


# =========================
# LOAD ENVIRONMENT VARIABLES
# =========================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("Gemini API key loaded:", bool(api_key))

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")


# =========================
# FLASK APP
# =========================

app = Flask(__name__)

CORS(app)


# =========================
# GEMINI CLIENT
# =========================

client = genai.Client(api_key=api_key)


# =========================
# NORMAL TEXT SUMMARIZER
# =========================

@app.route("/summarize", methods=["POST"])
def summarize():

    try:

        data = request.get_json()

        text = data.get("text", "").strip()

        length = data.get(
            "length",
            "medium"
        )

        language = data.get(
            "language",
            "English"
        )


        # Check text

        if not text:

            return jsonify({
                "error": "Please enter some text"
            }), 400


        # =========================
        # SUMMARY LENGTH
        # =========================

        if length == "short":

            instruction = """
Give a very short summary containing
only the most important points.
"""

        elif length == "detailed":

            instruction = """
Give a detailed summary covering
all important ideas and key points.
"""

        else:

            instruction = """
Give a balanced summary that is clear
and concise while keeping the important points.
"""


        # =========================
        # GEMINI PROMPT
        # =========================

        prompt = f"""
You are an expert AI text summarization assistant.

Summarize the following text.

{instruction}

IMPORTANT:
Write the final summary entirely in {language}.

Do not change the requested language.
Do not explain the instructions.
Do not mention these instructions.
Do not invent information.

TEXT:

{text}
"""


        print("Sending text to Gemini...")
        print("Language:", language)
        print("Length:", length)


        # =========================
        # GEMINI
        # =========================

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        summary = response.text


        print("Summary generated successfully!")


        return jsonify({
            "summary": summary
        })


    except Exception as e:

        print("Gemini error:", e)

        return jsonify({
            "error": str(e)
        }), 500


# =========================
# PDF SUMMARIZER
# =========================

@app.route("/summarize-pdf", methods=["POST"])
def summarize_pdf():

    try:

        # =========================
        # CHECK PDF
        # =========================

        if "file" not in request.files:

            return jsonify({
                "error": "No PDF file uploaded"
            }), 400


        pdf_file = request.files["file"]


        if pdf_file.filename == "":

            return jsonify({
                "error": "No PDF selected"
            }), 400


        if not pdf_file.filename.lower().endswith(".pdf"):

            return jsonify({
                "error": "Only PDF files are allowed"
            }), 400


        print(
            "PDF received:",
            pdf_file.filename
        )


        # =========================
        # GET OPTIONS
        # =========================

        language = request.form.get(
            "language",
            "English"
        )

        length = request.form.get(
            "length",
            "medium"
        )


        print(
            "PDF language:",
            language
        )

        print(
            "PDF length:",
            length
        )


        # =========================
        # EXTRACT PDF TEXT
        # =========================

        reader = PdfReader(pdf_file)

        extracted_text = ""


        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:

                extracted_text += (
                    page_text + "\n"
                )


        print(
            "PDF pages:",
            len(reader.pages)
        )

        print(
            "Extracted characters:",
            len(extracted_text)
        )


        # =========================
        # CHECK EXTRACTION
        # =========================

        if not extracted_text.strip():

            return jsonify({
                "error":
                "Could not extract text from this PDF. "
                "The PDF may contain scanned images."
            }), 400


        # =========================
        # SUMMARY LENGTH
        # =========================

        if length == "short":

            instruction = """
Give a very short summary containing
only the most important points.
"""

        elif length == "detailed":

            instruction = """
Give a detailed summary covering all
important ideas, sections and key points.
"""

        else:

            instruction = """
Give a balanced summary that is clear
and concise while keeping the important points.
"""


        # =========================
        # GEMINI PDF PROMPT
        # =========================

        prompt = f"""
You are an expert AI document summarization assistant.

Summarize the following PDF content.

{instruction}

IMPORTANT:
Write the entire final summary in {language}.

Do not switch languages.
Do not explain the instructions.
Do not mention that you are an AI.
Do not invent information.

Keep the important information,
main ideas and key points.

PDF CONTENT:

{extracted_text}
"""


        print(
            "Sending PDF text to Gemini..."
        )


        # =========================
        # GEMINI
        # =========================

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        summary = response.text


        print(
            "PDF summary generated successfully!"
        )


        return jsonify({
            "summary": summary
        })


    except Exception as e:

        print(
            "PDF ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


# =========================
# HOME ROUTE
# =========================

@app.route("/")
def home():

    return jsonify({
        "message":
        "AI Text Summarizer Backend is running with Gemini!"
    })


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(
        debug=True
    )