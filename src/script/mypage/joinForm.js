document.addEventListener("DOMContentLoaded", function () {
  const overlapCheckBtn = document.querySelector(".overlapCheck");
  const usernameInput = document.getElementById("username");

  overlapCheckBtn.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    let userId = "userId";

    fetch("http://localhost:8070/api/v1/id_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: username }),
    })
      .then((response) => {
        if (response.ok) {
          if (username.match(/^[a-zA-Z0-9]{6,15}$/)) {
            alert("사용 가능한 아이디입니다.");
            document.querySelector(".overlapCheckOk").style.display = "block";
          } else {
            alert("영문, 숫자 조합 6자~15자 이내로 사용 가능합니다.");
          }
        } else if (response.status == 409) {
          alert("이미 사용중인 아이디입니다.");
        } else {
          throw new Error("서버 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("아이디 중복 확인 오류:", error.message);
        alert("아이디 중복 확인 중 오류가 발생했습니다.");
      });
  });
});

//이메일 인증
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalMessage = document.getElementById("modal-message");
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const emailInput = document.getElementById("email");
  const emailOkInput = document.getElementById("emailOk");
  const emailCertifiedButton = document.querySelector(".emailCertified");
  const emailCheckButton = document.querySelector(".emailCheck");

  // 모달 창 열기
  emailCertifiedButton.addEventListener("click", function () {
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    // 이메일 발송
    fetch("http://localhost:8070/api/v1/email_send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log("이메일 전송 성공:", data);
        showModal("인증메일이 발송되었습니다.");
      })
      .catch((error) => {
        console.error("이메일 전송 실패:", error);
        alert("이미 사용중인 이메일 주소입니다.");
      });
  });

  // 이메일 확인 버튼
  emailCheckButton.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const code = emailOkInput.value.trim();

    // 이메일 확인 요청 보내기
    fetch("http://localhost:8070/api/v1/email_valid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("인증번호를 다시 확인해 주세요");
        }
        return response.json();
      })
      .then((data) => {
        console.log("이메일 확인 성공:", data);
        showModal("이메일 인증에 성공했습니다.");
        document.querySelector(".emailCheckOk").style.display = "block";
      })
      .catch((error) => {
        console.error("이메일 확인 실패:", error);
        alert("인증번호를 다시 확인해 주세요");
      });
  });

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
  }
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

//이름
const nameInput = document.getElementById("name");

nameInput.addEventListener("input", function () {
  const inputValue = this.value;
  const englishAndNumberRegex = /^[a-zA-Z0-9]+$/;

  if (englishAndNumberRegex.test(inputValue)) {
    alert("한글만 입력 가능합니다.");
    this.value = "";
  }
});

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
    alert("전화번호는 최대 11자리까지 입력할 수 있습니다.");
    phoneInput.value = phone.slice(0, 11);
  }
});

//회원가입
document.querySelector(".joinBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const birthdate = document.getElementById("birthdate").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const addrPost = document.getElementById("zonecode").value;
  const addrBasic = document.getElementById("roadAddress").value;
  const addrDetail = document.getElementById("roadAddressDetail").value;
  const emailOk = document.getElementById("emailOk").value;

  const overlapCheckOkButton = document.querySelector(".overlapCheckOk");
  if (overlapCheckOkButton.style.display !== "block") {
    alert("아이디 중복체크를 완료해 주세요.");
    return;
  }

  const emailCheckOkButton = document.querySelector(".emailCheckOk");
  if (emailCheckOkButton.style.display !== "block") {
    alert("이메일 인증을 완료해 주세요.");
    return;
  }

  fetch("http://localhost:8070/api/v1/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: username,
      userPw: password,
      userName: name,
      gender: gender,
      birth: birthdate,
      phone: phone,
      email: email,
      addrPost: addrPost,
      addrBasic: addrBasic,
      addrDetail: addrDetail,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      return response.json();
    })
    .then((data) => {
      console.log("회원가입 성공:", data);
      window.location.href = "./joinSuccess.html";
    })
    .catch((error) => {
      console.error("회원가입 실패:", error);
    });
});
