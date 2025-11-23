import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Use Render backend by default
const API =
  import.meta.env.VITE_API_BASE ||
  "https://office-planner-backend.onrender.com";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskDetails, setTaskDetails] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  async function fetchEmployees() {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
      if (res.data[0]) setSelectedEmployee(res.data[0].id);
    } catch (e) {
      console.error(e);
      alert("Failed to load employees");
    }
  }

  async function fetchTasks(params = {}) {
    try {
      const res = await axios.get(`${API}/tasks`, { params });
      setTasks(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load tasks");
    }
  }

  async function addEmployee(e) {
    e.preventDefault();
    if (!name) return alert("name required");
    await axios.post(`${API}/employee`, { name, role });
    setName("");
    setRole("");
    fetchEmployees();
  }

  async function addTask(e) {
    e.preventDefault();
    if (!selectedEmployee || !taskDetails || !timeSpent)
      return alert("fill fields");
    const payload = {
      employee_id: selectedEmployee,
      task_date: taskDate.toISOString().slice(0, 10),
      task_details: taskDetails,
      time_spent_hours: parseFloat(timeSpent),
    };
    await axios.post(`${API}/task`, payload);
    setTaskDetails("");
    setTimeSpent("");
    fetchTasks();
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Office Daily Update — Manager</h2>

      <section
        style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}
      >
        <h3>Add Employee</h3>
        <form
          onSubmit={addEmployee}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section
        style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}
      >
        <h3>Add Task for Date</h3>
        <form onSubmit={addTask} style={{ display: "grid", gap: 8 }}>
          <label>Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {employees.map((emp) => (
              <option value={emp.id} key={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <label>Date</label>
          <DatePicker
            selected={taskDate}
            onChange={(d) => setTaskDate(d)}
            dateFormat="yyyy-MM-dd"
          />

          <label>Task details</label>
          <textarea
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            rows={3}
          />

          <label>Time spent (hours, e.g. 1.5)</label>
          <input
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
          />

          <button type="submit">Save</button>
        </form>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12 }}>
        <h3>Recent Tasks</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={() => fetchTasks()}>Refresh</button>
          <button
            onClick={() =>
              fetchTasks({ from: new Date().toISOString().slice(0, 10) })
            }
          >
            Today
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}
            border="1"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Task</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: 6 }}>{t.task_date}</td>
                  <td style={{ padding: 6 }}>{t.employee_name}</td>
                  <td style={{ padding: 6 }}>{t.task_details}</td>
                  <td style={{ padding: 6 }}>{t.time_spent_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
