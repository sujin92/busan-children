let reservationData = null;
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
    reservationData = data.body;
    console.log(reservationData);
  } catch (error) {
    console.error("예약 상세 조회 중 오류 발생:", error);
  }

  function populateReservationDetails(data) {
    const reservationStateElement = document.querySelector(
      ".reservationState p"
    );
    const paymentState = data.payment.paymentState;

    reservationStateElement.textContent =
      paymentState === "PAY_BEFORE"
        ? "결제대기"
        : paymentState === "COMPLETE"
        ? "결제완료"
        : "취소";

    if (paymentState === "COMPLETE") {
      reservationStateElement.style.backgroundColor = "#ffaa14";
      document.querySelector(".paymentGo").style.display = "none";

      const performanceDateTime = new Date(
        `${data.time.performanceDate}T${data.time.startTime}`
      );
      const currentDateTime = new Date();

      // 공연 날짜와 시간이 현재 시간보다 1시간 이하로 남으면 예약취소 버튼을 숨기기
      if (performanceDateTime - currentDateTime <= 60 * 60 * 1000) {
        document.querySelector(".cancleBtn").style.display = "none";
      }
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

    const count = data.payment.paymentDetail
      .map((t) => t.count)
      .reduce((acc, a) => acc + a);
    document.querySelector(".tg-li6d.reservationCount").textContent = count;

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

  async function cancelPayment() {
    reservationData;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        paymentId: reservationData.payment.paymentId,
        paymentState: "CANCEL",
        reservationId: reservationData.id,
        performanceId: reservationData.performance.id,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8070/api/v1/reservation/payment/update",
        requestOptions
      );
      if (response.status === 200) {
        deleteReservation(reservationData.id);
        // const result = await response.json();
        // alert("정상적으로 취소되었습니다.");
        // location.reload();
      }
    } catch (e) {}
  }

  async function deleteReservation(reservationId) {
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
      if (!response.ok) {
        throw new Error("API 요청 실패: " + response.status);
      }
      alert("예약이 취소되었습니다.");
      window.location.href = "./reservation.html";
    } catch (error) {
      console.error("예약 삭제 중 오류 발생:", error);
      console.log(reservationId);
    }
  }

  document
    .querySelector(".cancleBtn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector(".overlay").style.display = "block";
      document.querySelector(".pop_wrap").style.display = "block";
    });

  document.querySelector(".btn_ok").addEventListener("click", function () {
    deleteReservation(reservationId);

    //cancelPayment();

    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".pop_wrap").style.display = "none";
  });

  document.querySelector(".btn_close").addEventListener("click", function () {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".pop_wrap").style.display = "none";
  });

  document.querySelector(".overlay").addEventListener("click", function () {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".pop_wrap").style.display = "none";
  });

  document
    .querySelector(".paymentGo")
    .addEventListener("click", async function () {
      let paymentId = `payment-${crypto.randomUUID().replaceAll("-", "")}`;
      const response = await PortOne.requestPayment({
        storeId: "store-f8fc7657-9a40-4081-85ca-1f28060ffecf",
        channelKey: "channel-key-557c8de4-85b8-4c51-9c13-c4394d1e52e4",
        paymentId: paymentId,
        orderName: reservationData.performance.title,
        totalAmount: reservationData.payment.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          email: reservationData.customerEmail,
          phoneNumber: reservationData.customerPhone,
          fullName: reservationData.customerName,
        },
      });

      console.log("PortOne 결제 응답:", response);

      if (response.code != null) {
        return alert(response.message);
      }

      const notified = await fetch(
        "http://localhost:8070/api/v1/reservation/payment/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            paymentId: response.paymentId,
            buyerName: reservationData.customerName,
            name: reservationData.performance.title,
            buyerTel: reservationData.customerPhone,
            buyerEmail: reservationData.customerEmail,
            payMethod: "CARD",
            pg: "KG이니시스",
            paymentApprovalDate: new Date(),
            paymentState: "COMPLETE",
            performanceId: reservationData.performance.id,
            reservationId: reservationData.id,
          }),
        }
      );

      console.log("결제 상태 업데이트 응답:", notified);

      if (notified.status === 200) {
        // const result = await notified.json();
        alert("예약이 정상적으로 되었습니다.");
        location.href =
          "./reservationDetailComplete.html?id=" + reservationData.id;
      } else {
        const errorMsg = await notified.text();
        console.error("결제 상태 업데이트 실패:", notified.status, errorMsg);
        alert("결제 상태 업데이트 실패");
      }
    });
});
