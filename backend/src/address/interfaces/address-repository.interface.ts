import { Address } from '@prisma/client';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';

export interface IAddressRepository {
  create(data: CreateAddressDto): Promise<Address>;
  update(addressId: string, data: UpdateAddressDto): Promise<Address>;
}
