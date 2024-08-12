import Home from "./paginas/home/Home"
import Navbar from './componentes/navbar/Navbar';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./componentes/footer/Footer";
import { Auth } from "./paginas/auth/Auth";
import { AuthProvider } from './contexts/AuthContext';
import { ListaCarros } from "./componentes/carros/listarCarros/listaCarros";
import FormularioCarro from "./componentes/carros/formCarro/FormCarro";
import { DeletarCarro } from "./componentes/carros/deletarCarro/DeletarCarro";

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
            <Route path="/carros" element={<ListaCarros />} />
            <Route path="/editarCarro/:id" element={<FormularioCarro />} />
            <Route path="/deletarCarro/:id" element={<DeletarCarro />} />
            <Route path="/cadastrarCarro" element={<FormularioCarro />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
