import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import Alert from "./Alert";


const FormularioProyecto = () => {

    const [id,setId]=useState(null);
    const [nombre,setNombre]=useState("");
    const [descripcion,setDescripcion]=useState("");
    const [fechaEntrega,setFechaEntrega]=useState("");
    const [cliente,setCliente]=useState("");

    const params=useParams();
    const { mostrarAlerta,alert,submitProyecto, proyecto }=useProyectos();



    useEffect(() => {
      if(params.id && proyecto.nombre){
        setNombre(proyecto.nombre);
        setDescripcion(proyecto.descripcion);
        setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
        setCliente(proyecto.cliente);
        setId(proyecto._id);
      }
    }, [params]);
    



    const handleSubmit = async(e:any)=>{
        e.preventDefault();

        if([nombre,descripcion,fechaEntrega,cliente].includes("")){
            mostrarAlerta({
                msg:"Todos los campos son requeridos",
                error:true
            });

            return;
        }

        // Pasar datos hacia el provider
        await submitProyecto({id,nombre,descripcion,fechaEntrega,cliente});

        setId(null);
        setNombre("");
        setDescripcion("");
        setFechaEntrega("");
        setCliente("");
        

    }

    const { msg }=alert;

  return (
    <form 
        className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}>
            { msg.length>0 && <Alert alerta={alert}/>}
        <div className="mb-5 ">
            <label className="text-gray-700 
            uppercase font-bold" htmlFor="nombre">Nombre Proyecto</label>
            <input 
                id="nombre"
                type="text"
                className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" 
                placeholder="Nombre del Proyecto"
                value={nombre}
                onChange={e=>setNombre(e.target.value)}
                />
        </div>
        <div className="mb-5 ">
            <label className="text-gray-700 
            uppercase font-bold" htmlFor="descripcion">Descripción</label>
            <textarea 
                id="descripcion"
                className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" 
                placeholder="Descripción"
                value={descripcion}
                onChange={e=>setDescripcion(e.target.value)}
                />
        </div>
        <div className="mb-5 ">
            <label className="text-gray-700 
            uppercase font-bold" htmlFor="fecha-entrega">Fecha Entrega</label>
            <input 
                id="fecha-entrega"
                type={"date"}
                className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" 
                value={fechaEntrega}
                onChange={e=>setFechaEntrega(e.target.value)}
                />
        </div>
        <div className="mb-5 ">
            <label className="text-gray-700 
            uppercase font-bold" htmlFor="cliente">Nombre Cliente</label>
            <input 
                id="cliente"
                type="text"
                className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" 
                placeholder="Nombre del Cliente"
                value={cliente}
                onChange={e=>setCliente(e.target.value)}
                />
        </div>

        <input 
            type="submit" 
            value={id ? "Actualizar Proyecto" : "Crear Proyecto" }
            className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
        />
    </form>
  )
}

export default FormularioProyecto;