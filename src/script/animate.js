window.addEventListener("DOMContentLoaded", scrollAppear);
window.addEventListener("scroll", scrollAppear);

function scrollAppear() {
  const h2 = document.querySelector(".contentBk h2");
  const contentDivs = document.querySelectorAll(".contentBk .contentGo div");

  if (h2.getBoundingClientRect().top < window.innerHeight) {
    h2.classList.add("appear");
  }

  contentDivs.forEach((div, index) => {
    if (div.getBoundingClientRect().top < window.innerHeight) {
      setTimeout(() => {
        div.classList.add("appear");
      }, index * 300);
    }
  });
}
