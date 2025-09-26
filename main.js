/**
 *  Product Management System - JavaScript Code
 *  
 *  This code implements a simple product
 management system with features to:
 *  - Add new products manually or from an external API.
 *  - Calculate total price based on price, taxes, ads, and discount.
 *  - Switch between light and dark mode.
 *  - Store product data in local storage.
 *  - Display, update, and delete products.
 *  - Search for products by title or category.

 */

// Global Variables
let mood = 'creat'; // Current mode: 'creat' for creating new products, 'update' for updating existing products.
let tmp; // Global variable to store the index of the product being updated.
// DOM Element References
let light = document.getElementById("light");
let dark = document.getElementById("dark");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let Categoris = document.getElementById("Categoris");
let creat = document.getElementById("creat");

// ----------------------------------------------------------------------------
// API Integration Functions
// ----------------------------------------------------------------------------

/**
 * Fetches data from an API using the provided URL.
 *
 * @param {string} url - The URL of the API endpoint.
 * @returns {Promise<object|null>} - A promise that resolves to the fetched data (as a JavaScript object) 
 *                                   or null if an error occurred.
 */
async function fetchDataFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return null;
  }
}

/**
 * Fetches products from your JSON file on GitHub and adds them to the `datapro` array.
 */
async function addProductsFromAPI() {
  // Correct Raw URL for your js.json file
  const apiUrl = "https://raw.githubusercontent.com/abderrahmane-laourf/json-management-pruducts/main/js.json";

  const apiProducts = await fetchDataFromAPI(apiUrl);

  if (apiProducts) {
    // Data mapping: Your JSON is an array directly, so no need to access .products
    apiProducts.forEach(product => {
      const apiData = {
        // Map fields correctly based on your js.json structure
        title: product.title.toLowerCase(),
        price: product.price,
        taxes: product.taxes,
        count: product.count,
        category: product.category.toLowerCase(),
        total: product.total,
        discount: product.discount,
        ads: product.ads
      };
      datapro.push(apiData);
    });

    localStorage.setItem('products', JSON.stringify(datapro));
    read(); // Update the display after adding products
  } else {
    console.error("Failed to fetch or parse API data.");
  }
}

// Add a button to the HTML to trigger the API data fetching process
const addApiDataButton = document.createElement("button");
addApiDataButton.style.backgroundColor = "green"
addApiDataButton.textContent = "Add Products from API";
addApiDataButton.onclick = addProductsFromAPI;
document.body.appendChild(addApiDataButton); // Append to the document body

// ----------------------------------------------------------------------------
// Calculation and Styling Functions
// ----------------------------------------------------------------------------

/**
 * Calculates the total price of a product based on its price, taxes, ads, and discount.
 * Updates the 'total' element's innerHTML and background color accordingly.
 */
function calcul() {
  if (price.value != '' && price.value >= 0) {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = result;
    // Change background color based on the result
    if (result >= 0) {
      total.style.backgroundColor = "green";
    } else {
      total.style.backgroundColor = "red";
    }
  } else {
    total.innerHTML = '';
    total.style.backgroundColor = "red";
  }
}

/**
 * Changes the stylesheet of the page to switch between light and dark modes.
 *
 * @param {string} newStylePath - The path to the new CSS stylesheet.
 */
function changeStyle(newStylePath) {
  const stylesheet = document.getElementById("main-stylesheet");
  stylesheet.setAttribute("href", newStylePath);
}

// Event listeners for light/dark mode buttons
light.onclick = function () {
  changeStyle('/light_mode.css');
  light.classList.add("hidden");
  dark.classList.remove("hidden");
};

dark.onclick = function () {
  changeStyle('/style.css');
  dark.classList.add("hidden");
  light.classList.remove("hidden");
};

// ----------------------------------------------------------------------------
// Data Management Functions (CRUD Operations)
// ----------------------------------------------------------------------------

// Data Storage (using localStorage)
let datapro;
if (localStorage.products != null) {
  datapro = JSON.parse(localStorage.products);
} else {
  datapro = [];
}

/**
 * Creates or updates a product and adds it to the `datapro` array.
 * Also updates the local storage and refreshes the displayed product list.
 */
creat.onclick = function () {
  // Create a new product object
  let data = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    count: count.value,
    category: Categoris.value.toLowerCase(),
    total: total.innerHTML,
    discount: discount.value,
    ads: ads.value,
  };

  // Validate input data
  if (title.value != "" && price.value != "" && Categoris.value != "" && count.value <= 100) {
    // Create or Update based on the current mood
    if (mood == 'creat') {
      // Create multiple products if count is greater than 1
      if (data.count > 1) {
        for (let i = 0; i < data.count; i++) {
          datapro.push(data);
        }
      } else {
        datapro.push(data);
      }
    } else {
      // Update existing product
      datapro[tmp] = data;
      mood = "creat";
      creat.innerHTML = "+ CREAT";
      count.style.display = "block"; // Show the count input field again
    }
    clear(); // Clear input fields after creating/updating
  }

  // Store data in localStorage and update the display
  localStorage.setItem('products', JSON.stringify(datapro));
  read();
};

