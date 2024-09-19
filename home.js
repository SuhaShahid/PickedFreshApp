document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  document.getElementById('menu-icon').addEventListener('click', toggleSidebar);
  document.querySelector('.close-btn').addEventListener('click', toggleSidebar);

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('category-link')) {
      const category = event.target.dataset.category;
      window.location.href = `../PickedFreshApp/product/products.html?category=${encodeURIComponent(category)}`;
    }
  });
});

function fetchCategories() {
  fetch('https://dummyjson.com/products/categories')
    .then(response => response.json())
    .then(categories => {
      const dropdown = document.getElementById("category-dropdown");
      const sidebarDropdown = document.getElementById("category-dropdown-sidebar");

      const categoryItems = categories.map(category => `
        <li><a href="#" class="category-link" data-category="${encodeURIComponent(category.slug)}">${category.name}</a></li>
      `).join("");

      dropdown.innerHTML = categoryItems;
      sidebarDropdown.innerHTML = categoryItems;
    })
    .catch(error => console.error("Error fetching categories:", error));
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}
