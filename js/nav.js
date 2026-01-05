window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const signInBtn = document.getElementById('signInBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  const logOutBtn = document.getElementById('logOutBtn');
if (isLoggedIn) {
  signInBtn.classList.add('hidden');
  signUpBtn.classList.add('hidden');
  logOutBtn.classList.remove('hidden');

  logOutBtn.onclick = () => {
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', 'false');
    location.replace('home.html'); 
  };

} else {

 signInBtn.classList.remove('hidden');
  signUpBtn.classList.remove('hidden');
  logOutBtn.classList.add('hidden');
    signUpBtn.onclick = () => {
     location.href = "sign_in.html?mode=signup";
  };

  signInBtn.onclick = () => {
     location.href = "sign_in.html?mode=signin";
  };

}

});
