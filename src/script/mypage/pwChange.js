var username = sessionStorage.getItem("username");
var email = sessionStorage.getItem("email");

document.querySelector(".newPwBtn").addEventListener("click", function () {
  var newPw = document.getElementById("newPw").value;
  var newPw2 = document.getElementById("newPw2").value;

  if (newPw === "") {
    alert("새로운 비밀번호를 입력해 주세요.");
    return;
  }

  var passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,15}$/;
  if (!passwordRegex.test(newPw)) {
    alert("비밀번호는 5자 이상 15자 이하의 영문, 숫자 조합이어야 합니다.");
    return;
  }

  if (newPw !== newPw2) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  var data = {
    userId: username,
    userPw: newPw,
    email: email,
  };

  fetch("http://localhost:8070/api/v1/pw_change", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "./pwSuccess.html";
      } else {
        alert("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    });
});
