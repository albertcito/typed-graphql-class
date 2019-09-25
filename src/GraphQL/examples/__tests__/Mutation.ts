import { Mutation } from '../../';
import { translationType } from '../types';

describe('GraphQL-Type-Mutation', () => {
  it('render GraphQL - variable  in subqueries', () => {

    const query = new Mutation(
      'translation',
      translationType,
      {
        code: 'String',
        texts: '[CreateTranslation]',
      },
    );

    const queryString = query.toString({
      columns: [
        'idTranslation',
        {
          text: ['idText', 'text'],
        },
      ],
      variables: [
        'code',
        'texts',
      ],
    });
    expect(queryString).toEqual('mutation translation($code:String,$texts:[CreateTranslation]){translation(code:$code,texts:$texts){idTranslation text{idText text}}}');
  });
});
