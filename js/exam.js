
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

document.addEventListener('DOMContentLoaded', () => {


  let user = JSON.parse(localStorage.getItem("currentUser")) || {};

  if (user.exam_submitted === true || user.exam_submitted === 'true') {
    window.location.replace('result.html');
    return;
  }

  if (user.exam_started === true || user.exam_started === 'true') {
    const savedState = localStorage.getItem(`exam_state_${user.email}`);
    if (!savedState) {
     
    }
  } else {
    user.exam_started = true;
    localStorage.setItem("currentUser", JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

});

let currentQuestionIndex = 0;
let userAnswers = [];
let flaggedQuestions = new Set();
let examStartTime = null;
let examDuration = 6 * 60;
let timeRemaining = examDuration;
let timerInterval = null;

let shuffledQuestions = [];
let originalIndexMap = [];



function initExam() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const savedStateJson = localStorage.getItem(`exam_state_${user.email}`);

  if (savedStateJson) {
    restoreExamState(JSON.parse(savedStateJson));
  } else {
    startNewExam();
  }
}

function startNewExam() {
  examStartTime = Date.now();
  userAnswers = new Array(questions.length).fill(null);
  currentQuestionIndex = 0;
  flaggedQuestions.clear();

  const indices = Array.from({ length: questions.length }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  originalIndexMap = indices;
  shuffledQuestions = indices.map(idx => questions[idx]);

  saveExamState(); 
  startTimer();
  renderQuestionNavigation();
  loadQuestion(0);
  updateAnsweredCount();
}

function restoreExamState(state) {
  examStartTime = state.examStartTime;
  userAnswers = state.userAnswers || [];
  currentQuestionIndex = state.currentQuestionIndex || 0;

  flaggedQuestions = new Set(state.flaggedQuestions || []);

  originalIndexMap = state.originalIndexMap || [];

  if (originalIndexMap.length > 0) {
    shuffledQuestions = originalIndexMap.map(idx => questions[idx]);
  } else {
    startNewExam();
    return;
  }

  const elapsedSeconds = Math.floor((Date.now() - examStartTime) / 1000);
  timeRemaining = Math.max(0, examDuration - elapsedSeconds);

  startTimer();
  renderQuestionNavigation();
  loadQuestion(currentQuestionIndex);
  updateAnsweredCount();
}

function saveExamState() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const state = {
    examStartTime: examStartTime,
    userAnswers: userAnswers,
    currentQuestionIndex: currentQuestionIndex,
    flaggedQuestions: Array.from(flaggedQuestions),
    originalIndexMap: originalIndexMap
  };

  localStorage.setItem(`exam_state_${user.email}`, JSON.stringify(state));
}

const time_out_sound = new Audio('assets/Time_out.mpeg');
const tin = new Audio('assets/tin.mpeg');
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - examStartTime) / 1000);
    timeRemaining = examDuration - elapsedSeconds;

    if (timeRemaining <= 300 && timeRemaining > 299) { 
      
    }

    if (timeRemaining === 5 * 60) {
      tin.play().catch(e => console.log("Audio play failed interaction??", e));
      document.getElementById('my_modal_3').showModal();
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timeRemaining = 0;
      autoSubmit();
      return;
    }

    updateTimerDisplay();
    
  }, 1000);

  updateTimerDisplay();

}

