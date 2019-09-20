import { params } from 'typed-graphqlify';
import {
  ICols,
  IColsTypes,
  IColumnType,
  IColVar,
} from './interfaces';
import {
  Cols,
  Vars,
} from './Util';

/**
 *
 */
class GraphQL {

  private readonly utilCols: Cols;
  private readonly utilVars: Vars;

  constructor(columnsType: IColumnType[], varTypes: { [key: string]: string } = {}) {
    this.utilCols = new Cols(columnsType);
    this.utilVars = new Vars(varTypes);
  }

  /**
   * To return a query like this one:
   *
   * operation($idLang: String) {
   *  operation {
   *    idTranslation
   *    text(idLang: $idLang) {
   *      idText
   *      idLang
   *    }
   *  }
   * }
   *
   * @param operation required. It's the name of the current operation.
   * @param keys requited. It's the keys to print in the operation brakets.
   * @param variables optional. To print the variables.
   * @param columns optional. To print the columns.
   */
  public operation(operation: string, columns: Array<ICols | string>, variables?: string[]) {
    const operationType = (variables && variables.length > 0) ?
      this.operationVars(operation, variables, columns) :
      this.operationCols(operation, columns);
    const keys = this.utilVars.varsKeys(columns, variables);
    return (keys && Object.keys(keys).length > 0) ? params(
      this.utilVars.varsKeys(columns, variables),
      operationType,
    ) :
    operationType;
  }

  /**
   * This is to resolve the columns to belong to other types
   *
   * @param args required. It can be a array of columns or a object {columns, variabes}
   */
  public resolve(args: string[] | IColVar) {
    if (Array.isArray(args)) {
      return this.cols(args);
    }
    return args.variables ?
      this.vars(args.variables, args.columns) :
      this.cols(args.columns);
  }

  /**
   * To return a sub-query with params
   *
   *  operation(idLang: $idLang) {
   *    text,
   *    idText,
   *    idLang
   *  }
   *
   * @param operation required. The operation name
   * @param variables required. To print the variables
   * @param columns required. To print the columns.
   */
  private operationVars(
    operation: string,
    variables: string[],
    columns: Array<ICols | string>,
  ) {
    return { [operation]: this.vars(variables, columns) };
  }

  /**
   * To return a sub-query with operation name and without args
   *
   *  operation {
   *    text,
   *    idText,
   *    idLang
   *  }
   *
   * @param operation required. The operation name
   * @param columns required. To print the columns.
   */
  private operationCols(
    operation: string,
    columns: Array<ICols | string>,
  ) {
    return { [operation]: this.cols(columns) };
  }

  /**
   * To return a sub-query with args
   *
   *  (idLang: $idLang) {
   *    text,
   *    idText,
   *    idLang
   *  }
   *
   * @param variables required. To print the variables
   * @param columns required. To print the columns.
   */

  private vars(variables: string[], columns: Array<ICols | string>) {
    return params(
      this.utilVars.varsValues(variables),
      this.cols(columns),
    );
  }

  /**
   *  To return a sub-query columns
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
   * @param columns required. To print the columns.
   */
  private cols(columns: Array<ICols | string>): IColsTypes {
    return this.utilCols.cols(columns);
  }

}

export default GraphQL;
