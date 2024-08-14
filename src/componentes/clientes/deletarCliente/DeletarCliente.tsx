import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { buscarPeloId, deletar } from '../../../service/Service';
import './DeletarCliente.css';
import { Cliente } from '../../../models/Cliente';
import { toastAlerta } from '../../../utils/ToastAlert';

export function DeletarCliente() {
    const [cliente, setCliente] = useState<Cliente>();
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        try {
            await buscarPeloId(`/clientes/${id}`, setCliente, {
                headers: {
                    Authorization: token
                }
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao buscar o cliente';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
            }
        }
    }

    async function apagarCliente() {
        try {
            await deletar(`/clientes/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            toastAlerta('Cliente excluído com sucesso', 'sucesso');
            navigate('/clientes');
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao excluir o cliente';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else if (error.toString().includes('403')) {
                toastAlerta('Token vencido, por favor faça login novamente', 'info');
                handleLogout();
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
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
    }, [id, token]);

    return (
        <main className="form-container">
            <section className="car-form">
                <header className="form-header">
                    <h1>Excluir Cliente</h1>
                </header>
                {cliente ? (
                    <form>
                        <fieldset>
                            <legend>Detalhes do Cliente</legend>
                            <div className="form-group">
                                <p><strong>Nome:</strong> {cliente.nome}</p>
                                <p><strong>Email:</strong> {cliente.email}</p>
                                <p><strong>CPF:</strong> {cliente.cpf}</p>
                                <p><strong>Telefone:</strong> {cliente.telefone}</p>
                            </div>
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={apagarCliente}
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={() => navigate('/clientes')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </fieldset>
                    </form>
                ) : (
                    <p>Carregando dados do cliente...</p>
                )}
            </section>
        </main>
    );
}
