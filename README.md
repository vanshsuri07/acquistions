# 🧭 Acquistions API

This repository contains the backend API for Acquistions, a robust application built with Node.js, Express, and Drizzle ORM. It provides a secure and scalable foundation for handling API requests, database management, and user authentication.

## 🧰 Tech Stack

- **Framework:** [Express.js](https://expressjs.com/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [JWT](https://jwt.io/) (JSON Web Tokens) with `jsonwebtoken` and `bcrypt`
- **Security:** [Helmet](https://helmetjs.github.io/), [Arcjet](https://arcjet.com/)
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Testing:** [Jest](https://jestjs.io/)
- **Containerization:** [Docker](https://www.docker.com/)

## 🚀 Features

- **RESTful API:** A well-structured API with clear separation of concerns.
- **Database Schema Management:** Use Drizzle Kit to manage database migrations and schema changes.
- **JWT Authentication:** Secure user authentication and authorization using JSON Web Tokens.
- **Security Hardening:** Middleware like Helmet and Arcjet to protect against common web vulnerabilities.
- **Developer-Friendly:** Comes with pre-configured linting, formatting, and testing scripts.
- **Containerized:** Ready for deployment with Docker and Docker Compose.

## 📂 Folder Structure

The project follows a standard MVC-like pattern to keep the codebase organized and maintainable.

```
.
├── drizzle/              # Drizzle ORM migration files
├── scripts/              # Shell scripts for Docker
├── src/
│   ├── config/           # Application configuration
│   ├── controllers/      # Express route handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Drizzle ORM schemas
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── validations/      # Zod validation schemas
│   ├── app.js            # Express app setup
│   ├── index.js          # Application entry point
│   └── server.js         # Server initialization
├── tests/                # Jest test files
├── .env.example          # Example environment variables
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── drizzle.config.js     # Drizzle ORM configuration
└── package.json
```

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vanshsuri07/acquistions.git
    cd acquistions
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in the `.env` file.

4.  **Run database migrations:**
    ```bash
    npm run db:migrate
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

## 🔐 Environment Variables

Create a `.env` file in the root of the project and add the following variables.

```env
# Application Port
PORT=3000

# Database Connection URL (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/db"

# JWT Secret and Expiration
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1d"

# Arcjet Protection Key (Optional)
ARCJET_KEY="your-arcjet-key"
```

## 🧪 Scripts & Commands

-   `npm run dev`: Start the development server with hot-reloading using `node --watch`.
-   `npm run start`: Start the application in production mode.
-   `npm run lint`: Lint the codebase using ESLint.
-   `npm run lint:fix`: Automatically fix linting issues.
-   `npm run format`: Format the code using Prettier.
-   `npm test`: Run tests using Jest.
-   `npm run db:generate`: Generate Drizzle ORM migration files based on schema changes.
-   `npm run db:migrate`: Apply pending migrations to the database.
-   `npm run db:studio`: Open Drizzle Studio to browse and manage your data.

## 🌐 Deployment Instructions

This project is configured for deployment using Docker.

### Development with Docker

To run the application in a development environment using Docker Compose:
```bash
npm run dev:docker
```
This command uses `scripts/dev.sh` to build and start the containers defined in `docker-compose.dev.yml`.

### Production with Docker

To deploy the application in a production environment:
```bash
npm run prod:docker
```
This command uses `scripts/prod.sh` to build and start the containers defined in `docker-compose.prod.yml`.

## 🧾 License

This project is licensed under the **ISC License**. See the `LICENSE` file for more details.