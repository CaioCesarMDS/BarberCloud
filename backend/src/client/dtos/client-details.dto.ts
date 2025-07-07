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
    this.subscribeIn = [];

    subscribes.forEach((subscription) => {
      const matchedBarbershop = barbershops.find(
        (barbershop) => barbershop.id === subscription.barbershopId,
      );

      if (matchedBarbershop) {
        this.subscribeIn!.push(
          new BarbershopsSubscribe(subscription, matchedBarbershop),
        );
      }
    });
  }
}

class BarbershopsSubscribe {
  readonly barbershopId!: string;
  readonly name!: string;
  readonly imageUrl!: string;
  readonly timeOpen?: string;
  readonly timeClose?: string;
  readonly subscribeIn!: Date;

  constructor(subscription: ClientSubscribeBarbershop, barbershop: Barbershop) {
    this.barbershopId = barbershop.id;
    this.name = barbershop.name;
    this.imageUrl = barbershop.imageUrl;
    this.timeOpen = barbershop.timeOpen;
    this.timeClose = barbershop.timeClose;
    this.subscribeIn = subscription.subscribeIn;
  }
}
