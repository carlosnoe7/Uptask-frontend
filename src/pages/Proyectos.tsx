import PreviewProyecto from "../components/PreviewProyecto";
import useProyectos from "../hooks/useProyectos";
import { Proyecto } from "../interfaces/ProyectoProps";




const Proyectos = () => {

    const {proyectos}=useProyectos();

    
    


  return (
    <>
        <h1 className="text-4xl font-black">Proyectos</h1>
        {proyectos?.length ===0 ? (
            <div className="bg-white shadow mt-10 rounded-lg ">
                <h3 className="mt-5 text-center text-gray-600 uppercase p-5">Aún no tienes proyectos creados, ¡comienza con tu primer proyecto!</h3>
            </div>
        ):
        proyectos.map((proyecto:Proyecto)=>(
            <div className="bg-white shadow mt-10 rounded-lg" key={proyecto._id}>
                <PreviewProyecto proyecto={proyecto}/>
            </div>
        ))
    
    }
    </>
  )
}

export default Proyectos;