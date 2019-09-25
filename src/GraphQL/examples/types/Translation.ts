import { GraphQL, types } from '../../';
import { IColumnType, IColVar } from '../../interfaces';
import { textType } from './';
const columns: IColumnType[] = [
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
  }];
export default columns;
