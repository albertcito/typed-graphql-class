import { types } from '../../';
import { IColumnType } from '../../interfaces';
const columns: IColumnType[] = [
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
export default columns;
