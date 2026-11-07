const questions = [
  {
    category: "Number",
    question: "What is 36 + 19?",
    answers: ["55", "45", "65", "54"],
    correct: "55"
  },
  {
    category: "Multiplication",
    question: "What is 7 × 8?",
    answers: ["54", "56", "64", "48"],
    correct: "56"
  },
  {
    category: "Fractions",
    question: "Which fraction is equal to 1/2?",
    answers: ["2/3", "3/6", "1/4", "4/5"],
    correct: "3/6"
  },
  {
    category: "Measurement",
    question: "How many centimetres are in 1 metre?",
    answers: ["10", "100", "1000", "50"],
    correct: "100"
  },
  {
    category: "Time",
    question: "What time is shown by 3:45?",
    answers: ["Quarter past three", "Quarter to four", "Half past three", "Five to four"],
    correct: "Quarter to four"
  },
  {
    category: "Geometry",
    question: "How many right angles does a square have?",
    answers: ["1", "2", "3", "4"],
    correct: "4"
  },
  {
    category: "Place Value",
    question: "Which number is bigger: 482 or 428?",
    answers: ["428", "482", "They are equal", "Cannot tell"],
    correct: "482"
  },
  {
    category: "Division",
    question: "What is 24 ÷ 4?",
    answers: ["5", "6", "7", "8"],
    correct: "6"
  },
  {
    category: "Number",
    question: "What is 100 less than 734?",
    answers: ["634", "724", "664", "624"],
    correct: "634"
  },
  {
    category: "Statistics",
    question: "If a bar chart shows 5 apples, 3 oranges and 2 pears, which fruit is most popular?",
    answers: ["Oranges", "Pears", "Apples", "Bananas"],
    correct: "Apples"
  }
];

const storageKey = "year3MathsProgress";
const defaultProgress = {
  counts: false,
  addition: false,
  multiplication: false,
  fractions: false,
  time: false,
  shapes: false,
  data: false,
  challenge: false
};

function getProgress() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(defaultProgress));
    return { ...defaultProgress };
  }

  try {
    return { ...defaultProgress, ...JSON.parse(saved) };
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(defaultProgress));
    return { ...defaultProgress };
  }
}

function updateProgress(storageState) {
  localStorage.setItem(storageKey, JSON.stringify(storageState));

  const taskList = document.querySelectorAll(".task-list input[type='checkbox']");
  taskList.forEach((checkbox) => {
    const key = checkbox.dataset.key;
    checkbox.checked = Boolean(storageState[key]);
  });

  const total = Object.keys(defaultProgress).length;
  const completed = Object.keys(defaultProgress).filter((key) => Boolean(storageState[key])).length;
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector("#progressText");

  if (progressBar) {
    const percentage = (completed / total) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  if (progressText) {
    progressText.textContent = `${completed}/${total} skills complete`;
  }
}

function attachProgressHandlers() {
  const taskList = document.querySelectorAll(".task-list input[type='checkbox']");
  taskList.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const state = getProgress();
      state[checkbox.dataset.key] = checkbox.checked;
      updateProgress(state);
    });
  });
}

function renderProgressPage() {
  const state = getProgress();
  updateProgress(state);
}

