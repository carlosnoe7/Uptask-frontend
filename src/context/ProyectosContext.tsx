import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import clienteAxios from "../config/clienteAxios";
import { Proyecto } from "../interfaces/ProyectoProps";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket:any;

interface ProyectosProviderProps {
  children: JSX.Element[];
}

const ProyectosContext = createContext<any>({});

const ProyectosProvider = ({ children }: ProyectosProviderProps) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [alert, setAlert] = useState({
    msg: "",
    error: false,
  });
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea,setModalEliminarTarea] = useState(false);
  const [colaborador,setColaborador] = useState({});
  const [modalEliminarColaborador,setModalEliminarColaborador] = useState(false);
  const [buscador,setBuscador] = useState(false);


  const navigate = useNavigate();
  const { auth }=useAuth();


  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios.get("/proyectos", config);
        setProyectos(data.proyectos);
      } catch (error) {
      }
    };
    obtenerProyectos();
  }, [auth]);

  useEffect(() => {
    socket=io(import.meta.env.VITE_BACKEND_URL);
    
  }, []);
  

  const mostrarAlerta = (alerta: { msg: string; error: boolean }) => {
    setAlert(alerta);

    setTimeout(() => {
      setAlert({ msg: "", error: false });
    }, 5000);
  };

  const submitProyecto = async (proyecto: any) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  const editarProyecto = async (proyecto: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );

      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      setProyectos(proyectosActualizados);
      toast.success("El proyecto se actualizó correctamente");
      navigate("/proyectos");
    } catch (error) {}
  };
  const nuevoProyecto = async (proyecto: Proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/proyectos", proyecto, config);

      toast.success("¡Proyecto creado correctamente!");
      setProyectos((projects: Proyecto[]) => [...projects, data]);
      navigate("/proyectos");
    } catch (error) {
      toast.error((error as any).response.data.msg);
    }
  };

  const obtenerProyecto = async (id: string) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.get(`/proyectos/${id}`, config);
      setProyecto(data.proyecto);
    } catch (error) {
      navigate('/proyectos');
      toast.error("Error al obtener el proyecto");


    } finally {
      setCargando(false);
    }
  };

  const eliminarProyecto = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await clienteAxios.delete(`/proyectos/${id}`, config);
      toast.success("El proyecto se eliminó correctamente");
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectosActualizados);
      navigate("/proyectos");
    } catch (error) {}
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const submitTarea = async (tarea: any) => {
    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }
  };

  const editarTarea = async (tarea: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );

      
      setAlert({ msg: "", error: false });
      setModalFormularioTarea(false);

      //Socket.io
      socket.emit('actualizar tarea',data);
    } catch (error) {}
  };

  const crearTarea = async (tarea: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post("/tareas", tarea, config);
      //Agregar la tarea al state
      
      setAlert({ msg: "", error: false });
      setModalFormularioTarea(false);

      //Socket.io
      socket.emit("nueva tarea",data);
    } catch (error) {}
  };

  const handleModalEditarTarea = (tarea: any) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const handleModalEliminarTarea=(tarea:any)=>{

    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);

  };

  const eliminarTarea=async(tarea:any)=>{
    try {
        const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
      setAlert({ msg: data.msg, error: false });

      
      setModalEliminarTarea(false);
      
      //Socket.io
      socket.emit('eliminar tarea',tarea);
      setTimeout(() => {
        setAlert({msg:"",error:false});
      }, 3000);
      setTarea({});

    } catch (error) {
        
    }
  };

  const submitColaborador=async(email:string)=>{
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data }=await clienteAxios.post("/proyectos/colaboradores",{ email },config);

      setColaborador(data);
      setAlert({msg:"", error:false});

    } catch (error) {
      setAlert({
        msg:(error as any).response.data.msg,
        error:true
      })
    } finally{
      setCargando(false);
    }
  };

  const agregarColaborador=async(email:string)=>{
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data }=await clienteAxios.post(`/proyectos/colaboradores/${(proyecto as any)._id}`,email ,config);

      setAlert({
        msg:data.msg,
        error:false
      });
      
      setColaborador({});
      setTimeout(() => {
        setAlert({
          msg:"",
          error:false
        });
      }, 3000);

    } catch (error) {
      setAlert({
        msg:(error as any).response.data.msg,
        error:true
      });
    }
  };

  const handleModalEliminarColaborador=(colaborador:any)=>{
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);

  }

  const eliminarColaborador=async()=>{
    try {
        const token = localStorage.getItem("token");
          if (!token) {
            return;
          }
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          const { data }=await clienteAxios.post(`/proyectos/eliminar-colaborador/${(proyecto as any)._id}`,{id:(colaborador as any)._id} ,config);
          
          const proyectoActualizado:any={...proyecto};
          proyectoActualizado.colaboradores=proyectoActualizado.colaboradores.filter((colaboradorState:any)=>colaboradorState._id!==(colaborador as any)._id);
          setProyecto(proyectoActualizado);

          setAlert({
            msg:data.msg,
            error:false
          });
          setColaborador({});
          setModalEliminarColaborador(false);
          setTimeout(() => {
            setAlert({
              msg:"",
              error:false
            });
          }, 3000);
      } catch (error) {
        
      }
  }

  const completarTarea=async (id:any)=>{
    try {
      const token = localStorage.getItem("token");
          if (!token) {
            return;
          }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data }=await clienteAxios.post(`/tareas/estado/${id}`,{},config);

      
      
      setTarea({});
      setAlert({msg:"",error:false});

      //Socket.io
      socket.emit('cambiar estado',data)

    } catch (error) {
      
    }
  }

  const handleBuscador=()=>{
    setBuscador(!buscador);
    
  }

  // Socket.io
  const submitTareasProyecto = (tarea:any)=>{
    const proyectoActualizado: any = {
      ...proyecto,
    };
    proyectoActualizado.tareas = [...(proyecto as any).tareas, tarea];

    setProyecto(proyectoActualizado);
  }

  const eliminarTareaProyecto=(tarea:any)=>{
    //Eliminar la tarea del state
    const proyectoActualizado: any = {
      ...proyecto,
    };

    proyectoActualizado.tareas=proyectoActualizado.tareas.filter((tareaState:any)=>tareaState._id !== tarea._id);

    setProyecto(proyectoActualizado);
  };

  const actualizarTareaProyecto =(tarea:any)=>{
    const proyectoActualizado:any = { ...proyecto };
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(
        (tareaState:any) => (tareaState._id === tarea._id ? tarea : tareaState)
      );
      setProyecto(proyectoActualizado);

  };

  const cambiarEstadoTarea=(tarea:any)=>{
    const proyectoActualizado:any={...proyecto};
      proyectoActualizado.tareas=proyectoActualizado.tareas.map((tareaState:any)=>tareaState._id===tarea._id ? tarea : tareaState);
      setProyecto(proyectoActualizado);
  };

  const cerrarSesionProyectos=()=>{
    setProyectos([]);
    setProyecto({});
    setAlert({msg:"",error:false});

  };

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alert,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
