A backend REST API for a restaurant order management system built with Express.js, PostgreSQL, Knex.js, and Socket.io. It supports customer login/registration, restaurant-side order handling, real-time order updates via WebSockets, and secure access using JWT-based authentication.

🔗 Repository :
https://github.com/Asimsam08/restro-be.git

 Tech Stack :
Express.js – Node.js web framework

PostgreSQL – Relational database

Knex.js – SQL query builder

Socket.io – Real-time bidirectional communication

JWT – Secure role-based authentication

dotenv – Environment variable management

CORS – Cross-Origin Resource Sharing

bcryptjs – Password hashing

pg – PostgreSQL driver for Node.js


 Features =>
 JWT authentication for both customers and restaurants

Role-based login system (shared login endpoint)

 Customer routes for:

Registration

Login

Order tracking

Receive real-time updates via WebSocket


Restaurant dashboard routes:

View new orders

Update order statuses

Receive real-time updates via WebSocket

Real-time order status updates for both customer & restaurant using Socket.io

Clone the repo=>

git clone https://github.com/Asimsam08/restro-be.git
cd restro-be

npm install

Create environment config =>
You will need to create a .env file at the root.
To request environment variable setup, contact the project maintainer.

Run the project
npm run build   
npm start     

Or for development:

npm run dev     # Starts with nodemon + ts-node