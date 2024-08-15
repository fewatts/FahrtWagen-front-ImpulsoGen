import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Carro } from '../../../models/Carro';
import './FormCarro.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { atualizar, buscarPeloId, cadastrar } from '../../../service/Service';
import { toastAlerta } from '../../../utils/ToastAlert';


function FormularioCarro() {

    const [carro, setCarro] = useState<Carro>({
        idCarro: 0,
        marca: '',
        modelo: '',
        ano: 0,
        placa: '',
        valor: 0,
        manutencaoEmDia: false,
        ativo: false,
    });

    const { usuario, handleLogout } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const token = usuario.token;
    let navigate = useNavigate();

    async function buscarPorId(id: string) {
        try {
            await buscarPeloId(`/carros/${id}`, setCarro, {
                headers: {
                    Authorization: token,
                },
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

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    useEffect(() => {
        if (token === '') {
            toastAlerta('Você precisa estar logado', 'info');
            navigate('/auth');
        }
    }, [token]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setCarro({
            ...carro,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    async function gerarNovoCarro(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();

        if (id !== undefined) {
            try {
                await atualizar(`/carros/${id}`, carro, setCarro, {
                    headers: {
                        Authorization: token,
                    },
                });
                toastAlerta('Carro atualizado com sucesso', 'sucesso');
                retornar();
            } catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data || 'Erro ao atualizar o carro';
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
        } else {
            try {
                await cadastrar('/carros', carro, setCarro, {
                    headers: {
                        Authorization: token,
                    },
                });
                toastAlerta('Carro cadastrado com sucesso', 'sucesso');
                retornar();
            } catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data || 'Erro ao cadastrar o carro';
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
    }

    function retornar() {
        navigate('/home');
    }

    return (
        <main className="form-container">
            <form onSubmit={gerarNovoCarro} className="car-form">
                <header>
                    <h1 className="form-header">
                        {id === undefined ? 'Cadastrar novo carro' : 'Atualizar carro'}
                    </h1>
                </header>
                <div className="form-group">
                    <label htmlFor="marca" className="form-label">Marca</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={carro.marca || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modelo" className="form-label">Modelo</label>
                    <input
                        type="text"
                        id="modelo"
                        name="modelo"
                        value={carro.modelo || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ano" className="form-label">Ano</label>
                    <input
                        type="number"
                        id="ano"
                        name="ano"
                        value={carro.ano || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="placa" className="form-label">Placa</label>
                    <input
                        type="text"
                        id="placa"
                        name="placa"
                        value={carro.placa || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="valor" className="form-label">Valor</label>
                    <input
                        type="number"
                        id="valor"
                        name="valor"
                        value={carro.valor || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="manutencaoEmDia" className="form-label">Manutenção em Dia</label>
                    <input
                        type="checkbox"
                        id="manutencaoEmDia"
                        name="manutencaoEmDia"
                        checked={carro.manutencaoEmDia || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-checkbox"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ativo" className="form-label">Ativo</label>
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={carro.ativo || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-checkbox"
                    />
                </div>
                <button
                    className="submit-btn"
                    type="submit"
                >
                    {id === undefined ? 'Cadastrar' : 'Atualizar'}
                </button>
            </form>
        </main>
    );
}

export default FormularioCarro;
