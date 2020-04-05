import { types } from '../../../';
import { IColumnType } from '../../../interfaces';

export interface ILang {
  idLang: string;
  name: string;
  localName: string;
}

export type TLangKeys = keyof ILang;

interface IColumnTypeLang extends IColumnType {
  name: TLangKeys;
}

export const langType: IColumnTypeLang[] = [
  {
    name: 'idLang',
    resolve: types.string,
  },
  {
    name: 'name',
    resolve: types.string,
  },
  {
    name: 'localName',
    resolve: types.string,
  },
];
