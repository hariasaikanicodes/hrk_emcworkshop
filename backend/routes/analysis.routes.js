import { Router } from 'express'
import { analyze, listAnalyses } from '../controllers/analysis.controller.js'
import { uploadResume } from '../middleware/upload.js'

const router = Router()

// POST /api/analyze — resume PDF (field "resume") + JD text (field "jd").
router.post('/analyze', uploadResume, analyze)

// GET /api/analyses — recent results, so it's visible data is really
// being stored in MongoDB.
router.get('/analyses', listAnalyses)

export default router
