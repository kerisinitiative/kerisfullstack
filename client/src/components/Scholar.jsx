import React from "react";
import bgImg from "../assets/img/hero-bg1.jpg";
import placeholderImg from "../assets/img/imgplaceholder.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Fetch database records and display in modals */
const Record = (props) => (
  /* Modals for Scholar Record */
  <>
    <div className="sm:max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Display the profile image if it exists */}
      {props.record.image && (
        <img
          src={props.record.image} // Use the full image URL stored in MongoDB
          alt={props.record.name}
          className="w-full h-48 object-cover"
        />
      )}
      {!props.record.image && (
        <img
          src={placeholderImg} // Default image if no image is uploaded
          alt="Profile"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {props.record.name}
        </h2>
        <p className="text-xs">
          <a
            href={`mailto:${props.record.email}`}
            className="text-blue-600 hover:underline"
          >
            {props.record.email}
          </a>{" "}
          ||
          {
            props.record.availability === true
              ? "✅" // if available
              : props.record.availability === false
              ? "❌" // if unavailable
              : "❓" // if null or invalid
          }
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-md">
            {props.record.sponsor}
          </span>
          {/* Display array of majors */}
          {(() => {
            const majors = [];
            for (let i = 0; i < props.record.major.length; i++) {
              majors.push(
                <span
                  key={i}
                  className="bg-purple-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  {props.record.major[i]}
                </span>
              );
            }
            return majors;
          })()}
          {/* Display array of institutions */}
          {(() => {
            const institutions = [];
            for (let i = 0; i < props.record.institution.length; i++) {
              institutions.push(
                <span
                  key={i}
                  className="bg-orange-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  {props.record.institution[i]}
                </span>
              );
            }
            return institutions;
          })()}
        </div>

        <div className="flex mt-3 gap-2">
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to={`detail/${props.record._id}`}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  </>
);

const Scholar = () => {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  /* Limit to 12 scholars per page (to avoid crashes) */
  const recordsPerPage = 12;

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setRecords(data);
    }
    getRecords();
  }, []);

  // Apply filters
  const filteredRecords = records.filter((record) => {
    return filters.every(({ type, value }) => {
      if (type === "name") {
        return record.name.toLowerCase().includes(value.toLowerCase());
      }
      if (type === "sponsor") {
        return record.sponsor.toLowerCase().includes(value.toLowerCase());
      }
      if (type === "availability") {
        if (value === "Available") return record.availability === true;
        if (value === "Unavailable") return record.availability === false;
        return true;
      }
      // Handle array fields (major and institution)
      if (Array.isArray(record[type])) {
        return record[type].includes(value);
      }
      // Handle non-array fields
      return record[type] === value;
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
            Welcome to Your Scholar Dashboard 🎓
          </h1>
          <p className="text-lg text-gray-200 mt-2 md:text-xl">
            Your one-stop hub for mentorship, resources, and growth. Let's make
            your journey smoother!
          </p>
          <div data-aos="fade-up" data-aos-delay="800">
            <a
              href="#scholar-section"
              data-aos="fade-up"
              data-aos-delay="300"
              className="btn-get-started scrollto mt-2"
            >
              Get <b>Started</b>!
            </a>
          </div>
        </div>
      </header>

      {/* Help & Mentee Guide Modals */}
      <section className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-10">
        {/* How Do We Help? */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            How Do We Help?
          </h2>
          <div className="mt-4 space-y-4">
            <aside className="p-4 bg-gray-100 rounded-lg">
              🔑 We provide a <strong>General Helpline</strong> where you can
              ask questions directly to our scholars. You can ask anything, from
              course choices to assessment tips.
            </aside>
            <aside className="p-4 bg-gray-100 rounded-lg">
              👨🏽‍🎓 We offer <strong>Mock Interviews</strong> to help you prepare
              for upcoming scholarship interviews.
            </aside>
            <aside className="p-4 bg-gray-100 rounded-lg">
              📖 We also offer help with <strong>Proofreading Essays</strong>{" "}
              for applications that require essays, such as YK, PNB, and UEM.
            </aside>
            <aside className="p-4 bg-gray-100 rounded-lg">
              📰 Our scholars can help you <strong>Build Your CV</strong> by
              reviewing it and suggesting appropriate amendments. This service
              is available for YTP MARA, Shell, YK, and other scholarships.
            </aside>
          </div>
        </div>

        {/* How to Become our Mentee? */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            How to Become our Mentee?
          </h2>
          <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
            <li>
              Reach out to one of your favorite mentors through Gmail or other
              contact points like Telegram or Instagram.
            </li>
            <li>
              Ask for any kind of help you need, no matter how big or small.
              We'll do our best to assist you.
            </li>
            <li>
              If you're new to scholarship tips, let us know in your message. It
              helps us figure out how to best help you.
            </li>
          </ul>
          <p className="mt-4 text-gray-600">
            Don't be shy – we're here to support you!
          </p>
        </div>
      </section>

      {/* Scholar Directory */}
      <section className="my-5 py-5" id="scholar-section">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Scholar Directory
        </h2>
        <p className="text-gray-600 text-sm text-center">
          Find scholars by expertise and availability.
        </p>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Filter Scholars
          </h2>
          <input
            type="text"
            placeholder="Search by Name..."
            className="w-full px-3 py-2 border rounded-md mb-2"
            onChange={(e) => {
              const value = e.target.value.trim();
              if (value === "") {
                setFilters(filters.filter((f) => f.type !== "name"));
              } else {
                const existingIndex = filters.findIndex(
                  (f) => f.type === "name"
                );
                if (existingIndex >= 0) {
                  const newFilters = [...filters];
                  newFilters[existingIndex].value = value;
                  setFilters(newFilters);
                } else {
                  addFilter("name", value);
                }
              }
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => {
                if (e.target.value) {
                  addFilter("availability", e.target.value);
                } else {
                  // Remove availability filter if empty option selected
                  setFilters(filters.filter((f) => f.type !== "availability"));
                }
              }}
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => addFilter("sponsor", e.target.value)}
            >
              <option value="">Select Sponsor</option>
              {[...new Set(records.map((r) => r.sponsor))].map((sponsor) => (
                <option key={sponsor} value={sponsor}>
                  {sponsor}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) =>
                e.target.value && addFilter("major", e.target.value)
              }
            >
              <option value="">Select Major</option>
              {[
                ...new Set(
                  records.flatMap((r) => r.major) // Flatten all majors into one array
                ),
              ].map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) =>
                e.target.value && addFilter("institution", e.target.value)
              }
            >
              <option value="">Select Institution</option>
              {[
                ...new Set(
                  records.flatMap((r) => r.institution) // Flatten all institutions into one array
                ),
              ].map((institution) => (
                <option key={institution} value={institution}>
                  {institution}
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
            currentRecords.map((record) => (
              <Record record={record} key={record._id} />
            ))
          ) : (
            <p>No scholars found, the server may be restarting. Please be patient, and refresh or wait a few minutes. Thank you!</p>
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

export default Scholar;
