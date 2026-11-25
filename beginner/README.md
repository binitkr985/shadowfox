# Support Ticket Management API

A simple backend API for submitting and managing customer support tickets. Built using Node.js, Express, and MongoDB as part of a beginner-level Backend Developer internship task.

The API allows users to create tickets, view submitted tickets, retrieve a specific ticket, and update its status.

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **MongoDB** – Database
- **Mongoose** – MongoDB object modeling
- **express-validator** – Request validation
- **dotenv** – Environment variable management
- **cors** – Cross-origin resource sharing

## Features

- Create support tickets
- View all submitted tickets
- Retrieve a ticket using its ID
- Update ticket status
- Validate incoming request data
- Handle invalid requests and missing tickets

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB (local installation or MongoDB Atlas)

### Installation

Clone the repository:

```bash
git clone https://github.com/binitkr985/shadowfox
```

Navigate into the project directory:

```bash
cd beginner
```

Install the dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory. You can use `.env.example` as a reference.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/support-tickets
```

If you're using MongoDB Atlas, replace the MongoDB URI with your Atlas connection string.

### Running the Project

Start the server in development mode:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

The API will be available at:

```text
http://localhost:5000
```

## API Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/tickets`     | Create a new ticket      |
| GET    | `/api/tickets`     | Get all tickets          |
| GET    | `/api/tickets/:id` | Get a ticket by ID       |
| PATCH  | `/api/tickets/:id` | Update a ticket's status |

## Ticket Categories

The following categories are supported:

- `technical`
- `billing`
- `account`
- `general`

## Ticket Statuses

- `open` – Default status when a ticket is created
- `in_progress` – The ticket is currently being worked on
- `resolved` – The issue has been resolved

## Example Requests

### 1. Create a Ticket

**Endpoint**

```http
POST /api/tickets
```

**Request Body**

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "subject": "Login problem",
  "description": "I am unable to login to my account.",
  "category": "account"
}
```

**Successful Response – `201 Created`**

```json
{
  "_id": "6651a2b3c4d5e6f7a8b9c0d1",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "subject": "Login problem",
  "description": "I am unable to login to my account.",
  "category": "account",
  "status": "open",
  "createdAt": "2026-11-25T11:30:00.000Z",
  "__v": 0
}
```

The ticket status is automatically set to `open` when created.

### 2. Get All Tickets

**Endpoint**

```http
GET /api/tickets
```

Returns a list of all tickets stored in the database.

**Successful Response – `200 OK`**

Returns an array of ticket objects.

### 3. Get a Single Ticket

**Endpoint**

```http
GET /api/tickets/:id
```

Replace `:id` with the MongoDB ID of the ticket.

**Successful Response – `200 OK`**

Returns the matching ticket.

If the ticket doesn't exist, the API returns `404 Not Found`.

### 4. Update Ticket Status

**Endpoint**

```http
PATCH /api/tickets/:id
```

**Request Body**

```json
{
  "status": "resolved"
}
```

**Successful Response – `200 OK`**

Returns the updated ticket.

Only the following status values are accepted:

- `open`
- `in_progress`
- `resolved`

## Validation and Error Handling

The API validates incoming data before processing requests.

For example:

- Required fields must be provided when creating a ticket.
- Email addresses must be valid.
- Ticket categories must be supported.
- Status updates must contain a valid status.
- Invalid MongoDB IDs and nonexistent tickets are handled appropriately.

Common HTTP status codes used:

| Status Code | Meaning               |
| ----------- | --------------------- |
| `200`       | Request successful    |
| `201`       | Ticket created        |
| `400`       | Invalid request data  |
| `404`       | Ticket not found      |
| `500`       | Internal server error |

## Testing

The API can be tested using Postman.

Test the following operations:

- Create a ticket with valid data
- Create a ticket with invalid or missing data
- Retrieve all tickets
- Retrieve a ticket by ID
- Try retrieving a nonexistent ticket
- Update a ticket status
- Try updating a ticket with an invalid status

## Project Purpose

This project was built to practice backend fundamentals such as REST API design, database integration, request validation, error handling, and basic CRUD operations using Node.js and MongoDB.
