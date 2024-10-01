document.addEventListener("DOMContentLoaded", async function () {
  const token = sessionStorage.getItem("token");
  let currentPage = 1;
  const pageSize = 10;

  async function fetchReservations(page) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:8070/api/v1/reservation/find?page=${page}&size=${pageSize}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("API 요청 실패: " + response.status);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      return data.body;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function loadReservations(page) {
    const data = await fetchReservations(page);
    if (data) {
      displayReservations(data.content);
      updatePagination(data.totalPages, page);
    }
  }

  function displayReservations(reservations) {
    const container = document.getElementById("reservationContainer");
    container.innerHTML = "";

    reservations.forEach((reservation) => {
      console.log("Reservation data:", reservation);

      const reservationDiv = document.createElement("div");
      reservationDiv.classList.add("coronationPrice");

      let paymentStateText =
        reservation.payment.paymentState === "PAY_BEFORE"
          ? "결제대기"
          : reservation.payment.paymentState === "COMPLETE"
          ? "결제완료"
          : reservation.payment.paymentState === "CANCEL"
          ? "결제취소"
          : "알 수 없음";

      const currentDateTime = new Date();
      const performanceDateTime = new Date(
        `${reservation.time.performanceDate}T${reservation.time.startTime}`
      );

      if (currentDateTime > performanceDateTime) {
        paymentStateText = "취소";
        reservation.payment.paymentState = "CANCEL"; // 상태 변경
      }

      const bgColor =
        paymentStateText === "취소" ||
        reservation.payment.paymentState === "CANCEL"
          ? "#dddddd"
          : reservation.payment.paymentState === "COMPLETE"
          ? "#ffaa14"
          : "";

      const detailPageUrl =
        reservation.payment.paymentState === "CANCEL"
          ? ""
          : reservation.payment.paymentState === "COMPLETE"
          ? `./reservationDetailComplete.html?id=${reservation.id}`
          : `./reservationDetail.html?id=${reservation.id}`;

      const detailLinkHtml =
        reservation.payment.paymentState !== "CANCEL"
          ? `<a href="${detailPageUrl}">상세보기</a>`
          : "";

      reservationDiv.innerHTML = `
        <h4><span style="background-color: ${bgColor}">${paymentStateText}</span></h4>
        <h4>${reservation.performance.title}</h4>
        <h4>${reservation.time.performanceDate}</h4>
        <h4>${removeSeconds(reservation.time.startTime)} ~ ${removeSeconds(
        reservation.time.endTime
      )}</h4>
        <h4>${formatPrice(reservation.payment.amount)}원</h4>
        <h4>${detailLinkHtml}</h4>
      `;
      container.appendChild(reservationDiv);
    });
  }

  function removeSeconds(time) {
    return time.slice(0, 5);
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function updatePagination(totalPages, currentPage) {
    const numbers = document.getElementById("numbers");
    numbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageElement = document.createElement("span");
      pageElement.innerHTML = `<a href="#">${i}</a>`;
      if (i === currentPage) {
        pageElement.classList.add("active");
      }
      pageElement.addEventListener("click", (e) => {
        e.preventDefault();
        loadReservations(i);
      });
      numbers.appendChild(pageElement);
    }

    document.getElementById("firstPage").addEventListener("click", () => {
      loadReservations(1);
    });
    document.getElementById("prevPage").addEventListener("click", () => {
      if (currentPage > 1) {
        loadReservations(currentPage - 1);
      }
    });
    document.getElementById("nextPage").addEventListener("click", () => {
      if (currentPage < totalPages) {
        loadReservations(currentPage + 1);
      }
    });
    document.getElementById("lastPage").addEventListener("click", () => {
      loadReservations(totalPages);
    });
  }

  loadReservations(currentPage);
});
