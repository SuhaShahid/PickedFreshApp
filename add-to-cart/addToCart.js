document.addEventListener("DOMContentLoaded", () => {
     let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
   
     function updateCart() {
       const cartContainer = document.getElementById('cartItems');
       const totalPriceElem = document.getElementById('totalPrice');
     
       cartContainer.innerHTML = ''; 
       let totalPrice = 0;
   
       cartItems.forEach(item => {
         const cartItem = document.createElement('div');
         cartItem.classList.add('cartItem');
     
         const img = document.createElement('img');
         img.src = item.thumbnail;
         img.alt = item.title;
     
         const title = document.createElement('p');
         title.textContent = `${item.title} - $${(item.price * item.quantity).toFixed(2)}  ${item.quantity}`;
     
         cartItem.appendChild(img);
         cartItem.appendChild(title);
         cartContainer.appendChild(cartItem);
     
         totalPrice += item.price * item.quantity;
       });
     
       totalPriceElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
     }
   
     document.getElementById('checkoutButton').addEventListener('click', () => {

    window.location.href = "../home.html"; 
  });

  updateCart();
});
   