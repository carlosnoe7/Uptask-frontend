import { useState } from "react"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clienteAxios from "../config/clienteAxios";


const Registrar = () => {

  const [nombre,setNombre] =useState("");
  const [email,setEmail] =useState("");
  const [password,setPassword] =useState("");
  const [repetirPassword,setRepetirPassword] =useState("");

  const handleSubmit=async(e:any) => {
    e.preventDefault();
    if ([nombre,email,password,repetirPassword].includes("")) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (password!==repetirPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password.length<6) {
      toast.error("El password es muy corto, agrega mínimo 6 caracteres");
      return;
    }

    //Crea el usuario en la API
    try {
      const {data}=await clienteAxios.post("/usuarios",{
        nombre,email,password
      });

      
      toast.success(data.msg);
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
    } catch (error) {
      toast.error((error as any).response.data.msg);
    }
  }

  

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea tu cuenta y administra tus <span className="text-slate-700">proyectos</span>{" "}
        
      </h1>

      <form 
        className="my-10 mb-5 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
        >
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="nombre">Nombre</label>
          <input 
            id="nombre"
            type="text"
            placeholder="Escriba su nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
             />
        </div>
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
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="password2">Confirmar Password</label>
          <input 
            id="password2"
            type="password"
            placeholder="Repetir su contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={(e)=>setRepetirPassword(e.target.value)}
             />
        </div>

        <input 
          type="submit"
          value="Crear Cuenta" 
          className="bg-sky-700 w-full py-3 
            text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? ¡Inicia Sesión!</Link>
        <Link 
          to="/forgot-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
      </nav>

      <ToastContainer />
    </>
  )
}

export default Registrar