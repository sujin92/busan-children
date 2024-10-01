document.addEventListener("DOMContentLoaded", function () {
  AOS.init();

  var quill = new Quill("#editor-container", {
    modules: {
      syntax: true,
      toolbar: "#toolbar-container",
    },
    placeholder: "게시글을 작성해 주세요.",
    theme: "snow",
  });

  var token = sessionStorage.getItem("token");
  var noticeId = sessionStorage.getItem("selectedNoticeId");

  if (!noticeId) {
    alert("공지사항 ID가 존재하지 않습니다.");
    window.location.href = "./notice.html";
    return;
  }

  function loadNoticeDetails(noticeId) {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch(
      `http://localhost:8070/api/v1/notice/find/detail?id=${noticeId}`,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        fillFormWithNoticeDetails(data.body);
        console.log(data.body);
      })
      .catch(function (error) {
        console.error(error);
        alert("공지사항을 불러오는 중 오류가 발생했습니다.");
        window.location.href = "./notice.html";
      });
  }

  function fillFormWithNoticeDetails(notice) {
    document.getElementById("title").value = notice.title;
    if (notice.group === "NOTICE") {
      document.getElementById("noticeList").checked = true;
    } else if (notice.group === "NEWS") {
      document.getElementById("newsList").checked = true;
    }
    quill.root.innerHTML = notice.content;
  }

  loadNoticeDetails(noticeId);

  document
    .querySelector(".writeSaveBtn")
    .addEventListener("click", function (e) {
      e.preventDefault();

      var title = document.getElementById("title").value;
      var group = document.querySelector(
        '.kindBtn input[type="radio"]:checked + label'
      ).innerText;
      var content = quill.root.innerHTML;

      if (!title || !group || !content) {
        alert("모든 항목을 입력해주세요.");
        return;
      }

      var noticeData = {
        id: noticeId,
        title: title,
        group: group === "공지" ? "NOTICE" : "NEWS",
        content: content,
      };

      console.log("보낼 데이터:", noticeData);

      var requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(noticeData),
      };

      fetch("http://localhost:8070/api/v1/admin/notice/update", requestOptions)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("API 요청 실패: " + response.status);
          }
          return response.json();
        })
        .then(function () {
          alert("공지사항이 수정되었습니다.");
          window.location.href = "./notice.html";
        })
        .catch(function (error) {
          console.error("공지사항 수정 중 오류가 발생했습니다:", error);
          alert("공지사항 수정 중 오류가 발생했습니다.");
        });
    });
});
