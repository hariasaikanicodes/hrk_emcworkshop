import { useRef, useState } from "react"
import Results from "./Results"
import JdInput from "./JdInput"
import "./UploadSection.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
const API_URL = `${API_BASE_URL || ""}/api/analyze`

export default function UploadSection() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    if (file.type !== "application/pdf") {
      setFile(null)
      setResult(null)
      setError("Please upload a PDF file.")
      return
    }
    setError("")
    setResult(null)
    setFile(file)
  }

  async function analyze() {
    if (!file || !jd.trim()) {
      setError("Add your resume PDF and a job description first.")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("jd", jd)

    try {
      setLoading(true)
      setError("")
      const res = await fetch(API_URL, { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setResult(data)
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Can't reach the server — is the backend running on port 4000?"
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setJd("")
    setResult(null)
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <section id="upload" className="upload-section">
      <h2 className="section-title">Upload your resume</h2>

      <div
        className={`dropzone ${dragOver ? "is-dragover" : ""} ${file ? "has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        {file ? (
          <div className="dz-file">
            <span className="file-chip">{file.name}</span>
            <p className="hint">
              {(file.size / 1024).toFixed(0)} KB · analyzed on the server, nothing is stored
            </p>
          </div>
        ) : (
          <div className="dz-empty">
            <div className="dz-icon">📄</div>
            <p className="dz-title">
              <strong>Drop your PDF here</strong> or <span className="browse">browse files</span>
            </p>
            <p className="hint">PDF only · max 5 MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />

      <JdInput jd={jd} onChange={setJd} />

      {error && <p className="notice">{error}</p>}

      <div className="upload-actions">
        <button className="cta-btn" onClick={analyze} disabled={loading || !file || !jd.trim()}>
          {loading ? "Analyzing…" : "Analyze resume"}
        </button>
      </div>

      {loading && (
        <p className="analyzing">
          <span className="spinner" /> Analyzing resume…
        </p>
      )}

      {result && <Results result={result} onReset={reset} />}
    </section>
  )
}
