document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get("id");

  if (!reservationId) {
    console.error("예약 ID가 제공되지 않았습니다.");
    return;
  }

  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("토큰이 없습니다. 로그인 상태를 확인해주세요.");
    console.log(token);
    return;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  try {
    const response = await fetch(
      `http://localhost:8070/api/v1/reservation/find/detail?id=${reservationId}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("API 요청 실패: " + response.status);
    }
    const data = await response.json();
    populateReservationDetails(data.body);
  } catch (error) {
    console.error("예약 상세 조회 중 오류 발생:", error);
  }
});

function populateReservationDetails(data) {
  const reservationStateElement = document.querySelector(".reservationState p");
  const paymentState = data.payment.paymentState;

  reservationStateElement.textContent =
    paymentState === "PAY_BEFORE"
      ? "결제대기"
      : paymentState === "COMPLETE"
      ? "완료"
      : "취소";

  if (paymentState === "COMPLETE") {
    reservationStateElement.style.backgroundColor = "#ffaa14";
  } else if (paymentState === "CANCEL") {
    reservationStateElement.style.backgroundColor = "#dddddd";
  }

  document.querySelector(".tg-li6d.customerName").textContent =
    data.customerName;
  document.querySelector(".tg-li6d.customerPhone").textContent =
    data.customerPhone;
  document.querySelector(".tg-li6d.performanceTitle").textContent =
    data.performance.title;
  document.querySelector(
    ".tg-li6d.performanceTime"
  ).textContent = `${removeSeconds(data.time.startTime)} ~ ${removeSeconds(
    data.time.endTime
  )}`;
  document.querySelector(".tg-li6d.performanceDate").textContent =
    data.time.performanceDate;
  document.querySelector(".tg-li6d.reservationCount").textContent =
    data.payment.paymentDetail[0].count;
  document.querySelector(".tg-li6d.totalAmount").textContent = formatPrice(
    data.payment.amount
  );
  document.querySelector(".tg-li6d.reservationDate").textContent = formatDate(
    data.reservationDate
  );
}

function removeSeconds(time) {
  return time.slice(0, 5);
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
