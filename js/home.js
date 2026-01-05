function initHomePage() {
  const homeNameElement = document.getElementById("home_name");
  if (homeNameElement) {
    const currentUserJSON = localStorage.getItem("currentUser");
    if (currentUserJSON) {
      const currentUser = JSON.parse(currentUserJSON);
      const firstName = currentUser.name.trim().split(" ")[0];
      homeNameElement.textContent = `Welcome, ${firstName}!`;
    } else {
      homeNameElement.textContent = `Welcome, Student!`;
    }
  }


  const startExamBtn = document.getElementById("startExamBtn");
  const examModal = document.getElementById("my_modal_5");
  const cancelExam = document.getElementById("cancelExam");
  const cancelExam2 = document.getElementById("cancelExam2");
  const Taken = document.getElementById("Taken");

  startExamBtn.onclick = () => {
    examModal.showModal();
  };

  cancelExam.onclick = () => {
    examModal.close();
  };
  cancelExam2.onclick = () => {
    Taken.close();
  };


  const confirmStartExam = document.getElementById("confirmStartExam");
  const loginModal = document.getElementById("login_modal");
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  let user = JSON.parse(localStorage.getItem("currentUser")) || [];
  confirmStartExam.onclick = () => {
    examModal.close();

    if (!isLoggedIn) {
      loginModal.showModal();
    }
    else if (user.exam_submitted === true || user.exam_submitted === 'true') {
      Taken.showModal();
    }
    else if (user.exam_started === true || user.exam_started === 'true') {
      location.replace("exam.html");
    }
    else {
      location.replace("exam.html");
    }
  };
  document.getElementById("goToLogin").onclick = () => {
    location.replace("sign_in.html?mode=signin");
  };

  document.getElementById("res_home").onclick = () => {
    location.href = "result.html";
  };

}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initHomePage);
} else {
  initHomePage();
}

