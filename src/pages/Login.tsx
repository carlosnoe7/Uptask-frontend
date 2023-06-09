import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import clienteAxios from '../config/clienteAxios';
import useAuth from "../hooks/useAuth";



const Login = () => {

  const [email,setEmail]=useState("");
  const [password,setPassword] = useState("");
  const [alert,setAlert] = useState({
    msg:"",
    error:false
  });
  const navigate=useNavigate();

  const { auth,setAuth }=useAuth();

  useEffect(() => {
    if (auth._id) navigate('/proyectos');
}, [auth]);

  const handleSubmit = async(e:any)=>{
    e.preventDefault();
    if ([email,password].includes("")) {
      setAlert({
        msg:"No se pueden dejar campos vacíos",
        error:true
      })
      return;
    }

    try {
      const { data }=await clienteAxios.post("/usuarios/login",{email,password});
      localStorage.setItem('token',data.token);
      setAuth(data);

    } catch (error) {
      setAlert({
        msg:(error as any)?.response.data?.msg || "Hubo un error",
        error:true
      })
    }
  }

  const {msg}=alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia sesión y administra tus <span className="text-slate-700">proyectos</span>{" "}
        
      </h1>

      {msg && <Alert alerta={alert}/>}

      <form 
        className="my-10 mb-5 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            placeholder="example@email.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
             />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            placeholder="Contraseña de su cuenta"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
             />
        </div>

        <input 
          type="submit"
          value="Iniciar Sesión" 
          className="bg-sky-700 w-full py-3 
            text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          to="/registrar"
          className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? ¡Regístrate!</Link>
        <Link 
          to="/forgot-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
      </nav>
    </>
  );
};

export default Login;
