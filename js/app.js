const wrapperEl = document.querySelector(".products__wrapper");
const loadingEl = document.querySelector(".loading");
const btn = document.querySelector(".btn");
const categories__items = document.querySelector(".categories__items");

const API_URL = "https://dummyjson.com";
let offset = 1;
let perPageCount = 4;
let closeButton = 0;
let total;
let ctg;

async function fetchData(api, callback) {
  loadingEl.style.display = "flex";

  const response = await fetch(api);
  try {
    const response = await fetch(api);
    const data = await response.json();
    total = data.total;
    callback(data, total);
  } catch (err) {
    console.error(err);
  } finally {
    loadingEl.style.display = "none";
    btn.removeAttribute("disabled");
  }
}

fetchData(`${API_URL}/products?limit=${perPageCount * offset}`, createCard);
fetchData(`${API_URL}/products/categories`, createCategories);
fetchData(`${API_URL}/products?limit=${perPageCount}`, (data) => {
  total = data.total;
  createCard(data, total);
});

function getByCategory(category) {
  ctg = category;
  offset = 1;
  closeButton = 0;
  btn.style.display = "block";
  const apiUrl =
    category === "all"
      ? `${API_URL}/products?limit=${perPageCount}`
      : `${API_URL}/products/category/${category}?limit=${perPageCount}`;
  fetchData(apiUrl, (data) => {
    total = category === "all" ? data.total : data.products.length;
    createCard(data, total);
  });
}

function createCategories(categories) {
  while (categories__items.firstChild) {
    categories__items.firstChild.remove();
  }

  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.addEventListener("click", () => getByCategory("all"));
  categories__items.appendChild(allButton);

  // Add buttons for each category
  categories.forEach((category) => {
    const categoryBtn = document.createElement("button");
    categoryBtn.textContent = category.slug; // Adjust if `category.slug` is used
    categoryBtn.addEventListener("click", () => getByCategory(category.slug));
    categories__items.appendChild(categoryBtn);
  });
}

function createCard(data, total) {
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
  offset++;
  closeButton += perPageCount;

  const apiUrl =
    ctg === "all" || !ctg
      ? `${API_URL}/products?limit=${perPageCount * offset}`
      : `${API_URL}/products/category/${ctg}?limit=${perPageCount * offset}`;

  fetchData(apiUrl, createCard);

  if (closeButton >= total) {
    btn.style.display = "none";
  }
}
