import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Cliente } from '../../../models/Cliente';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { atualizar, buscarPeloId, cadastrar } from '../../../service/Service';
import './FormCliente.css'

function FormCliente() {
    const [cliente, setCliente] = useState<Cliente>({
        idCliente: null,
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { usuario, handleLogout } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const token = usuario.token;
    let navigate = useNavigate();

    async function buscarPorId(id: string) {
        await buscarPeloId(`/clientes/${id}`, setCliente, {
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
            alert('Sem token, redirecionando para login...');
            navigate('/auth');
        }
    }, [token]);

    function validarCampos(): boolean {
        const newErrors: { [key: string]: string } = {};

        const cpfRegex = /^\d{11}$/;
        if (!cpfRegex.test(cliente.cpf)) {
            newErrors.cpf = 'CPF deve ter 11 dígitos numéricos.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cliente.email)) {
            newErrors.email = 'E-mail inválido.';
        }

        const telefoneRegex = /^\d{11}$/;
        if (!telefoneRegex.test(cliente.telefone)) {
            newErrors.telefone = 'Telefone deve ter 11 dígitos numéricos.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setCliente({
            ...cliente,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    async function gerarNovoCliente(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();

        if (validarCampos()) {
            if (id !== undefined) {
                try {
                    await atualizar(`/clientes/${id}`, cliente, setCliente, {
                        headers: {
                            Authorization: token,
                        },
                    });
                    alert('Cliente atualizado');
                    retornar();
                } catch (error: any) {
                    if (error.toString().includes('403')) {
                        alert('Token vencido, loga denovo');
                        handleLogout();
                    } else {
                        alert('Erro ao atualizar o cliente');
                        alert(error);
                    }
                }
            } else {
                try {
                    await cadastrar('/clientes', cliente, setCliente, {
                        headers: {
                            Authorization: token,
                        },
                    });
                    alert('Cliente cadastrado');
                    retornar();
                } catch (error: any) {
                    if (error.toString().includes('403')) {
                        alert('Token vencido, loga denovo');
                        handleLogout();
                    } else {
                        alert('Erro ao cadastrar o cliente');
                    }
                }
            }
        }
    }

    function retornar() {
        navigate('/clientes');
    }

    return (
        <main className="form-container">
            <form onSubmit={gerarNovoCliente} className="client-form">
                <header>
                    <h1 className="form-header">
                        {id === undefined ? 'Cadastrar novo cliente' : 'Atualizar cliente'}
                    </h1>
                </header>
                <div className="form-group">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={cliente.nome || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={cliente.email || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={cliente.cpf || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                    {errors.cpf && <p className="error-message">{errors.cpf}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="telefone" className="form-label">Telefone</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={cliente.telefone || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            atualizarEstado(e)
                        }
                        className="form-input"
                    />
                    {errors.telefone && <p className="error-message">{errors.telefone}</p>}
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

export default FormCliente;
