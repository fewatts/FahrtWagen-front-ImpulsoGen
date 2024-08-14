import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { buscarPeloId, deletar } from '../../../service/Service';
import './DeletarReserva.css'; // Atualize o nome do CSS se necessário
import { Reserva } from '../../../models/Reserva'; // Atualize o caminho do modelo
import { toastAlerta } from '../../../utils/ToastAlert';

export function DeletarReserva() {
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        try {
            await buscarPeloId(`/reservas/${id}`, setReserva, {
                headers: {
                    Authorization: token,
                },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao buscar a reserva';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro inesperado: ${error.message}`, 'erro');
            }
        }
    }

    async function apagarReserva() {
        try {
            await deletar(`/reservas/${id}`, {
                headers: {
                    Authorization: token,
                },
            });
            toastAlerta('Reserva excluída com sucesso', 'sucesso');
            navigate('/reservas');
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao excluir a reserva';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else if (error.toString().includes('403')) {
                toastAlerta('Token vencido, por favor faça login novamente', 'info');
                handleLogout();
            } else {
                toastAlerta(`Erro inesperado: ${error.message}`, 'erro');
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            toastAlerta('Você precisa estar logado', 'info');
            navigate('/auth');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);


    return (
        <main className="form-container">
            <section className="car-form">
                <header className="form-header">
                    <h1>Excluir Reserva</h1>
                </header>
                {reserva ? (
                    <form>
                        <fieldset>
                            <legend>Detalhes da Reserva</legend>
                            <div className="form-group">
                                <p><strong>ID Reserva:</strong> {reserva.idReserva}</p>
                                <p><strong>Carro:</strong> {reserva.carro}</p>
                                <p><strong>Cliente:</strong> {reserva.cliente}</p>
                                <p><strong>Data Início:</strong> {reserva.dataInicio}</p>
                                <p><strong>Data Fim:</strong> {reserva.dataFim}</p>
                                <p><strong>Valor:</strong> {reserva.valor}</p>
                                <p><strong>Confirmada:</strong> {reserva.confirmada ? 'Sim' : 'Não'}</p>
                            </div>
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={apagarReserva}
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={() => navigate('/reservas')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </fieldset>
                    </form>
                ) : (
                    <p>Carregando dados da reserva...</p>
                )}
            </section>
        </main>
    );
}
