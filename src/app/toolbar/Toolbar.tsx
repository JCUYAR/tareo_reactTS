import { useNavigate } from "react-router-dom";
import "../assets/generalAssets.css";
import { useAuth } from "../providers/AuthContext";

export default function Toolbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <header className="toolbar">
            <nav className="navbar navbar-expand-lg navbar-light navbarnbs">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="container-fluid">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Registro</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                    </ul>
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {`Usuario: ${user?.username}`}
                        </button>

                        <div className="dropdown-menu dropdown-menu-end p-0 border-1s shadow-2">
                            <div className="card" style={{ width: "250px", }}>

                                {/* Imagen */}
                                <div 
                                    className="text-center pt-3"
                                >
                                    <img
                                        src="src/app/assets/images/userLogo.png"
                                        alt="user"
                                        className="rounded-circle border border-3 border-primary"
                                        width="80"
                                        height="80"
                                    />
                                </div>

                                {/* Bienvenida */}
                                <div className="card-body text-center">
                                    <h6 className="">
                                        {`Bienvenido:`}
                                    </h6>

                                    <strong>
                                        {`${user?.name} ${user?.lName}`}
                                    </strong>

                                    <p className="mb-0">
                                        {`Rol: ${user?.role ?? "El pepe"}`}
                                    </p>
                                </div>

                                {/* Logout */}
                                <div className="card-footer bg-white border-0 text-center">
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}