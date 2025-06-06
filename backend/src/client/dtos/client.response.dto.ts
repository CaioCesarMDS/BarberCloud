import { Client } from '@prisma/client';

export class ClientResponseDto {
  readonly id!: string;
  readonly name!: string;
  readonly email!: string;
  readonly phone!: string;
  readonly birth?: string;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.email = client.email;
    this.birth = client.birth?.toISOString();
    this.phone = client.phone;
  }
}
