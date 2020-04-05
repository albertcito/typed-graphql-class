import { ICols } from './interfaces';
import Mutation from './Mutation';
import Query from './Query';

export interface IParams {
  query: string;
  variables: { [key: string]: any };
}

export default class Operation {
  public readonly name: string;
  public readonly query: Mutation | Query;
  private readonly columns: Array<ICols | string>;
  private readonly variables: { [key: string]: any };
  constructor(
    variables: { [key: string]: any },
    columns: Array<ICols | string>,
    query: Mutation | Query,
  ) {
    this.variables = variables;
    this.columns = columns;
    this.name = query.operationName;
    this.query = query;

  }

  public params(): IParams {
    const query = this.query.toString({
      columns: this.columns,
      variables: Object.keys(this.variables),
    });
    return {
      query,
      variables: this.variables,
    };
  }
}
