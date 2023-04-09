import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Alert from "../components/Alert"
import clienteAxios from '../config/clienteAxios';



const ConfirmarCuenta = () => {

  const { id }=useParams();
  const [alert,setAlert]=useState({
    msg:"",
    error:false
  });
  const [cuentaConfirmada,setCuentaConfirmada]=useState(false);
  
  useEffect(() => {
    const confirmarCuenta=async()=>{
  
      try {
        const { data }=await clienteAxios.get(`/usuarios/confirmar/${id}`);
        
        setCuentaConfirmada(true);
        setAlert({
          msg:"Cuenta confirmada",
          error:false
        });
      } catch (error) {
        setAlert({
          msg:(error as any).response.data.msg,
          error:true
        });
      }
    };
    return ()=>{confirmarCuenta()};
  }, []);
  
  const { msg }=alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
          Confirma tu cuenta y comienza a crear tus <span className="text-slate-700">proyectos</span>{" "}
          
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg.length>0 && <Alert alerta={alert}/>}
        {cuentaConfirmada && (
          <Link 
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia Sesión</Link>
        )}
      </div>
    </>
  )
}

export default React.memo(ConfirmarCuenta);