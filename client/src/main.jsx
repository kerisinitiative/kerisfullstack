import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// Import main App
import App from "./App";

// Import CSS : Tailwind File
import "./index.scss";

// Import page components
import Dev from "./components/Dev";
import Home from "./components/Home";
import ScholarList from "./components/ScholarList";
import ScholarshipList from "./components/ScholarshipList";
import Scholar from "./components/Scholar";
import Scholarship from "./components/Scholarship";
import ScholarshipDetail from "./components/ScholarshipDetail";
import ScholarDetail from "./components/ScholarDetail";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Import Login
import ProtectedLayout from "./components/ProtectedLayout"; // Import Protected Layout
import EditScholar from "./components/EditScholar";
import AddScholar from "./components/AddScholar";
import EditScholarship from "./components/EditScholarship";
import AddScholarship from "./components/AddScholarship";

const router = createBrowserRouter([
  // Client-Side Routes
  {
    path: "/",
    element: 
    <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "scholar",
        children: [
          { index: true, element: <Scholar /> },
          { path: "detail/:id", element: <ScholarDetail /> },
        ],
      },
      {
        path: "scholarship",
        children: [
          { index: true, element: <Scholarship /> },
          { path: "detail/:id", element: <ScholarshipDetail /> },
        ],
      },
    ],
  },

  // 🔒 Separate Login Route (NOT Protected)
  {
    path: "/admin/login",
    element: <Login />, // Public login page
  },

  // 🔒 Protected Admin Routes (Requires Auth)
  {
    path: "/admin",
    element: (
      <ProtectedLayout>  {/* Now only protects admin pages */}
        <App />
      </ProtectedLayout>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "scholar-list", element: <ScholarList /> },
      { path: "scholar-list/add", element: <AddScholar /> },
      { path: "scholar-list/edit/:id", element: <EditScholar /> },
      { path: "scholarship-list", element: <ScholarshipList /> },
      { path: "scholarship-list/add", element: <AddScholarship /> },
      { path: "scholarship-list/edit/:id", element: <EditScholarship /> },
    ],
  },

  {
    path: "/dev",
    element: <Dev />, // dev test page
  },

]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
