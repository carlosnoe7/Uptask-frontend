import { BrowserRouter,Routes,Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./context/AuthProvider"
import { ProyectosProvider } from "./context/ProyectosContext"
import AuthLayout from "./layouts/AuthLayout"
import RutaProtegida from "./layouts/RutaProtegida"
import ConfirmarCuenta from "./pages/ConfirmarCuenta"
import EditarProyecto from './pages/EditarProyecto';
import ForgotPassword from "./pages/ForgotPassword"
import Login from "./pages/Login"
import NuevoColaborador from "./pages/NuevoColaborador"
import NuevoProyecto from "./pages/NuevoProyecto"
import Proyecto from "./pages/Proyecto"
import Proyectos from "./pages/Proyectos"
import RecoverPassword from "./pages/RecoverPassword"
import Registrar from "./pages/Registrar";





function App() {


  return (
    <div className="App">
        <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>

          <Routes>
              <Route path="/" element={<AuthLayout />}>
                  <Route index element={<Login />}/>
                  <Route path="registrar" element={<Registrar />}/>
                  <Route path="forgot-password" element={<ForgotPassword />}/>
                  <Route path="forgot-password/:token" element={<RecoverPassword />}/>
                  <Route path="confirmar/:id" element={<ConfirmarCuenta />}/>
              </Route>

              <Route path="/proyectos" element={<RutaProtegida />}>

                <Route index element={<Proyectos />}/>
                <Route path="crear-proyecto" element={<NuevoProyecto />} />
                <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />
                <Route path=":id" element={<Proyecto />} />
                <Route path="editar/:id" element={<EditarProyecto />} />
              </Route>
              
          </Routes>
          <ToastContainer />
        </ProyectosProvider>
      </AuthProvider>
        </BrowserRouter>
    </div>
  )
}

export default App
