import { useContext, useEffect, useState } from "react";
import { Reserva } from "../../../models/Reserva";
import { buscarPeloId } from "../../../service/Service";
import "./CardReserva.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { Cliente } from "../../../models/Cliente";
import { Carro } from "../../../models/Carro";
import { Link } from "react-router-dom";
import { toastAlerta } from "../../../utils/ToastAlert";

interface CardReservaProps {
    reserva: Reserva;
}

function ajustarData(dataString: string) {
    const data = new Date(dataString);
    data.setDate(data.getDate() + 1); // Incrementa o dia
    return data;
}

function CardReserva({ reserva }: CardReservaProps) {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [carro, setCarro] = useState<Carro | null>(null);
    const { usuario } = useContext(AuthContext);
    const token = usuario.token;

    async function getCliente() {
        try {
            await buscarPeloId(`/clientes/${reserva.cliente}`, setCliente, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Não foi possível buscar o cliente';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
            }
        }
    }

    async function getCarro() {
        try {
            await buscarPeloId(`/carros/${reserva.carro}`, setCarro, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Não foi possível buscar o carro';
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
            getCliente();
            getCarro();
        }
    }, [token, reserva.cliente, reserva.carro]);

    return (
        <article className="card-reserva">
            <header className="card-header">
                <h3>Reserva ID: {reserva.idReserva}</h3>
            </header>

            <section className="card-content">
                <dl>
                    <dt>Placa do Carro:</dt>
                    <dd>{carro ? carro.placa : 'Carro não encontrado'}</dd>

                    <dt>Nome do Cliente:</dt>
                    <dd>{cliente ? cliente.nome : 'Cliente não encontrado'}</dd>

                    <dt>Data de Início:</dt>
                    <dd>{ajustarData(reserva.dataInicio).toLocaleDateString()}</dd>

                    <dt>Data de Fim:</dt>
                    <dd>{ajustarData(reserva.dataFim).toLocaleDateString()}</dd>

                    <dt>Valor:</dt>
                    <dd>R$ {reserva.valor !== null && reserva.valor !== undefined ? reserva.valor.toFixed(2) : 'N/A'}</dd>

                </dl>
            </section>

            <div className="card-actions">
                <Link to={`/editarReserva/${reserva.idReserva}`} className="btn btn-edit">
                    Editar
                </Link>
                <Link to={`/deletarReserva/${reserva.idReserva}`} className="btn btn-delete">
                    Deletar
                </Link>
            </div>
        </article>
    );
}

export default CardReserva;