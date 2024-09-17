document.addEventListener("DOMContentLoaded", () => {
  let productsData = [];
  let totalItems = 0;
  let limit = 20;
  let currentPage = 1;
  let cartCount = 0;
  let cartItems = [];
  let totalPrice = 0;

  function getData(searchQuery, category, page = 1) {
    let skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products${
      category ? `/category/${category}` : ""
    }?limit=${limit}&skip=${skip}`;
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
        currentPage = 1;
        getData("", category);
      })
    );
  }

  function setupPagination() {
    const pagination = document.getElementById("pagination");
    if (pagination) {
      pagination.innerHTML = "";
      const totalPages = Math.ceil(totalItems / limit);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
          currentPage = i;
          getData(document.getElementById("searchInput")?.value || "", "", i);
        });

        pagination.appendChild(button);
      }
    }
  }

  const cartIcon = document.getElementById("cartIcon");
  const sidebar = document.querySelector(".sideBar");

  if (cartIcon && sidebar) {
    cartIcon.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      updateSidebar();
    });

    const closeBtn = document.createElement("span");
    closeBtn.id = "closeSidebar";
    closeBtn.innerHTML = "&times;";
    sidebar.insertBefore(closeBtn, sidebar.firstChild);

    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }
  function addToCart(event) {
    let productId = event.target.dataset.id;
    let product = productsData.find((item) => item.id == productId);
  
    let existingProduct = cartItems.find((item) => item.id == productId);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateSidebar();
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
  
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }
  

  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      window.location.href = "../add-to-cart/addToCart.html";
    });
  }

  const searchContainer= document.getElementById("searchContainer");
  
      if (!document.getElementById("searchInput")) {
        let searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.id = "searchInput";
        searchInput.placeholder = "Search for products...";
        searchContainer.appendChild(searchInput);

        searchInput.addEventListener("input", (event) => {
          event.preventDefault();
          const searchQuery = event.target.value;
          currentPage = 1;
          getData(searchQuery);
        });
      }
    ;
    getData();
});
