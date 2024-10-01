document.querySelector(".loginBtn").addEventListener("click", function (event) {
  event.preventDefault();
  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');

  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch("http://localhost:8070/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: username,
      userPw: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const authorizationHeader = response.headers.get("Authorization");
      if (authorizationHeader) {
        sessionStorage.setItem("token", authorizationHeader);
        sessionStorage.setItem("userId", usernameInput.value);
      } else {
        throw new Error("로그인 실패: 토큰이 없음");
      }

      return response.json();
    })
    .then((data) => {
      console.log("로그인 성공:", data);
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호를 확인해 주세요.");
    });
});
