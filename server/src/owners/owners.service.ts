import { Injectable } from '@nestjs/common';
import { Owner } from '../graphql.schema';

@Injectable()
export class OwnersService {
  private readonly owners: Owner[] = [
    { id: 1, name: 'Jon', age: 8 },
    { id: 2, name: 'Tom', age: 15 }
  ];

  findOneById(id: number): Owner {
    return this.owners.find(owner => owner.id === id);
  }
}
