import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import "./index.scss";
import Dev from "./components/Dev";

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
        element: <RecordList />,
      },
      // scholar route
      {
        path: "scholar",
        children: [
          // scholar list
          {
            index: true,
            element: <Dev />,
          },
          // scholar detail
          {
            path: "detail/:id",
            element: <Dev />,
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
            element: <Dev />,
          },
          // scholarship detail
          {
            path: "detail/:id",
            element: <Dev />,
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
        element: <RecordList />,
      },
      // list of scholar record
      {
        path: "scholar-list",
            element: <Dev />,
      },
      // add scholar
      {
        path: "scholar-list/add",
            element: <Dev />,
      },
      // edit scholar
      {
        path: "scholar-list/edit:id",
            element: <Dev />,
      },
      // list of scholarship record
      {
        path: "scholarship-list",
            element: <Dev />,
      },
      // add scholarship
      {
        path: "scholarship-list/add",
            element: <Dev />,
      },
      // edit scholarship
      {
        path: "scholarship-list/edit:id",
            element: <Dev />,
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
        element: <Dev />,
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