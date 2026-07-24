"use strict";

const donghakCharacterNames = [
  "흑초",
  "블릭",
  "하랑",
  "폭스",
  "액스",
  "노아",
  "머디",
  "토리",
  "토토",
  "리트",
  "베티",
  "도브",
  "온",
  "리버",
  "올베",
  "유오",
  "헤스"
];

const quizData = [
  {
    id: 1,
    question: "초루딩님의 첫 영상 이름은 무엇인가요? (롱폼 기준)",
    answers: ["첫 영상", "첫영상"],
    displayAnswer: "첫 영상"
  },
  {
    id: 2,
    question: "초루딩님의 별자리는 무엇인가요?",
    answers: ["염소자리"],
    displayAnswer: "염소자리"
  },
  {
    id: 3,
    question: "쇼츠 기준으로 현재는 삭제되었지만 첫 영상은 무엇인가요?",
    answers: ["오징어게임", "오징어 게임"],
    displayAnswer: "오징어게임"
  },
  {
    id: 4,
    question: "현재는 삭제되었지만 얀초가 탄생하게 된 이유는 누구 때문인가요?",
    answers: ["네즈미"],
    displayAnswer: "네즈미"
  },
  {
    id: 5,
    question: "사돌이들의 PTSD가 도지는 날은 언제인가요?",
    answers: [
      "크리스마스",
      "크리스마스이브",
      "크리스마스 이브",
      "크리스마스와 크리스마스 이브",
      "크리스마스 크리스마스 이브",
      "크리스마스, 크리스마스 이브"
    ],
    displayAnswer: "크리스마스, 크리스마스 이브"
  },
  {
    id: 6,
    question: "초루의 최애 자캐는 누구인가요?",
    answers: ["벨라"],
    displayAnswer: "벨라"
  },
  {
    id: 7,
    question: "초루딩 채널에서 가장 인기가 많은 영상은 무엇인가요?",
    answers: ["엄마하고 부르는 날에", "엄마 하고 부르는 날에"],
    displayAnswer: "엄마하고 부르는 날에"
  },
  {
    id: 8,
    question: "동학 시리즈 캐릭터 중 도서부인 캐릭터는 누구인가요?",
    answers: ["올베"],
    displayAnswer: "올베"
  },
  {
    id: 9,
    question: "동학 시리즈 캐릭터 중 아는 이름 3가지를 서술하세요!",
    type: "threeNames",
    guide: "목록에 있는 서로 다른 이름 3개를 쉼표로 구분해서 입력해주세요.",
    displayAnswer: "흑초, 블릭, 하랑, 폭스, 액스, 노아, 머디, 토리, 토토, 리트, 베티, 도브, 온, 리버, 올베, 유오, 헤스 중 3개"
  },
  {
    id: 10,
    question: "초루딩 채널의 첫 번째 이름은 무엇인가요?",
    answers: [
      "스틱파&일상 채널",
      "스틱파 & 일상 채널",
      "스틱파 일상 채널",
      "스틱파일상채널"
    ],
    displayAnswer: "스틱파&일상 채널"
  }
];

const startScreen = document.querySelector("#startScreen");
const quizScreen = document.querySelector("#quizScreen");
const endScreen = document.querySelector("#endScreen");

const startButton = document.querySelector("#startButton");
const submitButton = document.querySelector("#submitButton");
const nextButton = document.querySelector("#nextButton");
const menuButton = document.querySelector("#menuButton");

const questionNumber = document.querySelector("#questionNumber");
const questionText = document.querySelector("#questionText");
const answerGuide = document.querySelector("#answerGuide");
const answerInput = document.querySelector("#answerInput");
const scoreText = document.querySelector("#scoreText");
const progress = document.querySelector("#progress");

const resultBox = document.querySelector("#resultBox");
const resultMessage = document.querySelector("#resultMessage");
const correctAnswerText = document.querySelector("#correctAnswerText");

