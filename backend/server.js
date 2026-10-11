import express from 'express'
import cors from 'cors'
import analysisRoutes from './routes/analysis.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { connectDB } from './config/db.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Resume Parser API' })
})

// All API routes live under /api — see routes/analysis.routes.js
app.use('/api', analysisRoutes)

// Upload/bad-request errors end here as clean JSON responses.
app.use(errorHandler)

const PORT = process.env.PORT || 4000

await connectDB()

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`)
  })
}

export default app
