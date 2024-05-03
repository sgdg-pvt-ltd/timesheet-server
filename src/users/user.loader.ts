
import * as DataLoader from 'dataloader';

import { UserService } from './user.service';
import { Injectable, Scope } from '@nestjs/common';


@Injectable({ scope: Scope.REQUEST })
export class UserLoader {
 constructor(private userService: UserService) {}

 public batchUsers = new DataLoader(async (keys: readonly string[]) => {
    const [limit, offset] = keys[0].split(',').map(Number);
    const users = await this.userService.findManyById(limit, offset);
    const userMap = new Map(users.map(user => [user.id, user]));
    return keys.map(key => userMap.get(key) || null);
 });
}