const totalQuestionCount = document.querySelector("#totalQuestionCount");
const finalScore = document.querySelector("#finalScore");
const rankText = document.querySelector("#rankText");
const finalMessage = document.querySelector("#finalMessage");
const creditBox = document.querySelector("#creditBox");
const loveMessage = document.querySelector("#loveMessage");

let shuffledQuizData = [];
let previousQuestionOrder = [];

let currentQuestionIndex = 0;
let score = 0;
let answerSubmitted = false;

let creditTimer = null;
let loveMessageTimer = null;

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s,.!?·~"'`&()[\]{}:;_-]/g, "");
}

function shuffleArray(array) {
  const copiedArray = [...array];

  for (let index = copiedArray.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [copiedArray[index], copiedArray[randomIndex]] =
      [copiedArray[randomIndex], copiedArray[index]];
  }

  return copiedArray;
}

function isSameOrder(firstOrder, secondOrder) {
  if (firstOrder.length !== secondOrder.length) {
    return false;
  }

  return firstOrder.every((id, index) => {
    return id === secondOrder[index];
  });
}

function createNewQuestionOrder() {
  const savedOrder = localStorage.getItem("chorudingPreviousOrder");

  if (savedOrder) {
    try {
      previousQuestionOrder = JSON.parse(savedOrder);
    } catch (error) {
      previousQuestionOrder = [];
    }
  }

  let newQuizOrder;
  let newOrderIds;

  do {
    newQuizOrder = shuffleArray(quizData);
    newOrderIds = newQuizOrder.map((quiz) => quiz.id);
  } while (
    previousQuestionOrder.length > 0 &&
    isSameOrder(newOrderIds, previousQuestionOrder)
  );

  previousQuestionOrder = [...newOrderIds];

  localStorage.setItem(
    "chorudingPreviousOrder",
    JSON.stringify(previousQuestionOrder)
  );

  return newQuizOrder;
}

function parseCharacterNames(value) {
  let names = value
    .split(/[,，/|\n]+/)
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (names.length === 1) {
    names = value
      .trim()
      .split(/\s+/)
      .filter((name) => name !== "");
  }

  const normalizedNames = names.map((name) => normalizeAnswer(name));

  return [...new Set(normalizedNames)];
}

function isCorrectAnswer(quiz, userAnswer) {
  if (quiz.type === "threeNames") {
    const submittedNames = parseCharacterNames(userAnswer);

    const allowedNames = new Set(
      donghakCharacterNames.map((name) => normalizeAnswer(name))
    );

    const validNames = submittedNames.filter((name) => {
      return allowedNames.has(name);
    });

    /*
      허용 목록에 있는 서로 다른 이름이
      3개 이상 포함되면 정답입니다.
    */
    return validNames.length >= 3;
  }

  const normalizedUserAnswer = normalizeAnswer(userAnswer);

  return quiz.answers.some((answer) => {
    return normalizeAnswer(answer) === normalizedUserAnswer;
  });
}

function clearGameTimers() {
  if (creditTimer !== null) {
    clearTimeout(creditTimer);
    creditTimer = null;
  }

  if (loveMessageTimer !== null) {
    clearTimeout(loveMessageTimer);
    loveMessageTimer = null;
  }
}

function resetGame() {
  clearGameTimers();

  currentQuestionIndex = 0;
  score = 0;
  answerSubmitted = false;

  scoreText.textContent = "0";
  finalScore.textContent = "0";

  answerInput.value = "";
  answerInput.disabled = false;

  resultBox.classList.add("hidden");
  creditBox.classList.add("hidden");
  loveMessage.classList.add("hidden");
  menuButton.classList.add("hidden");

  progress.style.width = "0%";
}

