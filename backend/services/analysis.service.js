import Analysis from '../models/Analysis.js'
import { analyzeResume } from './analyzer.service.js'

// Orchestrates one analysis: run the analyzer, persist the result,
// return the API response shape.
export async function analyzeAndSave({ pdfBuffer, fileName, fileSize, jd }) {
  const result = await analyzeResume(pdfBuffer, jd)

  // The raw PDF is never stored — only its result.
  const doc = await Analysis.create({
    fileName,
    fileSize,
    jdLength: jd.length,
    score: result.score,
    skillsPresent: result.skillsPresent,
    skillsMissing: result.skillsMissing,
  })

  return {
    id: doc._id,
    fileName,
    score: result.score,
    verdict: result.verdict,
    skillsPresent: result.skillsPresent,
    skillsMissing: result.skillsMissing,
  }
}

export async function listRecent() {
  return Analysis.find().sort({ createdAt: -1 }).limit(20)
}
