import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Record {
  _id: string;
  name: string;
  position: string;
  level: string;
}

export default function RecordList() {
  const [records, setRecords] = useState<Record[]>([]);

  // Fetch records when component mounts
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5050/record/`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    }
    getRecords();
  }, []);

  // Function to delete a record
  async function deleteRecord(id: string) {
    try {
      const response = await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      setRecords(records.filter(record => record._id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-2xl font-bold mb-4">Employee List</h3>
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Position</th>
            <th className="p-4 text-left">Level</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record._id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4">{record.name}</td>
              <td className="p-4">{record.position}</td>
              <td className="p-4">{record.level}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                    to={`/edit/${record._id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => deleteRecord(record._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
