document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");
  var selectedPerformanceId = sessionStorage.getItem("selectedPerformanceId");

  var requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  function fetchData(performanceId) {
    fetch(
      "http://localhost:8070/api/v1/performance/find/detail?id=" +
        performanceId,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        var performance = data.body;
        updateHTML(performance);
        console.log(performance);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function updateHTML(performance) {
    var thumbnailElement = document.querySelector(".thumbnail");
    var kindElement = document.querySelector(".kind");
    var titleElement = document.querySelector(".title");
    var periodStartElement = document.querySelector(".periodStart");
    var periodEndElement = document.querySelector(".periodEnd");
    var priceElement = document.querySelector(".price");
    var limitElement = document.querySelector(".limit");
    var ratingElement = document.querySelector(".rating");
    var inquiriesElement = document.querySelector(".inquiries");
    var subTitleElement = document.querySelector(".subTitle");
    var timeListElement = document.getElementById("timeList");
    var contentElement = document.querySelector(".detailsTxt .content");
    var reservationButton = document.querySelector(".goReservation");

    if (thumbnailElement) thumbnailElement.src = performance.thumbnail;
    if (kindElement) kindElement.textContent = performance.genre;
    if (titleElement) titleElement.textContent = performance.title;
    if (periodStartElement)
      periodStartElement.textContent = performance.periodStart;
    if (periodEndElement) periodEndElement.textContent = performance.periodEnd;
    if (priceElement) priceElement.textContent = performance.price + "원";
    if (limitElement) limitElement.textContent = performance.limit + "명";
    if (ratingElement) ratingElement.textContent = performance.rating;
    if (inquiriesElement) inquiriesElement.textContent = performance.inquiries;
    if (subTitleElement) subTitleElement.textContent = performance.subtitle;

    if (timeListElement) {
      timeListElement.innerHTML = "";

      var uniqueTimes = performance.time
        .reduce((acc, curr) => {
          var key = curr.startTime + "-" + curr.endTime;
          if (!acc.find((item) => item.key === key)) {
            acc.push({ ...curr, key });
          }
          return acc;
        }, [])
        .map((item) => ({
          startTime: item.startTime,
          endTime: item.endTime,
        }));

      uniqueTimes.sort((a, b) => a.startTime.localeCompare(b.startTime));

      var timeDiv = document.createElement("div");
      var timeTitle = document.createElement("h3");

      var displayTimes = uniqueTimes.slice(0, 4);

      while (displayTimes.length < 4) {
        displayTimes.push({ startTime: "", endTime: "" });
      }

      displayTimes.forEach(function (t) {
        var timeText = document.createElement("p");
        timeText.innerHTML =
          "<span class='startTime'>" +
          t.startTime +
          "</span> - <span class='endTime'>" +
          t.endTime +
          "</span>";
        timeDiv.appendChild(timeText);
      });

      timeListElement.appendChild(timeTitle);
      timeListElement.appendChild(timeDiv);
    }

    if (contentElement) contentElement.innerHTML = performance.content;

    // Check if periodEnd is before the current date
    var periodEndDate = new Date(performance.periodEnd);
    var currentDate = new Date();
    if (periodEndDate < currentDate) {
      if (reservationButton) {
        reservationButton.style.display = "none";
      }
    }
  }

  document
    .getElementById("beforeDetail")
    .addEventListener("click", function () {
      navigateDetailPage(-1);
    });

  document.getElementById("afterDetail").addEventListener("click", function () {
    navigateDetailPage(1);
  });

  function navigateDetailPage(direction) {
    var currentPage = parseInt(sessionStorage.getItem("currentPage"), 10) || 0;
    var newPageIndex = currentPage + direction;
    console.log(currentPage);
    if (newPageIndex <= 0) {
      alert("이동할 페이지가 없습니다.");
      return;
    }

    fetch(
      "http://localhost:8070/api/v1/performance/find/detail/move?page=" +
        newPageIndex,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        var totalElements = data.body.totalElements;

        if (newPageIndex > totalElements) {
          alert("이동할 페이지가 없습니다.");
          return;
        }

        var performanceList = data.body.content;
        if (performanceList.length > 0) {
          var nextPerformance = performanceList[0];
          sessionStorage.setItem("selectedPerformanceId", nextPerformance.id);
          sessionStorage.setItem("currentPage", newPageIndex);
          fetchData(nextPerformance.id);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function deletePerformance(performanceId) {
    var deleteRequestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id: performanceId }),
    };

    fetch(
      "http://localhost:8070/api/v1/admin/performance/delete",
      deleteRequestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function () {
        alert("공연 정보가 삭제되었습니다.");
        window.location.href =
          "/src/page/subPage/performance/performanceInfo.html";
      })
      .catch(function (error) {
        console.error("삭제 요청 실패: ", error);
      });
  }

  fetchData(selectedPerformanceId);

  var deleteButton = document.querySelector(".deleteBtn");
  if (deleteButton) {
    deleteButton.addEventListener("click", function () {
      var confirmDelete = confirm("게시글을 삭제하시겠습니까?");
      if (confirmDelete) {
        deletePerformance(selectedPerformanceId);
      }
    });
  }
});
