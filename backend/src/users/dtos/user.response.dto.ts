import { Role, User } from "@prisma/client";

export class UserResponseDto {
    readonly id!: string;
    readonly name!: string;
    readonly email!: string;
    readonly phone!: string;
    readonly birth?: string;
    readonly barbershopId!: string
    readonly role!: Role;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.birth = user.birth?.toString();
        this.phone = user.phone;
        this.barbershopId = user.barbershopId;
        this.role = user.role;
    }
}