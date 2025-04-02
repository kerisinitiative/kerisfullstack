import React from "react";
import bgImg from "../assets/img/bg-school.jpg";
import placeholderImg from "../assets/img/imgplaceholdersponsors.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return "Present"; // Handle empty/undefined dates

  const date = new Date(dateString);

  // Get day, month (0-11 so we add 1), and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/* Fetch database records and display in modals */
const Record = (props) => (
  /* Modals for Scholar Record */
  <>
    <div className="sm:max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Display the profile image if it exists */}
      {props.sponsors?.image && (
        <img
          src={props.sponsors.image}
          alt={props.sponsors.sponsor}
          className="w-full h-48 object-cover"
        />
      )}
      {!props.sponsors?.image && (
        <img
          src={placeholderImg}
          alt="Profile"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        {/* Display sponsor name */}
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {props.sponsors.sponsor}
        </h2>
        <p className="text-xs flex items-center gap-2">
          {formatDate(props.sponsors.time_start)} →{" "}
          {formatDate(props.sponsors.time_end)}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Display Status */}
          <span
            className={`text-white text-sm px-3 py-1 rounded-md ${
              props.sponsors.status === true ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {props.sponsors.status === true ? "Active" : "Inactive"}
          </span>
          {/* Display array of programs */}
          {(() => {
            const programs = [];
            for (let i = 0; i < props.sponsors.programs.length; i++) {
              programs.push(
                <span
                  key={i}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  {props.sponsors.programs[i]}
                </span>
              );
            }
            return programs;
          })()}
        </div>

        <div className="flex mt-3 gap-2">
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to={`detail/${props.sponsors._id}`}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  </>
);

const Scholarship = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  /* Limit to 12 scholars per page (to avoid crashes) */
  const recordsPerPage = 12;

  useEffect(() => {
    async function getSponsors() {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/sponsors`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setSponsors(data);
    }
    getSponsors();
  }, []);

  // Apply filters
  const filteredRecords = sponsors.filter((sponsor) => {
    return filters.every(({ type, value }) => {
      if (type === "sponsor") {
        return sponsor.sponsor.toLowerCase().includes(value.toLowerCase());
      }
      if (type === "name") {
        return sponsor.name.toLowerCase().includes(value.toLowerCase());
      }
      // Handle status field
      if (type === "status") {
        if (value === "Active") return sponsor.status === true;
        if (value === "Inactive") return sponsor.status === false;
        return true;
      }
      // Handle array fields
      if (Array.isArray(sponsor[type])) {
        return sponsor[type].includes(value);
      }
      // Handle non-array fields
      return sponsor[type] === value;
    });
  });

  const addFilter = (type, value) => {
    if (value && !filters.some((f) => f.type === type && f.value === value)) {
      setFilters([...filters, { type, value }]);
    }
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-6">
      {/* Header with Parallax Background */}
      <header
        className="relative h-96 flex items-center justify-center text-center text-white shadow-md rounded-lg md:h-[30rem] lg:h-[32rem]"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 p-4 sm:p-6 rounded-lg min-w-40 max-w-80 md:max-w-lg mx-auto">
          <h1 className="text-xl text-white font-bold sm:text-2xl md:text-4xl">
            Welcome to The Scholarship Dashboard
          </h1>
          <p className="text-lg text-gray-200 mt-2 md:text-xl">
            Your one-stop hub for information, inspiration, and application.
            Let's make a change!
          </p>
          <div data-aos="fade-up" data-aos-delay="800">
            <a
              href="#scholar-section"
              data-aos="fade-up"
              data-aos-delay="300"
              className="btn-get-started scrollto mt-2"
            >
              Get <b>Applying</b>!
            </a>
          </div>
        </div>
      </header>

      {/* Scholarship Directory */}
      <section className="my-5 py-5" id="scholar-section">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Scholarship Directory
        </h2>
        <p className="text-gray-600 text-sm text-center">
          Find scholarships by sponsor, availability, and major offered.
        </p>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Filter Scholarships
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by Sponsor..."
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => {
                if (e.target.value === "") {
                  // Remove sponsor filter if search is cleared
                  setFilters(filters.filter((f) => f.type !== "sponsor"));
                } else {
                  // Add/update sponsor filter
                  const existingIndex = filters.findIndex(
                    (f) => f.type === "sponsor"
                  );
                  if (existingIndex >= 0) {
                    const newFilters = [...filters];
                    newFilters[existingIndex].value = e.target.value;
                    setFilters(newFilters);
                  } else {
                    addFilter("sponsor", e.target.value);
                  }
                }
              }}
            />
            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => {
                if (e.target.value) {
                  addFilter("status", e.target.value);
                } else {
                  // Remove status filter if empty option selected
                  setFilters(filters.filter((f) => f.type !== "status"));
                }
              }}
            >
              <option value="">Select Availability</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Array of Majors */}
            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) =>
                e.target.value && addFilter("majors_offered", e.target.value)
              }
            >
              <option value="">Select Major(s)</option>
              {[
                ...new Set(
                  sponsors.flatMap((r) => r.majors_offered) // Flatten all majors into one array
                ),
              ].map((majors_offered) => (
                <option key={majors_offered} value={majors_offered}>
                  {majors_offered}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md flex items-center gap-2"
                >
                  {filter.type}: {filter.value}
                  <button
                    className="ml-2 bg-red-500 text-white rounded-full px-2"
                    onClick={() => removeFilter(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Clear Filters Button */}
          {filters.length > 0 && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Scholar List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {currentRecords.length > 0 ? (
            currentRecords.map((sponsor) => (
              <Record sponsors={sponsor} key={sponsor._id} />
            ))
          ) : (
            <p>No scholarships found, the server may be restarting. Please be patient, and refresh or wait a few minutes. Thank you!</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className="mx-1 px-2 bg-[--color-primary] hover:bg-[--color-secondary] text-white rounded-md"
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Scholarship;
