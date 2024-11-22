import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  return (
    <React.Fragment>
      <div className="flex font-nunito w-full h-screen overflow-hidden">
        <div className="overflow-y-auto">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
        <div className="fixed inset-0 z-10">
          <Navbar />
        </div>
        <div
          className={`fixed inset-0 z-20 top-16 md:top-16 ${
            sidebarOpen ? "md:left-60" : "md:left-20"
          } flex-1 duration-300 h-screen overflow-y-auto`}
        >
          <main className="px-3 pt-4 mb-20 md:p-5">{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
