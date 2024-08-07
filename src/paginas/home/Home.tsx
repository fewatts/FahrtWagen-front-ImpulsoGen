import { useState, useEffect } from 'react';
import carrosData from './../../assets/carros.json';
import clientesData from './../../assets/clientes.json';
import reservasData from './../../assets/reservas.json';
import './Home.css';
import { Carro } from '../../models/Carro';
import { Cliente } from '../../models/Cliente';
import { Reserva } from '../../models/Reserva';

function Home() {
    const [carros, setCarros] = useState<Carro[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setCarros(carrosData as Carro[]);
            setClientes(clientesData as Cliente[]);
            setReservas(reservasData as Reserva[]);
        } catch (error) {
            setError('Erro ao carregar dados');
        }
    }, []);

    return (
        <main>
            <section>
                <h2>Carros Disponíveis</h2>
                {error && <p className="error">{error}</p>}
                <ul>
                    {carros.map(carro => (
                        <li key={carro.idCarro}>
                            <h3>{carro.marca} {carro.modelo}</h3>
                            <p>Ano: {carro.ano}</p>
                            <p>Placa: {carro.placa}</p>
                            <p>Diária: R${carro.valor.toFixed(2)}</p>
                            <p>Manutenção em Dia: {carro.manutencaoEmDia ? 'Sim' : 'Não'}</p>
                            <p>Status: {carro.ativo ? 'Ativo' : 'Inativo'}</p>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Clientes</h2>
                <ul>
                    {clientes.map(cliente => (
                        <li key={cliente.idCliente}>
                            <h3>{cliente.nome}</h3>
                            <p>CPF: {cliente.cpf}</p>
                            <p>Telefone: {cliente.telefone}</p>
                            <p>Email: {cliente.email}</p>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Reservas</h2>
                <ul>
                    {reservas.map(reserva => {
                        const carro = carros.find(c => c.idCarro === reserva.carro);
                        const cliente = clientes.find(c => c.idCliente === reserva.cliente);
                        return (
                            <li key={reserva.idReserva}>
                                <h3>Reserva ID: {reserva.idReserva}</h3>
                                <p>Carro: {carro ? `${carro.marca} ${carro.modelo}` : 'Carro não encontrado'}</p>
                                <p>Cliente: {cliente ? cliente.nome : 'Cliente não encontrado'}</p>
                                <p>Data Início: {new Date(reserva.dataInicio).toLocaleDateString()}</p>
                                <p>Data Fim: {new Date(reserva.dataFim).toLocaleDateString()}</p>
                                <p>Valor Total: R${reserva.valor.toFixed(2)}</p>
                                <p>Confirmada: {reserva.confirmada ? 'Sim' : 'Não'}</p>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
}

export default Home;
