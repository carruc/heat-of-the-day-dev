import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecordFormData } from "../types/record";

export default function Record() {
  const [form, setForm] = useState<RecordFormData>({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id;
      if (!id) return;
      
      setIsNew(false);
      try {
        const response = await fetch(`http://localhost:5050/record/${id}`);
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }
        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }
        setForm(record);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [params.id, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const person = { ...form };
    try {
      const response = await fetch(
        `http://localhost:5050/record${params.id ? "/" + params.id : ""}`,
        {
          method: params.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // Add this function to handle form updates
  function updateForm(value: Partial<RecordFormData>) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">
        {isNew ? "Create New Employee" : "Edit Employee"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1">Name:</label>
          <input
            type="text"
            id="name"
            className="border rounded p-2"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="position" className="mb-1">Position:</label>
          <input
            type="text"
            id="position"
            className="border rounded p-2"
            value={form.position}
            onChange={(e) => updateForm({ position: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="level" className="mb-1">Level:</label>
          <select
            id="level"
            className="border rounded p-2"
            value={form.level}
            onChange={(e) => updateForm({ level: e.target.value })}
            required
          >
            <option value="">Select Level</option>
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {isNew ? "Create Employee" : "Update Employee"}
        </button>
      </form>
    </div>
  );
} 