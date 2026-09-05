const fs = require("fs");
const Groq = require("groq-sdk");

// Map platform language names to ISO 639-1 language codes for Whisper
const LANGUAGE_CODE_MAP = {
  English: "en",
  Hindi: "hi",
  Tamil: "ta",
  Telugu: "te",
  Marathi: "mr",
  Bengali: "bn",
  Gujarati: "gu",
  Kannada: "kn",
  Malayalam: "ml",
  Punjabi: "pa",
};

/**
 * Transcribe audio using Groq Whisper API (whisper-large-v3-turbo).
 * Falls back gracefully to mock transcription if GROQ_API_KEY is missing.
 *
 * @param {string} audioPath Relative or absolute path to audio file
 * @param {string} language Platform language name (e.g., "English", "Hindi")
 * @returns {Promise<string>} Transcribed text
 */
const transcribeAudio = async (audioPath, language = "English") => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    console.warn(
      "[speechService] GROQ_API_KEY is not configured in .env. Returning mock fallback transcription."
    );
    return "The boy is playing football.";
  }

  try {
    const groq = new Groq({ apiKey });

    // Ensure audio file exists
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found at path: ${audioPath}`);
    }

    const isoLanguage = LANGUAGE_CODE_MAP[language] || "en";

    console.log(`[speechService] Sending audio to Groq Whisper API (${language} / ${isoLanguage})...`);

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3-turbo",
      language: isoLanguage,
      response_format: "json",
      temperature: 0.0,
    });

    const resultText = transcription.text ? transcription.text.trim() : "";
    console.log(`[speechService] Transcribed Text: "${resultText}"`);

    return resultText;
  } catch (error) {
    console.error("[speechService] Groq API Error:", error.message || error);
    throw new Error(`Speech-to-Text failed: ${error.message}`);
  }
};

/**
 * Pronunciation analysis placeholder for advanced phoneme metrics.
 */
const analysePronunciation = async (audioPath, expectedText, language) => {
  return {
    phonemes: [],
    fluencyScore: null,
    paceWPM: null,
  };
};

module.exports = { transcribeAudio, analysePronunciation };
