document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");
  var currentPage = 1;
  var totalPages = 0;

  function loadPerformances(page) {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch(
      `http://localhost:8070/api/v1/performance/find?page=${page}`,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        let pageCount =
          Number(data.body.pageable.pageNumber) *
          Number(data.body.pageable.pageSize);
        displayPerformances(pageCount, data.body.content);
        totalPages = data.body.totalPages;
        updatePagination(page, totalPages);
        console.log(data.body.content);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function searchPerformances(page, query) {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch(
      `http://localhost:8070/api/v1/performance/search?page=${page}&word=${query}`,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        let pageCount =
          Number(data.body.pageable.pageNumber) *
          Number(data.body.pageable.pageSize);
        displayPerformances(pageCount, data.body.content);
        totalPages = data.body.totalPages;
        updatePagination(page, totalPages);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function displayPerformances(count, performances) {
    var performanceContainer = document.querySelector(".performanceContent");
    performanceContainer.innerHTML = "";

    if (Array.isArray(performances) && performances.length > 0) {
      performances.forEach(function (performance, index) {
        var contentBox = document.createElement("div");
        contentBox.classList.add("contentBox");
        contentBox.setAttribute("data-performance-id", performance.id);

        var thumbnail = document.createElement("img");
        thumbnail.src = performance.thumbnail;
        thumbnail.alt = "연극 포스터";
        thumbnail.width = "320";
        thumbnail.classList.add("thumbnail");
        contentBox.appendChild(thumbnail);

        var title = document.createElement("h2");
        title.classList.add("title");
        title.textContent = performance.title;
        contentBox.appendChild(title);

        var subTitle = document.createElement("h3");
        subTitle.classList.add("subTitle");
        subTitle.textContent = performance.subtitle;
        contentBox.appendChild(subTitle);

        var period = document.createElement("div");
        var periodTitle = document.createElement("h4");
        periodTitle.textContent = "공연기간";
        var periodText = document.createElement("p");
        periodText.innerHTML =
          "<span class='periodStart'>" +
          performance.periodStart +
          "</span> - <span class='periodEnd'>" +
          performance.periodEnd +
          "</span>";
        period.appendChild(periodTitle);
        period.appendChild(periodText);
        contentBox.appendChild(period);

        var time = document.createElement("div");
        var timeTitle = document.createElement("h4");
        timeTitle.textContent = "공연시간";

        // 공연 시간 중복 제거 및 정렬
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

        time.appendChild(timeTitle);
        time.appendChild(timeDiv);
        contentBox.appendChild(time);

        var price = document.createElement("div");
        var priceTitle = document.createElement("h4");
        priceTitle.textContent = "티켓가격";
        var priceText = document.createElement("p");
        priceText.classList.add("price");
        priceText.textContent = performance.price + "원";
        price.appendChild(priceTitle);
        price.appendChild(priceText);
        contentBox.appendChild(price);

        var detailLink = document.createElement("a");
        detailLink.href = "./performanceDetails.html";
        detailLink.textContent = "상세보기";
        detailLink.dataset.page_number = count + index + 1;
        contentBox.appendChild(detailLink);

        performanceContainer.appendChild(contentBox);

        // Check if periodEnd is before the current date
        var periodEndDate = new Date(performance.periodEnd);
        var currentDate = new Date();
        if (periodEndDate < currentDate) {
          detailLink.style.backgroundColor = "#969696";
          detailLink.textContent = "마감";
        }
      });
    } else {
      performanceContainer.textContent = "등록된 공연정보가 없습니다.";
    }

    // 페이지가 변경되면 스크롤 위치 이동
    window.scrollTo(0, 0);

    const userDetailLinks = document.querySelectorAll(".contentBox a");

    userDetailLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const contentBox = e.target.closest(".contentBox");
        const performanceId = contentBox.getAttribute("data-performance-id");
        sessionStorage.setItem("selectedPerformanceId", performanceId);
        sessionStorage.setItem("currentPage", link.dataset.page_number);
      });
    });
  }

  function updatePagination(currentPage, totalPages) {
    var pageNumberElement = document.getElementById("pageNumber");
    var numbersElement = document.getElementById("numbers");

    numbersElement.innerHTML = "";

    // 현재 페이지 표시
    for (var i = 1; i <= totalPages; i++) {
      var pageLink = document.createElement("span");
      pageLink.classList.add("page-link");
      if (i === currentPage) {
        pageLink.classList.add("active");
      }
      var pageAnchor = document.createElement("a");
      pageAnchor.href = "#";
      pageAnchor.textContent = i;
      pageAnchor.addEventListener("click", function (e) {
        e.preventDefault();
        var selectedPage = parseInt(this.textContent);
        loadPerformances(selectedPage);
      });
      pageLink.appendChild(pageAnchor);
      numbersElement.appendChild(pageLink);
    }

    // 페이지 버튼 처리
    var firstPageBtn = document.getElementById("firstPage");
    var prevPageBtn = document.getElementById("prevPage");
    var nextPageBtn = document.getElementById("nextPage");
    var endPageBtn = document.getElementById("endPage");

    firstPageBtn.onclick = function () {
      if (currentPage > 1) {
        loadPerformances(1);
      }
    };

    prevPageBtn.onclick = function () {
      if (currentPage > 1) {
        loadPerformances(currentPage - 1);
      }
    };

    nextPageBtn.onclick = function () {
      if (currentPage < totalPages) {
        loadPerformances(currentPage + 1);
      }
    };

    endPageBtn.onclick = function () {
      if (currentPage < totalPages) {
        loadPerformances(totalPages);
      }
    };
  }

  // 검색 기능
  document.getElementById("searchBtn").addEventListener("click", function () {
    var query = document.getElementById("performanceSearch").value;
    if (query) {
      searchPerformances(currentPage, query);
    }
  });

  document
    .getElementById("performanceSearch")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        var query = e.target.value;
        if (query) {
          searchPerformances(currentPage, query);
        }
      }
    });

  loadPerformances(currentPage);
});
