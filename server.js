const express = require("express");
const { Client } = require("pg");

const app = express();
app.use(express.json());

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "lab",
});

client.connect();

// VULNERABLE LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);

  // insecure
  // const query = `
  // SELECT * FROM users
  // WHERE email='${email}' AND password='${password}'
  // `

  // secure
  const query = "SELECT * FROM users WHERE email=$1 AND password=$2";
  const values = [email, password];

  console.log("Executing query:", query);
  console.log(`$1 = ${values[0]}`);
  console.log(`$2 = ${values[1]}`);

  try {
    // const result = await client.query(query);
    const result = await client.query(query, values);
    console.log("Query result:", result.rows);

    if (result.rows.length > 0) {
      res.send(result.rows);
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
