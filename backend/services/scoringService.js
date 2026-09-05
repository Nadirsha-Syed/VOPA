/**
 * Scoring Service
 *
 * Calculates the student's reading score by comparing
 * recognised text against expected text.
 *
 * MVP Formula:
 *   score = (correctWords / totalExpectedWords) * 100
 *
 * Later, this can incorporate:
 *   - Pronunciation accuracy
 *   - Reading fluency / pace
 *   - Extra or repeated words
 *
 * Keeping this isolated means the scoring algorithm can be
 * improved without touching the controller or routes.
 *
 * TODO (Phase 4/6): Integrate real scoring with AI analysis results.
 */

/**
 * Calculate a reading score.
 *
 * @param {string} expectedText    The sentence the student should have read
 * @param {string} recognizedText  What the speech service transcribed
 * @returns {{ score: number, correctWords: string[], mistakes: string[] }}
 */
const calculateScore = (expectedText, recognizedText) => {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // strip punctuation
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const expectedWords = normalize(expectedText);
  const recognizedWords = normalize(recognizedText);

  const correctWords = [];
  const mistakes = [];

  expectedWords.forEach((word) => {
    if (recognizedWords.includes(word)) {
      correctWords.push(word);
    } else {
      mistakes.push(word);
    }
  });

  const score =
    expectedWords.length > 0
      ? Math.round((correctWords.length / expectedWords.length) * 100)
      : 0;

  return { score, correctWords, mistakes };
};

/**
 * Identify weak areas based on mistakes.
 *
 * @param {string[]} mistakes   Words the student got wrong
 * @param {number}   score      Calculated score
 * @returns {string[]}          List of identified weak-area labels
 */
const identifyWeakAreas = (mistakes, score) => {
  const weakAreas = [];

  if (score < 60) weakAreas.push("overall reading accuracy");
  if (mistakes.length > 0) weakAreas.push("vocabulary");
  if (score < 75) weakAreas.push("reading fluency");

  // TODO: Add phoneme-level weak area detection (Phase 6)

  return weakAreas;
};

module.exports = { calculateScore, identifyWeakAreas };
