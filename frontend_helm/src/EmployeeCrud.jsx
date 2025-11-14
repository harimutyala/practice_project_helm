import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL+"/api/employees";

export default function EmployeeCrud() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", salary: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch All Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);

      // Ensure it is always an array
      const data = Array.isArray(res.data) ? res.data : [];
      setEmployees(data);

    } catch (err) {
      console.error("Error fetching employees", err);
      setEmployees([]); // Always fallback to array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId === null) {
        await axios.post(API_URL, form);
      } else {
        await axios.put(`${API_URL}/${editId}`, form);
      }

      setForm({ name: "", email: "", salary: "" });
      setEditId(null);
      fetchEmployees();

    } catch (err) {
      console.error("Error saving employee", err);
    }
  };

  // Handle Delete
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  // Load data into form for editing
  const editEmployee = (emp) => {
    setForm({ name: emp.name, email: emp.email, salary: emp.salary });
    setEditId(emp.id);
  };

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <h2>Employee CRUD</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          required
        />
        <br /><br />

        <button type="submit">
          {editId === null ? "Add Employee" : "Update Employee"}
        </button>
      </form>

      <hr />

      {/* LIST */}
      <h3>Employee List</h3>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div
            key={emp.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><b>Name:</b> {emp.name}</p>
            <p><b>Email:</b> {emp.email}</p>
            <p><b>Salary:</b> {emp.salary}</p>

            <button onClick={() => editEmployee(emp)}>Edit</button>
            <button
              onClick={() => deleteEmployee(emp.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
