var MySql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//Create database connection object
var connection = MySql.createConnection({
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
  showInventory();
});

function showInventory() {
  //Show Stuff
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
  var queryString = "Select * FROM products";
  connection.query(queryString, function(err, response) {
    //query stuff
    var x = response;

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
    buyStuff();
  });
}
function buyStuff() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Enter the ID of the item you'd like to purchase.",
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
        message: "Enter how many of those items you'd like to purchase.",
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
      var itemID = parseInt(answers.id);
      var itemQty = parseInt(answers.qty);

      var queryString = "SELECT * FROM products WHERE ?";

      connection.query(queryString, { item_id: itemID }, function(
        err,
        response
      ) {
        if (err) {
          throw err;
        }

        var itemPrice = response[0].price;

        if (itemQty > response[0].stock_quantity) {
          console.log("Insufficient quantity");
          return keepGoing();
        } else {
          var newInvQty = response[0].stock_quantity - itemQty;
          var queryString2 = "UPDATE products SET ? WHERE ?";
          connection.query(
            queryString2,
            [
              {
                stock_quantity: newInvQty
              },
              {
                item_id: itemID
              }
            ],
            function(err, response) {
              if (err) {
                throw err;
              }
              var total = itemQty * itemPrice;
              console.log("You spent $" + total);
              keepGoing();
            }
          );
        }
      });
    });
}

function keepGoing() {
  inquirer
    .prompt({
      name: "continue",
      type: "confirm",
      message: "Do you want to keep shopping?"
    })
    .then(function(answer) {
      if (answer.continue) {
        showInventory();
      } else {
        connection.end();
      }
    });
}
