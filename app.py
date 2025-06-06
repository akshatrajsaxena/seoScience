import os
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load API key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Check API key presence
if not GROQ_API_KEY:
    raise EnvironmentError("Missing GROQ_API_KEY in environment variables.")

# Initialize Flask and CORS
app = Flask(__name__)
CORS(app, origins=["https://seo-science.vercel.app"])

# Groq Client
groq_client = Groq(api_key=GROQ_API_KEY)

# Storage
user_sessions = {}
generated_content = {}

class SEOContentGenerator:
    def __init__(self, client):
        self.client = client
        self.model = "llama3-70b-8192"

    def chat(self, messages, temperature=0.7, max_tokens=300):
        return self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        ).choices[0].message.content.strip()

    def generate_keywords(self, seed_keyword):
        prompt = f"""
        Generate 5 SEO-friendly keywords related to '{seed_keyword}'.
        Return one per line, no numbering.
        """
        try:
            output = self.chat([
                {"role": "system", "content": "You're an SEO keyword expert."},
                {"role": "user", "content": prompt}
            ])
            return [kw.strip() for kw in output.splitlines() if kw.strip()]
        except Exception as e:
            print("Keyword Gen Error:", e)
            return [f"{seed_keyword} guide", f"best {seed_keyword} tools"]

    def generate_titles(self, keyword, tone="professional"):
        prompt = f"""
        Generate 3 SEO titles for '{keyword}' in a {tone} tone.
        Each title should be 50–60 characters, SEO-optimized, and catchy.
        Return one per line.
        """
        try:
            output = self.chat([
                {"role": "system", "content": "You're a creative SEO title copywriter."},
                {"role": "user", "content": prompt}
            ])
            return [title.strip() for title in output.splitlines() if title.strip()]
        except Exception as e:
            print("Title Gen Error:", e)
            return [f"Complete {keyword} Guide", f"Mastering {keyword}", f"Boost ROI with {keyword}"]

    def generate_topics(self, title, keyword):
        prompt = f"""
        For the title '{title}' and keyword '{keyword}', provide two content outlines.
        Each: 1–2 line description + 3–4 bullet points.
        Format:
        Topic 1: [description]
        - Point 1
        - Point 2
        ...
        """
        try:
            return self.chat([
                {"role": "system", "content": "You're an SEO content strategist."},
                {"role": "user", "content": prompt}
            ], max_tokens=500)
        except Exception as e:
            print("Topic Gen Error:", e)
            return f"Topic 1: Everything about {keyword}\n- Overview\n- Benefits\n- Strategies"

    def generate_content(self, keyword, title, topic_outline, content_type="blog_intro"):
        instruction = "Meta description (150–160 chars)" if content_type == "meta_description" else "Intro paragraph (150–250 words)"
        prompt = f"""
        Write a {instruction} for:
        - Keyword: {keyword}
        - Title: {title}
        - Outline: {topic_outline}
        Include the keyword 2–3 times, professional tone, no extra text.
        """
        try:
            return self.chat([
                {"role": "system", "content": "You're an expert SEO content writer."},
                {"role": "user", "content": prompt}
            ], max_tokens=400)
        except Exception as e:
            print("Content Gen Error:", e)
            return f"Learn everything about {keyword} in this insightful guide."

    def calculate_seo_score(self, content, keyword):
        score, factors = 0, []
        content_lower, keyword_lower = content.lower(), keyword.lower()
        kw_count = content_lower.count(keyword_lower)
        if kw_count >= 2: score += 30; factors.append("Good keyword density")
        elif kw_count == 1: score += 15; factors.append("Moderate keyword use")
        else: factors.append("Keyword missing")

        word_count = len(content.split())
        if 150 <= word_count <= 300: score += 25; factors.append("Optimal word count")
        elif word_count >= 100: score += 15; factors.append("Acceptable length")
        else: factors.append("Too short")

        sentences = content.count(".")
        if sentences: avg_len = word_count / sentences
        else: avg_len = word_count

        if 10 <= avg_len <= 20: score += 20; factors.append("Good readability")
        else: score += 10; factors.append("Okay readability")

        if any(p in content for p in [".", ",", "!", "?"]): score += 10
        if content and content[0].isupper(): score += 5

        return min(score, 100), factors

seo = SEOContentGenerator(groq_client)

@app.route('/api/health', methods=['GET'])
def health(): return jsonify({'status': 'ok', 'time': datetime.now().isoformat()})

@app.route('/api/keywords', methods=['POST'])
def api_keywords():
    data = request.get_json()
    seed = data.get("seed_keyword", "").strip()
    if not seed: return jsonify({"error": "Missing seed_keyword"}), 400
    keywords = seo.generate_keywords(seed)
    session_id = f"session_{int(time.time())}"
    user_sessions[session_id] = {"seed": seed, "keywords": keywords, "time": datetime.now().isoformat()}
    return jsonify({"session_id": session_id, "keywords": keywords, "status": "success"})

@app.route('/api/titles', methods=['POST'])
def api_titles():
    data = request.get_json()
    keyword, tone, session_id = data.get("keyword", ""), data.get("tone", "professional"), data.get("session_id", "")
    if not keyword: return jsonify({"error": "Missing keyword"}), 400
    titles = seo.generate_titles(keyword, tone)
    if session_id in user_sessions:
        user_sessions[session_id]["titles"] = titles
    return jsonify({"titles": titles, "status": "success"})

@app.route('/api/topics', methods=['POST'])
def api_topics():
    data = request.get_json()
    title, keyword = data.get("title", ""), data.get("keyword", "")
    if not title or not keyword: return jsonify({"error": "Missing title or keyword"}), 400
    topics = seo.generate_topics(title, keyword)
    return jsonify({"topics": topics, "status": "success"})

@app.route('/api/content', methods=['POST'])
def api_content():
    data = request.get_json()
    keyword, title, outline = data.get("keyword", ""), data.get("title", ""), data.get("topic_outline", "")
    ctype, sid = data.get("content_type", "blog_intro"), data.get("session_id", "")
    if not all([keyword, title, outline]): return jsonify({"error": "Missing input"}), 400
    content = seo.generate_content(keyword, title, outline, ctype)
    score, factors = seo.calculate_seo_score(content, keyword)
    content_id = f"content_{int(time.time())}"
    generated_content[content_id] = {
        "keyword": keyword, "title": title, "outline": outline,
        "content": content, "seo_score": score, "factors": factors,
        "type": ctype, "words": len(content.split()), "time": datetime.now().isoformat()
    }
    return jsonify({
        "content_id": content_id, "content": content,
        "seo_score": score, "factors": factors, "status": "success"
    })

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    last_sessions = list(user_sessions.values())[-5:]
    last_contents = list(generated_content.values())[-5:]
    return jsonify({
        "stats": {
            "sessions": len(user_sessions),
            "contents": len(generated_content),
            "avg_score": round(sum(c["seo_score"] for c in generated_content.values()) / max(len(generated_content), 1), 2)
        },
        "recent_sessions": last_sessions,
        "recent_contents": last_contents,
        "status": "success"
    })

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "service": "SEO Scientist AI Content Writer API",
        "frontend": "https://seo-science.vercel.app",
        "docs": "/api/health, /api/keywords, /api/titles, /api/topics, /api/content, /api/dashboard"
    })

if __name__ == '__main__':
    print("Starting SEO Scientist backend on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
