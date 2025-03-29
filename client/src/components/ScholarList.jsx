import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = ({ record, deleteRecord }) => (
  <tr className="border-b">
    <td className="p-2 border-r">{record.name}</td>
    <td className="p-2 border-r">{record.sponsor}</td>
    <td className="p-2 border-r">{record.major.join(", ")}</td>
    <td className="p-2 border-r">{record.institution.join(", ")}</td>
    <td className="p-2 border-r">{record.email}</td>
    <td className="p-2 border-r">
      {record.image ? (
        <img src={record.image} alt={record.name} className="w-16 h-16 object-cover" />
      ) : (
        <img src="./piqim.jpg" alt="Profile" className="w-16 h-16 object-cover" />
      )}
    </td>
    <td className="p-2 flex gap-2">
      <Link
        className="text-blue-500 hover:underline"
        to={`/edit/${record._id}`}
      >
        Edit
      </Link>
      <button
        className="text-red-500 hover:underline"
        onClick={() => deleteRecord(record._id)}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function ScholarRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
  }, [records.length]);

  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    setRecords(records.filter((el) => el._id !== id));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Scholar Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-r">Name</th>
              <th className="p-2 border-r">Sponsor</th>
              <th className="p-2 border-r">Major</th>
              <th className="p-2 border-r">Institution</th>
              <th className="p-2 border-r">Email</th>
              <th className="p-2 border-r">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <Record key={record._id} record={record} deleteRecord={deleteRecord} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}