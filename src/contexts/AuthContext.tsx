import { createContext, ReactNode, useState } from "react"; // Importa funções e tipos necessários do React
import { UsuarioLogin } from "../models/UsuarioLogin"; // Importa o modelo de dados do usuário
import { login } from "../service/Service"; // Importa a função de login do serviço
import { toastAlerta } from "../utils/ToastAlert";

// Define a interface para as propriedades do contexto de autenticação
interface AuthContextProps {
    usuario: UsuarioLogin; // Objeto de usuário que armazena as informações do usuário autenticado
    handleLogout(): void; // Função para deslogar o usuário
    handleLogin(usuario: UsuarioLogin): Promise<void>; // Função para logar o usuário, retornando uma Promise
    isLoading: boolean; // Indicador de carregamento (usado para mostrar um spinner ou bloquear interações durante o login)
}

// Define a interface para as propriedades do provedor de autenticação
interface AuthProviderProps {
    children: ReactNode; // Elementos filhos que serão renderizados dentro do provedor
}

// Cria o contexto de autenticação com um valor inicial vazio
export const AuthContext = createContext({} as AuthContextProps);

// Define o componente provedor de autenticação
export function AuthProvider({ children }: AuthProviderProps) {

    // Estado para armazenar os dados do usuário logado
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        email: "",
        senha: "",
        token: ""
    });

    // Estado para gerenciar o status de carregamento durante o processo de login
    const [isLoading, setIsLoading] = useState(false);

    // Função para realizar o login do usuário
    async function handleLogin(userLogin: UsuarioLogin) {
        setIsLoading(true); // Define o estado de carregamento como verdadeiro

        try {
            await login(`/login`, userLogin, setUsuario); // Chama a função de login do serviço
            toastAlerta('Usuário logado com sucesso', 'sucesso');
        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                const status = error.response.status;
                const message = error.response.data  || 'Erro ao efetuar login';
                const errorMessage = `${status}: ${message}`;
                toastAlerta(errorMessage, 'erro');
            } else if (error.request) {
                // A requisição foi feita, mas nenhuma resposta foi recebida
                toastAlerta('Erro na conexão com o servidor', 'erro');
            } else {
                // Algo aconteceu ao configurar a requisição
                toastAlerta(`Erro inesperado: ${error.message}`, 'erro');
            }
        } finally {
            setIsLoading(false); // Define o estado de carregamento como falso
        }
    }

    // Função para deslogar o usuário, resetando o estado de `usuario`
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            email: "",
            senha: "",
            token: ""
        });
    }

    // Retorna o provedor de contexto, fornecendo os valores e funções para os componentes filhos
    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
