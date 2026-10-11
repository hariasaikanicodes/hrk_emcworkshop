import mongoose from 'mongoose'

// Loads backend/.env when present (Node's built-in loader — no dotenv
// package needed). If the file is absent we rely on the real environment.
try {
  process.loadEnvFile()
} catch {
  // No .env file — environment variables must already be set.
}

let connectionPromise

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw Object.assign(
      new Error('Database is not configured. Set MONGODB_URI on the backend deployment.'),
      { statusCode: 503 },
    )
  }

  if (mongoose.connection.readyState === 1) return mongoose

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error) => {
      connectionPromise = undefined
      throw Object.assign(
        new Error(
          'Could not connect to the database. Check MONGODB_URI and MongoDB network access.',
        ),
        { statusCode: 503, cause: error },
      )
    })
  }

  return connectionPromise
}
