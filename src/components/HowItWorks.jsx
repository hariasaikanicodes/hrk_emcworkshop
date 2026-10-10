import "./HowItWorks.css"

const STEPS = [
  { n: 1, text: "Upload your resume as a PDF." },
  { n: 2, text: "We extract your text and detect skills." },
  { n: 3, text: "Get a 0–100 score with present and missing skills." },
]

export default function HowItWorks() {
  return (
    <section id="how" className="how">
      <h2 className="section-title">How it works</h2>
      <div className="steps">
        {STEPS.map((step) => (
          <div className="step" key={step.n}>
            <span>{step.n}</span>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
