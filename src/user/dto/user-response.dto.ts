import {User} from "../user.entity";

export class UserResponseDto {
    id: string;
    login: string;
    version: number;
    createdAt: number;
    updatedAt: number;

    constructor(user: User) {
        this.id = user.id;
        this.login = user.login;
        this.version = user.version;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}