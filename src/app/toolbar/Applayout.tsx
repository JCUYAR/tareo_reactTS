import { useState } from "react";
import { Outlet } from "react-router-dom";
import Toolbar from "../toolbar/Toolbar";
import "../styles/sideBar.css";
import Sidebar from "./Sidebar";

/**
 * AppLayout
 * Wrap your authenticated routes with this component so every
 * page automatically gets the Toolbar + Sidebar.
 *
 * Example usage in your router:
 *
 *   <Route element={<AppLayout />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/registro"  element={<Registro />} />
 *   </Route>
 */
export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Toolbar onSidebarToggle={() => setSidebarOpen((o) => !o)} />

            {/* Left sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen((o) => !o)}
            />

            {/* Page content */}
            <main
                className={`app-main ${
                    sidebarOpen ? "app-main--sidebar-open" : "app-main--sidebar-closed"
                }`}
            >
                {/* <Outlet /> renders the matched child route */}
                <Outlet />
            </main>
        </>
    );
}