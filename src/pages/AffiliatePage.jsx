import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AffiliatePage = () => {

  const [isSidebarCollapsed,setIsSidebarCollapsed] = useState(false);

  return (
    <div className="of-layout">

      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="of-main">

        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div style={{padding:"30px"}}>

          <h2>Affiliate</h2>

          <p>Welcome to the Affiliate page.</p>

        </div>

      </div>

    </div>
  );
};

export default AffiliatePage;