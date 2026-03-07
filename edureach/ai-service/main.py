# -*- coding: utf-8 -*-
import os
import re
import httpx
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

groq_client = Groq(api_key=GROQ_API_KEY)

app = FastAPI(title="EduReach AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Language metadata ────────────────────────────────────────────────────────
LANGUAGE_META = {
    "en-IN": {"name": "English",   "native": "English"},
    "hi-IN": {"name": "Hindi",     "native": "हिन्दी"},
    "ta-IN": {"name": "Tamil",     "native": "தமிழ்"},
    "te-IN": {"name": "Telugu",    "native": "తెలుగు"},
    "kn-IN": {"name": "Kannada",   "native": "ಕನ್ನಡ"},
    "ml-IN": {"name": "Malayalam", "native": "മലയാളം"},
    "bn-IN": {"name": "Bengali",   "native": "বাংলা"},
    "mr-IN": {"name": "Marathi",   "native": "मराठी"},
    "gu-IN": {"name": "Gujarati",  "native": "ગુજરાતી"},
    "pa-IN": {"name": "Punjabi",   "native": "ਪੰਜਾਬੀ"},
    "or-IN": {"name": "Odia",      "native": "ଓଡ଼ିଆ"},
}

# ── Stutter detection helpers ────────────────────────────────────────────────
STUTTER_PATTERNS = [
    r"\b(\w+)\s+\1\b",           # word repetition: "the the"
    r"\b(\w{1,3})-\1",           # syllable repetition: "I-I", "ba-ba"
    r"\b(um|uh|er|ah|like|you know)\b",  # filler words
    r"\.{3,}",                   # long pauses indicated by ellipsis
]

def detect_stutter_signals(text: str) -> list[str]:
    signals = []
    lower = text.lower()
    for pattern in STUTTER_PATTERNS:
        matches = re.findall(pattern, lower)
        if matches:
            signals.append(pattern)
    return signals

# ── Sarvam STT ───────────────────────────────────────────────────────────────
async def transcribe_with_sarvam(audio_bytes: bytes, filename: str, language_code: str) -> tuple[str, str]:
    """Call Sarvam AI speech-to-text.
    Returns (transcript, detected_language_code).
    Pass language_code='unknown' to let Sarvam auto-detect the language.
    """
    url = "https://api.sarvam.ai/speech-to-text"
    headers = {"api-subscription-key": SARVAM_API_KEY}

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "webm"
    mime_map = {
        "webm": "audio/webm",
        "wav":  "audio/wav",
        "mp3":  "audio/mpeg",
        "ogg":  "audio/ogg",
        "m4a":  "audio/mp4",
    }
    mime_type = mime_map.get(ext, "audio/webm")

    # Only pass language_code when user explicitly chose one;
    # omitting it (or passing 'unknown') lets Sarvam auto-detect.
    form_data = {} if language_code == "unknown" else {"language_code": language_code}

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            url,
            headers=headers,
            files={"file": (filename, audio_bytes, mime_type)},
            data=form_data,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Sarvam STT error {response.status_code}: {response.text}",
        )

    data = response.json()
    transcript = data.get("transcript") or data.get("text") or ""
    if not transcript:
        raise HTTPException(status_code=502, detail="Sarvam returned empty transcript")

    # Sarvam returns the detected language in the response
    detected = data.get("language_code", language_code)
    if detected not in LANGUAGE_META:
        detected = "en-IN"   # safe fallback

    return transcript.strip(), detected

# ── Groq analysis ────────────────────────────────────────────────────────────
def translate_transcript(transcript: str, source_language: str, target_language_code: str) -> str:
    """Translate transcript to the user's preferred language using Groq."""
    lang_info = LANGUAGE_META.get(target_language_code, {"name": "English", "native": "English"})
    target_lang = lang_info["name"]

    # No translation needed if source already matches target
    if source_language == target_language_code:
        return transcript

    completion = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": f"You are a professional translator. Translate the given text accurately into {target_lang}. Output only the translated text with no additional commentary or explanation.",
            },
            {
                "role": "user",
                "content": transcript,
            },
        ],
        temperature=0.2,
        max_tokens=1024,
    )
    return (completion.choices[0].message.content or transcript).strip()


