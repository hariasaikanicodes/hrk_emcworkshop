import "./JdInput.css"

export default function JdInput({ jd, onChange }) {
  return (
    <div className="jd-input">
      <label htmlFor="jd">Job description</label>
      <textarea
        id="jd"
        value={jd}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description you're targeting…"
        rows={6}
      />
      <p className="hint">Used with your resume to compute the match score (AI matching comes later).</p>
    </div>
  )
}
