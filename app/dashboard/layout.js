import React from "react";
import DashboardProvider from "./Provider";

function layout({ children }) {
    return <DashboardProvider>{children}</DashboardProvider>;
}

export default layout;
