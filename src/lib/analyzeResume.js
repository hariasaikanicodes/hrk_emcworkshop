import { SKILLS_POOL } from "../data/skills"

// Mock analysis: no real parsing happens here. Given a File, returns the
// same shape a real parser would, so Results doesn't need to change later.
function verdictFor(score) {
  if (score >= 70) return "Strong resume — good coverage of key skills."
  if (score >= 40) return "Decent foundation, but a few important skills are missing."
  return "Your resume could use more skills and detail."
}

export function analyzeResume(file) {
  const present = SKILLS_POOL.filter(() => Math.random() > 0.5)
  const missing = SKILLS_POOL.filter((skill) => !present.includes(skill))

  const score = Math.min(
    100,
    Math.round((present.length / SKILLS_POOL.length) * 80) +
      Math.floor(Math.random() * 15) +
      5,
  )

  return {
    fileName: file.name,
    score,
    verdict: verdictFor(score),
    present,
    missing,
  }
}
