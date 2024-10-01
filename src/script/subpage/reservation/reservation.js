let date = new Date();
let selectedIconIndex = null; // 선택된 아이콘의 인덱스를 저장할 변수

let paymentDetailInfo = [];

document.addEventListener("DOMContentLoaded", function () {
  let selectedPerformance = null;
  let selectedIcon = null;
  let selectedDates = [];
  let highlightedDates = [];

  const token = sessionStorage.getItem("token");
  const loggedInUserId = sessionStorage.getItem("userId");

  loadAllPerformances(token);
  initializeEventListeners();
  renderCalendar();
  setupNavigation();

  async function loadAllPerformances(token) {
    const performances = await fetchPerformances(token);
    const validPerformances = filterValidPerformances(performances);
    displayPerformances(validPerformances);
  }

  async function fetchPerformances(token) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    let performances = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await fetch(
        `http://localhost:8070/api/v1/performance/find?page=${page}`,
        requestOptions
      );
      if (!response.ok) throw new Error("API 요청 실패: " + response.status);

      const data = await response.json();
      performances = performances.concat(data.body.content);
      totalPages = data.body.totalPages;
      page++;
    }

    return performances;
  }

  function filterValidPerformances(performances) {
    const today = new Date();
    return performances.filter(
      (performance) => new Date(performance.periodEnd) >= today
    );
  }

  function displayPerformances(performances) {
    const carousel = document.querySelector(".carousel");
    carousel.innerHTML = "";
    performances.forEach((performance, index) => {
      const performanceDiv = document.createElement("div");
      performanceDiv.innerHTML = `
        <img src="${performance.thumbnail}" alt="공연이미지" class="thumbnail" />
        <p class="title"><i class="fa-solid fa-check" data-index="${index}"></i>${performance.title}</p>
      `;
      carousel.appendChild(performanceDiv);
    });

    updateIconStyles(performances);
  }

  function updateIconStyles(performances) {
    const icons = document.querySelectorAll(".carousel .fa-check");

    icons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const discountedSelectAdd = document.querySelectorAll(
          ".discountedSelectAdd"
        );
        const isFlex = Array.from(discountedSelectAdd).some(
          (el) => getComputedStyle(el).display === "flex"
        );

        if (isFlex) {
          alert("추가한 항목을 삭제한 후 다른 항목을 선택할 수 있습니다.");
          return;
        }

        const index = icon.getAttribute("data-index");
        const performance = performances[index];
        selectedPerformance = performance;
        selectedIconIndex = index; // 선택된 아이콘의 인덱스를 저장

        clearDateStyles();
        icons.forEach((icon) => {
          icon.style.backgroundColor = "transparent";
          icon.style.color = "#a4a4a4";
        });

        icon.style.backgroundColor = "#82b378";
        icon.style.color = "white";
        selectedIcon = icon;

        clearSelectedDates();
        applyDateStyles(performance.periodStart, performance.periodEnd);
        updateDiscountedPrice();

        const performanceTitleElement =
          document.querySelector(".performanceTitle");
        if (performanceTitleElement) {
          performanceTitleElement.textContent = performance.title + " /";
        }

        resetTimeSelect();

        const performanceDateElement =
          document.querySelector(".performanceDate");
        const performanceRoundElement =
          document.querySelector(".performanceRound");
        if (performanceDateElement) {
          performanceDateElement.textContent = "";
        }
        if (performanceRoundElement) {
          performanceRoundElement.textContent = "";
        }
      });
    });

    // 선택된 아이콘의 스타일을 복원
    if (selectedIconIndex !== null) {
      const selectedIcon = icons[selectedIconIndex];
      selectedIcon.style.backgroundColor = "#82b378";
      selectedIcon.style.color = "white";
    }
  }

  function clearDateStyles() {
    highlightedDates.forEach((span) => {
      span.style.position = "";
      span.style.backgroundColor = "";
      span.style.borderRadius = "";
      span.style.color = "";
      span.style.width = "";
      span.style.height = "";
      span.style.display = "";
      span.style.justifyContent = "";
      span.style.alignItems = "";
    });

    highlightedDates = [];
  }

  function clearSelectedDates() {
    selectedDates.forEach((dateElement) => {
      const span = dateElement.querySelector("span");
      span.style.position = "";
      span.style.backgroundColor = "";
      span.style.borderRadius = "";
      span.style.color = "";
      span.style.width = "";
      span.style.height = "";
      span.style.display = "";
      span.style.justifyContent = "";
      span.style.alignItems = "";
    });
    selectedDates = [];
  }

  function applyDateStyles(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = document.querySelectorAll(".date");

    dates.forEach((dateElement) => {
      const spanElement = dateElement.querySelector("span");
      const dateValue = parseInt(spanElement.textContent, 10);

      if (!spanElement.classList.contains("this")) {
        return;
      }

      const elementYear = parseInt(spanElement.getAttribute("data-year"), 10);
      const elementMonth =
        parseInt(spanElement.getAttribute("data-month"), 10) - 1;

      const dateObjClear = new Date(elementYear, elementMonth, dateValue);
      const startClear = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const endClear = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );

      if (dateObjClear >= startClear && dateObjClear <= endClear) {
        spanElement.style.position = "relative";

        if (dateObjClear < today) {
          spanElement.style.backgroundColor = "#dddddd";
          spanElement.style.color = "#fff";
        } else {
          spanElement.style.backgroundColor = "#82b378";
          spanElement.style.color = "#fff";
          highlightedDates.push(spanElement);
        }

        spanElement.style.borderRadius = "50%";
        spanElement.style.width = "45px";
        spanElement.style.height = "45px";
        spanElement.style.display = "flex";
        spanElement.style.justifyContent = "center";
        spanElement.style.alignItems = "center";
      }
    });

    const discountedSelectAdd = document.querySelectorAll(
      ".discountedSelectAdd"
    );
    const isFlex = Array.from(discountedSelectAdd).some(
      (el) => getComputedStyle(el).display === "flex"
    );

    if (isFlex) {
      dates.forEach((dateElement) => {
        dateElement.querySelector("span").addEventListener("click", (event) => {
          event.stopPropagation(); // 추가: 이벤트 전파 중단
          alert("추가한 항목을 삭제한 후 다른 항목을 선택할 수 있습니다.");
        });
      });
    }
  }

  document.querySelector(".paymentBtn").addEventListener("click", () => {
    const customerId = document.getElementById("customerId").value.trim();
    if (loggedInUserId !== customerId) {
      alert("로그인된 아이디와 일치하지 않습니다.");
      return;
    }

    // 총 인원 수 확인
    const reservationCount = parseInt(
      document.querySelector(".totalCountNumber").textContent.trim()
    );

    // 총 금액 확인
    const totalPriceCheckTotalAdd = document
      .querySelector(".totalPriceCheckTotalAdd")
      .textContent.replace(/,/g, "")
      .replace("원", "");

    // 할인 유형이 선택되었는지 확인 (할인 유형을 선택한 상태)
    const discountSelected = !document
      .getElementById("discounted")
      .value.includes("선택하세요");

    // 조건: 금액이 0원이지만 인원 수가 1 이상이고 할인 유형이 선택된 경우 서버로 전송 가능
    if (
      parseInt(totalPriceCheckTotalAdd, 10) === 0 &&
      (!discountSelected || reservationCount <= 0)
    ) {
      alert("할인 유형을 선택해 주세요");
      return;
    }

    // 모든 조건을 만족하면 모달 창을 열어서 예약 진행
    const reservationModal = document.getElementById("reservationModal");
    reservationModal.style.display = "block";
  });

  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");

      const selectedPerformanceId = selectedPerformance
        ? selectedPerformance.id
        : null;
      const selectedTimeId = selectedIcon
        ? selectedIcon
            .closest("tr")
            .querySelector("i.fa-regular.fa-circle-dot")
            .getAttribute("data-id")
        : null;

      const customerId = document.getElementById("customerId").value.trim();
      const customerName = document.getElementById("customerName").value.trim();
      const customerPhone = document
        .getElementById("customerPhone")
        .value.trim()
        .replace(/[^0-9]/g, "");
      const customerEmail = document
        .getElementById("customerEmail")
        .value.trim();
      const reservationCount = parseInt(
        document.querySelector(".totalCountNumber").textContent.trim()
      );

      // 총 금액을 가져옴
      const totalAmount = parseInt(
        document
          .querySelector(".totalPriceCheckTotalAdd")
          .textContent.replace(/[^0-9]/g, "")
      );

      // 할인 유형 체크 (할인 유형을 선택한 상태)
      const discountSelected = !document
        .getElementById("discounted")
        .value.includes("선택하세요");

      // 인당 금액 계산 (총 금액을 총 인원으로 나눈 값, 금액이 0일 때 예외 처리)
      const pricePerPerson =
        totalAmount > 0 ? totalAmount / reservationCount : 0;

      // const busanAreaDiscount = document
      //   .getElementById("busanArea")
      //   .value.trim();
      const discountOptions = document
        .getElementById("discounted")
        .value.trim();
      const ageGroup = document.getElementById("target").value.trim();

      const performanceName = selectedPerformance
        ? selectedPerformance.title
        : null;
      const performanceDate = selectedDates.length
        ? `${selectedDates[0]
            .querySelector("span")
            .getAttribute("data-year")}-${String(
            selectedDates[0].querySelector("span").getAttribute("data-month")
          ).padStart(2, "0")}-${String(
            selectedDates[0].querySelector("span").textContent
          ).padStart(2, "0")}`
        : null;
      const time = selectedIcon
        ? `${
            selectedIcon.closest("tr").querySelector(".startTime").textContent
          } ~ ${
            selectedIcon.closest("tr").querySelector(".endTime").textContent
          }`
        : null;

      // 필수 필드 검증
      if (
        !selectedPerformanceId ||
        !selectedTimeId ||
        !customerId ||
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        reservationCount <= 0 ||
        (!pricePerPerson && !discountSelected) // 금액이 0이더라도 할인 유형을 선택한 경우에는 허용
      ) {
        alert("모든 필드를 올바르게 입력해주세요.");
        return;
      }

      // 서버로 전송할 데이터
      const reservationData = {
        timeId: selectedTimeId,
        performanceId: selectedPerformanceId,
        customerId: customerId,
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        performanceName: performanceName,
        performanceDate: performanceDate,
        time: time,
        paymentInfo: paymentDetailInfo,
      };

      console.log("Reservation data to send:", reservationData);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(reservationData),
      };

      try {
        const response = await fetch(
          "http://localhost:8070/api/v1/reservation/save",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("API 요청 실패: " + response.status);
        }
        alert("예약이 성공적으로 저장되었습니다.");
        window.location.href = "/src/page/mypage/myPageInfo/reservation.html";
      } catch (error) {
        console.error(error);
      }
    });

  function initializeEventListeners() {
    // document
    //   .getElementById("busanArea")
    //   .addEventListener("change", handleDiscountChange);
    document
      .getElementById("target")
      .addEventListener("change", handleDiscountChange);
    document
      .getElementById("discounted")
      .addEventListener("change", handleDiscountChange);

    document
      .querySelector(".count .fa-minus")
      .addEventListener("click", decrementQuantity);
    document
      .querySelector(".count .fa-plus")
      .addEventListener("click", incrementQuantity);

    document
      .querySelectorAll(".fa-circle-dot, .date, .fa-check")
      .forEach((element) => {
        element.addEventListener("click", (e) => {
          if (
            Array.from(document.querySelectorAll(".discountedSelectAdd")).some(
              (el) => getComputedStyle(el).display === "flex"
            )
          ) {
            alert("추가한 항목을 삭제한 후 다른 항목을 선택할 수 있습니다.");
            e.stopPropagation();
            e.preventDefault();
          }
        });
      });
  }

  function handleDiscountChange() {
    if (!checkPerformanceAndTimeSelected()) {
      resetSelectElement(this);
      return;
    }
    updateDiscountedPrice();
  }

  function resetSelectElement(selectElement) {
    selectElement.selectedIndex = 0;
    updateDiscountedPrice();
  }

  function decrementQuantity() {
    const quantityElement = document.querySelector(".count .quantity");
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
      quantity -= 1;
      quantityElement.textContent = quantity;
      updateTotalPrice();
    }
  }

  function incrementQuantity() {
    const quantityElement = document.querySelector(".count .quantity");
    let quantity = parseInt(quantityElement.textContent);
    quantity += 1;
    quantityElement.textContent = quantity;
    updateTotalPrice();
  }

  function updateDiscountedPrice() {
    const basePrice = selectedPerformance
      ? parseInt(selectedPerformance.price)
      : 0;

    // const busanAreaSelect = document.getElementById("busanArea");
    const targetSelect = document.getElementById("target");
    const discountedSelect = document.getElementById("discounted");

    // const busanAreaDiscount =
    //   parseInt(
    //     busanAreaSelect.options[busanAreaSelect.selectedIndex].text
    //       .replace(/,/g, "")
    //       .match(/-?\d+/)
    //   ) || 0;
    const targetDiscount =
      parseInt(
        targetSelect.options[targetSelect.selectedIndex].text
          .replace(/,/g, "")
          .match(/-?\d+/)
      ) || 0;
    const discountedDiscount =
      parseInt(
        discountedSelect.options[discountedSelect.selectedIndex].text
          .replace(/,/g, "")
          .match(/-?\d+/)
      ) || 0;

    const totalDiscount = targetDiscount + discountedDiscount;
    let discountedPrice = basePrice + totalDiscount; // 할인 금액은 음수이므로 더해줌

    // 할인 금액이 0 이하일 때 경고창 띄우기
    if (discountedPrice <= -1) {
      alert("더이상 할인을 적용할 수 없습니다.");
      discountedPrice = 0; // 금액을 0으로 고정
    }

    document.querySelector(".totalPriceCheck").textContent =
      formatPrice(discountedPrice) + "원";

    // document.querySelector(".firstSale").textContent =
    //   busanAreaSelect.options[busanAreaSelect.selectedIndex].text;
    // document
    //   .querySelector(".firstSale")
    //   .setAttribute(
    //     "data-value",
    //     busanAreaSelect.options[busanAreaSelect.selectedIndex].value
    //   );

    document.querySelector(".secondSale").textContent =
      targetSelect.options[targetSelect.selectedIndex].text;
    document
      .querySelector(".secondSale")
      .setAttribute(
        "data-value",
        targetSelect.options[targetSelect.selectedIndex].value
      );
    document.querySelector(".thirdSale").textContent =
      discountedSelect.options[discountedSelect.selectedIndex].text;
    document
      .querySelector(".thirdSale")
      .setAttribute(
        "data-value",
        discountedSelect.options[discountedSelect.selectedIndex].value
      );

    updateTotalPrice(); // 총 금액 업데이트
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function updateTotalPrice() {
    const totalPriceElement = document.querySelector(".totalPriceCheck");
    if (!totalPriceElement) return;

    const discountedPrice = parseInt(
      totalPriceElement.textContent.replace(/[^0-9]/g, "")
    );
    const quantityElement = document.querySelector(".count .quantity");
    if (!quantityElement) return;

    const quantity = parseInt(quantityElement.textContent);

    const totalPrice = discountedPrice * quantity;
    const totalPriceCheckTotalElement = document.querySelector(
      ".totalPriceCheckTotal"
    );

    if (totalPriceCheckTotalElement) {
      totalPriceCheckTotalElement.textContent = formatPrice(totalPrice) + "원";
    }

    const totalPriceCheckTotalAddElement = document.querySelector(
      ".totalPriceCheckTotalAdd"
    );
    if (totalPriceCheckTotalAddElement) {
      const totalAddPrice = Array.from(
        document.querySelectorAll(".totalPriceCheckAdd")
      ).reduce(
        (acc, element) =>
          acc + parseInt(element.textContent.replace(/[^0-9]/g, "")),
        0
      );
      totalPriceCheckTotalAddElement.textContent =
        formatPrice(totalAddPrice) + "원";
    }
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function resetTimeSelect() {
    const tableBody = document.querySelector(".timeSelect tbody");
    tableBody.innerHTML = "";
  }

  function renderCalendar() {
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    document.querySelector(".year-month").textContent = `${viewYear}년 ${
      viewMonth + 1
    }월`;

    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
      }
    }

    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    const numberOfRows = Math.ceil(
      (prevDates.length + thisDates.length + nextDates.length) / 7
    );
    const calendarHeight = numberOfRows === 6 ? 560 : 500;
    document.querySelector(".calendar").style.height = `${calendarHeight}px`;

    dates.forEach((date, i) => {
      const condition =
        i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
      dates[i] = `
        <div class="date">
          <span class="${condition}" data-year="${viewYear}" data-month="${
        viewMonth + 1
      }">${date}</span>
        </div>
      `;
    });

    document.querySelector(".dates").innerHTML = dates.join("");

    const today = new Date();
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
      for (let date of document.querySelectorAll(".this")) {
        if (+date.innerText === today.getDate()) {
          date.classList.add("today");
          break;
        }
      }
    }

    document
      .querySelector(".dates")
      .addEventListener("click", function (event) {
        const visibleDiscountedSelectAdd = document.querySelectorAll(
          ".discountedSelectAdd[style*='display: flex']"
        );
        if (visibleDiscountedSelectAdd.length > 0) {
          alert("추가한 항목을 삭제한 후 다른 항목을 선택할 수 있습니다.");
          return;
        }

        const clickedDate = event.target.closest(".date");
        const spanElement = clickedDate.querySelector("span");
        const dateValue = parseInt(spanElement.textContent, 10);

        if (!selectedPerformance) {
          alert("공연을 먼저 선택해 주세요");
          return;
        }

        if (
          !spanElement.style.backgroundColor ||
          spanElement.style.backgroundColor === "transparent"
        ) {
          alert("해당 날짜에 공연이 없습니다.");
          return;
        }

        if (spanElement.style.backgroundColor === "rgb(221, 221, 221)") {
          alert("예약 가능한 시간이 없습니다.");
          return;
        }

        if (clickedDate && clickedDate.querySelector(".this")) {
          selectedDates.forEach((dateElement) => {
            const span = dateElement.querySelector("span");
            span.style.backgroundColor = "#82b378";
            span.style.color = "#fff";
          });

          spanElement.style.position = "relative";
          spanElement.style.backgroundColor = "#82b378";
          spanElement.style.borderRadius = "50%";
          spanElement.style.color = "#fff";
          spanElement.style.width = "45px";
          spanElement.style.height = "45px";
          spanElement.style.display = "flex";
          spanElement.style.justifyContent = "center";
          spanElement.style.alignItems = "center";

          if (!selectedDates.includes(clickedDate)) {
            selectedDates.push(clickedDate);
          }

          const selectedDateString =
            spanElement.getAttribute("data-year") +
            "-" +
            String(spanElement.getAttribute("data-month")).padStart(2, "0") +
            "-" +
            String(dateValue).padStart(2, "0");

          showPerformanceTimes(selectedPerformance.time, selectedDateString);

          const performanceDateElement =
            document.querySelector(".performanceDate");
          if (performanceDateElement) {
            performanceDateElement.textContent = selectedDateString + " /";
          }

          const performanceRoundElement =
            document.querySelector(".performanceRound");
          if (performanceRoundElement) {
            performanceRoundElement.textContent = "";
          }
        }
      });

    // 선택된 아이콘의 스타일을 복원
    if (selectedIconIndex !== null && selectedPerformance) {
      applyDateStyles(
        selectedPerformance.periodStart,
        selectedPerformance.periodEnd
      );
    }
  }

  function setupNavigation() {
    window.prevMonth = () => {
      date.setDate(1);
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    };

    window.nextMonth = () => {
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    };

    window.goToday = () => {
      date = new Date();
      renderCalendar();
    };
  }

  function showPerformanceTimes(times, selectedDate) {
    const tableBody = document.querySelector(".timeSelect tbody");
    tableBody.innerHTML = "";

    const filteredTimes = times.filter(
      (time) => time.performanceDate === selectedDate
    );
    filteredTimes.sort(
      (a, b) =>
        new Date(`1970-01-01T${a.startTime}`) -
        new Date(`1970-01-01T${b.startTime}`)
    );

    if (filteredTimes.length === 0) {
      alert("해당 날짜에 공연 시간이 없습니다.");
      return;
    }

    const performanceRoundElement = document.querySelector(".performanceRound");
    const currentTime = new Date();

    filteredTimes.forEach((time, index) => {
      const row = document.createElement("tr");
      const startTime = new Date();
      const [startHour, startMinute] = time.startTime.split(":");
      startTime.setHours(startHour, startMinute, 0, 0);

      const today = new Date();
      const performanceDate = new Date(time.performanceDate);

      const isPastOrToday =
        performanceDate < today ||
        (performanceDate.getFullYear() === today.getFullYear() &&
          performanceDate.getMonth() === today.getMonth() &&
          performanceDate.getDate() === today.getDate());

      const timeDifference = (startTime - currentTime) / (1000 * 60 * 60);
      const isUnavailable =
        isPastOrToday && (startTime <= currentTime || timeDifference <= 0.5);

      row.innerHTML = `
            <td><i class="fa-regular fa-circle-dot" style="display: ${
              isUnavailable ? "none" : "inline-block"
            };" data-id="${time.id}"></i></td>
            <td>${index + 1}차</td>
            <td>
              <span class="startTime">${time.startTime.slice(0, 5)}</span> ~
              <span class="endTime">${time.endTime.slice(0, 5)}</span>
            </td>
            <td class="limitCheck">${
              isUnavailable ||
              time.reservationCount >= selectedPerformance.limit
                ? "예약 불가"
                : "예약 가능"
            }</td>
            <td class="limit">${
              selectedPerformance.limit - time.reservationCount
            }</td>
        `;
      tableBody.appendChild(row);
    });

    const circleIcons = document.querySelectorAll(".fa-circle-dot");

    circleIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const discountedSelectAdd = document.querySelectorAll(
          ".discountedSelectAdd"
        );
        const isFlex = Array.from(discountedSelectAdd).some(
          (el) => getComputedStyle(el).display === "flex"
        );

        if (isFlex) {
          alert("추가한 항목을 삭제한 후 다른 항목을 선택할 수 있습니다.");
          return;
        }

        if (performanceRoundElement) {
          performanceRoundElement.textContent = "";
        }

        if (selectedIcon) {
          selectedIcon.style.color = "#cccccc";
        }

        this.style.color = "#82b378";
        selectedIcon = this;

        selectedDates.forEach((dateElement) => {
          const span = dateElement.querySelector("span");
          span.style.position = "relative";
          span.style.backgroundColor = "#82b378";
          span.style.borderRadius = "50%";
          span.style.color = "#fff";
          span.style.width = "45px";
          span.style.height = "45px";
          span.style.display = "flex";
          span.style.justifyContent = "center";
          span.style.alignItems = "center";
        });

        const rowIndex = Array.from(
          icon.closest("tr").parentNode.children
        ).indexOf(icon.closest("tr"));
        const startTime = filteredTimes[rowIndex].startTime.slice(0, 5);
        const endTime = filteredTimes[rowIndex].endTime.slice(0, 5);
        document.querySelector(".performanceRound").textContent = `${
          rowIndex + 1
        }차 ${startTime} ~ ${endTime}`;
      });
    });
  }

  document.querySelector(".ticketAddBtn").addEventListener("click", () => {
    // 아이디 체크가 완료되지 않은 경우 경고 메시지 표시
    if (!isIdChecked) {
      alert("아이디 체크를 진행해 주세요.");
      return;
    }

    // const firstSale = document.querySelector(".firstSale").textContent;
    // const firstValue = document
    //   .querySelector(".firstSale")
    //   .getAttribute("data-value");
    const secondSale = document.querySelector(".secondSale").textContent;
    const secondValue = document
      .querySelector(".secondSale")
      .getAttribute("data-value");
    const thirdSale = document.querySelector(".thirdSale").textContent;
    const thirdValue = document
      .querySelector(".thirdSale")
      .getAttribute("data-value");
    const totalPriceCheck = document
      .querySelector(".totalPriceCheckTotal")
      .textContent.replace(/,/g, "")
      .replace("원", "");

    const totalPriceCheckItem = document
      .querySelector(".totalPriceCheck")
      .textContent.replace(/,/g, "")
      .replace("원", "");
    const customerId = document.getElementById("customerId").value.trim();
    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const quantity = document
      .querySelector(".count .quantity")
      .textContent.trim();

    // 이메일 형식 검증
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(customerEmail)) {
      alert("올바른 이메일 형식으로 입력하세요.");
      return;
    }

    if (!customerId || !customerName || !customerPhone || !customerEmail) {
      alert("예약자 정보를 입력해 주세요");
      return;
    }

    if (
      // firstSale.includes("선택하세요") ||
      secondSale.includes("선택하세요") ||
      thirdSale.includes("선택하세요")
    ) {
      alert("모든 사항을 선택해 주세요");
      return;
    }

    // 총 인원수 계산
    const totalCountNumber = parseInt(
      document.querySelector(".totalCountNumber").textContent.trim()
    );

    const newReservationCount = parseInt(quantity);

    const availableSeats = parseInt(
      document.querySelector(".limit").textContent.trim()
    );

    // 예약 가능 인원 초과 체크
    if (totalCountNumber + newReservationCount > availableSeats) {
      alert("예약 가능 인원을 초과하였습니다.");
      return;
    }

    // b1
    const item = {
      reservationCount: quantity, // 인원 수
      // discountRegion: firstValue,
      discountOptions: thirdValue,
      ageGroup: secondValue,
      price: totalPriceCheckItem, // 인당 금액 전송 (0원일 경우도 허용)
    };
    paymentDetailInfo = [...paymentDetailInfo, item];

    const discountedSelectAdd = document.createElement("div");
    discountedSelectAdd.classList.add("discountedSelectAdd");
    discountedSelectAdd.style.display = "flex";
    discountedSelectAdd.innerHTML = `
      <p>
         
          <span class="secondSaleAdd">${secondSale}</span> <em>/</em>
          <span class="thirdSaleAdd">${thirdSale}</span>
      </p>
      <p class="selectCount">${quantity}명</p>
      <div class="discountePriceAdd">
          <p class="totalPriceCheckAdd">${formatPrice(totalPriceCheck)}원</p>
          <i class="fa-solid fa-x remove-btn"></i>
      </div>
    `;

    document.querySelector(".totalPriceBox").appendChild(discountedSelectAdd);

    discountedSelectAdd
      .querySelector(".remove-btn")
      .addEventListener("click", () => {
        paymentDetailInfo = paymentDetailInfo.filter((t) => t != item);
        discountedSelectAdd.remove();
        updateTotalPrice();
        updateTotalCount();
        console.log(paymentDetailInfo);
      });

    updateTotalPrice();
    updateTotalCount();
  });

  let isIdChecked = false;

  document.getElementById("idCheck").addEventListener("click", async () => {
    const customerId = document.getElementById("customerId").value.trim();
    if (!customerId) {
      alert("아이디를 입력해 주세요");
      return;
    }

    const token = sessionStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId: customerId }),
    };

    try {
      const response = await fetch(
        `http://localhost:8070/api/v1/id_check`,
        requestOptions
      );
      if (response.ok) {
        alert("유효하지 않은 아이디 입니다.");
        isIdChecked = false;
      } else if (response.status === 409) {
        alert("유효한 아이디 입니다.");
        isIdChecked = true;
      } else {
        throw new Error("API 요청 실패: " + response.status);
      }
    } catch (error) {
      console.error(error);
      alert("아이디 체크 중 오류가 발생했습니다.");
    }
  });

  document
    .getElementById("customerPhone")
    .addEventListener("input", function () {
      const input = this.value;
      if (/[^0-9]/.test(input)) {
        alert("숫자만 입력 가능합니다.");
        this.value = "";
      }
    });

  function updateTotalCount() {
    const selectCountElements = document.querySelectorAll(".selectCount");
    let totalCount = 0;

    selectCountElements.forEach((element) => {
      const count = parseInt(element.textContent, 10);
      totalCount += isNaN(count) ? 0 : count;
    });

    document.querySelector(".totalCountNumber").textContent = totalCount;
  }

  function checkPerformanceAndTimeSelected() {
    const performanceRoundElement = document.querySelector(".performanceRound");
    const performanceRound = performanceRoundElement
      ? performanceRoundElement.textContent.trim()
      : "";

    const performanceDateElement = document.querySelector(".performanceDate");
    const performanceDate = performanceDateElement
      ? performanceDateElement.textContent.trim()
      : "";

    if (
      !selectedPerformance ||
      !selectedDates.length ||
      !selectedIcon ||
      !performanceRound ||
      !performanceDate
    ) {
      alert("공연과 시간을 먼저 선택해 주세요");
      return false;
    }
    return true;
  }
});
