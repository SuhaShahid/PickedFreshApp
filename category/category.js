let categoriesData = [];

function getData(categoryId) {
  let url=  `https://dummyjson.com/products/categories`
  if(categoryId)
    url = `https://dummyjson.com/products${
      category ? `/category/${category}` : ""
    }`
  fetch(url)
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
          <h3 data-category=${category.slug}>${category.name}</h3>
      </div>
    `;
  }

  boxes.innerHTML = categoryBoxes;
  document.querySelector('.box').addEventListener(('click'),(event)=>{
    let categoryId= event.target.dataset.category
    getData(categoryId)
  })
}

getData();
