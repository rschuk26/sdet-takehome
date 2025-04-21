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

### 3. Work on the deliverables

View the [README](README.md) to see the expected deliverables.

### 4. Test the Github Workflow (optional)

If you chose to update the `.github/workflows/main.yml` file to run your tests:

- Create repository secrets for the database credentials and connection (for example `POSTGRES_USER` etc)
- Go to the Actions tab
- Find `CI Pipeline` in the Workflows list
- Click on the `Run workflow` button

Note that this method of delivery is optional, and more information can be found in the readme.

### 5. Commit your code to a personal repository

Commit the codebase along with your tests together to a new repository owned by you. When you are finished, please submit this link back to your Talent Acquisition contact at Sayari.
