import React from "react";
import Header from "./Header"; // Import your Header component
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Header /> {/* Add the header at the top */}
      <main>{children}</main> {/* Render the page content */}
    </>
  );
};

export default Layout;
