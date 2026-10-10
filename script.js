// Mock resume parser — no backend, everything happens in the browser.

const SKILLS_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "Docker", "AWS", "REST APIs", "HTML/CSS", "MongoDB",
  "Unit Testing", "CI/CD", "Agile", "Communication", "Problem Solving",
];

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const fileName = document.getElementById("file-name");
const analyzeBtn = document.getElementById("analyze-btn");
const results = document.getElementById("results");
const scoreRing = document.getElementById("score-ring");
const scoreValue = document.getElementById("score-value");
const scoreComment = document.getElementById("score-comment");
const skillsPresent = document.getElementById("skills-present");
const skillsMissing = document.getElementById("skills-missing");

let selectedFile = null;

// --- Upload interactions ---
dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) selectFile(fileInput.files[0]);
});
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type === "application/pdf") selectFile(file);
  else if (file) fileName.textContent = "⚠ Please upload a PDF file.";
});

function selectFile(file) {
  selectedFile = file;
  fileName.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
  analyzeBtn.classList.remove("hidden");
  results.classList.add("hidden");
}

// --- Fake analysis ---
analyzeBtn.addEventListener("click", () => {
  if (!selectedFile) return;
  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.disabled = true;

  // Pretend to parse for a moment, then show mock results.
  setTimeout(() => {
    analyzeBtn.textContent = "Analyze resume";
    analyzeBtn.disabled = false;
    showMockResults();
  }, 900);
});

function showMockResults() {
  const present = SKILLS_POOL.filter(() => Math.random() > 0.5);
  const missing = SKILLS_POOL.filter((s) => !present.includes(s));

  // Score weighted mostly by skills found (mock logic).
  const score = Math.min(
    100,
    Math.round((present.length / SKILLS_POOL.length) * 80) + Math.floor(Math.random() * 15) + 5
  );

  scoreValue.textContent = score;
  scoreRing.style.setProperty("--p", score);
  scoreComment.textContent =
    score >= 70
      ? "Strong resume — good coverage of key skills."
      : score >= 40
      ? "Decent foundation, but a few important skills are missing."
      : "Your resume could use more skills and detail.";

  skillsPresent.innerHTML = present.length
    ? present.map((s) => `<li>${s}</li>`).join("")
    : "<li>No skills detected</li>";
  skillsMissing.innerHTML = missing.length
    ? missing.map((s) => `<li>${s}</li>`).join("")
    : "<li>Nothing missing — nice!</li>";

  results.classList.remove("hidden");
  results.scrollIntoView({ behavior: "smooth" });
}
