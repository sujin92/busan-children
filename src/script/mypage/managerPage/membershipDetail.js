document.addEventListener("DOMContentLoaded", function () {
  var token = sessionStorage.getItem("token");
  var selectedUserId = sessionStorage.getItem("selectedUserId");

  fetch("http://localhost:8070/api/v1/user_find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      userId: selectedUserId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch user details");
      }
    })
    .then((data) => {
      const userNameElement = document.querySelector(".userName");
      const userIdElement = document.querySelector(".userId");
      const genderElement = document.querySelector(".gender");
      const birthElement = document.querySelector(".birth");
      const phoneElement = document.querySelector(".phone");
      const emailElement = document.querySelector(".email");
      const addrBasicElement = document.querySelector(".addrBasic");
      const addrDetailElement = document.querySelector(".addrDetail");
      const addrPostElement = document.querySelector(".addrPost");

      userNameElement.textContent = data.body.userName;
      userIdElement.textContent = data.body.userId;
      genderElement.textContent = data.body.gender;
      birthElement.textContent = data.body.birth;
      phoneElement.textContent = data.body.phone;
      emailElement.textContent = data.body.email;
      addrBasicElement.textContent = data.body.addrBasic;
      addrDetailElement.textContent = data.body.addrDetail;
      addrPostElement.textContent = data.body.addrPost;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

//탈퇴 팝업
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

document.querySelector(".btn_ok").addEventListener("click", function () {
  var selectedUserId = sessionStorage.getItem("selectedUserId");
  const requestData = { userId: selectedUserId };

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
      sessionStorage.removeItem("selectedUserId");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("회원 탈퇴 실패:", error);
    });
});
