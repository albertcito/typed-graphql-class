import { types } from '../../';
import { IColumnType } from '../../interfaces';

export interface IText {
  idText: number;
  text: string;
  idLang: string;
  idTranslation: number;
}

export type TTextKeys = keyof IText;

export interface ITextArgs {
  columns: TTextKeys[];
  variables: ['idLang'];
}

interface IColumnTypeText extends IColumnType {
  name: TTextKeys;
}

export const textType: IColumnTypeText[] = [
  {
    name: 'idText',
    resolve: types.number,
  },
  {
    name: 'text',
    resolve: types.string,
  },
  {
    name: 'idLang',
    resolve: types.string,
  },
  {
    name: 'idTranslation',
    resolve: types.number,
  },
];
