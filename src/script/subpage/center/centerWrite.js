document.addEventListener("DOMContentLoaded", function () {
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

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("title").value;
    var content = quill.root.innerHTML;
    var noticeType = document.querySelector(
      '.kindBtn input[type="radio"]:checked + label'
    ).innerText;

    var group;
    if (noticeType === "공지") {
      group = "NOTICE";
    } else if (noticeType === "새소식") {
      group = "NEWS";
    } else {
      alert("분류를 선택해 주세요.");
      return;
    }

    var data = {
      title: title,
      content: content,
      group: group,
    };

    fetch("http://localhost:8070/api/v1/admin/notice/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("공지 저장 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        alert("공지사항이 등록되었습니다.");
        window.location.href = "/src/page/subPage/center/notice.html";
      })
      .catch(function (error) {
        console.error(error);
        alert("공지사항 저장 중 오류가 발생했습니다.");
        console.log(token);
      });
  });
});
