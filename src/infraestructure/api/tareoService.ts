import type { TareoResponse } from "../../presentation/forms/tareoForm.types"
import { fetchData } from "./fetchData"


const listTareoByUser = (userId: number) => {
    const response = fetchData<TareoResponse> (
        `tareo/ListTareoByUser/${userId}`,
        "GET"
    );
    return response;
}

export {
    listTareoByUser,
}