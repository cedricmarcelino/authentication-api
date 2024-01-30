export interface IUser {
    id: number;
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface IUserResponse {
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}