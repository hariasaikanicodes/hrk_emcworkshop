import "./ScoreCard.css"

export default function ScoreCard({ score, verdict }) {
  return (
    <div className="score-card">
      {/* --p drives the conic-gradient fill in the CSS */}
      <div className="score-ring" style={{ "--p": score }}>
        <span>{score}</span>
      </div>
      <div className="score-label">
        <h3>Resume Score</h3>
        <p>{verdict}</p>
      </div>
    </div>
  )
}
