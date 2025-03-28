import React from 'react'
import bgImg from "../assets/img/hero-bg1.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Fetch database records and display in modals */
const Record = (props) => (
  <>
    <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
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
          src="./piqim.jpg" // Default image if no image is uploaded
          alt="Profile"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-semibold flex items-center gap-2">{props.record.name}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-md">
            {props.record.sponsor}
          </span>
          <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-md">
            {props.record.major}
          </span>
          <span className="bg-gray-600 text-white text-sm px-3 py-1 rounded-md">
            {props.record.institution}
          </span>
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
  
    // This method fetches the records from the database.
    useEffect(() => {
      async function getRecords() {
        const response = await fetch(`http://localhost:5050/record/`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const records = await response.json();
        setRecords(records);
      }
      getRecords();
      return;
    }, [records.length]);
  
    // This method will map out the records on the table
    function recordList() {
      return records.map((record) => {
        return (
          <Record
            record={record}
            key={record._id}
          />
        );
      });
    }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-6">
      {/* Header with Parallax Background */}
      <header className="relative h-96 flex items-center justify-center text-center text-white shadow-md rounded-lg md:h-[30rem] lg:h-[32rem]" style={{ backgroundImage: `url(${bgImg})`, backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-black bg-opacity-50 p-2 sm:p-6 rounded-lg min-w-40 max-w-80 md:max-w-lg mx-auto">
          <h1 className="text-xl font-bold sm:text-2xl md:text-4xl">Welcome to Your Scholar Dashboard 🎓</h1>
          <p className="text-lg text-gray-200 mt-2 md:text-xl">Your one-stop hub for mentorship, resources, and growth. Let's make your journey smoother!</p>
        </div>
      </header>

      {/* Help & Mentee Guide Modals */}
      <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* How Do We Help? */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">How Do We Help?</h2>
          <div className="mt-4 space-y-4">
            <aside className="p-4 bg-gray-100 rounded-lg">🔑 We provide a <strong>General Helpline</strong> where you can ask questions directly to our scholars. You can ask anything, from course choices to assessment tips.</aside>
            <aside className="p-4 bg-gray-100 rounded-lg">👨🏽‍🎓 We offer <strong>Mock Interviews</strong> to help you prepare for upcoming scholarship interviews.</aside>
            <aside className="p-4 bg-gray-100 rounded-lg">📖 We also offer help with <strong>Proofreading Essays</strong> for applications that require essays, such as YK, PNB, and UEM.</aside>
            <aside className="p-4 bg-gray-100 rounded-lg">📰 Our scholars can help you <strong>Build Your CV</strong> by reviewing it and suggesting appropriate amendments. This service is available for Shell, YK, and other scholarships.</aside>
          </div>
        </div>

        {/* How to Become our Mentee? */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">How to Become our Mentee?</h2>
          <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
            <li>Reach out to one of your favorite mentors through Gmail or other contact points like Telegram or Instagram.</li>
            <li>Ask for any kind of help you need, no matter how big or small. We'll do our best to assist you.</li>
            <li>If you're new to scholarship tips, let us know in your message. It helps us figure out how to best help you.</li>
          </ul>
          <p className="mt-4 text-gray-600">Don't be shy – we're here to support you!</p>
        </div>
      </section>

      {/* Scholar Directory */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Mentor Directory</h2>
        <p className="text-gray-600 text-sm text-center">Find mentors by expertise and availability.</p>
        <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-7xl">
          {recordList()}
        </div>
      </section>

      {/* FAQs & Contact */}
      <section className="mt-10 bg-white p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-gray-800">FAQs</h2>
        <p className="text-gray-600 text-sm mt-2">Check common queries or contact a mentor directly.</p>
      </section>
    </div>
  )
}

export default Scholar
