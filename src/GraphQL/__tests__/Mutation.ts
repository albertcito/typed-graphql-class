import {
  GraphQL,
  Mutation,
  types,
} from '../';
import { IColVar } from '../interfaces';

describe('GraphQL-Type-Mutation', () => {
  it('render GraphQL - variable  in subqueries', () => {

    const columnsText = [
      {
        name: 'idLang',
        resolve: types.string,
      },
      {
        name: 'text',
        resolve: types.string,
      },
      {
        name: 'idLangText',
        resolve: types.number,
      },
      {
        name: 'idTranslation',
        resolve: types.number,
      },
    ];

    const query = new Mutation(
      'translation',
      [
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
          resolve: (args: IColVar) => {
            const graphQL = new GraphQL(columnsText, { idLang: types.string });
            return graphQL.resolve(args);
          },
        },
      ],
      {
        code: 'String',
        texts: '[CreateTranslation]',
      },
    );
    const queryString = query.toString({
      columns: [
        'idTranslation',
        {
          text: ['idLangText', 'text'],
        },
      ],
      variables: [
        'code',
        'texts',
      ],
    });
    expect(queryString).toEqual('mutation translation($code:String,$texts:[CreateTranslation]){translation(code:$code,texts:$texts){idTranslation text{idLangText text}}}');
  });
});
