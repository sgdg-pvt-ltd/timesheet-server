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

export enum ClientTitle {
  mr = 'Mr',
  mrs = 'Mrs',
  ms = 'Ms',  
}

registerEnumType(ClientTitle, {
  name: 'ClinetTitle', 
});
