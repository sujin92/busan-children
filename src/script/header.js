//header 배경
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".navBar > ul")
    .addEventListener("mouseover", function () {
      document.querySelector("header").style.paddingBottom = "240px";
    });

  document
    .querySelector(".navBar > ul")
    .addEventListener("mouseout", function () {
      document.querySelector("header").style.paddingBottom = "0";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  var menuOpen = document.querySelector(".menuOpen");
  var sideWrap = document.querySelector(".sideWrap");
  var sideMenu = document.querySelector(".sideMenu");
  var menuClose = document.querySelector(".menuClose");
  var navInfo = document.querySelector(".navInfo");
  var navBar = document.querySelector(".navBar");

  // navInfo와 navBar의 초기 위치 저장
  var navInfoTop = navInfo.offsetTop;
  var navBarTop = navBar.offsetTop;

  menuOpen.addEventListener("click", function () {
    sideWrap.style.display = "block";
    sideMenu.style.display = "block";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "10px";
    setTimeout(function () {
      sideMenu.style.right = "0";
    }, 50);
    menuClose.style.display = "block";

    // 스크롤바의 가로 길이 변화에 따라 navInfo와 navBar의 위치 조정
    var scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    navInfo.style.right = scrollbarWidth + "px";
    navBar.style.right = scrollbarWidth + "px";
  });

  menuClose.addEventListener("click", function () {
    sideMenu.style.right = "-500px";
    setTimeout(function () {
      sideMenu.style.display = "none";
      sideWrap.style.display = "none";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0";
      navInfo.style.right = "0";
      navBar.style.right = "0";
    }, 500);
    menuClose.style.display = "none";
  });
});

//호버 색상 변경
document.addEventListener("DOMContentLoaded", function () {
  var menuItems = document.querySelectorAll(".sideMenu > .menuMove > a");

  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("mouseover", function () {
      menuItems.forEach(function (item) {
        if (item !== menuItem) {
          item.querySelector("h2").style.transition = "color 0.3s ease";
          item.querySelector("h2").style.color = "#cbcbcb";
        }
      });
    });

    menuItem.addEventListener("mouseout", function () {
      menuItems.forEach(function (item) {
        item.querySelector("h2").style.transition = "color 0.3s ease";
        item.querySelector("h2").style.color = "#333333";
      });
    });
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   var quickMenuTop = document.querySelector(".quickMenuTop");
//   quickMenuTop.addEventListener("click", function () {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   });
// });
