const sections = [
  {
    title: "Section 1",
    questions: [
      "Emotional",
      "Egotistical",
      "Interrupts others",
      "Compassionate",
      "Impulsive",
      "Disorganized",
      "Impractical",
      "Funny",
      "Forgetful",
      "Easily discouraged",
      "Very positive",
      "Easily angered",
      "Undisciplined",
      "Extrovert",
      "Refreshing",
      "Lively/spirited",
      "Weak-willed",
      "Spontaneuous",
      "Talkative",
      "Delightful/cheerful",
      "Enjoyable",
      "Popular",
      "Friendly/Sociable",
      "\"Bouncy\"",
      "Restless",
      "Difficulty concentrating",
      "Likes to play",
      "Difficulty keeping resolutions",
      "Lives in present",
      "Difficulty with appointments"
    ]
  },
  {
    title: "Section 2",
    questions: [
      "Optimistic",
      "Determined",
      "Bossy",
      "Goal-oriented",
      "Decisive",
      "Frank",
      "Self-confident",
      "Sarcastic",
      "Workaholic",
      "Self-sufficient"
    ]
  },
  {
    title: "Customer Support",
    questions: [
      "How helpful was our support?",
      "How satisfied are you with the delivery time?"
    ]
  },
  {
    title: "Overall Satisfaction",
    questions: [
      "How likely are you to buy again?",
      "Overall experience with us?"
    ]
  }
];

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("survey-form").classList.remove("hidden");
  document.getElementById("progress-container").classList.remove("hidden");
  buildSurvey();
});

let currentSection = 0;

function buildSurvey() {
  const questionContainer = document.getElementById("questions");
  questionContainer.innerHTML = "";

  sections.forEach((section, sectionIndex) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "survey-section hidden";
    sectionDiv.dataset.section = sectionIndex;

    const title = document.createElement("h3");
    title.textContent = section.title;
    sectionDiv.appendChild(title);

    section.questions.forEach((q, qIndex) => {
      const globalIndex = getGlobalQuestionIndex(sectionIndex, qIndex);
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.innerHTML = `
        <label for="q${globalIndex}">${globalIndex + 1}. ${q}</label>
        <div class="rating">
          ${[1, 2, 3, 4, 5]
            .map(
              (num) =>
                `<label><input type="radio" name="q${globalIndex}" value="${num}" required /> ${num}</label>`
            )
            .join("")}
        </div>
      `;
      sectionDiv.appendChild(questionDiv);
    });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = sectionIndex === sections.length - 1 ? "Submit" : "Next Section";
    btn.addEventListener("click", () =>
      sectionIndex === sections.length - 1 ? handleSubmit() : goToSection(sectionIndex + 1)
    );
    sectionDiv.appendChild(btn);
    questionContainer.appendChild(sectionDiv);
  });

  // Show the first section
  showSection(0);
}

function showSection(index) {
  document.querySelectorAll(".survey-section").forEach((sec, i) => {
    sec.classList.toggle("hidden", i !== index);
  });
  currentSection = index;
  updateProgressBar(index);
}

function updateProgressBar(sectionIndex) {
  const total = sections.length;
  const percent = ((sectionIndex + 1) / total) * 100;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}


function goToSection(index) {
  if (!validateSection(currentSection)) {
    alert("Please answer all questions in this section before continuing.");
    return;
  }
  showSection(index);
}

function getGlobalQuestionIndex(sectionIndex, qIndex) {
  return sections
    .slice(0, sectionIndex)
    .reduce((total, sec) => total + sec.questions.length, 0) + qIndex;
}

function validateSection(sectionIndex) {
  const section = document.querySelector(`.survey-section[data-section="${sectionIndex}"]`);
  const inputs = section.querySelectorAll("input[type='radio']");
  const names = [...new Set([...inputs].map((input) => input.name))];

  return names.every((name) =>
    section.querySelector(`input[name="${name}"]:checked`)
  );
}

function handleSubmit() {
  if (!validateSection(currentSection)) {
    alert("Please answer all questions in this section before submitting.");
    return;
  }

  let globalIndex = 0;
  let scores = [];
  const resultEl = document.getElementById("result");
  resultEl.innerHTML = "";

  sections.forEach((section) => {
    let sectionScore = 0;
    section.questions.forEach(() => {
      const selected = document.querySelector(`input[name="q${globalIndex}"]:checked`);
      const value = parseInt(selected.value, 10);
      if (value > 2) sectionScore += value;
      globalIndex++;
    });
    scores.push(sectionScore);
  });

  scores.forEach((score, i) => {
    const p = document.createElement("p");
    p.textContent = `${sections[i].title} Score: ${score}`;
    resultEl.appendChild(p);
  });

  const total = scores.reduce((a, b) => a + b, 0);
  const totalEl = document.createElement("p");
  totalEl.innerHTML = `<strong>Total Score: ${total}</strong>`;
  resultEl.appendChild(totalEl);

  // Hide the form
  document.getElementById("survey-form").classList.add("hidden");
  resultEl.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("survey-form").classList.remove("hidden");
  buildSurvey();
});
