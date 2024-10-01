var target = document.querySelectorAll(".btn_open");
var btnPopClose = document.querySelectorAll(".pop_wrap .btn_close");
var targetID;

// 팝업 열기
for (var i = 0; i < target.length; i++) {
  target[i].addEventListener("click", function () {
    targetID = this.getAttribute("href");
    document.querySelector(targetID).style.display = "block";
  });
}

// 팝업 닫기
for (var j = 0; j < target.length; j++) {
  btnPopClose[j].addEventListener("click", function () {
    this.parentNode.parentNode.style.display = "none";
  });
}

// 주소 입력 값 변수
let updatedZonecode = "";
let updatedRoadAddress = "";
let updatedRoadAddressDetail = "";

// 저장된 데이터 불러오기
document.addEventListener("DOMContentLoaded", function () {
  var userId = sessionStorage.getItem("userId");

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify({ userId: userId }),
    redirect: "follow",
  };

  fetch("http://localhost:8070/api/v1/user_find", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      return response.json();
    })
    .then((result) => {
      var genderKorean;
      if (result.body.gender === "male") {
        genderKorean = "남성";
      } else if (result.body.gender === "female") {
        genderKorean = "여성";
      } else {
        genderKorean = "기타";
      }

      // 폼에 데이터 채우기
      document.getElementById("name").innerText = result.body.userName;
      document.getElementById("username").innerText = result.body.userId;
      document.getElementById("gender").innerText = genderKorean;
      document.getElementById("birthdate").innerText = result.body.birth;
      document.getElementById("phone").value = result.body.phone;
      document.getElementById("email").innerText = result.body.email;
      document.getElementById("zonecode").value = result.body.addrPost;
      document.getElementById("roadAddress").value = result.body.addrBasic;
      document.getElementById("roadAddressDetail").value =
        result.body.addrDetail;

      // 저장된 주소 값 변수에 할당
      updatedZonecode = result.body.addrPost;
      updatedRoadAddress = result.body.addrBasic;
      updatedRoadAddressDetail = result.body.addrDetail;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// 주소검색창 열기
const elZonecode = document.querySelector("#zonecode");
const elRoadAddress = document.querySelector("#roadAddress");
const elRoadAddressDetail = document.querySelector("#roadAddressDetail");
const elResults = document.querySelectorAll(".el_result");

const onClickSearch = () => {
  new daum.Postcode({
    oncomplete: function (data) {
      elZonecode.value = data.zonecode;
      elRoadAddress.value = data.address;

      // 변경된 주소 값 변수에 할당
      updatedZonecode = data.zonecode;
      updatedRoadAddress = data.address;
    },
  }).open();
};

// 이벤트 추가
document.querySelector("#search-btn").addEventListener("click", () => {
  event.preventDefault();
  onClickSearch();
});
elRoadAddressDetail.addEventListener("input", (e) => {
  updatedRoadAddressDetail = e.target.value;
});

// 수정 데이터 저장
document.querySelector(".joinBtn").addEventListener("click", function () {
  event.preventDefault();

  const newPassword = document.getElementById("password").value;
  const newPhone = document.getElementById("phone").value;

  // 변경된 주소 값 사용
  const newZonecode = updatedZonecode;
  const newRoadAddress = updatedRoadAddress;
  const newRoadAddressDetail = updatedRoadAddressDetail;

  if (
    !newPassword ||
    !newPhone ||
    !newZonecode ||
    !newRoadAddress ||
    !newRoadAddressDetail
  ) {
    alert("모든 내용을 작성해 주세요");
    return;
  }

  if (newPhone.length !== 11 || isNaN(newPhone)) {
    alert("휴대폰 번호는 11자리 숫자여야 합니다.");
    return;
  }

  const userId = document.getElementById("username").innerText;
  const userEmail = document.getElementById("email").innerText;

  const requestData = {
    userId: userId,
    userPw: newPassword,
    userName: document.getElementById("name").innerText,
    gender: document.getElementById("gender").innerText,
    birth: document.getElementById("birthdate").innerText,
    phone: newPhone,
    email: userEmail,
    addrPost: newZonecode,
    addrBasic: newRoadAddress,
    addrDetail: newRoadAddressDetail,
  };

  fetch("http://localhost:8070/api/v1/user_update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      return response.json();
    })
    .then((data) => {
      alert("수정이 완료되었습니다.");
      location.reload();
    })
    .catch((error) => {
      console.error("회원 정보 수정 실패:", error);
    });
});

// 비밀번호 유효성 검사
function validatePassword() {
  var passwordInput = document.getElementById("password");
  var password = passwordInput.value;
  var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/;

  if (!passwordPattern.test(password)) {
    alert("5자~15자 이내의 영문, 숫자를 조합하여 사용해야 합니다.");
    passwordInput.value = "";
    return false;
  }

  return validateConfirmPassword();
}

// 비밀번호 확인 유효성 검사
function validateConfirmPassword() {
  var confirmPasswordInput = document.getElementById("confirm-password");
  var confirmPassword = confirmPasswordInput.value;
  var passwordInput = document.getElementById("password");
  var password = passwordInput.value;

  if (confirmPassword.trim() !== "") {
    if (confirmPassword !== password) {
      alert("비밀번호가 일치하지 않습니다.");
      confirmPasswordInput.value = "";
      return false;
    }
  }
  return true;
}

document.getElementById("password").addEventListener("blur", validatePassword);

document
  .getElementById("confirm-password")
  .addEventListener("blur", validateConfirmPassword);

// 전화번호 유효성 검사
document.getElementById("phone").addEventListener("input", function (event) {
  var phoneInput = event.target;
  var phone = phoneInput.value;

  var specialCharacterPattern = /[^\d]/;
  if (specialCharacterPattern.test(phone)) {
    alert("숫자만 입력하세요.");
    phoneInput.value = phone.replace(/[^\d]/g, "");
    phoneInput.focus();
    return;
  }

  if (phone.length > 11) {
    alert("11자리 숫자를 입력해 주세요");
    phoneInput.value = phone.slice(0, 11);
  }
});

//탈퇴
document.querySelector(".btn_ok").addEventListener("click", function () {
  const userId = document.getElementById("username").innerText;
  const requestData = { userId: userId };

  fetch("http://localhost:8070/api/v1/user_delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      return response.json();
    })
    .then((data) => {
      alert("회원 탈퇴되었습니다.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("회원 탈퇴 실패:", error);
    });
});
