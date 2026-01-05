function ProgressCircle(percent, grade) {
  //grade="D";
  const strokeDash = 314;
  const offset = strokeDash - (strokeDash * percent) / 100;

  let color = "#D13232";
  let message = "Fail";

  if (grade === "A") {
    color = "#004643";
    message = "Excellent";
  } else if (grade === "B") {
    color = "#33825C";
    message = "Very Good";
  } else if (grade === "C") {
    color = "#3C996C";
    message = "Good";
  }
  else if (grade === "D") {
    color = "#f59e0b";
    message = "Pass";
  }

  return `
    <div class="flex flex-col items-center gap-3">
      <svg width="140" height="140">
        <circle cx="70" cy="70" r="50"
          stroke="#e5e7eb"
          stroke-width="10"
          fill="none" />

        <circle cx="70" cy="70" r="50"
          stroke="${color}"
          stroke-width="10"
          fill="none"
          stroke-dasharray="${strokeDash}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          transform="rotate(-90 70 70)"
          style="transition: stroke-dashoffset 0.8s ease, stroke 0.4s;" />

       
        <text x="50%" y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-size="20"
          font-weight="bold"
          fill="${color}">
          ${percent}%
        </text>
      </svg>

     
      <p class="font-semibold text-lg" style="color:${color}">
        ${message}
      </p>
    </div>
  `;
}
