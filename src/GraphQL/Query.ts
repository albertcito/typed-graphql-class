import { query } from 'typed-graphqlify';
import GraphQL from './GraphQL';
import { IColVar } from './interfaces';

class Query extends GraphQL {
  public toString = (
    operation: string,
    {
      columns,
      variables,
    }: IColVar,
  ) => {
    const param = this.operation(operation, columns, variables);
    return query(operation, param);
  }

}

export default Query;
