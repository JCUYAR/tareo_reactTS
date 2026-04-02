import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../../app/providers/AuthContext";
import { listTareoByUser } from "../../../infraestructure/api/tareoService";

const RegisterTareo: FC = () => {
    const { user, logout } = useAuth();

    const [isLoad, setIsLoad] = useState<boolean>(false);

    const getTareoByUser = async () => {
        if (user) {
            const response = await listTareoByUser(user.id)
            console.log(response);
        }
    }

    useEffect(() => {
        if (user != null && !isLoad) {
            getTareoByUser();

        }
        
    }, [user])


    return (
        <>
            Registro de tareo
        </>

    );

}

export default RegisterTareo;