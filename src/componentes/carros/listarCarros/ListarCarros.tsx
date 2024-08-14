import { useContext, useEffect, useState } from "react";
import { Carro } from "../../../models/Carro";
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../../service/Service";
import './ListarCarros.css';
import CardCarro from "../cardCarro/CardCarro";
import { toastAlerta } from "../../../utils/ToastAlert";

export function ListarCarros() {
    const [carros, setCarros] = useState<Carro[]>([]);
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            toastAlerta('Sem token, redirecionando para login...', 'info');
            navigate('/auth');
        }
    }, [token, navigate]);

    async function getCarros() {
        try {
            await buscar('/carros', setCarros, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Não foi possível buscar os carros';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
            }
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
                        <CardCarro carro={carro} />
                    ))}
                </section>
            )}
        </section>
    );
}
