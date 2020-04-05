import { textType } from '../';
import { GraphQL, types } from '../../../';
import { IColumnType, IColVar } from '../../../interfaces';
import { IText } from '../Text';

export interface ITranslation {
  idTranslation: number;
  code: string;
  text: IText;
}

type TTranslationKeys = keyof ITranslation;

interface IColumnTypeTranslation extends IColumnType {
  name: TTranslationKeys;
}

export const translationType: IColumnTypeTranslation[] = [
  {
    name: 'idTranslation',
    resolve: types.number,
  },
  {
    name: 'code',
    resolve: types.string,
  },
  {
    name: 'text',
    resolve: (args: IColVar) => GraphQL.resolveType(
      args,
      textType,
      { idLang: types.string },
    ),
  },
];
