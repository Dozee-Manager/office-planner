-- office-planner-schema.sql
-- Run this in your Supabase SQL editor or psql to create tables.

CREATE TABLE IF NOT EXISTS employees (
  id serial PRIMARY KEY,
  name varchar(150) NOT NULL,
  role varchar(100),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id serial PRIMARY KEY,
  employee_id int REFERENCES employees(id) ON DELETE RESTRICT,
  task_date date NOT NULL,
  task_details text NOT NULL,
  time_spent_hours numeric(6,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks (task_date);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks (employee_id);
