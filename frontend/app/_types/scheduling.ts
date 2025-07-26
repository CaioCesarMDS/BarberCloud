export interface Scheduling {
  id: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  barbershopId: string;
  barbershopName: string;
  services: {
    id: number;
    name: string;
    price: string;
  }[];
  dateTime: string;
  totalPrice: string;
  status: "PENDING" | "DONE" | "CANCEL";
}
