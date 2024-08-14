import { useContext, useEffect, useState } from "react";
import { Reserva } from "../../../models/Reserva";
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { buscar } from "../../../service/Service";
import './ListarReservas.css';
import CardReserva from "../cardreserva/CardReserva";
import { toastAlerta } from "../../../utils/ToastAlert";

export function ListarReservas() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            toastAlerta('Sem token, redirecionando para login...', 'info');
            navigate('/auth');
        }
    }, [token, navigate]);

    async function getReservas() {
        try {
            await buscar('/reservas', setReservas, {
                headers: { Authorization: token },
            });
        } catch (error) {
            toastAlerta('Não foi possível buscar as reservas', 'erro');
            console.error(error);
        }
    }

    useEffect(() => {
        if (token) {
            getReservas();
        }
    }, [token]);

    return (
        <section className="reservas-container">
            <h2 className="titulo-lista">Nossas reservas:</h2>
            {reservas.length === 0 ? (
                <p className="carregando">Carregando reservas...</p>
            ) : (
                <section className="reservas-list">
                    {reservas.map(reserva => (
                        <CardReserva key={reserva.idReserva} reserva={reserva} />
                    ))}
                </section>
            )}
        </section>
    );
}
