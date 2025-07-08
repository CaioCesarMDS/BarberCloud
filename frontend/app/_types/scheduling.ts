export interface Scheduling {
  id: string;
  client?: {
    name: string;
  };
  employee?: {
    name: string;
  };
  services: {
    id: number;
    name: string;
    price: string;
  }[];
  dateTime: string;
  priceTotal: string;
  status: "PENDING" | "DONE" | "CANCEL";
}
