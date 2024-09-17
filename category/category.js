let categoriesData = [];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function getData(categoryId = "") {
  let url = categoryId
    ? `https://dummyjson.com/products/category/${categoryId}`
    : `https://dummyjson.com/products/categories`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      categoriesData = categoryId ? data.products : data;
      getPage(categoriesData, categoryId !== "");
    })
    .catch((error) => console.error("Error:", error));
}

function getPage(data, isProductView = false) {
  let boxes = document.querySelector(".boxes");
  let contentBoxes = "";

  if (isProductView) {
    for (let i = 0; i < data.length; i++) {
      let product = data[i];
      contentBoxes += `
        <div class="box">
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <button data-id="${product.id}">Add to Cart</button>
        </div>
      `;
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      let category = data[i];
      contentBoxes += `
        <div class="box" data-category="${category.slug}">
            <h3>${category.name}</h3>
        </div>
      `;
    }
  }

  boxes.innerHTML = contentBoxes;

  if (!isProductView) {
    document.querySelectorAll(".box").forEach((box) => {
      box.addEventListener("click", (event) => {
        let categoryId = event.currentTarget.dataset.category;
        getData(categoryId);
      });
    });
  } else {
    document.querySelectorAll(".box button").forEach((button) => {
      button.addEventListener("click", (event) => {
        let productId = event.currentTarget.dataset.id;
        addToCart(productId);
      });
    });
  }
}

function addToCart(productId) {
  const product = categoriesData.find(item => item.id == productId);

  if (product) {
    const existingItem = cartItems.find(item => item.id == productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      product.quantity = 1;
      cartItems.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartValue();
    toggleCartSidebar(); // Update the sidebar immediately
  }
}

function updateCartValue() {
  const cartValueElem = document.getElementById('cartvalue');
  if (cartValueElem) {
    cartValueElem.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    console.error('Cart value element not found!');
  }
}

function toggleCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const cartContent = document.getElementById('cartItems');
  const totalPriceElem = document.getElementById('totalPrice');

  if (!sidebar || !cartContent || !totalPriceElem) {
    console.error('Sidebar or cart elements not found!');
    return;
  }

  sidebar.classList.toggle('active');
  cartContent.innerHTML = '';

  cartItems.forEach(item => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cartItem');

    const itemImage = document.createElement('img');
    itemImage.src = item.thumbnail;
    itemImage.alt = item.title;

    const itemText = document.createElement('p');
    itemText.textContent = `${item.title} - $${(item.price * item.quantity).toFixed(2)} x ${item.quantity}`;

    cartItemDiv.appendChild(itemImage);
    cartItemDiv.appendChild(itemText);
    cartContent.appendChild(cartItemDiv);
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPriceElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

document.getElementById('closeSidebar').addEventListener('click', () => {
  document.getElementById('cartSidebar').classList.remove('active');
});

document.getElementById('cartIcon').addEventListener('click', toggleCartSidebar);

document.getElementById('checkoutButton').addEventListener('click', () => {
  window.location.href = "../add-to-cart/addToCart.html";
});

getData();
updateCartValue();
