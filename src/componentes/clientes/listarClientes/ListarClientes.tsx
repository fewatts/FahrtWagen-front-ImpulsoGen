import { useContext, useEffect, useState } from "react";
import { Cliente } from "../../../models/Cliente";
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../../service/Service";
import './ListarClientes.css';
import CardCliente from "../cardCliente/CardCliente";
import { toastAlerta } from "../../../utils/ToastAlert";

export function ListarClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            toastAlerta('Sem token, redirecionando para login...', 'info');
            navigate('/auth');
        }
    }, [token, navigate]);

    async function getClientes() {
        try {
            await buscar('/clientes', setClientes, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Não foi possível buscar os clientes';
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
            getClientes();
        }
    }, [token]);

    return (
        <section className="clientes-container">
            <h2 className="titulo-lista">Nossos clientes:</h2>
            {clientes.length === 0 ? (
                <p className="carregando">Carregando clientes...</p>
            ) : (
                <section className="clientes-list">
                    {clientes.map(cliente => (
                        <CardCliente key={cliente.idCliente} cliente={cliente} />
                    ))}
                </section>
            )}
        </section>
    );
}
