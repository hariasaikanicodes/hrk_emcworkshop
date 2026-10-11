// Mock analyzer — the AI part replaces this later. It reads the contract
// so the swap is one file: takes (pdfBuffer, jdText) and returns the
// result shape the frontend already renders.

import { SKILLS_POOL } from '../data/skills.js'
import { getVerdict } from '../utils.js'

// The uploaded buffer is parsed here; nothing is kept after the response.
export async function analyzeResume(pdfBuffer, jdText) {
  // "Parse" the PDF: derive a deterministic seed from its bytes so the
  // same resume always gets the same score until the real parser lands.
  let seed = 0
  for (const byte of pdfBuffer.buffer.slice(0, 64)) {
    seed = (seed + byte) % 997
  }
  const pick = (skill) => (seed + skill.length) % 2 === 0

  const skillsPresent = SKILLS_POOL.filter(pick)
  const skillsMissing = SKILLS_POOL.filter((s) => !skillsPresent.includes(s))

  const score = Math.min(
    100,
    Math.round((skillsPresent.length / SKILLS_POOL.length) * 80) +
      (seed % 15) +
      5,
  )

  const verdict = getVerdict(score)

  return { score, verdict, skillsPresent, skillsMissing }
}
