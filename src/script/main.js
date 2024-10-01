// 퀵메뉴
document.addEventListener("DOMContentLoaded", function () {
  var quickMenuTop = document.querySelector(".quickMenuTop");
  quickMenuTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

//마이페이지 이동
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.querySelector(".logout");
  const myPageMoveLink = document.querySelector(".myPageMove");
  const token = sessionStorage.getItem("token");

  if (token) {
    logoutButton.style.display = "block";
    const userId = sessionStorage.getItem("userId");

    if (userId === "admin") {
      // userId가 admin일 때
      myPageMoveLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href =
          "/src/page/mypage/manager/memberReservation.html";
      });

      // .managerWrite 디스플레이 설정
      const managerWrite = document.querySelector(".managerWrite");
      if (managerWrite) {
        managerWrite.style.display = "block";
      }
    } else {
      myPageMoveLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "/src/page/mypage/myPageInfo/reservation.html";
      });
    }
  } else {
    myPageMoveLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "/src/page/mypage/login.html";
    });
  }

  // 로그아웃
  logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    window.location.href = "/index.html";
  });
});
