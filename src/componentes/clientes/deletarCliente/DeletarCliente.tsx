import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { buscarPeloId, deletar } from '../../../service/Service';
import './DeletarCliente.css';
import { Cliente } from '../../../models/Cliente';

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
        } catch (error) {
            alert('Erro ao buscar o cliente');
        }
    }

    async function apagarCliente() {
        try {
            await deletar(`/clientes/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            alert('Cliente excluído com sucesso');
            navigate('/clientes');
        } catch (error: any) {
            if (error.toString().includes('403')) {
                alert('Token vencido, por favor faça login novamente');
                handleLogout();
            } else {
                alert('Erro ao excluir o cliente');
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/auth');
        }
    }, [token]);

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

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
