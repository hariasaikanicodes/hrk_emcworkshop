import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { analyzeResume } from './analyzer.service.js'

const originalFetch = globalThis.fetch
const originalApiKey = process.env.LABD_API_KEY

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalApiKey === undefined) delete process.env.LABD_API_KEY
  else process.env.LABD_API_KEY = originalApiKey
})

function createPdf(text) {
  const escapedText = text.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
  const stream = `BT /F1 12 Tf 72 720 Td (${escapedText}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xrefOffset = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return Buffer.from(pdf)
}

test('extracts resume text and returns the validated Labd analysis', async () => {
  process.env.LABD_API_KEY = 'test-key'
  let request
  globalThis.fetch = async (url, options) => {
    request = { url, ...options }
    return new Response(
      JSON.stringify({
        message: {
          content: JSON.stringify({
            score: 82.3,
            skillsPresent: ['JavaScript', 'React'],
            skillsMissing: ['MongoDB'],
          }),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const result = await analyzeResume(
    createPdf('Resume with JavaScript and React experience'),
    'Frontend developer with React experience',
  )

  assert.equal(result.score, 82)
  assert.equal(result.verdict, 'Strong resume — good coverage of key skills.')
  assert.deepEqual(result.skillsPresent, ['JavaScript', 'React'])
  assert.deepEqual(result.skillsMissing, ['MongoDB'])
  assert.equal(request.url, 'https://agent.thedevlabs.io/v1/api/chat')
  assert.equal(request.headers.Authorization, 'Bearer test-key')
  const prompt = JSON.parse(request.body).messages[0].content
  assert.match(prompt, /Resume with JavaScript and React experience/)
  assert.match(prompt, /Frontend developer with React experience/)
})

test('fails explicitly when the server API key is not configured', async () => {
  delete process.env.LABD_API_KEY

  await assert.rejects(
    analyzeResume(createPdf('A resume with selectable text'), 'A job description'),
    { message: 'Resume analysis is not configured. Set LABD_API_KEY on the server.', statusCode: 503 },
  )
})

test('rejects malformed model results instead of returning mock data', async () => {
  process.env.LABD_API_KEY = 'test-key'
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ message: { content: 'not JSON' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  await assert.rejects(
    analyzeResume(createPdf('A resume with selectable text'), 'A job description'),
    { message: 'The analysis service returned an invalid response. Please try again.', statusCode: 502 },
  )
})
