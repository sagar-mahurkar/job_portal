import { createBrowserRouter, Outlet } from "react-router";
import React from "react";
import HomePage from "../pages/HomePage.jsx";
import JobsPage from "../pages/JobsPage.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const router = createBrowserRouter([
  { path: "/", element: 
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>, 
    children: [
        { index: true, element: <HomePage /> },
        { path: "jobs", element: <JobsPage /> },
    ]
  }, 
]);

export default router;