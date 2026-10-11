import * as analysisService from '../services/analysis.service.js'

// Controllers handle HTTP concerns only: validate the request, call a
// service, shape the response. No business logic lives here.
export async function analyze(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Resume PDF is required' })
  }

  const jd = (req.body.jd || '').trim()
  if (!jd) {
    return res.status(400).json({ error: 'Job description (jd) is required' })
  }

  try {
    const result = await analysisService.analyzeAndSave({
      pdfBuffer: req.file.buffer,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      jd,
    })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong while analyzing the resume' })
  }
}

export async function listAnalyses(req, res) {
  const recent = await analysisService.listRecent()
  res.json(recent)
}
