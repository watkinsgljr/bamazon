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
console.log("\n------------------------------------------------------------------------------------------------------------\n");
console.log("\nWELCOME TO BAMAZON STORE, THE BEST COMMAND LINE STORE IN ALL THE WEB. TAKE A LOOK AT OUR PRODUCTS BELOW!!\n")
console.log("\n------------------------------------------------------------------------------------------------------------");
readItems();
let shoppingCart = [];
takeCustomerOrder();






function readItems() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        displayProducts(res);
        
    });
}

function displayProducts(inv) {
    for (var i = 0; i < inv.length; i++) {
        console.log(`\nProduct Num: ${inv[i].id} | Product: ${inv[i].product} | Price: $${inv[i].price}`);
    }    

}

function searchInvById(id, callback) {
    console.log("Finding item...\n");
    connection.query(`\nSELECT * FROM products WHERE id = ${id}`, function (err, res) {
        if (err) throw err;
        
        callback(res[0]);
      
    });

}

function takeCustomerOrder() {


    inquirer.prompt([

        {
            type: "input",
            name: "itemId",
            message: "Select an item by id that you would like to purchase?"
        },

        {
            type: "input",
            name: "quantity",
            message: "How many would you like to purchase?",
        },

    ]).then(function (order) {

        searchInvById(order.itemId, function (customerOrder) {


            if (order.quantity <= customerOrder.stock) {
                let items = 0;
                for (var i = 0; i < order.quantity; i++) {
                    addToCart(customerOrder);
                    items += 1;
                }
                console.log("\n-----------------------------------------------------------------------------------");
                console.log(`\n ${items} items added to your cart!\n`);
                console.log("\n-----------------------------------------------------------------------------------\n");
                inquirer.prompt([

                    {
                        type: "list",
                        name: "action",
                        message: "What would you like to do next?",
                        choices: ["CONTINUE SHOPPING", "CHECKOUT"]
                    },

                ]).then(function (next) {

                    if (next.action === "CONTINUE SHOPPING") {

                        takeCustomerOrder();


                    } else if (next.action === "CHECKOUT") {

                        checkout(shoppingCart);
                    }

                });

            } else {
                console.log(`\nI'm sorry but you orderd ${order.quantity} ${customerOrder.product} but we have ${customerOrder.stock} in stock. Try placing a different order.`);
                takeCustomerOrder();


            };
        });


        });

}

function addToCart(order) {
    shoppingCart.push(order);


}

function checkout(cart) {
    let cost = 0;
    for (var i = 0; i < cart.length; i++) {
        console.log(`${cart[i].product} | Price: $${cart[i].price} \n`);
        cost += cart[i].price;
    }

    const salesTax = cost * .07;
    const totalCost = salesTax + cost;
    console.log(`\nTotal Before Tax: $${cost} \n Sales Tax: $${salesTax} \n Total: $${totalCost} \n \n \n`);

    inquirer.prompt([

        {
            type: "list",
            name: "confirm",
            message: "Are you sure you want to finalize your order?",
            choices: ["Yes", "No, I need to add a new order", "Exit"]
        },


    ]).then(function (next) {

        if (next.confirm === "Yes") {
            console.log("\n-----------------------------------------------------------------------------------");
            console.log("Thank you for shopping with Bamazon. Your order will arive in 2-3 business days!")
            console.log("\n-----------------------------------------------------------------------------------");
            connection.end();


        } else if (next.confirm === "No, I need to add a new order") {

            takeCustomerOrder();

        } else {
            console.log("\n-----------------------------------------------------------------------------------");
            console.log("Good bye!");
            console.log("\n-----------------------------------------------------------------------------------");
            connection.end();

        }
    });
}
