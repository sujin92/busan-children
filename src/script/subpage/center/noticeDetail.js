document.addEventListener("DOMContentLoaded", function () {
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
        displayNoticeDetails(data.body);
        console.log(data.body);
      })
      .catch(function (error) {
        console.error(error);
        alert("공지사항을 불러오는 중 오류가 발생했습니다.");
        window.location.href = "./notice.html";
      });
  }

  function displayNoticeDetails(notice) {
    var titleElement = document.querySelector(".noticeDetail .title");
    var contentElement = document.querySelector(".noticeDetail .content");

    if (titleElement) titleElement.textContent = notice.title;
    if (contentElement) contentElement.innerHTML = notice.content;
  }

  function deleteNotice(noticeId) {
    var deleteRequestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id: noticeId }),
    };

    fetch(
      "http://localhost:8070/api/v1/admin/notice/delete",
      deleteRequestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function () {
        alert("공지사항이 삭제되었습니다.");
        window.location.href = "./notice.html";
      })
      .catch(function (error) {
        console.error("삭제 요청 실패: ", error);
      });
  }

  function navigateDetailPage(direction) {
    var currentPage = parseInt(sessionStorage.getItem("currentPage"), 10) || 0;
    var newPageIndex = currentPage + direction;

    if (newPageIndex <= 0) {
      alert("이동할 페이지가 없습니다.");
      return;
    }

    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch(
      `http://localhost:8070/api/v1/notice/find/detail/move?page=${newPageIndex}`,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        var totalPages = data.body.totalPages;

        if (newPageIndex > totalPages) {
          alert("이동할 페이지가 없습니다.");
          return;
        }

        var noticeList = data.body.content;
        if (noticeList.length > 0) {
          var nextNotice = noticeList[0];
          sessionStorage.setItem("selectedNoticeId", nextNotice.id);
          sessionStorage.setItem("currentPage", newPageIndex);
          loadNoticeDetails(nextNotice.id);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  document
    .getElementById("beforeDetail")
    .addEventListener("click", function () {
      navigateDetailPage(-1);
    });

  document.getElementById("afterDetail").addEventListener("click", function () {
    navigateDetailPage(1);
  });

  document
    .querySelector(".detailEditBtn")
    .addEventListener("click", function () {
      sessionStorage.setItem("selectedNoticeId", noticeId);
      window.location.href = "./noticeWriteEdi.html";
    });

  document
    .querySelector(".detailDelBtn")
    .addEventListener("click", function () {
      var confirmDelete = confirm("정말로 이 공지사항을 삭제하시겠습니까?");
      if (confirmDelete) {
        deleteNotice(noticeId);
      }
    });

  loadNoticeDetails(noticeId);
});
