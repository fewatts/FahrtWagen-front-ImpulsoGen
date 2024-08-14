export interface Reserva {
    idReserva: number;
    carro: number;
    cliente: number;
    dataInicio: string;
    dataFim: string;
    valor: number | null;
    confirmada: boolean | null;
}