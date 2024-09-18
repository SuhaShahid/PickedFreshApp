function toggleMenu() {
  document.getElementById("navbar").classList.toggle("show");
}

function fetchCategories() {
  fetch('https://dummyjson.com/products/categories')
    .then(response => response.json())
    .then(categories => {
      const dropdown = document.getElementById("category-dropdown");
      dropdown.innerHTML = categories.map(category => `
        <li><a href="../product/products.html?category=${encodeURIComponent(category.slug)}">${category.name}</a></li>
      `).join("");
    })
    .catch(error => console.error("Error fetching categories:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
});
