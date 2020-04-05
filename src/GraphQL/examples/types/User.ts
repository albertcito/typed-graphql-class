import { types } from '../../';
import { IColumnType } from '../../interfaces';

export interface IUser {
  idUser: number;
  name: string;
  email: string;
}

export type TUserKeys = keyof IUser;

interface IColumnTypeUser extends IColumnType {
  name: TUserKeys;
}

export const userType: IColumnTypeUser[] = [
  {
    name: 'idUser',
    resolve: types.number,
  },
  {
    name: 'name',
    resolve: types.string,
  },
  {
    name: 'email',
    resolve: types.string,
  },
];
