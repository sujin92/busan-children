document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("idFineBtn").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const birthdate = formatDate(document.getElementById("birthdate").value);
    const email = document.getElementById("email").value;

    // 폼 유효성 검사
    if (!name) {
      alert("이름을 입력해 주세요");
      return;
    }
    if (!birthdate) {
      alert("생년월일을 입력해 주세요");
      return;
    }
    if (!email) {
      alert("이메일을 입력해 주세요");
      return;
    }

    const requestData = {
      userName: name,
      birth: birthdate,
      email: email,
    };

    fetch("http://localhost:8070/api/v1/id_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        if (!data.body.userId) {
          return;
        }

        document.querySelector(".joinConsentHidden").style.display = "block";
        const userId = data.body.userId;
        document.querySelector(".idCheck").innerText = userId;
      })
      .catch((error) => {
        console.error("아이디 찾기 실패:", error);
        alert("가입 정보를 다시 확인해 주세요");
      });
  });

  function formatDate(dateString) {
    const date = new Date(dateString.replace(/\./g, "-"));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
});