function initQuiz() {
  const scoreValue = document.getElementById("scoreValue");
  const questionCount = document.getElementById("questionCount");
  const questionCategory = document.getElementById("questionCategory");
  const questionText = document.getElementById("questionText");
  const answerButtons = document.getElementById("answerButtons");
  const feedback = document.getElementById("feedback");
  const nextButton = document.getElementById("nextButton");

  if (!scoreValue || !questionCount || !questionCategory || !questionText || !answerButtons || !feedback || !nextButton) {
    return;
  }

  let score = 0;
  let currentQuestionIndex = 0;
  let questionSet = [];

  function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function updateScore() {
    scoreValue.textContent = score;
    questionCount.textContent = questionSet.length;
  }

  function finishQuiz() {
    questionText.textContent = `Well done! You scored ${score} out of ${questionSet.length}.`;
    questionCategory.textContent = "Quiz complete";
    answerButtons.innerHTML = "";
    feedback.textContent = "Keep practising to become even stronger with your Year 3 maths skills!";
    feedback.className = "feedback success";
    nextButton.classList.add("hidden");

    const state = getProgress();
    state.challenge = true;
    updateProgress(state);
  }

  function renderQuestion() {
    if (currentQuestionIndex >= questionSet.length) {
      finishQuiz();
      return;
    }

    const currentQuestion = questionSet[currentQuestionIndex];
    questionCategory.textContent = currentQuestion.category;
    questionText.textContent = currentQuestion.question;
    feedback.textContent = "";
    feedback.className = "feedback";
    nextButton.classList.add("hidden");

    const shuffledAnswers = shuffleArray(currentQuestion.answers);
    answerButtons.innerHTML = "";

    shuffledAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.textContent = answer;
      button.setAttribute("aria-label", `Answer: ${answer}`);

      button.addEventListener("click", () => {
        const isCorrect = answer === currentQuestion.correct;
        const buttons = answerButtons.querySelectorAll("button");

        buttons.forEach((btn) => {
          btn.disabled = true;
          if (btn.textContent === currentQuestion.correct) {
            btn.classList.add("correct");
          }
        });

        if (isCorrect) {
          score += 1;
          updateScore();
          feedback.textContent = "Correct! Great job!";
          feedback.classList.add("success");
        } else {
          feedback.textContent = `Not quite. The correct answer is ${currentQuestion.correct}.`;
          feedback.classList.add("error");
          button.classList.add("incorrect");
        }

        nextButton.classList.remove("hidden");
      });

      answerButtons.appendChild(button);
    });
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex += 1;
    renderQuestion();
  });

  score = 0;
  currentQuestionIndex = 0;
  questionSet = shuffleArray(questions).slice(0, 5);
  updateScore();
  renderQuestion();
}

function setupLessonTabs() {
  const tabs = document.querySelectorAll(".lesson-tab");
  const panels = document.querySelectorAll(".lesson-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;

      tabs.forEach((btn) => {
        const isActive = btn === tab;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
      });
    });
  });
}

function setupLessonQuestions() {
  document.querySelectorAll(".practice-answers").forEach((answerGroup) => {
    const correctAnswer = answerGroup.dataset.correct;
    const buttons = answerGroup.querySelectorAll(".practice-option");
    const feedback = answerGroup.parentElement.querySelector(".practice-feedback");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedAnswer = button.dataset.answer;
        buttons.forEach((btn) => {
          btn.disabled = true;
          if (btn.dataset.answer === correctAnswer) {
            btn.classList.add("correct");
          }
        });

        if (selectedAnswer === correctAnswer) {
          feedback.textContent = "Correct! Well done.";
          feedback.style.color = "#13a77d";

          const state = getProgress();
          const lessonKey = answerGroup.closest(".lesson-panel").id.replace("-panel", "");
          const mappedKey = {
            counting: "counts",
            addition: "addition",
            multiplication: "multiplication",
            fractions: "fractions",
            measurement: "time",
            geometry: "shapes"
          }[lessonKey] || lessonKey;

          state[mappedKey] = true;
          updateProgress(state);
        } else {
          feedback.textContent = `Not quite. The correct answer is ${correctAnswer}.`;
          feedback.style.color = "#d93a3a";
          button.classList.add("incorrect");
        }
      });
    });
  });
}

function setupGameButtons() {
  document.querySelectorAll(".game-card .mini-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const state = getProgress();
      state.game = true;
      updateProgress(state);
      button.textContent = "Played";
      button.disabled = true;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachProgressHandlers();
  renderProgressPage();
  setupLessonTabs();
  setupLessonQuestions();
  setupGameButtons();
  initQuiz();
});
