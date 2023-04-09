export interface Proyecto {
    _id:           string;
    nombre:        string;
    descripcion:   string;
    fechaEntrega:  Date;
    cliente:       string;
    colaboradores: any[];
    creador:       string;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}