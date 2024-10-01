document.addEventListener("DOMContentLoaded", function () {
  const performance = JSON.parse(sessionStorage.getItem("performanceDetail"));

  if (performance) {
    document.getElementById("title").value = performance.title;
    document.querySelector(
      `input[name="genre"][value="${performance.genre}"]`
    ).checked = true;
    document.getElementById("periodStart").value = performance.periodStart;
    document.getElementById("periodEnd").value = performance.periodEnd;
    document.getElementById("price").value = performance.price;
    document.getElementById("limit").value = performance.limit;
    document.getElementById("rating").value = performance.rating;
    document.getElementById("inquiries").value = performance.inquiries;
    document.getElementById("subTitle").value = performance.subtitle;
    // Assuming the thumbnail input will be managed manually

    // Populate times
    const times = performance.time;
    if (times) {
      times.forEach((time, index) => {
        if (index < 4) {
          // Assuming only 4 timeslots for simplicity
          const startTimeInput = document.getElementById(
            `time${index + 1}Start`
          );
          const endTimeInput = document.getElementById(`time${index + 1}End`);
          if (startTimeInput && endTimeInput) {
            startTimeInput.value = time.startTime;
            endTimeInput.value = time.endTime;
          }
        }
      });
    }

    // Initialize Quill editor with content
    var quill = new Quill("#editor-container", {
      modules: {
        syntax: true,
        toolbar: "#toolbar-container",
      },
      placeholder: "게시글을 작성해 주세요.",
      theme: "snow",
    });
    quill.root.innerHTML = performance.content;
  }

  const contentTextarea = document.getElementById("subTitle");

  contentTextarea.addEventListener("input", function () {
    const content = this.value;
    const maxLength = 100;

    if (content.length > maxLength) {
      alert("100자 이하로 작성해 주세요");
      this.value = content.substring(0, maxLength);
    }
  });

  const priceInput = document.getElementById("price");

  priceInput.addEventListener("input", function () {
    const value = this.value.replace(/\D/g, "");

    if (this.value !== value) {
      this.value = value;
      alert("숫자만 입력 가능합니다.");
    }
  });

  AOS.init();

  document
    .querySelectorAll(".writeinput .writeFrom > button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".writeinput .writeFrom > button")
          .forEach((btn) => {
            btn.classList.remove("clicked");
          });
        button.classList.add("clicked");
      });
    });
});
