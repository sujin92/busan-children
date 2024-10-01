let date = new Date();
let token = sessionStorage.getItem("token");
let dateSchedules = {}; // 전역 변수로 이동

const renderCalendar = (schedules = []) => {
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
  const calendarHeight = numberOfRows === 6 ? 860 : 750;
  document.querySelector(".calendar").style.height = `${calendarHeight}px`;

  dateSchedules = {}; // Reset dateSchedules

  // Mapping performances to the correct dates
  schedules.forEach((s) => {
    const startDate = new Date(s.periodStart);
    const endDate = new Date(s.periodEnd);

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      if (year === viewYear && month === viewMonth) {
        const key = `${year}-${month + 1}-${day}`;

        if (!dateSchedules[key]) {
          dateSchedules[key] = [];
        }
        dateSchedules[key].push(s);
      }
    }
  });

  dates.forEach((date, i) => {
    const condition =
      i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
    const dateKey = `${viewYear}-${viewMonth + 1}-${date}`;
    let scheduleContent = "";

    if (dateSchedules[dateKey] && condition === "this") {
      dateSchedules[dateKey].slice(0, 2).forEach((s) => {
        // Display up to 2 schedules
        scheduleContent += `
          <div class="schedule">
            <span class="category">${s.genre}</span>
            <p>${s.title}</p>
          </div>
        `;
      });
    }

    dates[i] = `
      <div class="date" onclick="handleDateClick('${dateKey}')">
        <span class="${condition}">${date}</span>
        ${scheduleContent}
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
};

const handleDateClick = (dateKey) => {
  const schedules = dateSchedules[dateKey] || [];
  const noSelect = document.querySelector(".noSelect");
  const calendarBoxItem1 = document.querySelector(".calendarBoxItem");
  const calendarBoxItem2 = document.querySelector(".calendarBoxItem02");

  console.log(calendarBoxItem1);

  if (noSelect) noSelect.style.display = "none";
  if (calendarBoxItem1) calendarBoxItem1.style.display = "block";
  if (calendarBoxItem2) calendarBoxItem2.style.display = "block";

  if (schedules[0] && calendarBoxItem1) {
    calendarBoxItem1.querySelector(".calendarTitle").textContent =
      schedules[0].title;
    calendarBoxItem1.querySelector(".calendarSubTitle").textContent =
      schedules[0].subtitle;
    calendarBoxItem1.querySelector(".calendarStartDate").textContent =
      schedules[0].periodStart;
    calendarBoxItem1.querySelector(".calendarEndtDate").textContent =
      schedules[0].periodEnd;
    calendarBoxItem1.querySelector(".calendarRating").textContent =
      schedules[0].rating;
    calendarBoxItem1.querySelector(".calendarPrice").textContent =
      schedules[0].price;
    calendarBoxItem1.querySelector(".thumbnail").src = schedules[0].thumbnail;
    calendarBoxItem1.querySelector(".genre").textContent = schedules[0].genre;
    // calendarBoxItem1.onclick = () => {
    //   window.location.href = `performanceDetails.html?id=${schedules[0].id}`;
    // };
  } else if (calendarBoxItem1) {
    calendarBoxItem1.style.display = "none";
  }

  if (schedules[1] && calendarBoxItem2) {
    calendarBoxItem2.querySelector(".calendarTitle").textContent =
      schedules[1].title;
    calendarBoxItem2.querySelector(".calendarSubTitle").textContent =
      schedules[1].subtitle;
    calendarBoxItem2.querySelector(".calendarStartDate").textContent =
      schedules[1].periodStart;
    calendarBoxItem2.querySelector(".calendarEndtDate").textContent =
      schedules[1].periodEnd;
    calendarBoxItem2.querySelector(".calendarRating").textContent =
      schedules[1].rating;
    calendarBoxItem2.querySelector(".calendarPrice").textContent =
      schedules[1].price;
    calendarBoxItem2.querySelector(".thumbnail").src = schedules[1].thumbnail;
    calendarBoxItem2.querySelector(".genre").textContent = schedules[1].genre;
    // calendarBoxItem2.onclick = () => {
    //   window.location.href = `performanceDetails.html?id=${schedules[1].id}`;
    // };
  } else if (calendarBoxItem2) {
    calendarBoxItem2.style.display = "none";
  }
};

const loadMonthlyPerformances = (date) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  fetch(
    `http://localhost:8070/api/v1/performance/find/calendar?date=${date}`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("API 요청 실패: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.body && data.body.length > 0) {
        console.log("공연 데이터:", data.body);
        renderCalendar(data.body); // Performances for the month
      } else {
        console.log("해당 월에 공연 데이터가 없습니다.");
        renderCalendar([]); // No performances for the month
      }
    })
    .catch((error) => {
      console.error(error);
      alert("월별 공연 정보를 불러오는 중 오류가 발생했습니다.");
    });
};

const prevMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  loadMonthlyPerformances(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`
  );
};

const nextMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  loadMonthlyPerformances(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`
  );
};

const goToday = () => {
  date = new Date();
  loadMonthlyPerformances(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`
  );
};

goToday(); // Load the current month's performances when the page loads
