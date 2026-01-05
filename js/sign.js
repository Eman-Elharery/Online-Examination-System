document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn ) {
    window.location.replace('home.html');
    return;
  }
});


const container = document.querySelector(".container");
const btn = document.querySelector(".signin-btn");
const forms = document.querySelectorAll("form");
const errors = document.querySelectorAll(".error");
btn.onclick = function () {
  container.classList.toggle("active");
  btn.textContent = container.classList.contains("active") ? "Sign Up" : "Sign In";
  forms.forEach(form => form.reset());
  errors.forEach(er => er.textContent = "");
};
//const container = document.querySelector(".container");
document.getElementById("toSignin").onclick = () => {
  container.classList.add("active");
  document.querySelectorAll('form').forEach(f => f.reset());
  document.querySelectorAll('.error').forEach(e => e.textContent = "");
};

document.getElementById("toSignup").onclick = () => {
  container.classList.remove("active");
  document.querySelectorAll('form').forEach(f => f.reset());
  document.querySelectorAll('.error').forEach(e => e.textContent = "");
};



const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "signin") {
  container.classList.add("active");
  btn.textContent = "Sign Up" ;
} else {
  container.classList.remove("active");
}



/////////////////////////////////////////////////////////////////////////
const eyes = document.querySelectorAll(".eye");
eyes.forEach(eye => {
  eye.addEventListener("click", () => {
    const input = eye.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
      eye.classList.remove("fa-eye");
      eye.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      eye.classList.remove("fa-eye-slash");
      eye.classList.add("fa-eye");
    }
  });
});

/////////////////////////////////////////////////////////////////////////

const signupForm = document.getElementById("signup-form");

const namee = document.getElementById("signup_name");
const email = document.getElementById("signup_email");
const password = document.getElementById("signup_password");
const confirmPassword = document.getElementById("signup_confirmPassword");

const NameError = document.getElementById("name_error");
const EmailError = document.getElementById("email_error");
const PasswordError = document.getElementById("password_error");
const RePasswordError = document.getElementById("re_password_error");

const nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;


namee.addEventListener("blur", () => {
  const nameVal = namee.value.trim();
  if (nameVal === "") {
    NameError.textContent = "Name is required";
  }
  else if (/\d/.test(nameVal)) {
    NameError.textContent = "Numbers are not allowed in name";
  }
  else if (nameVal.length < 7) {
    NameError.textContent = "Invalid Name (too short) ";
  }
  else if (!nameRegex.test(namee.value.trim())) {
    NameError.textContent = "Name must be first and last name (e.g. Youssef Mohamed, Eman Refaat)";
  } else {
    NameError.textContent = "";
  }
});

email.addEventListener("blur", () => {
  if (email.value.trim() === "") {
    EmailError.textContent = "Email is required";
  }
  else if (!emailRegex.test(email.value.trim())) {
    EmailError.textContent = "Please enter a valid email address";
  } else {
    EmailError.textContent = "";
  }
});

password.addEventListener("blur", () => {
  if (password.value.trim() === "") {
    PasswordError.textContent = "Password is required";
  }
  else if (!passwordRegex.test(password.value.trim())) {
    PasswordError.textContent = "Password must be at least 8 characters, contain one capital letter and one number";
  } else {
    PasswordError.textContent = "";
  }
});

confirmPassword.addEventListener("blur", () => {
  if (confirmPassword.value.trim() === "") {
    RePasswordError.textContent = "Required";
  }
  else if (confirmPassword.value.trim() !== password.value.trim()) {
    RePasswordError.textContent = "Passwords do not match";
  } else {
    RePasswordError.textContent = "";
  }
});

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;


  const nameVal = namee.value.trim();
  if (nameVal === "") {
    NameError.textContent = "Name is required";
    valid = false;
  } else if (/\d/.test(nameVal)) {
    NameError.textContent = "Numbers are not allowed in name";
    valid = false;
  } else if (nameVal.length < 3) {
    NameError.textContent = "Invalid Name (too short)";
    valid = false;
  } else if (!nameRegex.test(nameVal)) {
    NameError.textContent = "Name must be first and last name (e.g. Youssef Mohamed, Eman Refaat)";
    valid = false;
  } else {
    NameError.textContent = "";
  }


  const emailVal = email.value.trim();
  if (emailVal === "") {
    EmailError.textContent = "Email is required";
    valid = false;
  } else if (!emailRegex.test(emailVal)) {
    EmailError.textContent = "Please enter a valid email address";
    valid = false;
  } else {
    EmailError.textContent = "";
  }


  const passVal = password.value.trim();
  if (passVal === "") {
    PasswordError.textContent = "Password is required";
    valid = false;
  } else if (!passwordRegex.test(passVal)) {
    PasswordError.textContent =
      "Password must be at least 8 characters, contain one capital letter and one number";
    valid = false;
  } else {
    PasswordError.textContent = "";
  }

  const confirmVal = confirmPassword.value.trim();
  if (confirmVal === "") {
    RePasswordError.textContent = "Required";
    valid = false;
  } else if (confirmVal !== passVal) {
    RePasswordError.textContent = "Passwords do not match";
    valid = false;
  } else {
    RePasswordError.textContent = "";
  }

  if (!valid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(user => user.email === emailVal)) {
    EmailError.textContent = "Email already exists!";
    return;
  }

  users.push({
    name: nameVal,
    email: emailVal,
    password: CryptoJS.SHA256(passVal).toString(),
    exam_submitted: false
  });

  localStorage.setItem("users", JSON.stringify(users));

  const successAlert = document.getElementById("successAlert");
  successAlert.classList.remove("hidden");

  setTimeout(() => {
    successAlert.classList.add("hidden");
  }, 3000);

  signupForm.reset();
});

successAlert.classList.add("hidden");
/////////////////////////////////////////////////////////////////////////////////////
const signinForm = document.getElementById("signin-form");

const email2 = document.getElementById("signin_email");
const password2 = document.getElementById("signin_password");

const EmailError2 = document.getElementById("email_error2");
const PasswordError2 = document.getElementById("password_error2");

email2.addEventListener("blur", () => {
  if (email2.value.trim() === "") {
    EmailError2.textContent = "Email is required";
  }
  else if (!emailRegex.test(email2.value.trim())) {
    EmailError2.textContent = "Please enter a valid email address";
  } else {
    EmailError2.textContent = "";
  }
});

password2.addEventListener("blur", () => {
  if (password2.value.trim() === "") {
    PasswordError2.textContent = "Password is required";
  }
  else if (!passwordRegex.test(password2.value.trim())) {
    PasswordError2.textContent = "Password must be at least 8 characters, contain one capital letter and one number";
  } else {
    PasswordError2.textContent = "";
  }
});

signinForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  if (email2.value.trim() === "") {
    EmailError2.textContent = "Email is required";
    valid = false;
  } else if (!emailRegex.test(email2.value.trim())) {
    EmailError2.textContent = "Please enter a valid email address";
    valid = false;
  } else {
    EmailError2.textContent = "";
  }

  if (password2.value.trim() === "") {
    PasswordError2.textContent = "Password is required";
    valid = false;
  } else {
    PasswordError2.textContent = "";
  }

  if (!valid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(user =>
    user.email === email2.value.trim() &&
    user.password === CryptoJS.SHA256(password2.value.trim()).toString()
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "home.html";
  } else {
    PasswordError2.textContent = "Email or password is incorrect!";
  }
});




