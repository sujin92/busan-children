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

var quill = new Quill("#editor-container", {
  modules: {
    syntax: true,
    toolbar: "#toolbar-container",
  },
  placeholder: "게시글을 작성해 주세요.",
  theme: "snow",
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const genreLabel = document.querySelector(
      '.kindBtn input[type="radio"]:checked + label'
    ).innerText;

    // 입력된 값들을 가져오기
    const title = document.getElementById("title").value;
    const genre = genreLabel;
    const periodStart = document.getElementById("periodStart").value;
    const periodEnd = document.getElementById("periodEnd").value;
    const times = document.querySelectorAll(
      ".performanceTime input[type='time']:first-of-type"
    );
    const price = document.getElementById("price").value;
    const limit = document.getElementById("limit").value;
    const rating = document.getElementById("rating").value;
    const inquiries = document.getElementById("inquiries").value;
    const subtitle = document.getElementById("subTitle").value;

    const content = quill.root.innerHTML;

    const timeArray = [];
    times.forEach((elem) => {
      const startTime = elem.value;
      const endTime = elem.parentElement.querySelector(
        "input[type='time']:last-of-type"
      ).value;
      if (startTime != "" && endTime != "") {
        timeArray.push({ startTime, endTime });
      }
    });

    let thumbnail = null;
    const files = document.getElementById("thumbnail").files;
    const reader = new FileReader();
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        thumbnail = reader.result;
        const postData = {
          title,
          genre,
          periodStart,
          periodEnd,
          time: timeArray,
          price,
          limit,
          rating,
          inquiries,
          subtitle,
          thumbnail,
          content,
        };
        performanceSave(postData);
        console.log("dfefef" + postData);
      };
    }
  });
});

async function performanceSave(data) {
  fetch("http://localhost:8070/api/v1/admin/performance/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save performance information");
      }
      return response.json();
    })
    .then((data) => {
      alert("공연 정보가 저장되었습니다.");
      window.location.href =
        "/src/page/subPage/performance/performanceInfo.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("공연 정보를 저장하는데 실패하였습니다.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const contentTextarea = document.getElementById("subTitle");

  contentTextarea.addEventListener("input", function () {
    const content = this.value;
    const maxLength = 100;

    if (content.length > maxLength) {
      alert("100자 이하로 작성해 주세요");
      this.value = content.substring(0, maxLength);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const priceInput = document.getElementById("price");

  priceInput.addEventListener("input", function () {
    const value = this.value.replace(/\D/g, "");

    if (this.value !== value) {
      this.value = value;
      alert("숫자만 입력 가능합니다.");
    }
  });
});
