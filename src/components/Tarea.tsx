

import { formatearFecha } from "../helpers/FormatearFecha";
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";


interface TareaProps{
    tarea:any
}

const Tarea = ({tarea}:TareaProps) => {

    const { handleModalEditarTarea,handleModalEliminarTarea,completarTarea }=useProyectos();

    const { descripcion, nombre, prioridad, fechaEntrega,estado,_id}=tarea;
    const isAdmin=useAdmin();


  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div className="flex flex-col items-start">
            <p className="mb-1 text-xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
            <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
            { estado && <p className="text-xs bg-green-600 uppercase rounded-lg text-white">Completada por: {tarea?.completado?.nombre}</p>}
        </div>
        <div className="flex flex-col lg:flex-row gap-2 ">
            {
              isAdmin && (
              <button 
                  type="button" className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                  onClick={()=>handleModalEditarTarea(tarea)}>
                Editar
              </button>
              )
            }
              <button 
                type="button" className={`${estado ? 'bg-sky-600' :'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                onClick={()=>completarTarea(_id)}
                >
                {estado ? 'Completa':'Incompleta'}
              </button>
            {
              isAdmin && (
              <button 
                  type="button" 
                  className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                  onClick={()=>handleModalEliminarTarea(tarea)}>
                Eliminar
              </button>
              )
            }
        </div>
    </div>
  )
}

export default Tarea;