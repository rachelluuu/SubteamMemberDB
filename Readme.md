CUAir
=====

# Install

To run this, you must first download and installed [nodejs](https://nodejs.org/en/) and [mongodb](https://www.mongodb.com/) if not already installed.

   brew install node mongodb

You must then install the dependent NPM packages

   npm install

Start `mongodb` server

   brew services start mongodb

# Run

Start the `nodejs` server

    npm start

App can be browsed at `http://localhost:3000`.

# Test

Run the set of tests in `bin` directory

   bin/test.sh

# Mongo CLI 

You can view the database records using the [mongo shell](https://docs.mongodb.com/manual/mongo/)

    mongo

Then a command such as

    show dbs
    use cuair
    show collections
    db.members.find()
    db.subteams.find()
