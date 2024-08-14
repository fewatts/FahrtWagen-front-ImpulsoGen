import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { Reserva } from "../../../models/Reserva";
import { Carro } from "../../../models/Carro";
import { Cliente } from "../../../models/Cliente";
import './FormReserva.css';
import { useState, useContext, useEffect, ChangeEvent } from "react";
import { atualizar, buscarPeloId, cadastrar } from "../../../service/Service";
import { toastAlerta } from "../../../utils/ToastAlert";

export function FormReserva() {
    const [reserva, setReserva] = useState<Reserva>({
        idReserva: 0,
        carro: 0,
        cliente: 0,
        dataInicio: '',
        dataFim: '',
        valor: null,
        confirmada: null
    });

    const [carro, setCarro] = useState<Carro | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);

    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    useEffect(() => {
        if (!token) {
            toastAlerta('Você precisa estar autenticado para isso', 'info');
            navigate('/auth');
        }
    }, [token, navigate]);

    const { id } = useParams<{ id: string }>();

    async function buscarReservaPorId(id: string) {
        try {
            await buscarPeloId(`/reservas/${id}`, setReserva, {
                headers: { Authorization: token }
            });
        } catch (error) {
            toastAlerta('Erro ao buscar reserva', 'erro');
            console.error('Erro ao buscar reserva:', error);
        }
    }

    async function buscarCarroPorId(carroId: number) {
        try {
            await buscarPeloId(`/carros/${carroId}`, setCarro, {
                headers: { Authorization: token }
            });
        } catch (error) {
            toastAlerta('Erro ao buscar carro', 'erro');
            console.error('Erro ao buscar carro:', error);
            setCarro(null);
        }
    }

    async function buscarClientePorId(clienteId: number) {
        try {
            await buscarPeloId(`/clientes/${clienteId}`, setCliente, {
                headers: { Authorization: token }
            });
        } catch (error) {
            toastAlerta('Erro ao buscar cliente', 'erro');
            console.error('Erro ao buscar cliente:', error);
            setCliente(null);
        }
    }

    useEffect(() => {
        if (id) {
            buscarReservaPorId(id);
        }
    }, [id]);

    useEffect(() => {
        if (reserva.carro) {
            buscarCarroPorId(reserva.carro);
        }
    }, [reserva.carro]);

    useEffect(() => {
        if (reserva.cliente) {
            buscarClientePorId(reserva.cliente);
        }
    }, [reserva.cliente]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setReserva({
            ...reserva,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
    }

    function retornar() {
        navigate('/reservas');
    }

    async function gerarNovaReserva(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            if (id) {
                await atualizar(`/reservas/${id}`, reserva, setReserva, {
                    headers: { Authorization: token }
                });
                toastAlerta('Reserva atualizada com sucesso', 'sucesso');
            } else {
                await cadastrar(`/reservas`, reserva, setReserva, {
                    headers: { Authorization: token }
                });
                toastAlerta('Reserva cadastrada com sucesso', 'sucesso');
            }
            retornar();
        } catch (error: any) {
            console.error("Erro ao processar a solicitação:", error);

            if (error.toString().includes('403')) {
                toastAlerta('O token expirou, favor logar novamente', 'info');
                handleLogout();
            } else if (error.response) {
                const status = error.response.status;
                let message = '';

                if (Array.isArray(error.response.data) && error.response.data[0]?.mensagem) {
                    message = error.response.data.map((err: any) => err.mensagem).join('; ');
                } else if (typeof error.response.data === 'string') {
                    message = error.response.data;
                } else if (error.response.responseText) {
                    message = error.response.responseText;
                } else {
                    message = 'Erro desconhecido';
                }
                toastAlerta(`${status}: ${message}`, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
            }
        }
    }




    return (
        <div className="form-container">
            <div className="client-form">
                <h1 className="title">{id !== undefined ? 'Editar Reserva' : 'Cadastrar Reserva'}</h1>
                <form className="reserva-form" onSubmit={gerarNovaReserva}>
                    <div className="form-group">
                        <label htmlFor="carro" className="form-label">Carro</label>
                        <input
                            type="number"
                            id="carro"
                            name="carro"
                            className="form-input"
                            value={reserva.carro}
                            onChange={atualizarEstado}
                            required
                        />
                        {carro === null ? (
                            <div className="info">
                                <p>Carro não encontrado</p>
                            </div>
                        ) : (
                            carro && (
                                <div className="info">
                                    <p>Marca: {carro.marca}</p>
                                    <p>Modelo: {carro.modelo}</p>
                                    <p>Ano: {carro.ano}</p>
                                    <p>Placa: {carro.placa}</p>
                                    <p>Valor: {carro.valor}</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cliente" className="form-label">Cliente</label>
                        <input
                            type="number"
                            id="cliente"
                            name="cliente"
                            className="form-input"
                            value={reserva.cliente}
                            onChange={atualizarEstado}
                            required
                        />
                        {cliente === null ? (
                            <div className="info">
                                <p>Cliente não encontrado</p>
                            </div>
                        ) : (
                            cliente && (
                                <div className="info">
                                    <p>Nome: {cliente.nome}</p>
                                    <p>Email: {cliente.email}</p>
                                    <p>Telefone: {cliente.telefone}</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataInicio" className="form-label">Data Início</label>
                        <input
                            type="date"
                            id="dataInicio"
                            name="dataInicio"
                            className="form-input"
                            value={reserva.dataInicio}
                            onChange={atualizarEstado}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataFim" className="form-label">Data Fim</label>
                        <input
                            type="date"
                            id="dataFim"
                            name="dataFim"
                            className="form-input"
                            value={reserva.dataFim}
                            onChange={atualizarEstado}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        {id !== undefined ? 'Editar' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
