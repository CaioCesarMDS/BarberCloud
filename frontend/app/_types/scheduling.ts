export interface Scheduling {
  id: string;
  employee?: {
    name: string;
  };
  services: {
    id: number;
    name: string;
  }[];
  dateTime: string;
  priceTotal: string;
  status: "PENDING" | "DONE" | "CANCEL";
}
