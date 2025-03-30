import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  /* jangan guna <body> tag pleasseeeee */
  return (
    <div className="text-center min-h-screen">
      <div className="my-10">
        <p>Home. This is a placeholder, for temporary purposes.</p>

        <div className="my-2">
          You can click buttons below to test out certain functions: <br></br>
          <Link to="/scholar">
            <a className="border mx-1 bg-red-600 rounded-md p-1 hover:bg-red-300">
              Scholar Page
            </a>
          </Link>
          <Link to="/scholarship">
            <a className="border mx-1 text-slate-200 bg-blue-600 rounded-md p-1 hover:bg-blue-300">
              Scholarship Page
            </a>
          </Link>
          <Link to="/admin">
            <a className="border mx-1 text-slate-200 bg-green-600 rounded-md p-1 hover:bg-blue-300">
              Admin Page : Typical Password
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
