# Expense Sharing Application - Backend

A production-ready Node.js + Express backend for an expense sharing application (like Splitwise) with strict MVC architecture.

## Features

✅ User Management (create, retrieve)
✅ Group Management (create, add members)
✅ Expense Management with 3 split types:

-  EQUAL: divide equally among group members
-  EXACT: specify exact amounts per person
-  PERCENT: divide by percentage (must sum to 100)
   ✅ Automatic Balance Tracking (who owes whom)
   ✅ Balance Settlement system

## Tech Stack

-  **Runtime:** Node.js
-  **Framework:** Express.js
-  **Database:** MongoDB with Mongoose
-  **Architecture:** Strict MVC pattern

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── userController.js
│   ├── groupController.js
│   ├── expenseController.js
│   └── balanceController.js
├── middlewares/
│   ├── errorHandler.js
│   └── asyncHandler.js
├── models/
│   ├── User.js
│   ├── Group.js
│   ├── Expense.js
│   └── Balance.js
├── routes/
│   ├── userRoutes.js
│   ├── groupRoutes.js
│   ├── expenseRoutes.js
│   └── balanceRoutes.js
├── server.js              # Main entry point
├── package.json
├── .env.example
└── .gitignore
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and port

5. Start the server:

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Users

-  `POST /api/users` - Create a new user
-  `GET /api/users/:id` - Get user details

### Groups

-  `POST /api/groups` - Create a new group
-  `POST /api/groups/:groupId/add-member` - Add member to group

### Expenses

-  `POST /api/expenses` - Add expense to a group

### Balances

-  `GET /api/balances/:userId` - Get user's balance summary
-  `POST /api/balances/settle` - Settle balance between two users

## Request Examples

### Create User

```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Create Group

```json
POST /api/groups
{
  "groupName": "Trip to Vegas",
  "createdBy": "user_id_here",
  "members": ["user_id_1", "user_id_2"]
}
```

### Add Expense (EQUAL split)

```json
POST /api/expenses
{
  "description": "Dinner at restaurant",
  "totalAmount": 300,
  "paidBy": "user_id_1",
  "groupId": "group_id_here",
  "splitType": "EQUAL",
  "splitDetails": {
    "user_id_1": 0,
    "user_id_2": 0,
    "user_id_3": 0
  }
}
```

### Add Expense (EXACT split)

```json
POST /api/expenses
{
  "description": "Gas",
  "totalAmount": 100,
  "paidBy": "user_id_1",
  "groupId": "group_id_here",
  "splitType": "EXACT",
  "splitDetails": {
    "user_id_1": 60,
    "user_id_2": 40
  }
}
```

### Add Expense (PERCENT split)

```json
POST /api/expenses
{
  "description": "Hotel",
  "totalAmount": 500,
  "paidBy": "user_id_1",
  "groupId": "group_id_here",
  "splitType": "PERCENT",
  "splitDetails": {
    "user_id_1": 50,
    "user_id_2": 30,
    "user_id_3": 20
  }
}
```

### Get Balances

```json
GET /api/balances/user_id_here
```

Response:

```json
{
   "success": true,
   "data": {
      "userId": "user_id_here",
      "balances": {
         "John": 500,
         "Jane": -200
      },
      "summary": {
         "totalOwing": 500,
         "totalOwed": 200,
         "netBalance": -300
      }
   }
}
```

### Settle Balance

```json
POST /api/balances/settle
{
  "userId": "user_id_1",
  "otherUserId": "user_id_2",
  "amount": 100
}
```

## Architecture Notes

### MVC Pattern

-  **Models:** Mongoose schemas only (User, Group, Expense, Balance)
-  **Controllers:** Business logic, validation, error handling
-  **Routes:** Endpoint definitions only
-  **Middlewares:** Cross-cutting concerns (error handling, async wrapping)

### Error Handling

-  Custom error objects with `statusCode` and `message`
-  Global error handler middleware catches all errors
-  AsyncHandler wrapper prevents unhandled promise rejections

### Balance Tracking

-  Automatically updated when expenses are added
-  Negative balance = user is owed money
-  Positive balance = user owes money
-  Settlement endpoint reduces balances

## Running the Server

Make sure MongoDB is running, then:

```bash
npm run dev
```

Server will start on `http://localhost:5000`

Check health: `GET http://localhost:5000/health`
