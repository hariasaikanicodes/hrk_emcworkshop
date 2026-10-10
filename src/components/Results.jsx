import { useEffect, useRef } from "react"
import ScoreCard from "./ScoreCard"
import SkillsLists from "./SkillsLists"
import "./Results.css"

export default function Results({ result, onReset }) {
  const ref = useRef(null)

  // Scroll the report into view once, when it first renders.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="results" ref={ref}>
      <h2 className="section-title">Your resume report</h2>
      <p className="results-file">Parsed: {result.fileName} (mock)</p>

      <ScoreCard score={result.score} verdict={result.verdict} />
      <SkillsLists present={result.present} missing={result.missing} />

      <div className="result-actions">
        <button className="cta-btn secondary" onClick={onReset}>
          ↺ Analyze another resume
        </button>
      </div>
    </div>
  )
}
