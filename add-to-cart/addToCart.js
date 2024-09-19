document.addEventListener("DOMContentLoaded", () => {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  function updateCart() {
    const cartContainer = document.getElementById("cartItems");
    const totalPriceElem = document.getElementById("totalPrice");

    cartContainer.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cartItem");

      const img = document.createElement("img");
      img.src = item.thumbnail;
      img.alt = item.title;

      const title = document.createElement("p");
      title.textContent = `${item.title}`;

      const price = document.createElement("p");
      price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

      const quantity = document.createElement("p");
      quantity.textContent = `Quantity: ${item.quantity}`;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("removeButton");
      removeButton.addEventListener("click", () => {
        removeFromCart(item.id);
      });

      cartItem.appendChild(img);
      cartItem.appendChild(title);
      cartItem.appendChild(price);
      cartItem.appendChild(quantity);
      cartItem.appendChild(removeButton);
      cartContainer.appendChild(cartItem);

      totalPrice += item.price * item.quantity;
    });

    totalPriceElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }

  function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  }

  document.getElementById("checkoutButton").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });

  updateCart();
});
