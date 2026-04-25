import { Role } from "./role.model";

export interface User {
  id: number;
  name: string;
  age: number;
  phone_no: number;
  email: string;
  username: string;
  roles: Role[];
}