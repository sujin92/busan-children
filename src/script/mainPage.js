document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");

  var requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  fetch("http://localhost:8070/api/v1/performance/find/top", requestOptions)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API 요청 실패: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (data.body && Array.isArray(data.body.content)) {
        var performances = data.body.content.slice(0, 5);
        var infoRightElements = document.querySelectorAll(".infoRight");

        performances.forEach(function (performance, index) {
          if (infoRightElements[index]) {
            infoRightElements[index].querySelector(".title").textContent =
              performance.title;
            infoRightElements[index].querySelector(".periodStart").textContent =
              performance.periodStart;
            infoRightElements[index].querySelector(".periodEnd").textContent =
              performance.periodEnd;
            infoRightElements[index].querySelector(".price").textContent =
              performance.price + "원";
            infoRightElements[index]
              .querySelector(".detailTop")
              .setAttribute(
                "href",
                "/src/page/subPage/performance/performanceDetails.html?id=" +
                  performance.id
              );
          }
        });
      } else {
        console.error("API 응답이 배열이 아닙니다.", data.body);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");

  var requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  fetch("http://localhost:8070/api/v1/notice/find/top", requestOptions)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API 요청 실패: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (data.body && Array.isArray(data.body.content)) {
        var notices = data.body.content;
        var noticeElements = document.querySelectorAll(
          ".rightNotice .noticeTxt"
        );
        console.log(data.body.content);
        notices.forEach(function (notice, index) {
          if (noticeElements[index]) {
            noticeElements[index].querySelector(".titleNotic").textContent =
              notice.title;
            var groupText =
              notice.group === "NEWS"
                ? "뉴스"
                : notice.group === "NOTICE"
                ? "공지"
                : notice.group;
            noticeElements[index].querySelector(
              ".noticeCategory.group"
            ).textContent = groupText;

            // 태그를 제거한 content를 표시
            var contentText = notice.content.replace(/<[^>]*>?/gm, "");
            noticeElements[index].querySelector(".contentNotice").textContent =
              contentText;

            var noticeLink = noticeElements[index].querySelector("a");
            noticeLink.addEventListener("click", function (event) {
              event.preventDefault();
              sessionStorage.setItem("selectedNoticeId", notice.id);
              window.location.href =
                "/src/page/subPage/center/noticeDetail.html";
            });
          }
          console.log(notice.id);
        });
      } else {
        console.error("API 응답이 배열이 아닙니다.", data.body);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});
