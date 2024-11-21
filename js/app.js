const wrapperEl = document.querySelector(".products__wrapper");
const loadingEl = document.querySelector(".loading");
const btnEl = document.querySelector(".btn");

const API_URL = "https://dummyjson.com";
let offset = 1;
let pageCount = 4;

async function fetchData(api) {
  const response = await fetch(api);
  response
    .json()
    .then((res) => createCard(res))
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl.style.display = "none";
      btnEl.removeAttribute("disabled");
    });
}
fetchData(`${API_URL}/products?limit=${pageCount * offset}`);

function getProductByCategory() {
  fetchData(`${API_URL}/products?limit=${pageCount * offset}`);
}

function createCard(data) {
  //   wrapperEl.innerHTML = "";
  while (wrapperEl.firstChild) {
    wrapperEl.firstChild.remove();
  }
  data.products.forEach((product) => {
    const card = document.createElement("div");
    // card.classList.add("card");
    card.className = "card";
    card.innerHTML = `
        <img src=${product.images[0]} alt=${product.title}>
        <h3>${product.title}</h3>
        <strong>${product.price}</strong>
        <br>
        <button>By now</button>
    `;
    wrapperEl.appendChild(card);
  });
  window.scrollTo(0, wrapperEl.scrollHeight); // scroll yuqoriga olib chiqadi
}

function seeMore() {
  btnEl.setAttribute("disabled", true);
  loadingEl.style.display = "flex";
  offset++;
  fetchData(`${API_URL}/products?limit=${pageCount * offset}`);
}
