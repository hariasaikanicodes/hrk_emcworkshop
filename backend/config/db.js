import mongoose from 'mongoose'

// Loads backend/.env when present (Node's built-in loader — no dotenv
// package needed). If the file is absent we rely on the real environment.
try {
  process.loadEnvFile()
} catch {
  // No .env file — environment variables must already be set.
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set — copy backend/.env.example to backend/.env')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}
