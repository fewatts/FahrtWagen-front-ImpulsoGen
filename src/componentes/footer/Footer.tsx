import gitlogo from './../../assets/github.svg';
import './Footer.css';

export function Footer() {
    return (
        <footer>
            <a href="https://github.com/fewatts/" target='blank'><abbr title="repositório no github"><img src={gitlogo} alt="Repositório" className='git' /></abbr></a>
            <p>Copyright Fahrt Wagen ©</p>
        </footer>
    );
}