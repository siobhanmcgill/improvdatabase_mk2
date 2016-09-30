improvdatabase
==============

A webapp built on nodejs and a PostgreSQL database to view and organize Improv Comedy games.

Currently still in development...

# Database Setup

The ImprovDatabase API utilizes PostgreSQL for basing the data. Download and install that first.

Next, you'll need to set up the local database if you want to run the app locally.

First you need a user. In the pgAdmin app, create a new Login/Group role called 'sdbuatyadcczhj' - it can have superadmin privelages, who cares. It should have the password 'password'.

Now you can create a new database in pgAdmin called 'd1ihmfmjooehcl' and make that new user the owner.

Restore the database data from the latest backup stored in the postgres folder of this repository.

# Install the App

Download the repository, and do:

```
npm install
npm postinstall
```

# Run the App

First, make sure you have redis running locally.

Next, ensure your NODE_ENV variable is set to "development"

Then you can run the app.

```
npm start
```

The app will now be visible at localhost:1919
