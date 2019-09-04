import {
  ICols,
  IColVar,
  IVars,
} from '../interfaces';

export class Vars {
  private readonly varTypes: { [key: string]: string};
  constructor(varTypes: { [key: string]: string}) {
    this.varTypes = varTypes;
  }

  /**
   * Return the keys for the query variables, i.e: ($idLang: Int)
   *
   * @param variables the variables of the top query
   * @param columnsSelected the variables of the childs
   */
  public varsKeys = (columnsSelected: Array<ICols | string>, variables?: string[]): IVars => {
    let varsArray = this.getVariableNames(columnsSelected);
    if (variables && variables.length > 0) {
      varsArray = Array.from(new Set([...varsArray, ...variables]));
    }
    const vars: IVars = {};
    for (const varName of varsArray) {
      const type = this.varTypes[varName];
      if (typeof type === 'undefined') {
        throw this.Error(varName);
      }
      const keyName = '$' + varName;
      vars[keyName] =  type;
    }
    return vars;
  }

  /**
   * Return the values for the query variable function, i.e: (idLang: $idLang)
   */
  public varsValues = (variables: string[]): IVars => {
    const vars: IVars = {};
    for (const varName of variables) {
      const type = this.varTypes[varName];
      if (typeof type === 'undefined') {
        throw this.Error(varName);
      }
      vars[varName] = '$' + varName;
    }
    return vars;
  }

  private getVariableNames = (columns: Array<ICols | string>): string[] => {
    const vars: any = [];
    for (const column of columns) {
      if (typeof column === 'object') {
        for (const key in column) {
          if (Array.isArray(column[key])) {
            const curentCol = column[key] as ICols[] | string[];
            const varx = this.getVariableNames(curentCol);
            if (varx.length > 0) {
              vars.push(...varx);
            }
          } else if ('variables' in column[key]) {
            const curentCol = column[key] as IColVar;
            if (curentCol.variables) {
              vars.push(...curentCol.variables);
            }
            if (Array.isArray(curentCol.columns)) {
              const varx = this.getVariableNames(curentCol.columns);
              if (varx.length > 0) {
                vars.push(...varx);
              }
            }
          }
        }
      }
    }
    return vars;
  }

  private Error(varName: string) {
    const typesList = Object.keys(this.varTypes).join(', ');
    return new Error(`The "${varName}" doesn't exist in the types list: ${typesList}`);
  }

}
