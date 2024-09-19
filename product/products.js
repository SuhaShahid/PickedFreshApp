document.addEventListener("DOMContentLoaded", () => {
  let productsData = [];
  let totalItems = 0;
  let limit = 20;
  let currentPage = 1;
  let cartItems = [];

  loadCartItems();
  fetchCategories(); 

  function getData(searchQuery = "", category = "", page = 1) {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (category) {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    }

    if (searchQuery) {
      url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        totalItems = data.total || data.length;
        productsData = data.products || data;
        getProducts(productsData);
        setupPagination();
      })
      .catch(error => console.error("Error fetching products:", error));
  }
  function fetchCategories() {
    fetch('https://dummyjson.com/products/categories')
      .then(response => response.json())
      .then(categories => {
        const dropdown = document.getElementById("category-dropdown");
        const sidebarDropdown = document.getElementById("category-dropdown-sidebar");
  
        const categoryItems = categories.map(category => `
          <li><a href="#" class="category-link" data-category="${encodeURIComponent(category.slug)}">${category.name}</a></li>
        `).join("");
  
        if (dropdown) dropdown.innerHTML = categoryItems;
        if (sidebarDropdown) sidebarDropdown.innerHTML = categoryItems;
  
        document.querySelectorAll(".category-link").forEach(link =>
          link.addEventListener("click", (event) => {
            event.preventDefault();
            const selectedCategory = event.target.dataset.category;
            getData("", selectedCategory);
            window.history.pushState({}, "", `?category=${selectedCategory}`);
          })
        );
      })
      .catch(error => console.error("Error fetching categories:", error));
  }
  
  function getProducts(data) {
    const boxes = document.querySelector(".boxes");
    let productBoxes = "";

    data.forEach(product => {
      productBoxes += `
        <div class="box">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h3>$${product.price}</h3>
          <h4>${product.title}</h4>
          <h4 class="category-link" data-category="${product.category}">${product.category}</h4>
          <p>${product.description}</p>
          <button class="addToCart" data-id="${product.id}" type="button">Add To Cart</button>
        </div>
      `;
    });

    boxes.innerHTML = productBoxes;

    document.querySelectorAll(".addToCart").forEach(btn =>
      btn.addEventListener("click", addToCart)
    );
  }

  function setupPagination() {
    const pagination = document.getElementById("pagination");
    if (pagination) {
      pagination.innerHTML = '';
      const totalPages = Math.ceil(totalItems / limit);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
          currentPage = i;
          getData(document.getElementById("searchInput").value || "", new URLSearchParams(window.location.search).get('category'), i);
        });

        pagination.appendChild(button);
      }
    }
  }

  function addToCart(event) {
    const productId = event.target.dataset.id;
    const product = productsData.find(item => item.id == productId);

    if (!product) return;

    const existingProduct = cartItems.find(item => item.id == productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateSidebar();
    updateCartIcon();
  }

  function updateSidebar() {
    const cartContainer = document.querySelector(".cartContainer");
    const totalPriceElem = document.getElementById("total");

    if (cartContainer) {
      cartContainer.innerHTML = '';

      cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');
        cartItem.setAttribute('data-id', item.id);

        const img = document.createElement('img');
        img.src = item.thumbnail;
        img.alt = item.title;

        const title = document.createElement('p');
        title.textContent = item.title;

        const quantity = document.createElement('p');
        quantity.classList.add('quantity');
        quantity.textContent = `x${item.quantity}`;

        const price = document.createElement('p');
        price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        cartItem.appendChild(img);
        cartItem.appendChild(title);
        cartItem.appendChild(quantity);
        cartItem.appendChild(price);

        cartContainer.appendChild(cartItem);
      });
    }

    totalPriceElem.textContent = `Total: $${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}`;
  }

  function loadCartItems() {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      cartItems = storedCartItems;
      updateSidebar();
      updateCartIcon();
    }
  }

  function updateCartIcon() {
    const cartValueElem = document.getElementById("cartvalue");
    if (cartValueElem) {
      cartValueElem.textContent = cartItems.length;
    }
  }

  document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value;
    getData(query, new URLSearchParams(window.location.search).get('category'));
  });

  const category = new URLSearchParams(window.location.search).get('category');
  getData("", category);
});
