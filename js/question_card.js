function QuestionReviewComponent(question, userAnswer, index) {
  let optionsHTML = "";

  question.options.forEach(option => {
    let style = "bg-gray-100";

    if (option === question.correct) {
      style = "bg-green-100 border-green-400";
    } 
    else if (option === userAnswer && option !== question.correct) {
      style = "bg-red-100 border-red-400";
    }

    optionsHTML += `
      <div class="p-3 rounded-lg border ${style} flex justify-between">
        <span>${option}</span>
        ${
          option === question.correct
            ? "✅"
            : option === userAnswer
            ? "❌"
            : ""
        }
      </div>
    `;
  });

  return `
    <div class="bg-white rounded-xl p-6 mb-6 shadow">
      <div class="flex justify-between mb-4">
        <h3 class="font-semibold">${index + 1}. ${question.question}</h3>
        <span class="text-sm text-gray-500">
          ${userAnswer === question.correct ? "1/1 point" : "0/1 point"}
        </span>
      </div>

      <div class="space-y-3">
        ${optionsHTML}
      </div>
    </div>
  `;
}
