document.addEventListener("DOMContentLoaded", () => {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      item.classList.toggle("open");

      const icon = btn.querySelector("span");
      if (icon) {
        icon.textContent = item.classList.contains("open") ? "−" : "+";
      }
    });
  });
});