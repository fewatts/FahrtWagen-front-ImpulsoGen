import { useContext, useEffect, useState } from "react";
import { Cliente } from "../../../models/Cliente";
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../../service/Service";
import './ListarClientes.css';
import CardCliente from "../cardCliente/CardCliente";

export function ListarClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            alert('Sem token, redirecionando para login...');
            navigate('/auth');
        }
    }, [token, navigate]);

    async function getClientes() {
        try {
            const resposta = await buscar('/clientes', setClientes, {
                headers: { Authorization: token },
            });

            console.log(resposta);
        } catch (error) {
            alert('Não foi possível buscar os clientes');
            console.error(error);
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
