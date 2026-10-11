import multer from 'multer'

// Resume PDFs are kept in memory only — parsed, scored, then discarded.
// Field name the frontend must upload under: "resume".
export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files are accepted'))
  },
}).single('resume')
