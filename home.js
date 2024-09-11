let productsData = [];
let totalItems = 0;

function getData() {
  fetch("https://dummyjson.com/products/category/groceries?limit=10")
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
        <a href="product/products.html"><button type="button">Buy</button></a>
      </div>
    `;
  }

  let bodyContent = `${productBoxes}`;

  boxes.innerHTML = bodyContent;
}

getData();
