import Home from "./paginas/home/Home"
import Navbar from './componentes/navbar/Navbar';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./componentes/footer/Footer";
import { Auth } from "./paginas/auth/Auth";
import { AuthProvider } from './contexts/AuthContext';

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
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
