import type { AuthResponse, LoginBody } from "../../presentation/forms/loginForm.types"
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

export {
    authenticateService
}