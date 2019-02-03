# bAmazon Node.js /  mySQL app #
This the bAmazon store app.  It is powered by two JavaScript files:
* bAmazonCustomer.js - Customer interface
* bamazonManager.js - Manager interface

## Goal ##
The goal of this exercise is to create an interface for a bAmazon customer to purchase an item from the store and for a bAmazon manager to be able to view the entire inventory, view items that are "low stock" which is where the quantity is less than 5 items, add to the quantity of a particular item, and to add additional items to the store.

## Customer Interface ##
Typing "node bamazonCustomer.js" in the CLI will start up the customer interface.  The user will see the entire inventory of the store in a table that was constructed using the cli-table node module.  The user will be prompted to enter the ID of the item to be purchased.  After entering the ID, the user will be prompted to select the number of that item to be purchased.  Once the user enters the number to be purchased, the app will validate the amount requested.  If the amount requested is greater than the amount on hand, a message will be displayed and the transaction is cancelled, otherwise the inventory is updated and the user is prompted to continue.  Selecting "Y" will show the store front again (with the stock updated from the last transaction). Selecting "N" will disconnect from the app.

## Manager Interface ##
Typing "node bamazonManager.js" in the CLI will start up the manager interface.  The manager is prompted to select from the following actions:
* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product

At the end of each of these actions, the user is asked to continue. Selecting "Y" will display the list of actions above.  Selecting "N" will disconnect from the app.

### View Products for Sale ###
This option generates the storefront with a table that displays the fields:  ID, PRODUCT NAME, DEPARTMENT, PRICE QTY.  

### View Low Inventory ###
This option shows all items where the quantity is less than five items.  

### Add to Inventory ### 
This option prompts the the manager to select one of the stocked items from a list.  After an item is selected the manager is prompted to put in the number of items to be added to the inventory.  Once that item has been entered, it is added to the existing amount and the updated table displays.

### Add New Product ### 
This option begins a series of prompts to add a new item to the inventory.  The manager will put in the name of the item, the department, the price, and the quantity of the item being added.  The item is then added to the products table and the new table is displayed.

## Technical Details ##
The bamazon database and products table was created using mySQL.  
The mySql node module was used to create the connection to the database and execute SQL statements against the products table.
The Inquirer node module was used to prompt the user to select courses of action and for data to be added to the products table.
The cli-table node module was used to generate the table displayed in the store front and management reports.

## Outputs ##
Data is displayed in the command line and stored in the products table in the bamazon database.

## Video ##
video demonstrations can be found by clicking the links below.

 [Click HERE for bAmazon customer demo video](https://drive.google.com/open?id=1VV3khu5Dq3e9CaKPMF7vwaqH-dzHV1Fr).
 [Click HERE for bAmazon manager demo video](https://drive.google.com/open?id=1iDrroFUD6gWZOfvRBMNDQTbV10HruKxW).
