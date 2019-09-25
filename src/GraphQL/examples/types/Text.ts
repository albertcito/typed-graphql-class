import { types } from '../../';
import { IColumnType } from '../../interfaces';
const columns: IColumnType[] = [
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
export default columns;
