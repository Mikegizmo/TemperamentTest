let currentSectionIndex = 0;
let temperamentDescriptions = {};
let temperamentSummaries = {};
let surveyMode;
const profileDiv = document.getElementById("profile");

fetch('temperamentDescriptions.json')
  .then(response => response.json())
  .then(data => {
    temperamentDescriptions = data;
  })
  .catch(error => console.error("Error loading descriptions:", error));

fetch('temperamentSummaries.json')
  .then(response => response.json())
  .then(data => {
    temperamentSummaries = data;
  })
  .catch(error => console.error("Error loading summaries:", error));

const temperamentSections = [
  {
    title: "Section 1",
    type: "Sanguine",
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
    type: "Choleric",
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
      "Self-sufficient",
      "Practical",
      "Headstrong",
      "Activist",
      "Outgoing",
      "Domineering",
      "Adventurous",
      "Aggressive",
      "Competitive",
      "Leadership ability",
      "Daring",
      "Persevering",
      "Bold",
      "Strong-willed",
      "Persuasive",
      "Hot-tempered",
      "Resourceful",
      "Insensitive",
      "Outspoken",
      "Unsympathetic",
      "Productive"
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
      "Hard to please",
      "Self-centered",
      "Pessimistic",
      "Depressed easily",
      "Easily offended",
      "Idealistic",
      "Loner",
      "Self-sacrificing",
      "Introvert",
      "Faithful friend",
      "Analytical",
      "Considerate",
      "Likes behind the scenes",
      "Suspicious",
      "Respectful",
      "Introspective",
      "Planner",
      "Perfectionist",
      "Scheduled",
      "Unforgiving/resents",
      "Orderly",
      "Creative",
      "Detailed",
      "Moody",
      "Gifted(musically or athletically)"
    ]
  },
  {
    title: "Section 4",
    type: "Phlegmatic",
    questions: [
      "Very quiet",
      "Selfish",
      "Unenthusiastic",
      "Negative",
      "Regular daily habits",
      "Hesitant",
      "Shy",
      "Stingy",
      "Aimless",
      "Not aggressive",
      "Stubborn",
      "Worrier",
      "Spectator of life",
      "Works well under pressure",
      "Indecisive",
      "Adaptable",
      "Slow and lazy",
      "Submissive to others",
      "Easy going",
      "Reserved",
      "Calm and cool",
      "Content/satisfied",
      "Efficient",
      "Patient",
      "Dependable",
      "Listener",
      "Witty/dry humor",
      "Pleasant",
      "Teases others",
      "Consistent"
    ]
  }
];

function buildSurvey() {
  const container = document.getElementById("surveyContainer");
  container.innerHTML = ""; // Clear
  updateProgressBar(currentSectionIndex);

  // Determine how many questions to load per section
  const questionsPerSection = surveyMode === "quick" ? 10 : 30;
  // Create a deep copy of sections with only desired number of questions
  const selectedSections = temperamentSections.map(section => ({
    type: section.type,
    title: section.title,
    questions: section.questions.slice(0, questionsPerSection)
  }));

  // Store selectedSections
  currentSurveySections = selectedSections;

  selectedSections.forEach((section, sIndex) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "section";
    if (sIndex !== 0) sectionDiv.style.display = "none";

    const header = document.createElement("h3");
    header.textContent = section.title;
    sectionDiv.appendChild(header);

    section.questions.forEach((question, qIndex) => {
      const qDiv = document.createElement("div");
      qDiv.className = "question";
      qDiv.innerHTML = `<p>${question}</p>`;
      for (let i = 1; i <= 5; i++) {
        qDiv.innerHTML += `
          <input type="radio" name="q${sIndex}_${qIndex}" value="${i}"> ${i}
        `;
      }
      sectionDiv.appendChild(qDiv);
    });
  

    // Add Save Progress button (not on last section)
    if (sIndex !== temperamentSections.length - 1) {
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save Progress";
      saveBtn.className = "save-progress-btn";
      saveBtn.addEventListener("click", () => {
        saveProgress();
        alert("Progress saved!");
      });
      sectionDiv.appendChild(saveBtn);
    }

    // Next Section button
    if (sIndex < temperamentSections.length - 1) {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next Section";
      nextBtn.className = "next-section-btn";
      nextBtn.addEventListener("click", () => {
        const currentSection = document.querySelectorAll(".section")[currentSectionIndex];
        const questions = currentSection.querySelectorAll(".question");

        let allAnswered = true;
        questions.forEach(question => {
          const selected = question.querySelector("input[type='radio']:checked");
          if (!selected) {
            allAnswered = false;
            question.classList.add("unanswered");
          } else {
            question.classList.remove("unanswered");
          }
        });

        if (!allAnswered) {
          alert("Please answer all questions in this section before proceeding.");
          return;
        }

        currentSectionIndex++;
        showSection(currentSectionIndex);
        window.scrollTo(0, 0);
      });
      sectionDiv.appendChild(nextBtn);
    }

    if (sIndex === temperamentSections.length - 1) {
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit Survey";
      submitBtn.className = "submit-survey-btn";
      submitBtn.addEventListener("click", () => {
        const currentSection = document.querySelectorAll(".section")[currentSectionIndex];
        const questions = currentSection.querySelectorAll(".question");

        let allAnswered = true;
        questions.forEach(question => {
          const selected = question.querySelector("input[type='radio']:checked");
          if (!selected) {
            allAnswered = false;
            question.classList.add("unanswered");
          } else {
            question.classList.remove("unanswered");
          }
        });

        if (!allAnswered) {
          alert("Please answer all questions in this section before submitting.");
          return;
        }

        showResults();
        window.scrollTo(0, 0);
      });

      sectionDiv.appendChild(submitBtn);
    }

    container.appendChild(sectionDiv);
  });
}

