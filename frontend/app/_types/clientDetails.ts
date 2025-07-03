  export default interface ClientDetails {
    id: string;
    name: string;
    subscribeIn: [
      {
        barbershopId: string,
        name: string,
        subscribeIn: Date
      }
    ]
  }