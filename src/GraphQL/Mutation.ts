import { mutation } from 'typed-graphqlify';
import GraphQL from './GraphQL';
import { IColVar } from './interfaces';

class Mutation extends GraphQL {
  public toString = (
    operation: string,
    {
      columns,
      variables,
    }: IColVar,
  ) => {
    const param = this.operation(operation, columns, variables);
    return mutation(operation, param);
  }

}

export default Mutation;
