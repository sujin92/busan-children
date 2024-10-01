const elZonecode = document.querySelector("#zonecode");
const elRoadAddress = document.querySelector("#roadAddress");
const elRoadAddressDetail = document.querySelector("#roadAddressDetail");
const elResults = document.querySelectorAll(".el_result");
// 주소검색창 열기
const onClickSearch = () => {
  console.log(1);
  new daum.Postcode({
    oncomplete: function (data) {
      console.log(data);
      elZonecode.setAttribute("value", data.zonecode);
      elRoadAddress.setAttribute("value", data.address);
    },
  }).open();
};
const register = () => {
  console.log(`우편번호: ${elZonecode.getAttribute("value")}`);
  console.log(`주소: ${elRoadAddress.getAttribute("value")}`);
  console.log(`상세주소: ${elRoadAddressDetail.getAttribute("value")}`);
  elResults[0].innerHTML = elZonecode.getAttribute("value");
  elResults[1].innerHTML = elRoadAddress.getAttribute("value");
  elResults[2].innerHTML = elRoadAddressDetail.getAttribute("value");
};
// 이벤트 추가
document.querySelector("#search-btn").addEventListener("click", () => {
  onClickSearch();
});
elRoadAddressDetail.addEventListener("change", (e) => {
  elRoadAddressDetail.setAttribute("value", e.target.value);
});

function uncheckOther(checkbox) {
  const checkboxes = document.querySelectorAll(
    '.radio-group input[type="checkbox"]'
  );
  checkboxes.forEach(function (cb) {
    if (cb !== checkbox) {
      cb.checked = false;
    }
  });
}
