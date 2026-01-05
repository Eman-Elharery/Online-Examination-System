# Online-Examination-System
This is a fully functional Online Examination System designed from scratch to provide a smooth, secure, and user-friendly experience for students. The project is built using HTML, JavaScript, Tailwind CSS, with minimal custom CSS, and features a fully responsive design that works on any device.

User Authentication :
Sign Up / Sign In system with validation.
Passwords are securely encrypted before being stored in localStorage.
Users cannot access Sign In / Sign Up pages if already logged in.

Exam Management:
Users can start an exam and attempt questions.
Flagging system: Students can mark questions they are unsure about.
Timer: Tracks exam duration with a 5-minute warning before time runs out.
Auto-submit: When time finishes, the exam is submitted automatically.
If the exam is interrupted (e.g., tab closed, internet lost), users can resume from where they left off as long as time remains.
Users cannot retake an exam once completed.


Results & Feedback:
After submission, users see a summary:
Total correct , incorrect answers , Score, grade and Percentage
Detailed answer review is available with model answers.
Back button is disabled to prevent revisiting the exam page or manipulating results.


Security & Navigation:
Strict page access control based on login and exam status.
Cannot access results without attempting the exam.
Cannot go to Sign In / Sign Up if already logged in.
URL manipulation is handled to ensure users cannot access unauthorized pages.


Designed entirely from scratch.
Built with HTML, JS, Tailwind, and minimal CSS.
Fully responsive for mobile, tablet, and desktop devices.


Tech Stack 
Frontend: HTML, JavaScript, Tailwind CSS
Styling: Tailwind with minimal custom CSS
Storage: Browser LocalStorage
Security: Password encryption


Project Structure
/home.html         # Landing / home page
/sign_in.html        # User registration page and log in page 
/exam.html          # Exam page with questions, timer, flags
/result.html        # Results & review page
/js/                # JavaScript files for functionality
/style.css               # Minimal custom CSS (Tailwind used mostly)

How to Run 
Clone the repository or download the project.
Open home.html in your browser.
Sign up as a new user and start the exam.

Notes
Timer continues even if the tab is closed or internet is lost; exam resumes exactly where it was left.
Users cannot reattempt the exam once time is finished and submission is done.
Navigation is secured to prevent access to restricted pages.

