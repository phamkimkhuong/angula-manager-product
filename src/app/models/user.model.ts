export interface IUser {
  id?: string;
  is_admin?: boolean;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  province?: string;
  picture?: string;
  gender?: string;
  birthday? : string;
  job?:string;
}