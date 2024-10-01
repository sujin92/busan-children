document.addEventListener("DOMContentLoaded", function () {
  showTab(1);
});

function showTab(tabNumber) {
  var tabs = document.querySelectorAll(".tabs li");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  var contents = document.getElementsByClassName("content");
  for (var i = 0; i < contents.length; i++) {
    contents[i].classList.add("hidden");
  }

  // 선택된 탭 활성화
  document.getElementById("tab" + tabNumber).classList.remove("hidden");
  document
    .querySelector(".tabs li:nth-child(" + tabNumber + ")")
    .classList.add("active");
}
