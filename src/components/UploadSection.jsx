import { useRef, useState } from "react"
import Results from "./Results"
import { analyzeResume } from "../lib/analyzeResume"
import "./UploadSection.css"

// Mock delay so the "Parsing…" state is visible.
const PARSE_DELAY_MS = 1200

export default function UploadSection() {
  const [file, setFile] = useState(null)
  const [notice, setNotice] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  function clearPendingParse() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function handleFile(file) {
    clearPendingParse()
    setAnalyzing(false)

    if (!file) return
    if (file.type !== "application/pdf") {
      setFile(null)
      setResult(null)
      setNotice("⚠ Please upload a PDF file.")
      return
    }

    setNotice("")
    setResult(null)
    setFile(file)
    setAnalyzing(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setAnalyzing(false)
      setResult(analyzeResume(file))
    }, PARSE_DELAY_MS)
  }

  function reset() {
    clearPendingParse()
    setFile(null)
    setResult(null)
    setAnalyzing(false)
    setNotice("")
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
            <span className="file-chip">📄 {file.name}</span>
            <p className="hint">
              {(file.size / 1024).toFixed(0)} KB · mock parse, nothing leaves
              your browser
            </p>
            {analyzing && (
              <p className="analyzing">
                <span className="spinner" /> Parsing resume…
              </p>
            )}
          </div>
        ) : (
          <div className="dz-empty">
            <div className="dz-icon">📄</div>
            <p className="dz-title">
              <strong>Drop your PDF here</strong> or{" "}
              <span className="browse">browse files</span>
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

      {notice && <p className="notice">{notice}</p>}

      {result && <Results result={result} onReset={reset} />}
    </section>
  )
}
