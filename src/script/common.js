let headerSpace = document.querySelector("#header");
let headerCont = `
<header>
  <div class="header">
    <a href="/index.html"><img src="/public/logo.png" alt="logo" /></a>
  </div>
  <nav class="navBar">
    <ul>
      <li>
        <a href="/src/page/subPage/children/greeting.html" class="mainMenu"><span>자유아동극장</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/children/greeting.html">인사말</a></li>
          <li><a href="/src/page/subPage/children/facilities.html" class="tablinks">시설소개</a></li>
          <li><a href="/src/page/subPage/children/information.html">이용안내</a></li>
        </ul>
      </li>
      <li>
        <a href="/src/page/subPage/performance/performanceInfo.html" class="mainMenu"><span>프로그램</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/performance/performanceInfo.html">프로그램 정보</a></li>
          <li><a href="/src/page/subPage/performance/performancSchedule.html">이달의 일정</a></li>
        </ul>
      </li>
            <li>
        <a href="/src/page/subPage/reservation/reservationInfo.html" class="mainMenu"><span>예약</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/reservation/reservationInfo.html">예약안내</a></li>
          <li><a href="/src/page/subPage/reservation/reservation.html">예약하기</a></li>
        </ul>
      </li>
      <li>
        <a href="/src/page/subPage/coronation/coronationFacility.html" class="mainMenu"><span>대관안내</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/coronation/coronationFacility.html">대관시설</a></li>
          <li><a href="/src/page/subPage/coronation/coronationInfo.html">대관안내</a></li>
        </ul>
      </li>
      <li>
        <a href="/src/page/subPage/play/playInfo.html" class="mainMenu"><span>들락날락</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/play/playInfo.html">체험안내</a></li>
          <li><a href="/src/page/subPage/play/playReserVation.html">이용안내</a></li>
        </ul>
      </li>

      <li>
        <a href="/src/page/subPage/center/notice.html" class="mainMenu"><span>고객센터</span></a>
        <ul class="subManu">
          <li><a href="/src/page/subPage/center/notice.html">공지사항</a></li>
          <li><a href="/src/page/subPage/center/faq.html">FAQ</a></li>
          <li><a href="/src/page/subPage/center/location.html">오시는길</a></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div class="navInfo">
    <a href="/src/page/mypage/login.html" class="myPageMove"><i class="fa-regular fa-user"></i></a>
    <i class="fa-solid fa-bars menuOpen"></i>
  </div>
  <div class="sideWrap"></div>
  <div class="sideMenu">
    <i class="fa-solid fa-xmark menuClose"></i>
    <div class="menuMove">
      <a href="/src/page/subPage/children/greeting.html"><h2>자유아동극장</h2></a>
      <a href="/src/page/subPage/performance/performanceInfo.html"><h2>프로그램</h2></a>
            <a href="/src/page/subPage/reservation/reservationInfo.html"><h2>예약</h2></a>
      <a href="/src/page/subPage/coronation/coronationFacility.html"><h2>대관안내</h2></a>
      <a href="/src/page/subPage/play/playInfo.html"><h2>들락날락</h2></a>

      <a href="/src/page/subPage/center/notice.html"><h2>고객센터</h2></a>
    </div>
<p class="logout">로그아웃</p>
    <div class="shortcutMenu">
      <a href="/src/page/subPage/reservation/reservation.html"
        ><img src="/public/icon/main/shortcutMenu01.png" alt="icon"
      /></a>
      <a href="/src/page/subPage/children/flooGuide.html"
        ><img src="/public/icon/main/shortcutMenu02.png" alt="icon"
      /></a>
      <a href="/src/page/subPage/center/location.html"
        ><img src="/public/icon/main/shortcutMenu03.png" alt="icon"
      /></a>
                
    </div>

  </div>
</header>

`;
headerSpace.innerHTML = headerCont;

let footerSpace = document.querySelector("#footer");
let footerCont = `
<footer>
  <div>
    <img src="/public/logo.png" alt="logo" width="260" class="logoBlack" />
    <img src="/public/logo_white.png" alt="logo" width="260" class="logoWhite"/>
  </div>
  <div>
    <div>
      <p><span>상호명</span> 서구청</p>
      <p><span>사업자번호</span> 603-83-01058</p>
      <p><span>대표자명</span> 공한수</p>
      <p><span>주소</span> (49247) 부산 서구 구덕로 120, 부산 서구청</p>
      <p><span>전화번호</span> 051-290-5681~6</p>
    </div>
    <h3>Copyright ⓒ 한형석아동전용극장 All rights Reserved.</h3>
  </div>
  <div>
    <a href="/src/page/common/policy.html"><p>개인정보처리방침</p></a>
    <a href="/src/page/common/term.html"><p>이용약관</p></a>
  </div>
</footer>

`;
footerSpace.innerHTML = footerCont;

