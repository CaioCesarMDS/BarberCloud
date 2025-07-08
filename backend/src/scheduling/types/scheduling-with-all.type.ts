import { Prisma } from "@prisma/client";

export type SchedulingWithAll = Prisma.SchedulingGetPayload<{
    include: {
        services: {
            include: {
                service: true;
            };
        };
        employee: true;
        barbershop: true;
        client: true;
    };
}>;