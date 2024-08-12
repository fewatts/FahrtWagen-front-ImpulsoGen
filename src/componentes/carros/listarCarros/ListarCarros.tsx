import { useContext, useEffect, useState } from "react";
import { Carro } from "../../../models/Carro";
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../../service/Service";
import './ListarCarros.css'; 
import CardCarro from "../cardCarro/CardCarro";

export function ListarCarros() {
    const [carros, setCarros] = useState<Carro[]>([]);
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            alert('Sem token, redirecionando para login...');
            navigate('/auth');
        }
    }, [token, navigate]);

    async function getCarros() {
        try {
            const resposta = await buscar('/carros', setCarros, {
                headers: { Authorization: token },
            });

            console.log(resposta);
        } catch (error) {
            alert('Não foi possível buscar os carros');
            console.error(error);
        }
    }

    useEffect(() => {
        if (token) {
            getCarros();
        }
    }, [token]);

    return (
        <section className="carros-container">
            <h2 className="titulo-lista">Nossos carros: </h2>
            {carros.length === 0 ? (
                <p className="carregando">Carregando carros...</p>
            ) : (
                <section className="carros-list">
                    {carros.map(carro => (
                        <CardCarro carro={carro}/>
                    ))}
                </section>
            )}
        </section>
    );
}
