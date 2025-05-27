#  Setup Guide

:exclamation: **Please be sure that you do not fork this repo, or try to commit changes to it.** :exclamation:

To get started, you'll need a Github account. You'll also need the following tools:

- Git
- Docker
- Docker Compose

### 1. Clone the repository
Start by obtaining a copy of the codebase. If you need assistance you can find out how in this [Github guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository). 


### 2. Build the application
First, create a `.env` file in the root directory. You can see the values needed in this file by looking at the `.env.example` file, and can choose any values you like for these secrets.

In the root directory, there is a `docker-compose.yml`. You can build the entire application stack by running `docker compose up --build`.

Hot reloading is enabled by default, so any changes you make should happen on the fly.

### 3. Using a test database
If you would like to use a separate postgres database for your tests, the client code in `backend/src/db/postgresClient.ts` allows for this. Below is an example of how you might configure this in Supertest.

    beforeAll(async () => {
      // Create test database client
      testDb = new DatabaseClient({
        database: 'test_db'
      });

      // Set up clean test schema
      await testDb.initializeDb(false); // No seed data
    });

    beforeEach(async () => {
      // Clean slate for each test
      await testDb.clearDb();

      // Add minimal test entities
      await testDb.query(`INSERT INTO entities (...) VALUES (...)`);
    });

    afterAll(async () => {
      await testDb.close();
    });

### 4. Work on the deliverables

View the [README](README.md) to see the expected deliverables.

### 5. Commit your code to a personal repository

Commit the codebase along with your tests together to a new repository owned by you. When you are finished, please submit this link back to your Talent Acquisition contact at Sayari.
