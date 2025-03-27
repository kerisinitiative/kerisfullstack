import React from 'react'
import bgImg from "../assets/img/hero-bg1.jpg";

const Scholar = () => {
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

      {/* Mentor Directory */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Mentor Directory</h2>
        <p className="text-gray-600 text-sm text-center">Find mentors by expertise and availability.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((mentor) => (
            <div key={mentor} className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-800">Mentor {mentor}</h3>
              <p className="text-gray-600 text-sm">Specializes in scholarship applications</p>
            </div>
          ))}
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
