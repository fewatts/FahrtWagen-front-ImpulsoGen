import home from './../../assets/home.svg';
import { ListaCarros } from '../../componentes/carros/listaCarros';
import './Home.css';

function Home() {
    return (
        <main>
            <section className="home-container">
                <aside className="textos-home">
                    <h1 className="welcome-text">Bem-vindo!</h1>
                    <p>Gerencie seus negócio de aluguel de carros utilizando as melhores tecnologias do mercado</p>
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
