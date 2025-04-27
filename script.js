const sections = [
  {
    title: "Section 1",
    type: "Sanguine",
    questions: [
      "Emotional",
      "Egotistical",
      "Interrupts others",
      "Compassionate",
      "Impulsive",
      // "Disorganized",
      // "Impractical",
      // "Funny",      
      // "Forgetful",
      // "Easily discouraged",
      // "Very positive",
      // "Easily angered",
      // "Undisciplined",
      // "Extrovert",
      // "Refreshing",
      // "Lively/spirited",
      // "Weak-willed",
      // "Spontaneuous",
      // "Talkative",
      // "Delightful/cheerful",
      // "Enjoyable",
      // "Popular",
      // "Friendly/Sociable",
      // "\"Bouncy\"",
      // "Restless",
      // "Difficulty concentrating",
      // "Likes to play",
      // "Difficulty keeping resolutions",
      // "Lives in present",
      // "Difficulty with appointments"
    ]
  },
  {
    title: "Section 2",
    type: "Choleric",
    questions: [
      "Optimistic",
      "Determined",
      "Bossy",
      "Goal-oriented",
      "Decisive",
      // "Frank",
      // "Self-confident",
      // "Sarcastic",
      // "Workaholic",
      // "Self-sufficient",
      // "Practical",
      // "Headstrong",
      // "Activist",
      // "Outgoing",
      // "Domineering",
      // "Adventurous",
      // "Aggressive",
      // "Competitive",
      // "Leadership ability",
      // "Daring",
      // "Persevering",
      // "Bold",
      // "Strong-willed",
      // "Persuasive",
      // "Hot-tempered",
      // "Resourceful",
      // "Insensitive",
      // "Outspoken",
      // "Unsympathetic",
      // "Productive"
    ]
  },
  {
    title: "Section 3",
    type: "Melancholy",
    questions: [
      "Deep feeling",
      "Critical",
      "Insecure",
      "Sensitive",
      "Indecisive",
      // "Hard to please",
      // "Self-centered",
      // "Pessimistic",
      // "Depressed easily",
      // "Easily offended",
      // "Idealistic",
      // "Loner",
      // "Self-sacrificing",
      // "Introvert",
      // "Faithful friend",
      // "Analytical",
      // "Considerate",
      // "Likes behind the scenes",
      // "Suspicious",
      // "Respectful",
      // "Introspective",
      // "Planner",
      // "Perfectionist",
      // "Scheduled",
      // "Unforgiving/resents",
      // "Orderly",
      // "Creative",
      // "Detailed",
      // "Moody",
      // "Gifted(musically or athletically)"
    ]
  },
  {
    title: "Section 3",
    type: "Phlegmatic",
    questions: [
      "Very quiet",
      "Selfish",
      "Unenthusiastic",
      "Negative",
      "Regular daily habits",
      // "Hesitant",
      // "Shy",
      // "Stingy",
      // "Aimless",
      // "Not aggressive",
      // "Stubborn",
      // "Worrier",
      // "Spectator of life",
      // "Works well under pressure",
      // "Indecisive",
      // "Adaptable",
      // "Slow and lazy",
      // "Submissive to others",
      // "Easy going",
      // "Reserved",
      // "Calm and cool",
      // "Content/satisfied",
      // "Efficient",
      // "Patient",
      // "Dependable",
      // "Listener",
      // "Witty/dry humor",
      // "Pleasant",
      // "Teases others",
      // "Consistent"
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

// function handleSubmit() {
//   if (!validateSection(currentSection)) {
//     alert("Please answer all questions in this section before submitting.");
//     return;
//   }

//   let globalIndex = 0;
//   let scores = [];
//   const resultEl = document.getElementById("result");
//   resultEl.innerHTML = "";

//   sections.forEach((section) => {
//     let sectionScore = 0;
//     section.questions.forEach(() => {
//       const selected = document.querySelector(`input[name="q${globalIndex}"]:checked`);
//       const value = parseInt(selected.value, 10);
//       if (value > 2) sectionScore += value;
//       globalIndex++;
//     });
//     scores.push(sectionScore);
//   });

//   scores.forEach((score, i) => {
//     const p = document.createElement("p");
//     p.textContent = `${sections[i].title} Score: ${score}`;
//     resultEl.appendChild(p);
//   });

//   const total = scores.reduce((a, b) => a + b, 0);
//   const totalEl = document.createElement("p");
//   totalEl.innerHTML = `<strong>Total Score: ${total}</strong>`;
//   resultEl.appendChild(totalEl);

//   // Hide the form
//   document.getElementById("survey-form").classList.add("hidden");
//   resultEl.scrollIntoView({ behavior: "smooth" });
// }
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
    scores.push({ type: section.type, score: sectionScore });
  });

  // Sort sections from highest to lowest score
  scores.sort((a, b) => b.score - a.score);

  // Display sorted section scores
  scores.forEach(({ type, score }) => {
    const p = document.createElement("p");
    p.textContent = `${type} Score: ${score}`;
    resultEl.appendChild(p);
  });

  // Calculate final temperament based on top two
  const top = scores[0].type.toLowerCase();
  const second = scores[1].type.toLowerCase();
  let temperament = "";

  const combinations = {
    "sanguine_choleric": "SanChlor",
    "sanguine_melancholy": "SanMel",
    "sanguine_phlegmatic": "SanPhleg",
    "choleric_sanguine": "ChlorSan",
    "choleric_melancholy": "ChlorMel",
    "choleric_phlegmatic": "ChlorPhleg",
    "melancholy_sanguine": "MelSan",
    "melancholy_choleric": "MelChlor",
    "melancholy_phlegmatic": "MelPhleg",
    "phlegmatic_sanguine": "PhlegSan",
    "phlegmatic_choleric": "PhlegChlor",
    "phlegmatic_melancholy": "PhlegMel"
  };

  const key = `${top}_${second}`;
  temperament = combinations[key] || "Unknown Combination";

  const temperamentEl = document.createElement("h2");
  temperamentEl.innerHTML = `Your combined temperament is: <strong>${temperament}</strong>`;
  resultEl.appendChild(temperamentEl);

  // Hide the form and progress bar
  document.getElementById("survey-form").classList.add("hidden");
  document.getElementById("progress-container").classList.add("hidden");
  resultEl.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("survey-form").classList.remove("hidden");
  buildSurvey();
});