/**
 * Clears the input fields of the product form.
 */
function clear() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  count.value = '';
  total.innerHTML = '';
  Categoris.value = '';
  discount.value = '';
}

/**
 * Reads product data from the `datapro` array and displays it in an HTML table.
 */
function read() {
  calcul(); // Recalculate total (in case prices were updated)
  let table = '';
  // Build the HTML table rows
  for (let i = 0; i < datapro.length; i++) {
    table += ` 
        <tr>
            <td>${i}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td> 
            <td><button  onclick = "update_data(${i})" id="UPDATE">UPDATE</button></td>
            <td><button onclick = "delet_data(${i})" id="DELETE">DELETE</button></td>
        </tr>`;
  }
  // Update the table body
  document.getElementById("tbody").innerHTML = table;
}

/**
 * Deletes a product from the `datapro` array at the specified index.
 * Updates local storage and refreshes the displayed product list.
 *
 * @param {number} i - The index of the product to delete.
 */
function delet_data(i) {
  datapro.splice(i, 1);
  localStorage.products = JSON.stringify(datapro);
  read();
}

/**
 * Deletes all products from the `datapro` array and clears local storage.
 * Asks for confirmation with an alert before deleting.
 */
function delet_all() {
  alert("are you sure"); // Consider using a more user-friendly confirmation dialog
  datapro.splice(0);
  localStorage.clear();
  read();
}

/**
 * Prepares the form for updating an existing product.
 * Fills the input fields with the product's data and changes the 'mood' to 'update'.
 *
 * @param {number} i - The index of the product to update.
 */
function update_data(i) {
  title.value = datapro[i].title;
  price.value = datapro[i].price;
  taxes.value = datapro[i].taxes;
  ads.value = datapro[i].ads;
  discount.value = datapro[i].discount;
  Categoris.value = datapro[i].category;
  count.style.display = "none"; // Hide the count input field
  calcul();
  creat.innerHTML = "+ UPDATE";
  mood = "update";
  tmp = i; // Store the index of the product being updated
  // Scroll to the top of the page for better user experience
  scroll({
    top: 0,
    behavior: 'smooth',
  });
}

// ----------------------------------------------------------------------------
// Search Functionality
// ----------------------------------------------------------------------------

let searchmood = 'title'; // Current search mode: 'title' or 'category'

/**
 * Sets the search mode to either 'title' or 'category' based on the clicked button's ID.
 * Updates the search input's placeholder accordingly.
 *
 * @param {string} id - The ID of the search mode button ('SearchTitle' or 'SearchCategory').
 */
function getsearchmmod(id) {
  let search = document.getElementById("search");
  if (id == 'SearchTitle') {
    searchmood = 'title';
    search.placeholder = 'search by title';
  } else {
    searchmood = 'category';
    search.placeholder = 'search by category';
  }
  search.focus();
  search.value = "";
  read(); // Refresh the list to clear any previous search results
}

/**
 * Searches for products based on the current `searchmood` and the entered search value.
 * Filters the `datapro` array and displays only the matching products.
 *
 * @param {string} value - The search value entered by the user.
 */
function searchdata(value) {
  let table = '';
  if (searchmood == 'title') {
    // Search by title
    for (let i = 0; i < datapro.length; i++) {
      if (datapro[i].title.includes(value.toLowerCase())) {
        // Add matching products to the table
        table += ` 
                <tr>
                    <td>${i}</td>
                    <td>${datapro[i].title}</td>
                    <td>${datapro[i].price}</td>
                    <td>${datapro[i].taxes}</td>
                    <td>${datapro[i].ads}</td>
                    <td>${datapro[i].discount}</td>
                    <td>${datapro[i].total}</td>
                    <td>${datapro[i].category}</td> 
                    <td><button  onclick = "update_data(${i})" id="UPDATE">UPDATE</button></td>
                    <td><button onclick = "delet_data(${i})" id="DELETE">DELETE</button></td>
                </tr>`;
      }
    }
  } else {
    // Search by category
    for (let i = 0; i < datapro.length; i++) {
      if (datapro[i].category.includes(value.toLowerCase())) {
        // Add matching products to the table
        table += ` 
                    <tr>
                        <td>${i}</td>
                        <td>${datapro[i].title}</td>
                        <td>${datapro[i].price}</td>
                        <td>${datapro[i].taxes}</td>
                        <td>${datapro[i].ads}</td>
                        <td>${datapro[i].discount}</td>
                        <td>${datapro[i].total}</td>
                        <td>${datapro[i].category}</td> 
                        <td><button  onclick = "update_data(${i})" id="UPDATE">UPDATE</button></td>
                        <td><button onclick = "delet_data(${i})" id="DELETE">DELETE</button></td>
                    </tr>`;
      }
    }
  }
  // Update the table body with the search results
  document.getElementById("tbody").innerHTML = table;
}

// Initial display of products when the page loads
read();
