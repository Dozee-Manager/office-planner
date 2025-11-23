import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

const app = express();
app.use(cors());
app.use(express.json());

// --- Employees ---
app.post("/employee", async (req, res) => {
  const { name, role } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  try {
    const result = await pool.query(
      "INSERT INTO employees (name, role) VALUES ($1, $2) RETURNING *",
      [name, role || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// --- Tasks ---
app.post("/task", async (req, res) => {
  const { employee_id, task_date, task_details, time_spent_hours } = req.body;
  if (!employee_id || !task_date || !task_details || time_spent_hours == null) {
    return res.status(400).json({ error: "missing fields" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tasks (employee_id, task_date, task_details, time_spent_hours)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [employee_id, task_date, task_details, time_spent_hours]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// Query tasks: ?employee_id=&from=&to=
app.get("/tasks", async (req, res) => {
  const { employee_id, from, to } = req.query;
  let q = "SELECT t.*, e.name as employee_name FROM tasks t JOIN employees e ON t.employee_id = e.id";
  const conditions = [];
  const params = [];
  if (employee_id) { params.push(employee_id); conditions.push(`employee_id = $${params.length}`); }
  if (from) { params.push(from); conditions.push(`task_date >= $${params.length}`); }
  if (to) { params.push(to); conditions.push(`task_date <= $${params.length}`); }
  if (conditions.length) q += " WHERE " + conditions.join(" AND ");
  q += " ORDER BY task_date DESC, created_at DESC";
  try {
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server listening on port", PORT));
