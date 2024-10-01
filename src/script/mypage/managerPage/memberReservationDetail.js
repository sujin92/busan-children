document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login.html"; // 로그인 페이지로 리디렉션
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get("id");
    if (reservationId) {
      loadReservationDetails(token, reservationId);
    } else {
      alert("잘못된 접근입니다.");
      window.location.href = "./memberReservation.html"; // 예약 목록 페이지로 리디렉션
    }
  }

  function loadReservationDetails(token, reservationId) {
    fetchReservationDetails(token, reservationId)
      .then((data) => {
        console.log(data); // 데이터를 콘솔에 출력
        renderReservationDetails(data);
      })
      .catch((error) => {
        console.error("예약 정보를 불러오는 중 오류가 발생했습니다:", error);
      });
  }

  async function fetchReservationDetails(token, reservationId) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetch(
      `http://localhost:8070/api/v1/reservation/find/detail?id=${reservationId}`,
      requestOptions
    );
    if (!response.ok) throw new Error("API 요청 실패: " + response.status);
    const data = await response.json();

    return data.body; // 예약 엔티티 반환
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

  function renderReservationDetails(reservation) {
    const statusText = getStatusText(reservation.payment.paymentState);
    document.getElementById("reservationStatus").textContent = statusText;
    document.getElementById("customerName").textContent =
      reservation.customerName;
    document.getElementById("customerPhone").textContent =
      reservation.customerPhone;
    document.getElementById("performanceTitle").textContent =
      reservation.performance.title;
    document.getElementById("reservationDate").textContent =
      reservation.reservationDate.split("T")[0];
    document.getElementById(
      "performanceTime"
    ).textContent = `${reservation.time.startTime} ~ ${reservation.time.endTime}`;
    document.getElementById("reservationCount").textContent =
      reservation.payment.paymentDetail[0].count;
    document.getElementById("totalAmount").textContent =
      reservation.payment.amount.toLocaleString() + "원";
    document.getElementById("performanceDate").textContent =
      reservation.time.performanceDate;

    // 예약 취소 버튼 클릭 시
    document
      .querySelector(".cancellation a")
      .addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("pop_info_1").style.display = "block";
      });

    // 팝업에서 '예' 버튼 클릭 시 예약 취소 요청
    document.querySelector(".btn_ok").addEventListener("click", function () {
      deleteReservation(token, reservation.id);
    });

    // 팝업에서 '아니오' 버튼 클릭 시 팝업 닫기
    document.querySelector(".btn_close").addEventListener("click", function () {
      document.getElementById("pop_info_1").style.display = "none";
    });
  }

  async function deleteReservation(token, reservationId) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id: reservationId }),
    };

    try {
      const response = await fetch(
        `http://localhost:8070/api/v1/reservation/delete`,
        requestOptions
      );
      if (!response.ok) throw new Error("API 요청 실패: " + response.status);
      alert("예약이 삭제되었습니다.");
      window.location.href = "./memberReservation.html"; // 예약 목록 페이지로 리디렉션
    } catch (error) {
      console.error("예약 삭제 중 오류가 발생했습니다:", error);
      alert("예약 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }
});
