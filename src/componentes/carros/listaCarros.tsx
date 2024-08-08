import { useContext, useEffect, useState } from "react";
import { Carro } from "../../models/Carro";
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../service/Service";
import './listaCarros.css'; 

export function ListaCarros() {
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

            console.log('Resposta da API:', resposta);
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
                        <article key={carro.idCarro} className="carro-item">
                            <h2>{carro.marca} {carro.modelo}</h2>
                            <p><strong>Ano:</strong> {carro.ano}</p>
                            <p><strong>Placa:</strong> {carro.placa}</p>
                            <p><strong>Valor:</strong> R${carro.valor.toFixed(2)}</p>
                            <p><strong>Manutenção em Dia:</strong> {carro.manutencaoEmDia ? 'Sim' : 'Não'}</p>
                            <p><strong>Ativo:</strong> {carro.ativo ? 'Sim' : 'Não'}</p>
                        </article>
                    ))}
                </section>
            )}
        </section>
    );
}
