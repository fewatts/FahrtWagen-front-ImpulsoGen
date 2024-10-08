import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { buscarPeloId, deletar } from '../../../service/Service';
import './DeletarCarro.css'; // Importa o CSS específico
import { Carro } from '../../../models/Carro';
import { toastAlerta } from '../../../utils/ToastAlert';

export function DeletarCarro() {
    const [carro, setCarro] = useState<Carro>();
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        try {
            await buscarPeloId(`/carros/${id}`, setCarro, {
                headers: {
                    Authorization: token
                }
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao buscar o carro';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                toastAlerta(`Erro: ${error.message}`, 'erro');
            }
        }
    }

    async function apagarCarro() {
        try {
            await deletar(`/carros/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            toastAlerta('Carro excluído com sucesso', 'sucesso');
            navigate('/carros');
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data || 'Erro ao excluir o carro';
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
                    <h1>Excluir Carro</h1>
                </header>
                {carro ? (
                    <form>
                        <fieldset>
                            <legend>Detalhes do Carro</legend>
                            <div className="form-group">
                                <p><strong>Marca:</strong> {carro.marca}</p>
                                <p><strong>Modelo:</strong> {carro.modelo}</p>
                                <p><strong>Ano:</strong> {carro.ano}</p>
                                <p><strong>Placa:</strong> {carro.placa}</p>
                                <p><strong>Valor:</strong> {carro.valor}</p>
                            </div>
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={apagarCarro}
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={() => navigate('/carros')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </fieldset>
                    </form>
                ) : (
                    <p>Carregando dados do carro...</p>
                )}
            </section>
        </main>
    );
}
