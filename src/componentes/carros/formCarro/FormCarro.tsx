import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Carro } from '../../../models/Carro';
import './FormCarro.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { atualizar, buscar, cadastrar } from '../../../service/Service';


function FormularioCarro() {

    const [carro, setCarro] = useState<Carro>({} as Carro);

    const { usuario, handleLogout } = useContext(AuthContext);

    const { id } = useParams<{ id: string }>();

    const token = usuario.token;

    let navigate = useNavigate();

    async function buscarPorId(id: string) {
        await buscar(`/carros/${id}`, setCarro, {
            headers: {
                Authorization: token,
            },
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    useEffect(() => {
        if (token === '') {
            alert('Pega teu token lá');
            navigate('/auth');
        }
    }, [token]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setCarro({
            ...carro,
            [e.target.name]: e.target.value,
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
                alert('Carro atualizado');
                retornar();
            } catch (error: any) {
                if (error.toString().includes('403')) {
                    alert('Token vencido, loga denovo');
                    handleLogout();
                } else {
                    alert('Erro ao atualizar o carro');
                }
            }
        } else {
            try {
                await cadastrar('/carros', carro, setCarro, {
                    headers: {
                        Authorization: token,
                    },
                });
                alert('Carro cadastrado');
                retornar();
            } catch (error: any) {
                if (error.toString().includes('403')) {
                    alert('Token vencido, loga denovo');
                    handleLogout();
                } else {
                    alert('Erro ao cadastrar o carro');
                }
            }
        }
    }

    function retornar() {
        navigate('/carros');
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
                        onChange={atualizarEstado}
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