def analyse_with_groq(transcript: str, language_code: str, has_stutter_signals: bool) -> dict:
    lang_info = LANGUAGE_META.get(language_code, {"name": "English", "native": "English"})
    lang_name = lang_info["name"]
    lang_native = lang_info["native"]

    stutter_instruction = (
        "The transcript shows signs of stuttering or filler words. "
        "Add a dedicated section with 4–6 practical exercises "
        "(e.g., slow speech, breathing techniques, pausing strategies, mirror practice)."
        if has_stutter_signals
        else "No significant stuttering was detected."
    )

    system_prompt = f"""You are an expert speech therapist and elocution coach specialising in 
Indian languages. You help students from rural India improve their spoken language skills, 
especially for school recitation competitions.

Your ENTIRE response must be written exclusively in {lang_name} ({lang_native}).
Do NOT mix languages. Do NOT write in English unless {lang_name} is English.
Use clear headings and bullet points. Be encouraging, practical, and culturally sensitive.

Always provide these sections (headings also in {lang_name}):
1. Overall Impression – A warm, motivating 2–3 sentence summary.
2. Pronunciation & Clarity – Specific words or sounds to improve with examples.
3. Pace & Rhythm – Was the speech too fast, too slow, or uneven?
4. Expression & Emotion – Did the student convey feeling appropriate for the content?
5. Vocabulary & Language Use – Note any grammar issues or strong word choices.
6. Competition Tips – 3–5 actionable tips to stand out in a recitation competition.
7. {stutter_instruction}
8. Practice Exercise – One short, specific exercise the student can do today.

Score the speech out of 10 in each category and provide an overall score at the end."""

    user_message = f"""Please analyse this speech transcript and provide detailed feedback entirely in {lang_name}:

--- TRANSCRIPT ---
{transcript}
--- END TRANSCRIPT ---

Respond fully in {lang_name} only."""

    completion = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ],
        temperature=0.7,
        max_tokens=2048,
    )

    feedback_text = completion.choices[0].message.content or ""

    # Parse overall score (look for "X/10" pattern)
    score_match = re.search(r"overall[^\d]*(\d+(?:\.\d+)?)\s*/\s*10", feedback_text, re.IGNORECASE)
    # Also try score at end of text in non-English formats
    if not score_match:
        score_match = re.search(r"(\d+(?:\.\d+)?)\s*/\s*10", feedback_text)
    overall_score = float(score_match.group(1)) if score_match else None

    return {
        "feedback":      feedback_text,
        "overall_score": overall_score,
    }

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "EduReach AI service running"}


@app.get("/speech-therapy/languages")
def get_supported_languages():
    return {
        "languages": [
            {"code": code, **meta}
            for code, meta in LANGUAGE_META.items()
        ]
    }


@app.post("/speech-therapy/analyze")
async def analyze_speech(
    file: UploadFile = File(...),
    language_code: str = Form("unknown"),
):
    """
    Accepts an audio recording, transcribes it with Sarvam AI,
    then analyses the transcript using Groq LLaMA.
    Pass language_code='unknown' to auto-detect the spoken language.
    Returns: { transcript, feedback, overall_score, has_stutter, language_code, language_name }
    """
    if language_code not in LANGUAGE_META and language_code != "unknown":
        raise HTTPException(status_code=400, detail=f"Unsupported language code: {language_code}")

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio file is empty")

    # 1. Transcribe; Sarvam returns the detected language when code is 'unknown'
    raw_transcript, detected_lang = await transcribe_with_sarvam(
        audio_bytes, file.filename or "audio.webm", language_code
    )

    # Use detected language for all downstream processing
    effective_lang = detected_lang if language_code == "unknown" else language_code

    # 2. Translate if Sarvam returned English but user's language differs
    transcript = (
        translate_transcript(raw_transcript, "en-IN", effective_lang)
        if effective_lang != "en-IN"
        else raw_transcript
    )

    # 3. Detect stutter signals
    stutter_signals = detect_stutter_signals(raw_transcript)
    has_stutter = len(stutter_signals) > 0

    # 4. Analyse with Groq in the detected/chosen language
    analysis = analyse_with_groq(transcript, effective_lang, has_stutter)

    return {
        "transcript":    transcript,
        "feedback":      analysis["feedback"],
        "overall_score": analysis["overall_score"],
        "has_stutter":   has_stutter,
        "language_code": effective_lang,
        "language_name": LANGUAGE_META[effective_lang]["name"],
    }
