
import { useState } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert";
import clienteAxios from "../config/clienteAxios";


const ForgotPassword = () => {

  const [email,setEmail]=useState('');
  const [alert,setAlert]=useState({
    msg:'',
    error:false
  });

  const handleSubmit = async(e:any)=>{
    e.preventDefault();
    const emailRegEx=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRegEx.test(email)) {
      setAlert({
        msg:"El email no es valido",
        error:true
      })
      return;
    }

    try {
      const { data }=await clienteAxios.post(`/usuarios/forgot-password`,{
        email
      });
      setAlert({
        msg:data.msg,
        error:false
      });

    } catch (error) {
      setAlert({
        msg:(error as any).response.data.msg,
        error:true
      })
    }

  };

  const { msg }=alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu acceso y no pierdas tus <span className="text-slate-700">proyectos</span>{" "}
        
      </h1>
      {msg.length>0 && <Alert alerta={alert}/>}
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
            onChange={e=>setEmail(e.target.value)}
             />
        </div>

        <input 
          type="submit"
          value="Enviar Instrucciones" 
          className="bg-sky-700 w-full py-3 
            text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? ¡Inicia Sesión!</Link>
        <Link 
          to="/registrar"
          className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? ¡Regístrate!</Link>
      </nav>
    </>
  )
}

export default ForgotPassword