let quickMenuSpace = document.querySelector("#quickMenu");
let quickMenuCont = `
<div class="quickMenu">
<div class="quickMenuIcon">
  <a href="/src/page/subPage/reservation/reservation.html"><img src="/public/icon/main/shortcutMenu01.png" alt="icon" width="35"><p>예약</p></a>
  <a href="/src/page/subPage/children/facilities.html"><img src="/public/icon/main/shortcutMenu02.png" alt="icon" width="35"><p>시설소개</p></a>
  <a href="/src/page/subPage/center/location.html"><img src="/public/icon/main/shortcutMenu03.png" alt="icon" width="35"><p>오시는길</p></a>
</div>
<div class="quickMenuTop"><i class="fa-solid fa-caret-up"></i></div>
</div>
`;
quickMenuSpace.innerHTML = quickMenuCont;

let subMainSpace = document.querySelector("#subMain");
let subMainCont = `
<div class="subMain">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div class="mainTxt">
    <h2>자유아동극장</h2>
    <p>
      꿈과 상상이 만나는 어린이 문화 예술 들락날락
    </p>
  </div>
</div>

<div class="tab01">
  <div class="tab">
    <a href="./greeting.html" class="greeting">인사말</a>
    <a href="./facilities.html" class="facilities">시설소개</a>
    <a href="./information.html" class="information">이용안내</a>
  </div>
</div>
</div>
`;
subMainSpace.innerHTML = subMainCont;

let subMain02Space = document.querySelector("#subMain02");
let subMain02Cont = `
<div class="subMain02">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>프로그램</h2>
    <p>
      한형석 자유아동극장만의 차별화된 문화·예술 공연 및 프로그램
    </p>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">

    <a href="/src/page/subPage/performance/performanceInfo.html" class="performanceInfo">프로그램 정보</a>
    <a href="/src/page/subPage/performance/performancSchedule.html" class="performancSchedule">이달의 일정</a>
  </div>
</div>
</div>
`;
subMain02Space.innerHTML = subMain02Cont;

let subMain03Space = document.querySelector("#subMain03");
let subMain03Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>대관안내</h2>
    <p>
      한형석 자유아동극장은 공연과 행사를 위한 대관 서비스를 제공합니다.
    </p>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
    <a href="/src/page/subPage/coronation/coronationFacility.html" class="coronationFacility">대관시설</a>
    <a href="/src/page/subPage/coronation/coronationInfo.html" class="coronationInfo">대관안내</a>
  </div>
</div>
</div>
`;
subMain03Space.innerHTML = subMain03Cont;

let subMain04Space = document.querySelector("#subMain04");
let subMain04Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>들락날락</h2>
    <p>
    다양하고 창의적인 구성으로 체험형 프로그램 연출
    </p>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
    <a href="/src/page/subPage/play/playInfo.html" class="playInfo">체험안내</a>
    <a href="/src/page/subPage/play/playReserVation.html" class="playReserVation">이용안내</a>
  </div>
</div>
</div>
`;
subMain04Space.innerHTML = subMain04Cont;

let subMain05Space = document.querySelector("#subMain05");
let subMain05Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>예약</h2>
    <p>
    한형석자유아동극장은 다양한 문화예술 장르를 공연할 수 있는 환경을 갖추고 있습니다.
    </p>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
    <a href="/src/page/subPage/reservation/reservationInfo.html" class="reservationInfo">예약안내</a>
    <a href="/src/page/subPage/reservation/reservation.html" class="reservation">예약하기</a>
  </div>
</div>
</div>
`;
subMain05Space.innerHTML = subMain05Cont;

let subMain06Space = document.querySelector("#subMain06");
let subMain06Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>고객센터</h2>
    <p>
    한형석자유아동극장의 안내와 공지사항을 전해드립니다.
    </p>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
            <a href="/src/page/subPage/center/notice.html" class="noticeTab">공지사항</a>
            <a href="/src/page/subPage/center/faq.html" class="faq">FAQ</a>
            <a href="/src/page/subPage/center/location.html" class="location">오시는길</a>
  </div>
</div>
</div>
`;
subMain06Space.innerHTML = subMain06Cont;

let subMain07Space = document.querySelector("#subMain07");
let subMain07Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>마이페이지</h2>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
            <a href="/src/page/mypage/myPageInfo/reservation.html" class="myPageInfo">예약정보</a>
            <a href="/src/page/mypage/myPageInfo/member.html" class="member">회원정보</a>
  </div>
</div>
</div>
`;
subMain07Space.innerHTML = subMain07Cont;

let subMain08Space = document.querySelector("#subMain08");
let subMain08Cont = `
<div class="subMain03">
<div>
  <video
    src="/public/character.mp4"
    autoplay
    loop
    muted
    class="character"
  ></video>
</div>
<div>
  <video
    src="/public/character-crop.mp4"
    autoplay
    loop
    muted
    class="mobileCharacter"
  ></video>
</div>
<div
  class="mainTitle"
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
>
  <div
    class="lottie-container01"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
  <div class="mainTxt">
    <h2>관리자페이지</h2>
  </div>
  <div
    class="lottie-container02"
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay="100"
  >
  </div>
</div>

<div class="tab01">
  <div class="tab">
            <a href="/src/page/mypage/manager/memberReservation.html" class="memberReservation">회원 예약정보</a>
            <a href="/src/page/mypage/manager/membership.html" class="membership">회원정보</a>
  </div>
</div>
</div>
`;
subMain08Space.innerHTML = subMain08Cont;
