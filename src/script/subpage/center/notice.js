document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");
  var currentPage = 1;
  var totalPages = 0;
  var totalElements = 0; // 총 공지사항 수
  var searchQuery = "";

  function loadNotices(page) {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch(
      `http://localhost:8070/api/v1/notice/find?page=${page}`,
      requestOptions
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        totalElements = data.body.totalElements; // 총 공지사항 수 저장
        displayNotices(page, data.body.content);
        totalPages = data.body.totalPages;
        updatePagination(page, totalPages);
        console.log(data.body.content);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function searchNotices(page, query) {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    let url = `http://localhost:8070/api/v1/notice/search/title?page=${page}&title=${encodeURIComponent(
      query
    )}`;

    fetch(url, requestOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (data.body.content.length === 0) {
          alert("조회된 공지사항이 없습니다.");
        } else {
          totalElements = data.body.totalElements; // 총 공지사항 수 저장
          displayNotices(page, data.body.content);
          totalPages = data.body.totalPages;
          updatePagination(page, totalPages);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function displayNotices(page, notices) {
    var noticeContainer = document.querySelector(".noticeBoard tbody");
    noticeContainer.innerHTML = "";

    if (Array.isArray(notices) && notices.length > 0) {
      notices.forEach(function (notice, index) {
        var row = document.createElement("tr");

        var indexCell = document.createElement("td");
        indexCell.textContent = totalElements - ((page - 1) * 10 + index);
        row.appendChild(indexCell);

        var groupCell = document.createElement("td");
        groupCell.textContent = notice.group === "NOTICE" ? "공지사항" : "뉴스";
        row.appendChild(groupCell);

        var titleCell = document.createElement("td");
        var titleLink = document.createElement("a");
        titleLink.href = `./noticeDetail.html?id=${notice.id}`;
        titleLink.textContent = notice.title;
        titleLink.addEventListener("click", function () {
          sessionStorage.setItem("selectedNoticeId", notice.id);
        });
        titleCell.appendChild(titleLink);
        row.appendChild(titleCell);

        var dateCell = document.createElement("td");
        dateCell.textContent = new Date(notice.updateDate).toLocaleDateString();
        row.appendChild(dateCell);

        noticeContainer.appendChild(row);
      });
    } else {
      noticeContainer.innerHTML =
        "<tr><td colspan='4'>등록된 공지사항이 없습니다.</td></tr>";
    }

    window.scrollTo(0, 0);
  }

  function updatePagination(currentPage, totalPages) {
    var numbersElement = document.getElementById("numbers");
    numbersElement.innerHTML = "";

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
        if (searchQuery) {
          searchNotices(selectedPage, searchQuery);
        } else {
          loadNotices(selectedPage);
        }
      });
      pageLink.appendChild(pageAnchor);
      numbersElement.appendChild(pageLink);
    }

    var firstPageBtn = document.getElementById("firstPage");
    var prevPageBtn = document.getElementById("prevPage");
    var nextPageBtn = document.getElementById("nextPage");
    var endPageBtn = document.getElementById("endPage");

    firstPageBtn.onclick = function () {
      if (currentPage > 1) {
        if (searchQuery) {
          searchNotices(1, searchQuery);
        } else {
          loadNotices(1);
        }
      }
    };

    prevPageBtn.onclick = function () {
      if (currentPage > 1) {
        if (searchQuery) {
          searchNotices(currentPage - 1, searchQuery);
        } else {
          loadNotices(currentPage - 1);
        }
      }
    };

    nextPageBtn.onclick = function () {
      if (currentPage < totalPages) {
        if (searchQuery) {
          searchNotices(currentPage + 1, searchQuery);
        } else {
          loadNotices(currentPage + 1);
        }
      }
    };

    endPageBtn.onclick = function () {
      if (currentPage < totalPages) {
        if (searchQuery) {
          searchNotices(totalPages, searchQuery);
        } else {
          loadNotices(totalPages);
        }
      }
    };
  }

  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      var query = document.getElementById("searchInput").value;
      if (query) {
        searchQuery = query;
        searchNotices(1, query);
      }
    });

  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        var query = e.target.value;
        if (query) {
          searchQuery = query;
          searchNotices(1, query);
        }
      }
    });

  loadNotices(currentPage);
});