function showSection(index) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section, i) => {
    section.style.display = i === index ? "block" : "none";
    const saveBtn = section.querySelector(".save-progress-btn");
    if (saveBtn) {
      saveBtn.style.display = (i === sections.length - 1) ? "none" : "inline-block";
    }
  });
  updateProgressBar(index);
}

function updateProgressBar(currentSectionIndex) {
  const total = temperamentSections.length;
  const percent = ((currentSectionIndex + 1) / total) * 100;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}

function saveProgress() {
  const answers = getAnswers();

  const progressData = {
    answers: answers,
    currentSection: currentSectionIndex,
    surveyMode: surveyMode
  };

  localStorage.setItem("surveyProgress", JSON.stringify(progressData));
}

function loadProgress() {
  const saved = localStorage.getItem("surveyProgress");
  if (!saved) {
    alert("No saved progress found.");
    return;
  }

  const progress = JSON.parse(saved);
  console.log(progress);

  // Set surveyMode BEFORE calling buildSurvey
  if (progress.surveyMode) {
    surveyMode = progress.surveyMode;
  } else {
    surveyMode = 'quick'; // fallback default if older save
  }

  // Now rebuild the correct survey mode
  buildSurvey();
  const allQuestions = Array.from(document.querySelectorAll(".section"))
    .flatMap(section => Array.from(section.querySelectorAll(".question")));
  
    console.log(allQuestions);

  progress.answers.forEach((value, index) => {
    if (value !== null && allQuestions[index]) {
      const radio = allQuestions[index].querySelector(`input[value="${value}"]`);
      if (radio) radio.checked = true;
    }
  }); 

  updateProgressBar(progress.currentSection);
  console.log(progress.currentSection);

  // Wait a bit for DOM to build, then restore answers
  setTimeout(() => {
    currentSectionIndex = progress.currentSection || 0;
    showSection(currentSectionIndex);
    
  }, 100); // small delay to ensure the DOM is ready
}


function showResults() {
  document.getElementById("scoringReminder").classList.add("hidden");
  document.getElementById("progress-container").classList.add("hidden");
  const answers = getAnswers(); // flatten answers array
  const sectionScores = calculateSectionScores(answers);
  const sorted = Object.entries(sectionScores).sort((a, b) => b[1] - a[1]);

  const resultDiv = document.createElement("div");
  resultDiv.innerHTML = `<h2>Section Scores:</h2>`;

  sorted.forEach(([name, score]) => {
    let index = 0;
    resultDiv.className = "score-item";
    resultDiv.innerHTML += `<p><strong>${name}</strong>: ${score}</p>`;
    resultDiv.style.animationDelay = `${index * 0.2}s`;
    index++;
  });

  // Delay temperament reveal
  setTimeout(() => {
    const temperament = getTemperamentBlend(sorted);
    const temperamentSummary = temperamentSummaries[temperament];
    const summary = document.createElement("p");
    summary.className = "temperament-summary";
    summary.textContent = temperamentSummary;

    const tempDiv = document.createElement("div");
    tempDiv.className = "temperament-title";
    tempDiv.innerHTML = `<h3>Your Temperament Blend: ${temperament}</h3>`;
    tempDiv.appendChild(summary);
    const getProfileBtn = document.createElement("button");
    getProfileBtn.textContent = "Get Detailed Profile";
    getProfileBtn.addEventListener("click", () => {
      // Show loading spinner
      getProfileBtn.innerHTML = `<div class="spinner"></div> Loading...`;
      getProfileBtn.disabled = true; // Disable the button so user can't click again

      setTimeout(() => {
        // After short delay, show the description paragraphs
        showTemperamentProfile(temperament, sorted);
        getProfileBtn.remove(); // Remove the button after loading done
      }, 1000); // 1 second delay
    });
    tempDiv.appendChild(getProfileBtn);
    resultDiv.appendChild(tempDiv);
  }, 1000);

  document.getElementById("surveyContainer").innerHTML = ""; // clear old content
  document.getElementById("surveyContainer").appendChild(resultDiv);

  localStorage.removeItem("surveyProgress"); // Clear saved data
}

