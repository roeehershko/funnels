export interface AddUserDto {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
}

export interface ViewUsersDto {
    from: [string, number],
    to: [string, number]
}