import multer from 'multer'

// Turns upload errors (wrong type, too large) into clean JSON responses
// instead of HTML error pages. Anything unrecognized moves on to the
// default Express error handling.
export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Resume PDF exceeds the 5MB limit' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err.message === 'Only PDF files are accepted') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}
