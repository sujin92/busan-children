document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");
  var currentPage = 1;
  var itemsPerPage = 10; // 한 페이지에 표시할 항목 수
  var members = [];

  function fetchMembers() {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    fetch("http://localhost:8070/api/v1/admin/user/find?page=1", requestOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        members = data.body.content; // 전체 데이터를 배열에 저장
        renderMembers(); // 페이지에 맞는 멤버 리스트 렌더링
        updatePagination(); // 페이지네이션 업데이트
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function renderMembers() {
    var memberContainer = document.getElementById("memberList");
    memberContainer.innerHTML = ""; // 이전 멤버 목록 지우기

    // 현재 페이지에 맞는 멤버 리스트를 계산
    var start = (currentPage - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var paginatedMembers = members.slice(start, end);

    // 멤버 리스트를 HTML로 변환하여 추가
    paginatedMembers.forEach(function (member) {
      var userId = member.userId;
      var userName = member.userName;
      var birth = member.birth;
      var phone = member.phone;

      var memberHtml =
        '<div class="coronationPriceaa">' +
        '<h4 class="userIdList">' +
        userId +
        "</h4>" +
        '<h4 class="userNameList">' +
        userName +
        "</h4>" +
        '<h4 class="userBirth">' +
        birth +
        "</h4>" +
        '<h4 class="userPhoneList">' +
        phone +
        "</h4>" +
        '<h4><a href="./membershipDeatail.html" class="userDetail" data-userid="' +
        userId +
        '">상세보기</a></h4>' +
        "</div>";

      memberContainer.insertAdjacentHTML("beforeend", memberHtml);
    });

    // 상세보기 버튼에 이벤트 리스너 추가
    const userDetailLinks = document.querySelectorAll(".userDetail");
    userDetailLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const userId = e.target.getAttribute("data-userid");
        sessionStorage.setItem("selectedUserId", userId);
      });
    });
  }

  function updatePagination() {
    var totalPages = Math.ceil(members.length / itemsPerPage); // 총 페이지 수 계산
    var paginationContainer = document.getElementById("pageNumber");
    var numbersContainer = document.getElementById("numbers");

    numbersContainer.innerHTML = ""; // 이전 페이지네이션 지우기

    for (let i = 1; i <= totalPages; i++) {
      var pageHtml = `<span class="page-number" data-page="${i}"><a href="#">${i}</a></span>`;
      numbersContainer.insertAdjacentHTML("beforeend", pageHtml);
    }

    // 페이지 번호 클릭 이벤트 추가
    document.querySelectorAll(".page-number").forEach(function (pageElement) {
      pageElement.addEventListener("click", function (e) {
        e.preventDefault();
        currentPage = parseInt(e.target.textContent);
        renderMembers(); // 클릭한 페이지에 맞는 멤버 리스트 렌더링
        setActivePage(); // 클릭한 페이지에 맞게 활성화 상태 업데이트
      });
    });

    document.getElementById("firstPage").addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage = 1;
        renderMembers();
        setActivePage();
      }
    });

    document.getElementById("prevPage").addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderMembers();
        setActivePage();
      }
    });

    document.getElementById("nextPage").addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderMembers();
        setActivePage();
      }
    });

    document.getElementById("endPage").addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage = totalPages;
        renderMembers();
        setActivePage();
      }
    });

    setActivePage(); // 초기 페이지 활성화 상태 설정
  }

  function setActivePage() {
    // 모든 페이지 번호의 'active' 클래스를 제거
    document.querySelectorAll(".page-number").forEach(function (pageElement) {
      pageElement.classList.remove("active");
    });

    // 현재 페이지 번호에 'active' 클래스 추가
    document
      .querySelector(`.page-number[data-page="${currentPage}"]`)
      .classList.add("active");
  }

  // 데이터 가져오기 및 초기 렌더링
  fetchMembers();
});
