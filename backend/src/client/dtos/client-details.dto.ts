import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';

export class ClientDetailsDto {
  readonly id!: string;
  readonly name!: string;
  readonly email!: string;
  readonly phone!: string;
  readonly birth?: string;
  readonly subscribeIn?: BarbershopsSubscribe[];

  constructor(
    client: Client,
    subscribes: ClientSubscribeBarbershop[],
    barbershops: Barbershop[],
  ) {
    this.id = client.id;
    this.name = client.name;
    this.email = client.email;
    this.birth = client.birth?.toISOString();
    this.phone = client.phone;
    let count: number = 0;
    subscribes.map((subscription) => {
      this.subscribeIn?.push(
        new BarbershopsSubscribe(subscription, barbershops[0]),
      );
      count++;
    });
  }
}

class BarbershopsSubscribe {
  readonly barbershopId!: string;
  readonly name!: string;
  readonly subscribeIn!: Date;

  constructor(subscription: ClientSubscribeBarbershop, barbershop: Barbershop) {
    this.barbershopId = barbershop.id;
    this.name = barbershop.name;
    this.subscribeIn = subscription.subscribeIn;
  }
}
