import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Record from "./components/Record";
import RecordList from "./components/RecordList";

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
import RecordScholar from "./components/RecordScholar";
import RecordScholarship from "./components/RecordScholarship";

/* Routes (pages) for the webapp */
const router = createBrowserRouter([
  /**
   * client-side
   **/
  {
    path: "/",
    element: <App />,
    children: [
      // home page - route
      {
        index: true,
        element: <Home />,
      },
      // scholar route
      {
        path: "scholar",
        children: [
          // scholar list
          {
            index: true,
            element: <Scholar />,
          },
          // scholar detail
          {
            path: "detail/:id",
            element: <ScholarDetail />,
          },
        ],
      },
      // scholarship route
      {
        path: "scholarship",
        children: [
          // scholarship list
          {
            index: true,
            element: <Scholarship />,
          },
          // scholarship detail
          {
            path: "detail/:id",
            element: <ScholarshipDetail />,
          },
        ,]
      },
    ],
  },

  /** 
   * admin-side
   **/
  {
    path: "/admin",
    element: <App />,
    children: [
      // admin dashboard page
      {
        index: true,
        element: <Dashboard />,
      },
      // list of scholar record
      {
        path: "scholar-list",
            element: <ScholarList />,
      },
      // add scholar
      {
        path: "scholar-list/add",
            element: <RecordScholar />,
      },
      // edit scholar
      {
        path: "scholar-list/edit:id",
            element: <RecordScholar />,
      },
      // list of scholarship record
      {
        path: "scholarship-list",
            element: <ScholarshipList />,
      },
      // add scholarship
      {
        path: "scholarship-list/add",
            element: <RecordScholarship />,
      },
      // edit scholarship
      {
        path: "scholarship-list/edit:id",
            element: <RecordScholarship />,
      },

    ],
  },

  /** 
   * Dev Page
   **/
  {
    path: "/dev",
    element: <App />,
    children: [
      {
        path: "/dev",
        element: <RecordList />,
      },
    ],
  },


  /* Old stuff
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
  */

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);