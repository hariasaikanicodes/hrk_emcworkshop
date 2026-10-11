import mongoose from 'mongoose'

// One analyzed resume. The raw PDF is never stored — only its result.
const analysisSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    jdLength: { type: Number, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    skillsPresent: { type: [String], default: [] },
    skillsMissing: { type: [String], default: [] },
  },
  { timestamps: true },
)

export default mongoose.model('Analysis', analysisSchema)
