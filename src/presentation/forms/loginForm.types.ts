export interface LoginBody 
    extends LoginFormInterface {}

export interface LoginFormInterface {
    userName: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    id: number;
}

export interface UserData {
    id: number;
    username: string;
    name: string;
    lName: string;
    role: string;
}