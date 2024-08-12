import { Link } from "react-router-dom";
import { Carro } from "../../../models/Carro";
import "./CardCarro.css";

interface CardCarroProps {
    carro: Carro;
}

function CardCarro({ carro }: CardCarroProps) {
    return (
        <article className="card-carro">
            <header className="card-header">
                <h3>Carro: {carro.marca} {carro.modelo} ({carro.ano})</h3>
            </header>

            <section className="card-content">
                <dl>
                    <dt>Placa:</dt>
                    <dd>{carro.placa}</dd>

                    <dt>Valor:</dt>
                    <dd>R$ {carro.valor.toFixed(2)}</dd>

                    <dt>Manutenção em Dia:</dt>
                    <dd>{carro.manutencaoEmDia ? "Sim" : "Não"}</dd>

                    <dt>Status:</dt>
                    <dd>{carro.ativo ? "Ativo" : "Inativo"}</dd>
                </dl>
            </section>

            <div className="card-actions">
                <Link to={`/editarCarro/${carro.idCarro}`} className="btn btn-edit">
                    Editar
                </Link>
                <Link to={`/deletarCarro/${carro.idCarro}`} className="btn btn-delete">
                    Deletar
                </Link>
            </div>
        </article>
    );
}

export default CardCarro;
