import { mutation } from 'typed-graphqlify';
import GraphQL from './GraphQL';
import {
  IColumnType,
  IColVar,
} from './interfaces';

class Mutation extends GraphQL {
  public readonly operationName: string;

  constructor(operationName: string, columnsType: IColumnType[], varTypes: { [key: string]: string } = {}) {
    super(columnsType, varTypes);
    this.operationName = operationName;
  }

  public toString = (
    {
      columns,
      variables,
    }: IColVar,
  ) => {
    const param = this.operation(this.operationName, columns, variables);
    return mutation(this.operationName, param);
  }

}

export default Mutation;
