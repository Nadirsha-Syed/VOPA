/**
 * Speech Service
 *
 * Acts as the abstraction layer between the backend and the AI/speech provider.
 * Replace the internals of these functions when integrating a real provider
 * (e.g. Google Cloud Speech-to-Text, Assembly AI, Whisper, Azure Cognitive).
 *
 * The rest of the application should NEVER import an AI SDK directly.
 * All AI calls must go through this service.
 *
 * TODO (Phase 4): Replace placeholder implementations with real API calls.
 */

/**
 * Transcribe audio to text.
 *
 * @param {string} audioPath    Local path or URL to the audio file
 * @param {string} language     Language code (e.g. "English", "Hindi")
 * @returns {Promise<string>}   Transcribed text
 */
const transcribeAudio = async (audioPath, language) => {
  // TODO: Call real speech-to-text API here
  console.log(`[speechService] transcribeAudio called — language: ${language}, file: ${audioPath}`);
  return "placeholder transcription";
};

/**
 * Analyse pronunciation at the phoneme level.
 *
 * @param {string} audioPath      Local path or URL to the audio file
 * @param {string} expectedText   The text the student should have read
 * @param {string} language       Language code
 * @returns {Promise<object>}     Pronunciation analysis object
 */
const analysePronunciation = async (audioPath, expectedText, language) => {
  // TODO: Call real pronunciation-analysis API here
  console.log(`[speechService] analysePronunciation called — language: ${language}`);
  return {
    phonemes: [],
    fluencyScore: null,
    paceWPM: null,
  };
};

module.exports = { transcribeAudio, analysePronunciation };
