import {
  ICols,
  IColsTypes,
  IColumnType,
} from '../interfaces';

export class Cols {
  private readonly columns: IColumnType[];
  constructor(columns: IColumnType[]) {
    this.columns = columns;
  }

  /**
   * Return the columns for the query or mutation
   *
   * {
   *  data {
   *    idTranslation: types.number
   *    text {
   *      idText: types.number
   *      idLang: types.string,
   *      text: types.string
   *    }
   *  }
   * }
   *
   * @param columns
   */
  public cols = (columnsSelected: Array<ICols | string>): IColsTypes => {
    const cols: IColsTypes = {};
    for (const col of columnsSelected) {
      if (typeof col === 'string') {
        const currentCol = this.getCol(col);
        cols[currentCol.name] = (typeof currentCol.resolve === 'function') ?
          currentCol.resolve() :
          currentCol.resolve;
      } else {
        for (const colName in col) {
          if (!col.hasOwnProperty(colName)) { continue; }
          const currentCol = this.getCol(colName);
          if (typeof currentCol.resolve === 'function') {
            cols[colName] = currentCol.resolve(col[colName]);
          } else {
            throw new Error(`The ${colName} doesn't have a resolve function. It's a simple column`);
          }
        }
      }
    }
    return cols;
  }

  /**
   * Return a column
   * @param columnName
   */
  private getCol(columnName: string): IColumnType {
    for (const column of this.columns) {
      if (column.name === columnName) {
        return column;
      }
    }
    const columnList = this.getNames(this.columns).join(', ');
    throw new Error(`The "${columnName}" doesn't exist in the column list: ${columnList}`);
  }

  /**
   * To get the name of the the columns names
   * @param array
   */
  private getNames(array: IColumnType[]): string[] {
    const columns: string[] = [];
    for (const col of array) {
      columns.push(col.name);
    }
    return columns;
  }

}
