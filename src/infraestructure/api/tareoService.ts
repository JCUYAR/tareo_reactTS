import type { AddTareo, TareoResponse, UpdtTareo } from "../../presentation/forms/tareoForm.types"
import type { BaseResult } from "../../presentation/general/BaseResult";
import type { SelectDto } from "../../presentation/general/SelectDto";
import { fetchData } from "./fetchData"


const listTareoByUser = (userId: number) => {
    const response = fetchData<TareoResponse[]>(
        `tareo/ListTareoByUser/${userId}`,
        "GET"
    );
    return response;
}

const listOneById = (id: number, userId: number) => {
    const response = fetchData<TareoResponse>(
        `tareo/ListOneById/${id}&${userId}`,
        "GET"
    );
    return response;
}

const listCategory = () => {
    const response = fetchData<SelectDto[]>(
        `category/ListAllCategory`,
        "GET"
    );
    return response;
}

const listArea = () => {
    const response = fetchData<SelectDto[]>(
        `catalog/ListAllArea`,
        "GET"
    );
    return response;
}

const listStatus = () => {
    const response = fetchData<SelectDto[]>(
        `catalog/ListAllStatus`,
        "GET"
    );
    return response;
}

const addTareoService = (payload: AddTareo) => {
    const body = {
        description: payload.description,
        user_id: payload.user_id,
        category: payload.category,
        area: payload.area,
        status: payload.status,
        work_date: payload.work_date,
        start_time: payload.start_time,
        end_time: payload.end_time,
    }
     const response = fetchData<void> (
        "tareo/AddTareo",
        "POST",
        body
     );
     return response;
}

const updtTareoService = (payload: UpdtTareo) => {
    const body = {
        id: payload.id,
        description: payload.description,
        category: payload.category,
        area: payload.area,
        status: payload.status,
        user_id: payload.user_id,
        work_date: payload.work_date,
        start_time: payload.start_time,
        end_time: payload.end_time
    }
    
    const response = fetchData<void> (
        "tareo/UpdateTareo",
        "PUT",
        body
    );

    return response;
}

export {
    listTareoByUser,
    listOneById,
    listCategory,
    listArea,
    listStatus,
    addTareoService,
    updtTareoService
}