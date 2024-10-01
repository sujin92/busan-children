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
    fetch("http://localhost:8070/api/v1/email_simple_send", {
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

//이름
const usernameInput = document.getElementById("username");

usernameInput.addEventListener("input", function () {
  const inputValue02 = this.value;
  const englishAndNumberRegex = /^[a-zA-Z0-9]+$/;

  if (!englishAndNumberRegex.test(inputValue02)) {
    alert("영문, 숫자만 입력 가능합니다.");
    this.value = "";
  }
});

document.getElementById("pwfineBtn").addEventListener("click", function () {
  var name = document.getElementById("name").value;
  var username = document.getElementById("username").value;
  const birthdate = formatDate(document.getElementById("birthdate").value);
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  const emailOk = document.getElementById("emailOk").value;

  sessionStorage.setItem("username", username);
  sessionStorage.setItem("email", email);

  const emailCheckOkButton = document.querySelector(".emailCheckOk");
  if (emailCheckOkButton.style.display !== "block") {
    alert("이메일 인증을 완료해 주세요.");
    return;
  }

  var data = {
    userId: username,
    userName: name,
    birth: birthdate,
    email: email,
    phone: phone,
  };

  fetch("http://localhost:8070/api/v1/pw_search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "./pwfine2.html";
      } else {
        alert("가입 정보를 다시 확인해 주세요");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    });

  function formatDate(dateString) {
    const date = new Date(dateString.replace(/\./g, "-"));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
});
