'use strict';

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});

console.log("Bamazon Manager \n");

inquirer.prompt([

    {
        type: "password",
        name: "myPassword",
        message: "Please input your password to continue."
    }

]).then(function (auth) {


    if (auth.myPassword != "pass") {

        console.log("==============================================");
        console.log("Incorrect password");
        console.log("Verify you password and try again");
        console.log("==============================================");
    }
    else {

        runMainLoop();

    }
});


function viewLowInventory(cutoff = 51) {

    console.log("\nFinding low inventory...\n");
    connection.query(`SELECT * FROM products WHERE stock < ${cutoff}`, function (err, res) {
        if (err) throw err;
        console.log(`These items have less than ${cutoff} units in stock. Time to restock!`);
        displayProducts(res);

    });

}

function restockProduct(callback) {
    connection.query(`SELECT product FROM products`, function (err, res) {
        if (err) throw err;

        callback(res);

    });
}

function viewProducts() {
    console.log("\nSelecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        displayProducts(res);
        return (res);


    });
}

function searchStockByName(name, callback) {
    connection.query(`SELECT stock FROM products WHERE product = "${name}"`, function (err, res) {
        if (err) throw err;
        callback(res[0]);

    });

}

//function addProduct(res) {
//    console.log("Inserting a new product...\n");
//    const query = connection.query(
//        "INSERT INTO products SET ?",
//        {
//            product: res.product,
//            department: res.department,
//            price: res.price,
//            stock: res.stock,
//            sale: 0,
//            sale_price: null
//        },
//        function (err, res) {
//            console.log(res.affectedRows + " product inserted!\n");
//             Call updateProduct AFTER the INSERT completes
//        });

//}


function getDepartmentChoices(callback) {
    connection.query(`SELECT DISTINCT department FROM products`, function (err, res) {
        if (err) throw err;
        callback(res);

    });
}


function displayProducts(inv) {
    console.log("-----------------------------------------------------------------------------------");
    for (var i = 0; i < inv.length; i++) {
        console.log(`\nProduct Num: ${inv[i].id} | Product: ${inv[i].product} | Price: $${inv[i].price} | In Stock: ${inv[i].stock}`);
    }

    console.log("\n-----------------------------------------------------------------------------------");

}

function runMainLoop() {


    inquirer.prompt([

        {
            type: "list",
            name: "action",
            message: "Hello, how may I assist you today?",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
        }

    ]).then(function (mgmt) {

        if (mgmt.action === "View products for sale") {

            viewProducts();

        }
        else if (mgmt.action === "View low inventory") {

            viewLowInventory();

        }
        else if (mgmt.action === "Add to inventory") {

            restockProduct(function (products) {

                const choicesDis = [];
                for (var i = 0; i < products.length; i++) {
                    choicesDis.push(products[i].product);
                }

                inquirer.prompt([

                    {
                        type: "list",
                        name: "product",
                        message: "Which product are you replenishing today?",
                        choices: choicesDis
                    },

                    {
                        type: "input",
                        name: "quantity",
                        message: "How many units are you adding?",
                        choices: choicesDis
                    }

                ]).then(function (response) {

                    console.log(response.product);

                    searchStockByName(response.product, function (res) {

                        console.log(`\nAdding ${response.quantity} ${response.product}(s)...\n`);
                        const query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock: res.stock + parseInt(response.quantity)
                                },
                                {
                                    product: response.product
                                }
                            ],
                            function (err, res) {
                                console.log(res.affectedRows + " products updated!\n");
                            }
                        );
                    });
                });

            });
        }
        else {

            getDepartmentChoices(function (departments) {

                const choicesDis = [];
                for (var i = 0; i < departments.length; i++) {
                    choicesDis.push(departments[i].department);
                }

                inquirer.prompt([

                    {
                        type: "input",
                        name: "product",
                        message: "What product are we adding today?"
                    },

                    {
                        type: "list",
                        name: "department",
                        message: "Which department will this product be?",
                        choices: choicesDis
                    },

                    {
                        type: "input",
                        name: "price",
                        message: "What will be the price of our new product?",
                    },

                    {
                        type: "input",
                        name: "stock",
                        message: "How much inventory will we begin with?"
                    }

                ]).then(function (res) {
                    console.log("\nInserting a new product...\n");
                    const query = connection.query(
                        "INSERT INTO products SET ?",
                        {
                            product: res.product,
                            department: res.department,
                            price: res.price,
                            stock: res.stock,
                            sale: 0,
                            sale_price: null
                        },
                        function (err, res) {
                            console.log(res.affectedRows + " product inserted!\n");
                            // Call updateProduct AFTER the INSERT completes
                        });
                });

            });
        }
    });
}