function updateTimerDisplay() {
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;


  const timerElement = document.getElementById('timerDisplay');

  timerElement.textContent =
    `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;


  if (timeRemaining <= 5 * 60) {
    timerElement.classList.add('text-red-600', 'font-extrabold');
  } else {
    timerElement.classList.remove('text-red-600', 'font-extrabold');
  }

  const progress = (timeRemaining / examDuration) * 100;

  document.getElementById('timerProgress').value = progress;


}

function loadQuestion(index) {


  if (index < 0 || index >= questions.length) return;

  currentQuestionIndex = index;
  saveExamState(); 
  const question = shuffledQuestions[index];

  document.getElementById('questionText').textContent = `${index + 1}. ${question.question}`;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';



  question.options.forEach((option, i) => {

    const div = document.createElement('div');
    div.className = 'flex items-center p-5 border-2 border-gray-400 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-600 hover:bg-blue-50';

    if (userAnswers[originalIndexMap[index]] === option) {
      div.classList.add('bg-blue-100', 'border-blue-700');
    }

    const radio = document.createElement('input');


    radio.type = 'radio';
    radio.name = 'questionOption';
    radio.value = option;
    radio.id = `opt-${i}`;
    radio.checked = userAnswers[originalIndexMap[index]] === option;
    radio.className = 'radio radio-primary mr-4';


    const label = document.createElement('label');
    label.htmlFor = `opt-${i}`;

    label.className = 'flex-1 cursor-pointer text-lg font-medium text-gray-900';
    label.textContent = option;

    radio.addEventListener('change', () => selectAnswer(option));

    div.appendChild(radio);
    div.appendChild(label);

    container.appendChild(div);

  });


  updateBookmarkButton();
  updateNavigationButtons();
  updateQuestionNavigation();


}



function selectAnswer(answer) {

  const originalIndex = originalIndexMap[currentQuestionIndex];
  userAnswers[originalIndex] = answer;
  saveExamState(); 
  updateAnsweredCount();


  loadQuestion(currentQuestionIndex);
}

function updateAnsweredCount() {

  const answered = userAnswers.filter(a => a !== null).length;

  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('totalQuestions').textContent = questions.length;
}

function toggleBookmark() {
  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
  } else {
    flaggedQuestions.add(currentQuestionIndex);
    flaggedQuestions.add(currentQuestionIndex);
  }

  saveExamState(); 
  updateBookmarkButton();

  updateQuestionNavigation();

}



function updateBookmarkButton() {


  const btn = document.getElementById('bookmarkBtn');
  if (flaggedQuestions.has(currentQuestionIndex)) {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#CA2727]" fill="currentColor" viewBox="0 0 24 24"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V15.693L18.8542 10.8727C20.5846 10.2238 20.5846 7.77627 18.8542 7.12739L6 2.30705V2C6 1.44772 5.55228 1 5 1ZM6 4.44305V13.557L17.6526 9.18732C17.8256 9.12243 17.8256 8.87767 17.6526 8.81278L6 4.44305Z" />
            fill="#CA2727" </svg>`;
  } else {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V15.693L18.8542 10.8727C20.5846 10.2238 20.5846 7.77627 18.8542 7.12739L6 2.30705V2C6 1.44772 5.55228 1 5 1ZM6 4.44305V13.557L17.6526 9.18732C17.8256 9.12243 17.8256 8.87767 17.6526 8.81278L6 4.44305Z" fill="#0F0F0F"/>
            </svg>`;
  }

}



function updateNavigationButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  prev.disabled = currentQuestionIndex === 0;
  next.disabled = currentQuestionIndex === questions.length - 1;


  prev.style.opacity = prev.disabled ? '0.6' : '1';
  next.style.opacity = next.disabled ? '0.6' : '1';
}


function goToPrevious() {
  if (currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1);
}


function goToNext() {
  if (currentQuestionIndex < questions.length - 1) loadQuestion(currentQuestionIndex + 1);
}

function renderQuestionNavigation() {
  const nav = document.getElementById('questionNav');
  nav.innerHTML = '';


  for (let displayIndex = 0; displayIndex < questions.length; displayIndex++) {
    const btn = document.createElement('button');
    btn.className = 'btn w-full h-12 rounded-lg font-bold text-sm flex items-center justify-between px-4 transition-colors duration-200';
    btn.dataset.displayIndex = displayIndex;



    const textSpan = document.createElement('span');
    textSpan.textContent = `Question ${displayIndex + 1}`;
    btn.appendChild(textSpan);

    const rightSlot = document.createElement('span');
    rightSlot.className = 'w-8 text-right';
    btn.appendChild(rightSlot);



    btn.addEventListener('click', () => loadQuestion(displayIndex));
    nav.appendChild(btn);
  }



  updateQuestionNavigation();
}

function updateQuestionNavigation() {
  const buttons = document.querySelectorAll('#questionNav button');


  buttons.forEach(btn => {
    const displayIndex = parseInt(btn.dataset.displayIndex);

    btn.classList.remove('bg-gray-200', 'bg-success', 'bg-warning', 'custom-current', 'hover:bg-gray-300', 'hover:bg-success/90', 'hover:bg-warning/90', 'hover:opacity-90');

    const textSpan = btn.querySelector('span:first-child');
    const rightSlot = btn.querySelector('span:last-child');

    textSpan.className = 'text-gray-800';

    rightSlot.innerHTML = '';
    rightSlot.className = 'w-8 text-right';

    if (displayIndex === currentQuestionIndex) {
      btn.classList.add('custom-current', 'hover:opacity-90');
      textSpan.className = 'text-white';
    }
    else if (userAnswers[originalIndexMap[displayIndex]] !== null) {
      btn.classList.add('custom-current', 'hover:opacity-90');
      textSpan.className = 'text-white';
    }
    else {
      btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    }


    if (flaggedQuestions.has(displayIndex)) {
      btn.classList.remove('bg-gray-200', 'bg-success', 'custom-current');

      btn.classList.add('bg-warning', 'hover:bg-warning/90');
      textSpan.className = 'text-warning-content';
      rightSlot.innerHTML = '🚩';
      rightSlot.className = 'w-8 text-right text-lg';
    }


  });

}


function showSubmitModal() {
  const answered = userAnswers.filter(a => a !== null).length;

  if (answered < questions.length) {
    document.getElementById('finalAnsweredCount').textContent = answered;
    document.getElementById('finalTotalQuestions').textContent = questions.length;
    document.getElementById('my_modal_4').showModal();
  } else {
    document.getElementById('my_modal_1').showModal();
  }
}

function saveExamResult() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    currentUser.exam_submitted = true;
    currentUser.exam_answers = userAnswers;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
}

function confirmSubmit() {
  clearInterval(timerInterval);
  saveExamResult();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    localStorage.removeItem(`exam_state_${user.email}`);
  }

  window.location.replace('result.html');
}

function cancelSubmit() {
  document.getElementById('submitModal').close();
}


function autoSubmit() {
  // time_out_sound.play();
  document.getElementById('my_modal_2').showModal();
}


document.addEventListener('DOMContentLoaded', () => {
  initExam();

  document.getElementById('prevBtn').addEventListener('click', goToPrevious);
  document.getElementById('nextBtn').addEventListener('click', goToNext);
  document.getElementById('bookmarkBtn').addEventListener('click', toggleBookmark);

  document.getElementById('submitBtn').addEventListener('click', showSubmitModal);
  document.getElementById('confirmSubmitBtn').addEventListener('click', confirmSubmit);
  document.getElementById('cancelSubmitBtn').addEventListener('click', cancelSubmit);


  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();

  });


  window.addEventListener('beforeunload', (e) => {
    if (timeRemaining > 0) {
      e.preventDefault();
      e.returnValue = '';
    }

  });
});


function closeModal(id) {
  document.getElementById(id).close();
}

function stayInExam() {
  document.getElementById("exitConfirmModal").close();
}

function confirmExitExam() {
  confirmSubmit();
}