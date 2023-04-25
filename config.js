let config = {};
config.db = {};

// create properties on the config.db object for the host and database names
const username = "g4brielmarte11";
const password = "dsYrz1wJEPP285ju";
const dbname = "community-fridge-101191857";

const connectionURL = `mongodb+srv://${username}:${password}@cluster0.zvq9f.mongodb.net/${dbname}?retryWrites=true&w=majority`; // full URL for connecting to our MongoDB database; includes the database username, password, and the database name

// create properties on the config.db object for the host and database names
config.db.host = connectionURL;
config.db.name = dbname;

module.exports = config;
