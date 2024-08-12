import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DeletarCarro } from "./componentes/carros/deletarCarro/DeletarCarro"
import FormularioCarro from "./componentes/carros/formCarro/FormCarro"
import { Footer } from "./componentes/footer/Footer"
import Navbar from "./componentes/navbar/Navbar"
import { AuthProvider } from "./contexts/AuthContext"
import { Auth } from "./paginas/auth/Auth"
import Home from "./paginas/home/Home"
import { ListarCarros } from "./componentes/carros/listarCarros/ListarCarros"
import { ListarClientes } from './componentes/clientes/listarClientes/ListarClientes';
import FormCliente from "./componentes/clientes/formCliente/FormCliente"
import { DeletarCliente } from "./componentes/clientes/deletarCliente/DeletarCliente"
import { Menu } from "./componentes/menu/Menu"
import { ListarReservas } from "./componentes/reservas/listarReservas/ListarReservas"
import { FormReserva } from "./componentes/reservas/formReserva/FormReserva"
import { DeletarReserva } from "./componentes/reservas/deletarReservas/DeletarReserva"



function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/carros" element={<ListarCarros />} />
            <Route path="/clientes" element={<ListarClientes />} />
            <Route path="/reservas" element={<ListarReservas />} />
            <Route path="/editarCarro/:id" element={<FormularioCarro />} />
            <Route path="/deletarCarro/:id" element={<DeletarCarro />} />
            <Route path="/cadastrarCarro" element={<FormularioCarro />} />
            <Route path="/editarCliente/:id" element={<FormCliente />} />
            <Route path="/deletarCliente/:id" element={<DeletarCliente />} />
            <Route path="/cadastrarCliente" element={<FormCliente />} />
            <Route path="/editarReserva/:id" element={<FormReserva />} />
            <Route path="/deletarReserva/:id" element={<DeletarReserva />} />
            <Route path="/cadastrarReserva" element={<FormReserva />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
