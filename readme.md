# Task Management API

A simple REST API built using **Node.js**, the built-in HTTP module, and **SQLite**. This project supports CRUD operations (Create, Read, Update, and Delete) for managing tasks.

## Features

- Retrieve all tasks
- Retrieve a task by ID
- Create a new task
- Update an existing task
- Delete a task
- Store task data in an SQLite database
- Automatically create the database table if it doesn't exist

## Tech Stack

- **Node.js** — JavaScript runtime
- **HTTP module** — Handles HTTP requests and responses
- **SQLite** — Lightweight relational database
- **sqlite3** — Node.js SQLite library

## Project Structure

```text
tasks-api/
├── node_modules/
├── server.js
├── tasks.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

- `server.js` — Contains the API routes and database operations.
- `tasks.db` — SQLite database, generated when the application runs.
- `package.json` — Project metadata and dependencies.
- `.gitignore` — Specifies files Git should ignore.
- `README.md` — Project documentation.

*Note: `node_modules/` and `tasks.db` are local files and should generally be excluded from Git. The filename `server.js` is an example; use your actual server filename if different.*

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/tasks-api.git
cd tasks-api
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install dependencies

```bash
npm install
```

If you haven't installed SQLite's Node.js package yet, run:

```bash
npm install sqlite3
```

### 3. Configure ES modules

This project uses `import` statements. Ensure your `package.json` includes:

```json
"type": "module"
```

You can also add a start script:

```json
"scripts": {
  "start": "node server.js"
}
```

Keep the existing dependencies in your `package.json`. If your server file has a different name, update the start command accordingly.

### 4. Start the server

```bash
npm start
```

The server runs at:

`http://localhost:3000`

The application creates `tasks.db` and the `TASKS` table when it starts, if they do not already exist.

## Database Schema

The `TASKS` table contains the following columns:

| Column | Type | Description |
|---|---|---|
| `ID` | INTEGER | Auto-incrementing primary key |
| `TITLE` | VARCHAR(50) | Task title; required |
| `DESCRIPTION` | VARCHAR(255) | Task description |
| `STATUS` | VARCHAR(20) | Task status; defaults to `pending` |

## API Endpoints

Base URL: `http://localhost:3000`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

Example:

```bash
curl http://localhost:3000/tasks
```

Returns an array containing all tasks.

### 2. Get a Task by ID

**Endpoint:** `GET /tasks/:id`

Example:

```bash
curl http://localhost:3000/tasks/1
```

Returns the task matching the specified ID.

### 3. Create a Task

**Endpoint:** `POST /tasks`

Send a JSON request body:

```json
{
  "title": "Learn Node.js",
  "description": "Build a REST API using SQLite",
  "status": "pending"
}
```

Example:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Build a REST API using SQLite","status":"pending"}'
```

The API responds with the ID of the newly created task.

If `description` is omitted, it is stored as `NULL`. If `status` is omitted, the code uses `pending`.

### 4. Update a Task

**Endpoint:** `PUT /tasks/:id`

Send a JSON request body:

```json
{
  "title": "Learn Node.js",
  "description": "Complete the Tasks API",
  "status": "completed"
}
```

Example:

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Complete the Tasks API","status":"completed"}'
```

Updates the task matching the specified ID.

### 5. Delete a Task

**Endpoint:** `DELETE /tasks/:id`

Example:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

Deletes the task matching the specified ID.

## Example Task Object

```json
{
  "ID": 1,
  "TITLE": "Learn Node.js",
  "DESCRIPTION": "Build a REST API using SQLite",
  "STATUS": "pending"
}
```

## Error Handling

The API returns JSON responses for errors. Depending on the operation, these may include:

- `400` — Bad request or missing task data
- `404` — Task not found
- `500` — Internal server or database error

The current implementation can be improved with more consistent validation and error handling.

## Future Improvements

- Validate task IDs and request fields
- Improve malformed JSON handling
- Return consistent HTTP status codes
- Configure the port using environment variables
- Add automated tests
- Add authentication and authorization if required

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