function startQuiz() {
  resetGame();

  shuffledQuizData = createNewQuestionOrder();

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  const currentQuiz = shuffledQuizData[currentQuestionIndex];

  answerSubmitted = false;

  questionNumber.textContent =
    `문제 ${currentQuestionIndex + 1} / ${shuffledQuizData.length}`;

  questionText.textContent = currentQuiz.question;

  const progressPercentage =
    ((currentQuestionIndex + 1) / shuffledQuizData.length) * 100;

  progress.style.width = `${progressPercentage}%`;

  answerInput.value = "";
  answerInput.disabled = false;

  submitButton.disabled = false;
  submitButton.classList.remove("hidden");

  resultBox.classList.add("hidden");

  resultMessage.textContent = "";
  resultMessage.className = "result-message";

  correctAnswerText.textContent = "";

  if (currentQuiz.type === "threeNames") {
    answerGuide.textContent = currentQuiz.guide;
    answerGuide.classList.remove("hidden");
    answerInput.placeholder = "예: 이름1, 이름2, 이름3";
  } else {
    answerGuide.textContent = "";
    answerGuide.classList.add("hidden");
    answerInput.placeholder = "정답을 입력해주세요";
  }

  const isLastQuestion =
    currentQuestionIndex === shuffledQuizData.length - 1;

  nextButton.textContent = isLastQuestion
    ? "결과 보기"
    : "다음 문제";

  answerInput.focus();
}

function checkAnswer() {
  if (answerSubmitted) {
    return;
  }

  const userAnswer = answerInput.value.trim();

  if (userAnswer === "") {
    alert("정답을 입력해주세요!");
    answerInput.focus();
    return;
  }

  answerSubmitted = true;

  const currentQuiz = shuffledQuizData[currentQuestionIndex];
  const isCorrect = isCorrectAnswer(currentQuiz, userAnswer);

  if (isCorrect) {
    score += 1;
    scoreText.textContent = score;

    resultMessage.textContent = "정답입니다! 🎉";
    resultMessage.classList.add("correct");
  } else {
    resultMessage.textContent = "아쉽지만 오답입니다!";
    resultMessage.classList.add("wrong");
  }

  correctAnswerText.textContent = currentQuiz.displayAnswer;

  answerInput.disabled = true;

  submitButton.disabled = true;
  submitButton.classList.add("hidden");

  resultBox.classList.remove("hidden");
}

function goToNextQuestion() {
  if (!answerSubmitted) {
    return;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex < shuffledQuizData.length) {
    showQuestion();
    return;
  }

  showFinalResult();
}

function getRank(correctCount) {
  if (correctCount <= 3) {
    return "사회돌이";
  }

  if (correctCount <= 6) {
    return "역사부도도리";
  }

  return "역사돌이";
}

function getFinalMessage(rank) {
  if (rank === "역사돌이") {
    return "초루딩의 역사를 완벽하게 알고 있네요!";
  }

  if (rank === "역사부도도리") {
    return "초루딩의 역사를 제법 많이 알고 있네요!";
  }

  return "초루딩의 역사를 조금 더 공부해보세요!";
}

function showFinalResult() {
  clearGameTimers();

  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  const rank = getRank(score);

  totalQuestionCount.textContent = shuffledQuizData.length;
  finalScore.textContent = score;
  rankText.textContent = rank;
  finalMessage.textContent = getFinalMessage(rank);

  creditBox.classList.add("hidden");
  loveMessage.classList.add("hidden");
  menuButton.classList.add("hidden");

  creditTimer = setTimeout(() => {
    creditBox.classList.remove("hidden");
    menuButton.classList.remove("hidden");

    loveMessageTimer = setTimeout(() => {
      loveMessage.classList.remove("hidden");
    }, 2170);
  }, 300);
}

function returnToMenu() {
  resetGame();

  quizScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", goToNextQuestion);
menuButton.addEventListener("click", returnToMenu);

answerInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  if (answerSubmitted) {
    goToNextQuestion();
  } else {
    checkAnswer();
  }
});
