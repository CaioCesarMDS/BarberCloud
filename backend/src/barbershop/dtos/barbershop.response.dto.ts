import { AddressBarbershop, Barbershop } from "@prisma/client";

export class BarbershopResponseDto {
    readonly id!: string;
    readonly name!: string;
    readonly imageUrl!: string;
    readonly timeOpen!: string;
    readonly timeClose!: string;
    readonly number!: string;
    readonly rua!: string;
    readonly street!: string;
    readonly complement!: string;
    readonly neighborhood!: string;
    readonly city!: string;
    readonly state!: string;
    readonly country!: string;
    readonly zipCode!: string;

    constructor(barbershop: Barbershop, address: AddressBarbershop) {
        this.id = barbershop.id;
        this.name = barbershop.name;
        this.imageUrl = barbershop.imageUrl;
        this.timeOpen = barbershop.timeOpen;
        this.timeClose = barbershop.timeClose;
        this.number = address.number;
        this.street = address.street;
        this.complement = address.complement;
        this.neighborhood = address.neighborhood;
        this.city = address.city;
        this.state = address.state;
        this.country = address.country;
        this.zipCode = address.zipCode;
    }
}