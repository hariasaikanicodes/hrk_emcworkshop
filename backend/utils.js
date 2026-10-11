// Shared helpers used across services and controllers.

// Maps a 0-100 score to the summary sentence shown in the report.
export function getVerdict(score) {
  if (score >= 70) return 'Strong resume — good coverage of key skills.'
  if (score >= 40) return 'Decent foundation, but a few important skills are missing.'
  return 'Your resume could use more skills and detail.'
}
