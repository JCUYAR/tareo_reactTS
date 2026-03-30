import type { AuthResponse, LoginBody, UserData } from "../../presentation/forms/loginForm.types"
import { fetchData } from "./fetchData";

const authenticateService = (payload: LoginBody) => {
    const body = {
        username: payload.userName,
        password: payload.password
    }

    const response = fetchData<AuthResponse> (
        "/auth/login",
        "POST",
        body
    );
    return response;
}

const getUserDataById = (id: number) => {
    const response = fetchData<UserData> (
        `user/GetUserById/${id}`,
        "GET"
    );
    return response;
}

export {
    authenticateService,
    getUserDataById
}