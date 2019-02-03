var mySql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//Create database connection object
var connection = mySql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

//Connect to database
connection.connect(function(err) {
  if (err) {
    throw err;
  }
  showMenu();
});

function showMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.menu) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInv();
          break;
        case "Add to Inventory":
          addQty();
          break;
        case "Add New Product":
          addNewProduct();
          break;
      }
    });
}

function viewProducts() {
  //View Stuff
  var queryString = "Select * FROM products";
  connection.query(queryString, function(err, response) {
    buildTable(response);
  });
}
function viewLowInv() {
  //View Low Inventory
  var queryString = "Select * FROM products WHERE stock_quantity < 5";
  connection.query(queryString, function(err, response) {
    buildTable(response);
  });
}
function addQty() {
  //Add qty to existing items
  var queryString = "Select * FROM products";
  var myChoices = [];
  var myIds = [];
  var myAmounts = [];
  connection.query(queryString, function(err, response) {
    for (var i = 0; i < response.length; i++) {
      var x = response[i].product_name;
      myChoices.push(x);
      myIds.push(response[i].item_id);
      myAmounts.push(response[i].stock_quantity);
    }
    inquirer
      .prompt([
        {
          name: "item",
          type: "list",
          message: "Select the item that is changing quantity",
          choices: myChoices
        },
        {
          name: "newQty",
          type: "input",
          message: "Enter the amount to be added.",
          validate: function(val) {
            if (isNaN(val) === false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(function(answers) {
        console.log(answers);
        var myItem = answers.item;
        var myQty = answers.newQty;
        var myId = myIds[myChoices.indexOf(myItem)];
        var myTotal =
          parseInt(myQty) + parseInt(myAmounts[myChoices.indexOf(myItem)]);
        console.log(myItem);
        console.log(myQty);
        var queryString = "UPDATE products SET ? WHERE ?";
        connection.query(
          queryString,
          [{ stock_quantity: myTotal }, { item_id: myId }],
          function(err, resp) {
            viewProducts();
          }
        );
      });
  });
}
function addNewProduct() {
  //Add new item to inventory
  inquirer
    .prompt([
      { name: "product", type: "input", message: "Enter the item name." },
      {
        name: "department",
        type: "input",
        message: "What department?"
      },
      {
        name: "price",
        type: "input",
        message: "Enter the price",
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        name: "qty",
        type: "input",
        message: "Enter the quantity.",
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answers) {
      //update products table
      var queryString = "INSERT INTO products SET ?";
      connection.query(
        queryString,
        {
          product_name: answers.product,
          department: answers.department,
          price: parseFloat(answers.price),
          stock_quantity: parseInt(answers.qty)
        },
        function(err, resp) {
          if (err) {
            throw err;
          }
          viewProducts();
        }
      );
    });
}
function buildTable(x) {
  //Build table
  var table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    },
    head: ["ID", "PRODUCT NAME", "DEPARTMENT", "PRICE", "QTY"],
    colWidths: [5, 52, 32, 10, 5]
  });

  for (var i = 0; i < x.length; i++) {
    //build table
    table.push([
      x[i].item_id,
      x[i].product_name,
      x[i].department,
      x[i].price,
      x[i].stock_quantity
    ]);
  }
  console.log(table.toString());
  keepGoing();
}
function keepGoing() {
  inquirer
    .prompt({
      name: "continue",
      type: "confirm",
      message: "Do you want to continue?"
    })
    .then(function(answer) {
      if (answer.continue) {
        showMenu();
      } else {
        connection.end();
      }
    });
}
