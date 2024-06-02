const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME ;

function dbService() {

    let client = null;
    const url = process.env.DB_URL

    async function getClient() {

        if (client)
            return client.db(DB_NAME);

        client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });

        try {
            await client.connect();
            console.log('Database connected successfully!');
        }
        catch (err) {
            console.log('Database connection error: ', err.toString());
            return null;
        }

        return client.db(DB_NAME);
    }
    return { getClient };
}

module.exports = dbService();
