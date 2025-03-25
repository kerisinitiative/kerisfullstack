
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    /**
     * NAVBAR COMPONENT
     */
    <header id="header" className="
      fixed top-0 left-0 right-0 flex items-center bg-transparent z-50">
      <div className="container mx-auto px-4 flex items-center">
        {/* Logo */}
        <div className="logo mr-auto">
          <h1 className="text-white">
            <a href="/"><span>KERIS</span></a>
            </h1>
        </div>

        {/* Navbar */}
        <nav className="nav-menu hidden md:block text-white">
        <ul className="flex space-x-8">
          <li>
            <a href="#about" className="
              hover:text-opacity-80 transition">About</a>
            </li>
          <li class="drop-down relative group">
            <a href="#resource" className="
              hover:text-opacity-80 transition">Resources</a>
            <ul className="
              absolute hidden group-hover:block bg-white text-gray-800 p-2 rounded shadow-lg min-w-[200px]">
            <NavLink to="/scholar">
              <li><a className="
                block px-4 py-2 hover:bg-gray-100">Meet Your Scholars</a></li>
            </NavLink>
            <NavLink to="/scholarship">
              <li><a className="
                block px-4 py-2 hover:bg-gray-100">Scholarship Status</a></li>
            </NavLink>
            </ul>
          </li>
          <li><a href="#faq" className="
              hover:text-opacity-80 transition">FAQ</a></li>
          <li><a href="#contact" className="
              hover:text-opacity-80 transition">Contact Us</a></li>
        </ul>
        </nav>
      </div>



    {/*
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="MongoDB logo" className="h-10 inline" src="https://raw.githubusercontent.com/mongodb-developer/mern-stack-example/603144e25ba5549159d1962601337652a7bfa253/mern/client/src/assets/mongodb.svg"></img>
        </NavLink>

        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
        to="/create">
          Create Scholar
        </NavLink>
      </nav>
      */ }

    </header>
  );
}
