import { Link } from "react-router-dom";
import { Cliente } from "../../../models/Cliente";
import "./CardCliente.css";

interface CardClienteProps {
    cliente: Cliente;
}

function CardCliente({ cliente }: CardClienteProps) {
    return (
        <article className="card-cliente">
            <header className="card-header">
                <h3>Cliente: {cliente.nome}</h3>
            </header>

            <section className="card-content">
                <dl>
                    <dt>CPF:</dt>
                    <dd>{cliente.cpf}</dd>

                    <dt>Telefone:</dt>
                    <dd>{cliente.telefone}</dd>

                    <dt>Email:</dt>
                    <dd>{cliente.email}</dd>
                </dl>
            </section>

            <div className="card-actions">
                <Link to={`/editarCliente/${cliente.idCliente}`} className="btn btn-edit">
                    Editar
                </Link>
                <Link to={`/deletarCliente/${cliente.idCliente}`} className="btn btn-delete">
                    Deletar
                </Link>
            </div>
        </article>
    );
}

export default CardCliente;
