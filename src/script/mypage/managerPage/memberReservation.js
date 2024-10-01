document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");
  const itemsPerPage = 10; // 페이지 당 항목 수
  let allReservations = []; // 전체 예약 목록을 저장할 전역 변수

  if (!token) {
    alert("관리자 로그인이 필요합니다.");
    window.location.href = "/login.html"; // 로그인 페이지로 리디렉션
  } else {
    loadAllReservations(token); // 전체 예약 로드
  }

  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const searchQuery = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();
      filterAndRenderReservations(searchQuery, 1);
    });

  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const searchQuery = event.target.value.trim().toLowerCase();
        filterAndRenderReservations(searchQuery, 1);
      }
    });

  async function loadAllReservations(token) {
    let page = 1;
    let totalPages = 1;
    allReservations = []; // 기존 데이터를 초기화

    while (page <= totalPages) {
      try {
        const data = await fetchReservations(token, page);
        allReservations = allReservations.concat(data.reservations);
        totalPages = data.totalPages;
        page++;
      } catch (error) {
        console.error(
          "전체 예약 정보를 불러오는 중 오류가 발생했습니다:",
          error
        );
        break;
      }
    }

    filterAndRenderReservations("", 1); // 전체 예약을 로드한 후 초기 렌더링
    updatePagination(1, Math.ceil(allReservations.length / itemsPerPage)); // 전체 페이지 수를 기반으로 페이지네이션 업데이트
  }

  async function fetchReservations(token, page) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetch(
      `http://localhost:8070/api/v1/admin/reservation/find?page=${page}`,
      requestOptions
    );
    if (!response.ok) throw new Error("API 요청 실패: " + response.status);
    const data = await response.json();

    return {
      reservations: data.body.content,
      currentPage: data.body.pageable.pageNumber + 1, // 페이지 번호는 0부터 시작하므로 +1
      totalPages: data.body.totalPages,
    };
  }

  function getStatusText(paymentState) {
    switch (paymentState) {
      case "PAY_BEFORE":
        return "예약 완료";
      case "COMPLETE":
        return "결제 완료";
      case "CANCEL":
        return "예약 취소";
      default:
        return "알 수 없음";
    }
  }

  function renderReservations(reservations, currentPage, itemsPerPage) {
    const container = document.getElementById("reservationContainer");
    container.innerHTML = ""; // 기존 내용을 지움

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, reservations.length);

    for (let i = startIndex; i < endIndex; i++) {
      const reservation = reservations[i];
      const itemIndex = startIndex + i + 1; // 인덱스 계산
      const statusText = getStatusText(reservation.payment.paymentState);
      const reservationElement = document.createElement("a");
      reservationElement.href = `./memberReservationDetail.html?id=${reservation.id}`;
      reservationElement.innerHTML = `
        <div class="coronationPrice">
          <h4>${itemIndex}</h4>
          <h4><span>${statusText}</span></h4>
          <h4>${reservation.performance.genre}</h4>
          <h4>${reservation.time.startTime} ~ ${reservation.time.endTime}</h4>
          <h4>${reservation.time.performanceDate}</h4>
          <h4>${reservation.customerName}</h4>
          <h4>${reservation.customerPhone}</h4>
        </div>
      `;
      container.appendChild(reservationElement);
    }
  }

  function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector(".pageNumber");
    paginationContainer.innerHTML = "";

    const createPageButton = (pageNumber, text, isIcon = false) => {
      const button = document.createElement(isIcon ? "i" : "span");
      button.classList.add("page-button");
      if (isIcon) {
        button.innerHTML = text;
        button.classList.add("icon");
      } else {
        button.textContent = text || pageNumber;
        button.classList.add("number");
      }
      if (pageNumber === currentPage) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        loadPage(pageNumber);
      });
      return button;
    };

    paginationContainer.appendChild(
      createPageButton(1, '<i class="fa-solid fa-angles-left"></i>', true)
    );
    paginationContainer.appendChild(
      createPageButton(
        Math.max(currentPage - 1, 1),
        '<i class="fa-solid fa-chevron-left"></i>',
        true
      )
    );

    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    paginationContainer.appendChild(
      createPageButton(
        Math.min(currentPage + 1, totalPages),
        '<i class="fa-solid fa-chevron-right"></i>',
        true
      )
    );
    paginationContainer.appendChild(
      createPageButton(
        totalPages,
        '<i class="fa-solid fa-angles-right"></i>',
        true
      )
    );
  }

  function filterAndRenderReservations(searchQuery, page) {
    let filteredReservations = allReservations;
    if (searchQuery) {
      filteredReservations = allReservations.filter((reservation) =>
        reservation.customerName.toLowerCase().includes(searchQuery)
      );
    }
    renderReservations(filteredReservations, page, itemsPerPage);
    updatePagination(
      page,
      Math.ceil(filteredReservations.length / itemsPerPage)
    );
  }

  function loadPage(page) {
    const searchQuery = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();
    filterAndRenderReservations(searchQuery, page);
  }
});
