const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "lab",
});

client.connect();

// SAFE LOGIN - Using Parameterized Queries
app.post("/login-safe", async (req, res) => {
  const { email, password } = req.body;
  console.log("Safe Login Attempt:", email);

  const query = "SELECT * FROM users WHERE email=$1 AND password=$2";
  const values = [email, password];

  try {
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UNSAFE LOGIN - Using String Concatenation (Vulnerable to SQL Injection)
app.post("/login-unsafe", async (req, res) => {
  const { email, password } = req.body;
  console.log("Unsafe Login Attempt:", email);

  const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
  console.log("Executing Unsafe Query:", query);

  try {
    const result = await client.query(query);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
