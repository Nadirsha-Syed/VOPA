/**
 * Improvement Plan Service
 *
 * Generates recommendations and improvement plans for students based on 
 * their reading attempt results.
 *
 * Rule-based thresholds (from Requirements Sec 15):
 *   Score >= 90: Advance difficulty level
 *   Score 75-89: Practice difficult words
 *   Score 60-74: Repeat exercise + targeted practice
 *   Score < 60:  Easier exercise + additional guided practice
 *
 * TODO (Phase 6): Integrate AI-assisted personalized plan generation.
 */

const generatePlanDetails = (score, mistakes, weakAreas) => {
  const recommendations = [];
  let suggestedDifficulty = "easy";

  if (mistakes && mistakes.length > 0) {
    recommendations.push(`Practice these specific words: ${mistakes.join(", ")}`);
  }

  if (score >= 90) {
    suggestedDifficulty = "medium"; // or next level up
    recommendations.push("Great job! Try a higher difficulty level exercise next.");
  } else if (score >= 75) {
    suggestedDifficulty = "medium";
    recommendations.push("Good effort! Focus on reading with steady pace and repeating tricky words.");
  } else if (score >= 60) {
    suggestedDifficulty = "easy";
    recommendations.push("Repeat this exercise 2-3 times to improve accuracy.");
  } else {
    suggestedDifficulty = "easy";
    recommendations.push("Try a shorter or simpler exercise to build confidence.");
    recommendations.push("Listen to guided audio reading before recording again.");
  }

  return {
    weakAreas: weakAreas || [],
    recommendations,
    difficulty: suggestedDifficulty,
  };
};

module.exports = { generatePlanDetails };
