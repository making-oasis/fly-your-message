// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const envPath = path.resolve(process.cwd(), ".env.local");

console.log({ envPath });

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: envPath });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require("serverless-mysql");

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  },
});

async function query(q) {
  try {
    console.log("try");
    const results = await db.query(q);
    console.log(results);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}

// Create "entries" table if doesn't exist
async function migrate() {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      toMessage TEXT NULL,
      handleName TEXT NOT NULL,
      content TEXT NOT NULL,
      report TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at
        TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
    `);

    console.log("migration ran successfully");
  } catch (e) {
    console.log(e);
    console.error("could not run migration, double check your credentials.");
    process.exit(1);
  }
}

migrate().then(() => process.exit());
