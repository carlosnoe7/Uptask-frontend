import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Alert from "../components/Alert"
import clienteAxios from '../config/clienteAxios';


const RecoverPassword = () => {

  const [tokenValido,setTokenValido]=useState(false);
  const [password,setPassword]=useState("");
  const [confirmarPassword,setConfirmarPassword]=useState("");
  const [passwordModificado,setPasswordModificado]=useState(false);

  const [alert,setAlert] = useState({
    msg:"",
    error:false
  })
  const params=useParams();
  const { token }=params;

  const handleSubmit=async(e:any)=>{
    e.preventDefault();

    if (password.length<6 || password!==confirmarPassword) {
      setAlert({
        msg:"El password tiene menos de 6 caracteres o no coincide",
        error:true
      });

      return;
    }

    try {
      const url= `/usuarios/forgot-password/${token}`;

      const { data }=await clienteAxios.post(url,{password});
      setAlert({
        msg:data.msg,
        error:false
      });
      setPasswordModificado(true);
    } catch (error) {
      setAlert({
        msg:(error as any).response.data.msg,
        error:true
      })
    }
  }

  useEffect(() => {
    const comprobarToken=async()=>{
      try {
        const { data }=await clienteAxios.get(`/usuarios/forgot-password/${token}`);
        setTokenValido(true);

      } catch (error) {
        setAlert({
          msg:(error as any).response.data.msg,
          error:false
        })
      }
    }
    comprobarToken();
  }, []);

  const {msg}=alert;
  
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reestablece tu password y no pierdas acceso a tus <span className="text-slate-700">proyectos</span>{" "}
        
      </h1>

      {
        msg.length>0 && <Alert 
          alerta={alert}
        />
      }

      {
        tokenValido && (
          <form className="my-10 mb-5 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Escriba su nueva contraseña"
            value={password}
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
             />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" 
            htmlFor="password2">Confirmar Password</label>
          <input 
            id="password2"
            type="password"
            onChange={(e)=>setConfirmarPassword(e.target.value)}
            value={confirmarPassword}
            placeholder="Confirme su nueva contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
             />
        </div>

        <input 
          type="submit"
          value="Restablecer password" 
          className="bg-sky-700 w-full py-3 
            text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
      </form>
        )
      }

      <nav className="lg:flex lg:justify-between">
        {passwordModificado && (<Link 
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm">
            ¿Ya tienes una cuenta? ¡Inicia Sesión!
          </Link>)}
        
      </nav>
    </>
  )
}

export default RecoverPassword