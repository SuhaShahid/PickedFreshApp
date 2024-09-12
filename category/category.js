let categoriesData = [];

function getData() {
  fetch("https://dummyjson.com/products/categories")
    .then((res) => res.json())
    .then((data) => {
      categoriesData = data; 
      console.log(categoriesData);
      getPage(categoriesData);
    })
    .catch((error) => console.error("Error:", error));
}

function getPage(data) {
  let boxes = document.querySelector(".boxes");
  let categoryBoxes = "";

  for (let i = 0; i < data.length; i++) {
    let category = data[i];
    categoryBoxes += `
      <div class="box">
          <h3>${category.name}</h3>
      </div>
    `;
  }

  boxes.innerHTML = categoryBoxes;
}

getData();
