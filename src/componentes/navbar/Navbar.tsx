import { Link, useNavigate } from "react-router-dom";
import logo from './../../assets/favicon.png';
import './Navbar.css';
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { usuario, handleLogout } = useContext(AuthContext);

    function logout() {
        handleLogout();
        alert('Usuário deslogado com sucesso');
        navigate('/auth');
    }

    let navbarComponent;

    if (usuario.token !== '') {
        navbarComponent = (
            <nav className='navbar'>
                <picture className='logo-container'>
                    <Link to='/home'><img src={logo} alt="logo" className='logo' /></Link>
                </picture>

                <div id='itens'>
                    <ul id='itens2'>
                        <li><Link to='/home'>Home</Link></li>
                        <li><Link to='/clientes'>Clientes</Link></li>
                        <li><Link to='/carros'>Carros</Link></li>
                        <li><Link to='/reservas'>Reservas</Link></li>
                        <li><Link to='/' onClick={logout}>Logout</Link></li>
                    </ul>
                </div>

                <Link to='/menu'>
                    <span id='burguer' className="material-symbols-outlined">
                        menu
                    </span>
                </Link>
            </nav>
        );
    }

    return (
        <>
            {navbarComponent}
        </>
    );
}

export default Navbar;