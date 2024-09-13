let productsData = [];
let totalItems = 0;
let limit = 20;
let currentPage = 1;
let cartCount = 0;

function getData(searchQuery, category, page = 1) {
  let skip = (page - 1) * limit;
  let url = `https://dummyjson.com/products${category ? `/category/${category}` : ""}?limit=${limit}&skip=${skip}`;
  if (searchQuery) {
    url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      totalItems = data.total;
      productsData = data.products;
      getPage(productsData);
      setupPagination();
    })
    .catch((error) => console.error("Error:", error));
}

function getPage(data) {
  let boxes = document.querySelector(".boxes");
  let productBoxes = "";

  data.forEach((product) => {
    productBoxes += `
          <div class="box">
            <img src="${product.thumbnail}" />
            <h3>$${product.price}</h3>
            <h4>${product.title}</h4>
            <h4 class="category-link" data-category="${product.category}">${product.category}</h4>
            <p>${product.description}</p>
            <button class="addToCart" data-id="${product.id}" type="button">Add To Cart</button>
          </div>
        `;
  });

  boxes.innerHTML = productBoxes;
  
  document
    .querySelectorAll(".addToCart")
    .forEach((btn) => btn.addEventListener("click", addToCart));
  
  document.querySelectorAll(".category-link").forEach((link) =>
    link.addEventListener("click", (event) => {
      const category = event.target.dataset.category;
      getData("", category);
    })
  );
}

function setupPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalItems / limit);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      getData(document.getElementById("searchInput")?.value || "", "", i);
    });

    pagination.appendChild(button);
  }
}

function addToCart(event) {
  let productId = event.target.dataset.id;
  cartCount++; 
  document.getElementById("cartvalue").textContent = cartCount; // Update cart display
  console.log(`Product with ID ${productId} added to cart.`);
}

let searchIcon = document.getElementById("searchIcon");
searchIcon.addEventListener("click", () => {
  const searchContainer = document.getElementById("searchContainer");
  if (!document.getElementById("searchInput")) {
    let searchInput =
    document.createElement("input");
    searchInput.type = "search";
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search for products...";
    searchContainer.appendChild(searchInput);

    searchInput.addEventListener("input", (event) => {
      const searchQuery = event.target.value;
      currentPage = 1;
      getData(searchQuery);
    });
  }
});

getData(); 