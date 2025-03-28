import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import placeholderImg from "../assets/img/imgplaceholdersponsors.jpg";

const ScholarshipDetail = () => {
  const { id } = useParams(); // Get sponsor ID from the URL
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsor() {
      try {
        const response = await fetch(
          `http://localhost:5050/record/sponsors/${id}`
        );
        if (!response.ok) throw new Error("Sponsor not found");
        const data = await response.json();
        setSponsor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsor();
  }, [id]);

  if (loading)
    return (
      <div className="text-center min-h-screen m-10">
        <strong>Loading...</strong>
      </div>
    );

  if (!sponsor)
    return (
      <div className="text-center m-10 min-h-screen text-[--color-primary]">
        <strong>
          Sponsor not found :/ http://localhost:5050/sponsors/${id}{" "}
        </strong>
        <div className="text-center m-6 text-white">
          <Link to="/sponsors">
            <button className="bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-4 py-2 rounded-md">
              Back to Sponsors List
            </button>
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
          backgroundImage: `url(${sponsor.image || placeholderImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="text-4xl text-[--color-light] font-bold relative z-10">
          {sponsor.sponsor}
        </h1>
      </div>

      {/* Sponsor Information Grid */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">Sponsor Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>
              Status:<br></br>
            </strong>{" "}
            {sponsor.status || "N/A"}
          </p>

          <p>
            <strong>
              Link:<br></br>
            </strong>
            <a
              href={sponsor.link || "#"}
              className="hover:text-[--color-secondary]"
            >
              {sponsor.link || "N/A"}
            </a>
          </p>

          {/* Display array of Supported Institutions */}
          <p>
            <strong>
              Program:<br></br>
            </strong>
            {sponsor.programs && sponsor.programs.length > 0
              ? sponsor.programs.join(", ")
              : "None"}
          </p>

          {/* Display array of Sponsored Majors */}
          <p>
            <strong>
              Sponsored Majors:<br></br>
            </strong>
            {sponsor.majors_offered && sponsor.majors_offered.length > 0
              ? sponsor.majors_offered.join(", ")
              : "None"}
          </p>
        </div>
        # Note to self, add more attributes after Zai and Dayana work on it
      </div>

      {/* About Sponsor Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">About {sponsor.sponsor}</h2>
        {sponsor.about || "No details provided."}
      </div>

      {/* Back Button */}
      <div className="text-center m-6 text-white">
        <Link to="/scholarship">
          <button className="bg-[--color-primary] hover:bg-[--color-light] hover:text-[--color-secondary] px-4 py-2 rounded-md">
            Back to Sponsors List
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
