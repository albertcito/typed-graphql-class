import { types } from '../../';
import { IColumnType } from '../../interfaces';
const columns: IColumnType[] = [
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
export default columns;
