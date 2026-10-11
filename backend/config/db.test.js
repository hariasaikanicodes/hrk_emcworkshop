import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { connectDB } from './db.js'

const originalMongoUri = process.env.MONGODB_URI

afterEach(() => {
  if (originalMongoUri === undefined) delete process.env.MONGODB_URI
  else process.env.MONGODB_URI = originalMongoUri
})

test('reports a missing MongoDB connection string as a service configuration error', async () => {
  delete process.env.MONGODB_URI

  await assert.rejects(connectDB(), {
    message: 'Database is not configured. Set MONGODB_URI on the backend deployment.',
    statusCode: 503,
  })
})
