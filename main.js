let light = document.getElementById("light")
let dark = document.getElementById("dark")
let title = document.getElementById("title")
let price = document.getElementById("price")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let count = document.getElementById("count")
let Categoris = document.getElementById("Categoris")
let creat = document.getElementById("creat")
let mood = 'creat'


//
function calcul() {
    if (price.value != '' && price.value >= 0) {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
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

function changeStyle(newStylePath) {
    const stylesheet = document.getElementById("main-stylesheet");
    stylesheet.setAttribute("href", newStylePath);
}
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

let datapro;
if (localStorage.products != null) {
    datapro = JSON.parse(localStorage.products)
}
else {
    datapro = [];
}

creat.onclick = function () {
    data = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        count: count.value,
        category: Categoris.value.toLowerCase(),
        total: total.innerHTML,
        discount: discount.value,
        ads: ads.value
    }
    if (title.value != "" && price.value != "" && Categoris.value != "" && count.value <= 100) {
        if (mood == 'creat') {
            if (data.count > 1) {
                for (let i = 0; i <= data.count; i++) {
                    datapro.push(data)
                }
            }
            else {
                datapro.push(data)
            }
        } else {
            datapro[tmp] = data
            mood = "creat"
            creat.innerHTML = "+ CREAT"
        }
    }


    localStorage.setItem('products', JSON.stringify(datapro))
    clear()
    read()
}

function clear() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    count.value = '';
    total.innerHTML = '';
    Categoris.value = '';
    discount.value = ''
}


function read() {
    calcul()
    let table = '';
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

    document.getElementById("tbody").innerHTML = table;
}
read()
function delet_data(i) {
    datapro.splice(i, 1)
    localStorage.products = JSON.stringify(datapro)
    read()
}
function delet_all() {
    alert("are you sure")
    datapro.splice(0)
    localStorage.clear()
    read()
}

function update_data(i) {
    title.value = datapro[i].title
    price.value = datapro[i].price
    taxes.value = datapro[i].taxes
    ads.value = datapro[i].ads
    discount.value = datapro[i].discount
    Categoris.value = datapro[i].category
    count.style.display = "none"
    calcul()
    creat.innerHTML = "+ UPDATE"
    mood = "update"
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth'
    })
}
let searchmood = 'title';

function getsearchmmod(id) {
    let search = document.getElementById("search")
    if (id == 'SearchTitle') {
        searchmood = 'title';
        search.placeholder = 'search by title'
    }
    else {
        searchmood = 'category'
        search.placeholder = 'search by category'
    }
    search.focus()
    search.value = ""
    read()
}

function searchdata(value) {
    let table = ''
    if (searchmood == 'title') {
        for (let i = 0; i < datapro.length; i++) {
            if (datapro[i].title.includes(value.toLowerCase())) {
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
    else {
        for (let i = 0; i < datapro.length; i++) {
            if (datapro[i].category.includes(value.toLowerCase())) {
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
    document.getElementById("tbody").innerHTML = table;
}