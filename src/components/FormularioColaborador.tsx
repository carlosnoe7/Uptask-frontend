import { useEffect, useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alert from "./Alert";

const FormularioColaborador = () => {
  const [email, setEmail] = useState("");
  const { mostrarAlerta, alert,submitColaborador }=useProyectos();
  

  useEffect(() => {
    
  }, []);
  

  const handleSubmit=(e:any)=>{
    e.preventDefault();

    if (email==='') {
        mostrarAlerta({msg:"El email es obligatorio",error:true});
        return;
    }
    submitColaborador(email);

  };

  const { msg }=alert;

  return (
    <form className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow" onSubmit={handleSubmit}>
        { msg.length>0 && <Alert alerta={alert}/>}
      <div className="mb-5 ">
        <label
          className="text-gray-700 
            uppercase font-bold"
          htmlFor="email"
        >
          Email colaborador
        </label>
        <input
          id="email"
          type="email"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Email del colaborador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <input
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 
                    w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
        value={"Buscar Colaborador"}
      />
    </form>
  );
};

export default FormularioColaborador;
