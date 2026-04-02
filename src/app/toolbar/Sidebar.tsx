import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import "../styles/sideBar.css";
import Icon from "../../shared/ui/Icon";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({
    isOpen,
    onToggle
}: SidebarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navItems = [
        { id: "dashboard", icon: "bi-house", label: "Dashboard", path: "/dashboard" },
        { id: "registro", icon: "bi-calendar-check", label: "Registrar", path: "/registerT" },
        // { id: "registro", icon: "bi-pencil-square", label: "Registro" },
        // { id: "usuarios", icon: "bi-people", label: "Usuarios" },
        // { id: "reportes", icon: "bi-bar-chart-line", label: "Reportes" },
        // { id: "config", icon: "bi-gear", label: "Configuración" },
    ];



    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="sidebar-overlay " onClick={onToggle} />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>

                {/* Toggle button */}
                <button
                    className="sidebar-toggle-btn"
                    onClick={onToggle}
                    title={isOpen ? "Ocultar menú" : "Mostrar menú"}
                >
                    <i className={`bi ${isOpen ? "bi-chevron-double-left" : "bi-chevron-double-right"}`} />
                </button>

                {/* User card */}
                <div className="sidebar-user">
                    <div className="sidebar-user__avatar-wrap">
                        <img
                            src="src/app/assets/images/userLogo.png"
                            alt="user"
                            className="sidebar-user__avatar"
                        />
                        <span className={`sidebar-user__status ${isOpen ? "mb-sm-5" : ""}`} />
                    </div>


                    {isOpen && (
                        <div className="sidebar-user__info">
                            <span className="sidebar-user__name">
                                {user?.name} {user?.lName}
                            </span>
                            <div className="sidebar-user" style={{ width: "124px", marginLeft: "1rem" }}>
                                <div className="sidebar-user__info">
                                    <span className="sidebar-user__role">
                                        {user?.role ?? "Sin rol"}
                                    </span>

                                    <span className="sidebar-user__username">
                                        @{user?.username}
                                    </span>
                                </div>

                                <div
                                    className="sidebar-user__icon"
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        handleLogout()
                                    }}
                                >
                                    <Icon
                                        name="FaPowerOff"
                                        size={20}
                                        CStyle={{ color: "white" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar-divider" />

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.id}>
                                    <button
                                        className={`sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""
                                            }`}
                                        onClick={() => navigate(item.path)}
                                        title={!isOpen ? item.label : undefined}
                                    >
                                        <i className={`bi ${item.icon} sidebar-nav__icon`} />

                                        {isOpen && (
                                            <span className="sidebar-nav__label">
                                                {item.label}
                                            </span>
                                        )}

                                        {isActive && isOpen && (
                                            <span className="sidebar-nav__indicator" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-spacer" />

                <div className="sidebar-divider" />

                {/* Logout */}
                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                        title={!isOpen ? "Cerrar sesión" : undefined}
                    >
                        <i className="bi bi-box-arrow-left sidebar-nav__icon" />
                        {isOpen && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}