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
    },

]).then(function (auth) {


    if (auth.myPassword != "pass") {

        console.log("==============================================");
        console.log("Incorrect password");
        console.log("Verify you password and try again");
        console.log("==============================================");
    }


    else {

        inquirer.prompt([

            {
                type: "list",
                name: "action",
                message: "Hello, how may I assist you today?",
                choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
            },

        ]).then(function (mgmt) {

            if (mgmt.action === "View products for sale") {

                viewProducts();

            } else if (mgmt.action === "View low inventory") {

                viewLowInventory();

            } else if (mgmt.action === "Add to inventory") {

                restockProduct(function (products) {


                    const choicesDis = [];
                    for (var i = 0; i < products.length; i++) {
                        choicesDis.push(products[i].product);

                    }

                    inquirer.prompt([

                        {
                            type: "list",
                            name: "action",
                            message: "Which product are you replenishing today?",
                            choices: choicesDis,
                        },

                    ])

                });

            } else {

                addProduct();

            }

        });
    }
});


function viewLowInventory(cutoff = 51) {

    console.log("Finding low inventory...\n");
    connection.query(`SELECT * FROM products WHERE stock < ${cutoff}`, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });

}

function restockProduct(callback) {
    connection.query(`SELECT product FROM products`, function (err, res) {
        if (err) throw err;

        callback(res);

    });
}









