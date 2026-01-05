history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};


document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  let user = JSON.parse(localStorage.getItem("currentUser"));

  if (!isLoggedIn || !user) {
    window.location.replace('home.html');
    return;
  }

  if (Array.isArray(user) && user.length === 0) {
    window.location.replace('home.html');
    return;
  }

  const examSubmitted = user.exam_submitted === true || user.exam_submitted === 'true';
  const examStarted = user.exam_started === true || user.exam_started === 'true';

  if (!examSubmitted) {
    if (examStarted) {
      window.location.replace('exam.html');
      return;
    } else {
      
      window.location.replace('home.html');
      return;
    }
  }

  const storedAnswers = user.exam_answers;
  const userAnswers = storedAnswers ? storedAnswers : new Array(questions.length).fill(null);

  const total = questions.length;
  let correct = 0;

  questions.forEach((q, i) => {
    if (q.correct === userAnswers[i]) correct++;
  });

  const wrong = total - correct;
  const percent = Math.round((correct / total) * 100);

  let grade = "F", msg = "Hard luck";
  if (percent >= 85) grade = "A";
  else if (percent >= 75) grade = "B";
  else if (percent >= 60) grade = "C";
  else if (percent >= 50) grade = "D";

  if (percent >= 50) {
    msg = "Congratulations";
  }

  const summaryEl = document.getElementById("summary");
  if (summaryEl) {
    summaryEl.innerHTML = SummaryComponent(total, correct, wrong, grade);
  }

  const progressEl = document.getElementById("progress");
  if (progressEl) {
    progressEl.innerHTML = ProgressCircle(percent, grade);
  }0

  const firstName = user.name ? user.name.trim().split(" ")[0] : "User";
  const msgEl = document.getElementById("userMessage");
  if (msgEl) {
    msgEl.textContent = `${msg}, ${firstName}`;
  }

  const review = document.getElementById("review");
  if (review) {
    questions.forEach((q, i) => {
      review.innerHTML += QuestionReviewComponent(q, userAnswers[i], i);
    });
  }

});

