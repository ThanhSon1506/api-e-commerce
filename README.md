# Electronic Store

![Electronic Store Logo](https://fitsmallbusiness.com/wp-content/uploads/2023/02/Screenshot_logomakr_home_decor_logo.jpg)

Electronic Store is an e-commerce project built to provide a convenient and reliable shopping experience for customers. This project uses [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) for the backend, [React](https://reactjs.org/) for the frontend, and [MongoDB](https://www.mongodb.com/) as the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

Before running the installation command, make sure you have MongoDB installed and running on your machine. Also, ensure you have [Node.js](https://nodejs.org/) installed.

#1. Clone the repository:

   ```bash
   git clone https://github.com/ThanhSon1506/api-e-commerce.git

#2. Install package npm:

   ```bash
    npm install 

#3. Setup file .env:
    - Read file config.js in project to config file .env

#4. Run database seder  
    - This command runs when the data you don/'t have or when you want to go back to the previous day/'s data
   ```bash
    npm data:backup

#5. Run start project 
    - This command runs when .env development
   ```bash
    npm run dev

#6. Run build project
    - This command runs when you want to build a project to deliver to a customer
   ```bash
    npm run build

