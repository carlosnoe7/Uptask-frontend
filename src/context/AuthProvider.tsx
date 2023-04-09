import  { useState,useEffect,createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

interface ProviderProps{
    children:JSX.Element
}

type AuthContextType=any; 

const AuthContext=createContext<AuthContextType>({});

const AuthProvider=({ children }:ProviderProps)=>{

    const [auth,setAuth]=useState<any>({});
    const [cargando,setCargando]=useState(true);
    const navigate=useNavigate();
    

    useEffect(()=>{
        const autenticarUsuario=async ()=>{
            const token=localStorage.getItem('token');
            if(!token){
                setCargando(false);
                return;
            }
            const config={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                const { data }=await clienteAxios.get('/usuarios/perfil',config);

                setAuth(data);
                navigate("/proyectos");
            } catch (error) {
                
            } finally{
                setCargando(false);
            }
        }
        autenticarUsuario();
    },[]);

    const cerrarSesionAuth=()=>{
        setAuth({});

    }

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            cargando,
            cerrarSesionAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export{
    AuthProvider
}

export default AuthContext;