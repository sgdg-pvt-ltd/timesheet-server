import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  superAdmin = 'Super Admin',
  masterAdmin = 'Master Admin',
  unitAdmin = 'Unit Admin',
  normalAdmin = 'Normal Admin'
}

registerEnumType(UserRole, {
  name: 'UserRole', 
});
