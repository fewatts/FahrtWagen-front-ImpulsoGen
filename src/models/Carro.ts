export interface Carro {
    idCarro: number | null;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
    valor: number;
    manutencaoEmDia: boolean;
    ativo: boolean;
}