import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import placeholderImg from "../assets/img/imgplaceholder.jpg";

const ScholarDetail = () => {
  const { id } = useParams(); // Get scholar ID from the URL
  const [scholar, setScholar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScholar() {
      try {
        const response = await fetch(`http://localhost:5050/record/${id}`);
        if (!response.ok) throw new Error("Scholar not found");
        const data = await response.json();
        setScholar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchScholar();
  }, [id]);

  if (loading) return <div className="text-center min-h-screen m-10"><strong>Loading...</strong></div>;
  if (!scholar)
    return (
      <div className="text-center m-10 min-h-screen text-[--color-primary]">
        <strong>Scholar not found :/ </strong>
        <div className="text-center m-6 text-white">
          <Link to="/scholar">
            <a className="bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-4 py-2 rounded-md">
              Back to Scholars List
            </a>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="h-96 flex items-center justify-center text-center text-white relative"
        style={{
          backgroundImage: `url(${scholar.image || placeholderImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="text-4xl text-[--color-light] font-bold relative z-10">
          {scholar.name}
        </h1>
      </div>

      {/* Scholar Information Grid */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">Scholar Information </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>Sponsor:</strong> {scholar.sponsor}
          </p>
          <p>
            <strong>Major:</strong> {scholar.major}
          </p>
          <p>
            <strong>Institution:</strong> {scholar.institution}
          </p>
          <p>
            <strong>Email:</strong> {scholar.email || "N/A"}
          </p>
        </div>
        #Note: Add more atributes as Dayana and Zai create the schema for the database
      </div>

      {/* About Scholar Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">About {scholar.name}</h2>
          {/* HTML Code of Scholar's Yapping */}
          {scholar.aboutMe || "No details provided."}
      </div>

      {/* Back Button */}
      <div className="text-center m-6 text-white">
        <Link to="/scholar">
          <a className="bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-4 py-2 rounded-md">
            Back to Scholars List
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ScholarDetail;
