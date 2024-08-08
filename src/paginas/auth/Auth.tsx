import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioLogin } from "../../models/UsuarioLogin";
import { AuthContext } from "../../contexts/AuthContext";
import './Auth.css';

export function Auth() {
    const navigate = useNavigate(); // Hook do React Router para navegação programática

    // Estado local para armazenar os dados do usuário que está tentando logar
    const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
        {} as UsuarioLogin
    );

    // Obtém o usuário logado e a função de login do contexto de autenticação
    const { usuario, handleLogin, isLoading } = useContext(AuthContext);

    // Efeito colateral que redireciona o usuário para a página inicial se ele estiver autenticado
    useEffect(() => {
        if (usuario.token !== "") {
            navigate('/home'); // Redireciona para a página inicial se o usuário tiver um token
        }
    }, [usuario, navigate]);

    // Função para atualizar o estado do formulário conforme o usuário digita
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuarioLogin({
            ...usuarioLogin, // Mantém o estado anterior do objeto `usuarioLogin`
            [e.target.name]: e.target.value // Atualiza apenas o campo que foi modificado
        });
    }

    // Função para lidar com o envio do formulário de login
    function login(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault(); // Previne o comportamento padrão de submissão do formulário
        handleLogin(usuarioLogin); // Chama a função de login do contexto com os dados do usuário
    }

    return (
        <main className="main-container">
            <section aria-labelledby="login-heading" className="login-section">
                <h1 id="login-heading">Login</h1>

                {/* Formulário de login */}
                <form onSubmit={login} className="login-form">
                    <fieldset>
                        <legend>Entre com suas credenciais</legend>

                        {/* Campo de entrada para o nome de usuário */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={usuarioLogin.email}
                                onChange={atualizarEstado}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Campo de entrada para a senha */}
                        <div className="form-group">
                            <label htmlFor="senha" className="form-label">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={usuarioLogin.senha}
                                onChange={atualizarEstado}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Botão de submissão */}
                        <div className="form-group">
                            <button type="submit" disabled={isLoading} className="submit-button">
                                {isLoading ? "Entrando..." : "Entrar"}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </main>
    );
}
