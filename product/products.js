fetch("https://dummyjson.com/products/category/groceries")
  .then((res) => res.json())
  .then(console.log);
