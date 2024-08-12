import home from './../../assets/home.svg';
import { ListaCarros } from '../../componentes/carros/listarCarros/listaCarros';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main>
            <section className="home-container">
                <aside className="textos-home">
                    <h1 className="welcome-text">Bem-vindo!</h1>
                    <p className='para-home'>Gerencie seus negócio de aluguel de carros utilizando as melhores tecnologias do mercado</p>
                    <div className="card-actions">
                        <Link to={'/cadastrarCarro'} className="btn btn-edit">
                            Cadastrar carro
                        </Link>
                        <Link to={'#'} className="btn btn-edit">
                            Cadastrar Cliente
                        </Link>
                        <Link to={'#'} className="btn btn-edit">
                            Cadastrar Reserva
                        </Link>
                    </div>
                </aside>
                <picture className="home-image">
                    <img src={home} alt="Home" />
                </picture>
            </section>
            <ListaCarros />
        </main >
    );
}

export default Home;
