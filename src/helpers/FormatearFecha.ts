

export const formatearFecha=(fecha:any)=>{
    
    const nuevaFecha=new Date(fecha.split('T')[0].split('-'));

    const opciones:any={
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }

    return nuevaFecha.toLocaleDateString('es-ES',opciones);

};