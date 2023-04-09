import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import useProyectos from "../hooks/useProyectos";
import Tarea from "../components/Tarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import useAdmin from "../hooks/useAdmin";
import { io } from "socket.io-client";


let socket:any;



const Proyecto = () => {


    const params=useParams();
    const {id}=params;
    const {obtenerProyecto,proyecto,cargando,
      handleModalTarea,submitTareasProyecto,
      eliminarTareaProyecto,actualizarTareaProyecto,cambiarEstadoTarea}=useProyectos();
    const isAdmin:any=useAdmin();



    useEffect(() => {
        obtenerProyecto(id);
    }, []);

    useEffect(() => {
      socket=io(import.meta.env.VITE_BACKEND_URL);
      socket.emit('abrir proyecto',params.id)
    }, []);
    
    useEffect(() => {
      socket.on("tarea agregada",(tareaNueva:any)=>{
        if (tareaNueva.proyecto===proyecto._id) {
          submitTareasProyecto(tareaNueva);
        }
      });

      socket.on('tarea eliminada',(tareaEliminada:any)=>{
        if (tareaEliminada.proyecto===proyecto._id) {
          eliminarTareaProyecto(tareaEliminada);
        }
      });
      
      socket.on('tarea actualizada',(tareaActualizada:any)=>{
        if (tareaActualizada.proyecto._id===proyecto._id) {
          actualizarTareaProyecto(tareaActualizada);
        }

      });

      socket.on('nuevo estado',(nuevoEstadoTarea:any)=>{
        if (nuevoEstadoTarea.proyecto._id===proyecto._id) {
          cambiarEstadoTarea(nuevoEstadoTarea);
        }
      });
    });


    
    
    const { nombre }=proyecto;




  return (
    (cargando || Object.keys(proyecto).length===0) ? <Loading /> :
    
    <>
      <div className="flex justify-between">
          <h1 className="font font-black text-4xl">{nombre}</h1>
          {isAdmin && (
          <div className="flex items-center gap-2 text-gray-400 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            <Link 
              to={`/proyectos/editar/${id}`}
              className='uppercase font-bold'
            >
              Editar
            </Link>
          </div>
          )}
      </div>
          {
            isAdmin && (
            <button 
              onClick={handleModalTarea}
              type="button" className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

              Nueva Tarea
            </button>

            )
          }

          <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

          
          {/* //TODO: Change type from tarea */}
          <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.tareas?.length ? proyecto.tareas?.map((tarea:any)=>(
              <Tarea 
                key={tarea._id}
                tarea={tarea}
              />
            )) : <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
          </div>
          {
            isAdmin && (
            <>
              <div className="flex items-center justify-between mt-10">
                <p className="text-center my-5">Colaboradores</p>
                <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`} 
                  className="text-gray-400 uppercase font-bold hover:text-black">
                  Añadir
                </Link>
              </div>
              <div className="bg-white shadow mt-10 rounded-lg">
                {proyecto.colaboradores?.length ? proyecto.colaboradores?.map((colaborador:any)=>(
                  <Colaborador key={colaborador._id} colaborador={colaborador}/>
                )) : <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
              </div>
            </>
            )
          }


          <ModalFormularioTarea 
            
          />
          <ModalEliminarTarea />
          <ModalEliminarColaborador />

    </>
    
  )
}

export default Proyecto;