export interface LoginBody 
    extends LoginFormInterface {}

export interface LoginFormInterface {
    userName: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}