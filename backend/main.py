import openai
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import API_KEY
# Set up Flask app
app = Flask(__name__)
CORS(app)

# Load GPT-3 config
with open('prompts.json', 'r') as f:
    gpt3_config = json.load(f)

# Initialize OpenAI with your API key from config.py
openai.api_key = API_KEY  # Using the imported API_KEY


@app.route('/ask', methods=['POST'])
def ask_gpt3():
    question = request.json.get('question', '')

    if not question:
        return jsonify({"error": "Question not provided"}), 400

    # Construct the full prompt
    full_prompt = f"{gpt3_config['context']} {gpt3_config['guidelines']} {question}"

    try:
        response = openai.Completion.create(
            prompt=full_prompt,
            engine=gpt3_config['engine'],
            max_tokens=gpt3_config['max_tokens'],
            temperature=gpt3_config['temperature']
        )
        answer = response.choices[0].text.strip()
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": f"Error obtaining answer: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