function getAnswers() {
  const allQuestions = document.querySelectorAll(".question");
  return Array.from(allQuestions).map(q => {
    const selected = q.querySelector("input[type='radio']:checked");
    return selected ? parseInt(selected.value) : null;
  });
}

function calculateSectionScores(answers) {
  const sectionScores = {};
  let qIndex = 0;

  temperamentSections.forEach((section) => {
    let total = 0;
    
    for (const question of section.questions) {
      const score = answers[qIndex++];
      if (score >= 3) total += score;
      if (surveyMode === "quick" && qIndex % 10 === 0) {
        break;
      }
    }
    sectionScores[section.type] = total;
  });
  return sectionScores; 
}

function getTemperamentBlend(sorted) {
  const top = sorted[0][0].toLowerCase();
  const second = sorted[1][0].toLowerCase();
  let temperament;

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
  return temperament = combinations[key] || "Unknown Combination";
}

function showTemperamentProfile(temperament, sorted) {
  const descriptionParagraphs = temperamentDescriptions[temperament];

  // Description paragraphs
  if (descriptionParagraphs && descriptionParagraphs.length > 0) {
    const numberOfScores = temperament.length || 4; // Normally 4 sections
    descriptionParagraphs.forEach((text, index) => {
      const p = document.createElement("p");
      p.className = "description-paragraph";
      p.textContent = text;
      p.style.animationDelay = `${(numberOfScores * 0.2) + (index * 0.2)}s`;
      profileDiv.appendChild(p);
    });
  } 

  const container = document.getElementById("surveyContainer");
  container.innerHTML = `<h2>${temperament} Profile</h2>`;

  const pdfBtn = document.createElement("button");
  pdfBtn.textContent = "Download PDF";
  pdfBtn.addEventListener("click", () => generatePDF(temperament, descriptionParagraphs, sorted));
  profileDiv.appendChild(pdfBtn);
}

async function generatePDF(temperament, descriptionParagraphs, sorted) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const todaysDate = new Date().toLocaleDateString();
  const top = sorted[0][0];
  const second = sorted[1][0];

  // Title and Date
  doc.setFontSize(18);
  doc.text("Temperament Survey Results", 20, 20);
  doc.setFontSize(14);
  doc.text(`Date Taken: ${todaysDate}`, 130, 20);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Your temperament blend is ${temperament}(${top}/${second})`, 20, 30);

  // Section Scores
  let x = 20;
  let y = 40;
  if (sorted.length > 0) {
    doc.setFontSize(12);
    doc.text("Section Scores:", x, y);
    doc.setFont(undefined, "normal");
    y += 7;
    sorted.forEach((item) => {
      doc.text(`• ${item[0]}: ${item[1]}`, x, y);
      x += (item[0] + item[1]).length + 22;
    });
    y += 10;
  }

  // Temperament Summary
  doc.setFont(undefined, "bold");
  doc.text("Summary:", 20, y);
  doc.setFont(undefined, "normal");
  const summary = temperamentSummaries[temperament];
  
  if(summary.length > 0) {
    y += 8;
    
    const lines = doc.splitTextToSize(summary[0].trim(), 170);
    doc.text(lines, 20, y);
  }

  // Description Paragraphs
  y += 30;
  doc.setFont(undefined, "bold"); 
  doc.text("Detailed Profile:", 20, y);
  doc.setFont(undefined, "normal"); 

  if (descriptionParagraphs.length > 0) {
    
    y += 8;
    
    descriptionParagraphs.forEach((p) => {
      const lines = doc.splitTextToSize(p.trim(), 170);
      if (y + lines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * 5 + 5;
    });
  } else {
    doc.text("Profile details not available yet.", 20, y);
  }

  // Save PDF
  const fileName = `temperament_results_${todaysDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
}

// Handle Start/Resume
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("surveyProgress");
  if (saved) {
    document.getElementById("resume-survey-btn").style.display = "inline-block";
  }

  document.getElementById("start-quick-btn").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("surveyContainer").classList.remove("hidden");
    document.getElementById("scoringReminder").classList.remove("hidden");
    document.getElementById("progress-container").classList.remove("hidden");
    surveyMode = "quick";
    buildSurvey();
  });

  document.getElementById("start-full-btn").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("surveyContainer").classList.remove("hidden");
    document.getElementById("scoringReminder").classList.remove("hidden");
    document.getElementById("progress-container").classList.remove("hidden");
    surveyMode = "full";
    buildSurvey();
  });

  document.getElementById("resume-survey-btn").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("surveyContainer").style.display = "block";
    document.getElementById("scoringReminder").classList.remove("hidden");
    document.getElementById("progress-container").classList.remove("hidden");
    loadProgress();
  });
});