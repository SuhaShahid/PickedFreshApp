let productsData = [];
let totalItems = 0;

function getData() {
  fetch("https://dummyjson.com/products/category/groceries?limit=10&skip=0")
    .then((res) => res.json())
    .then((data) => {
      totalItems = data.total;
      productsData = data.products;
      console.log(data);
      getPage(productsData);
    })
    .catch((error) => console.error("Error:", error));
}

function getPage(data) {
  let boxes = document.querySelector(".boxes");
  let productBoxes = "";

  for (let i = 0; i < data.length; i++) {
    let product = data[i];
    productBoxes += `
      <div class="box">
        <img src="${product.thumbnail}" />
        <h3>$${product.price}</h3>
        <h4>${product.title}</h4>
        <h4>${product.category}</h4>
        <p>${product.description}</p>
        <button id="addToCart" type="button">Add To Cart</button>
      </div>
    `;
  }

  let bodyContent = `${productBoxes}`;

  boxes.innerHTML = bodyContent;
}

let addToCartBtn = document.getElementById("addToCart");
let cartIcon = document.getElementById("cartIcon");
addToCartBtn.addEventListener("click", () => {
  alert("Added To cart");
});
getData();
