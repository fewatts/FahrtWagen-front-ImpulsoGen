import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import './Menu.css';
import { toastAlerta } from "../../utils/ToastAlert";

export function Menu() {

    const navigate = useNavigate();
    const { handleLogout } = useContext(AuthContext);

    function logout() {
        handleLogout();
        toastAlerta('Usuário deslogado com sucesso', 'info');
        navigate('/auth');
    }

    return (
        <main className="menu-container">
            <nav className="menu-nav">
                <ul className="menu-list">
                    <li><Link to='/home' className="menu-link">Home</Link></li>
                    <li><Link to='/clientes' className="menu-link">Clientes</Link></li>
                    <li><Link to='/carros' className="menu-link">Carros</Link></li>
                    <li><Link to='/reservas' className="menu-link">Reservas</Link></li>
                    <li><Link to='/' className="menu-link" onClick={logout}>Logout</Link></li>
                </ul>
            </nav>
        </main>
    );
}
