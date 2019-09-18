import {
  GraphQL,
  Query,
  types,
} from '../';
import { IColVar } from '../interfaces';

describe('GraphQL-Type-Query', () => {

  it('render GraphQL - basic', () => {
    const query = new Query(
      'langs',
      [
        {
          name: 'idLang',
          resolve: types.string,
        },
        {
          name: 'name',
          resolve: types.string,
        },
        {
          name: 'localName',
          resolve: types.string,
        },
      ]
    );
    const columns = [
      'idLang',
      'name',
      'localName',
    ];
    const queryString = query.toString({ columns });
    expect(queryString).toEqual('query langs{langs{idLang name localName}}');
  });

  it('render GraphQL - variable', () => {
    const query = new Query(
      'user',
      [
        {
          name: 'idUser',
          resolve: types.number,
        },
        {
          name: 'name',
          resolve: types.string,
        },
        {
          name: 'email',
          resolve: types.string,
        },
      ],
      {
        idUser: 'Int',
      }
    );
    const columns = [
      'idUser',
      'name',
      'email',
    ];
    const queryString = query.toString({columns, variables: ['idUser']});
    expect(queryString).toEqual('query user($idUser:Int){user(idUser:$idUser){idUser name email}}');
  });

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

    const query = new Query(
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
        idLang: 'String',
        idTranslation: 'Int',
      }
    );
    const queryString = query.toString({ columns: [
      'idTranslation',
      {
        text: {
          columns: ['idLangText', 'text'],
          variables: ['idLang'],
        },
      },
    ], variables: ['idTranslation'] });
    expect(queryString).toEqual('query translation($idLang:String,$idTranslation:Int){translation(idTranslation:$idTranslation){idTranslation text(idLang:$idLang){idLangText text}}}');
  });

  it('properly errors on invalid input', () => {
    const query = new Query(
      'user',
      [{
        name: 'idUser',
        resolve: types.number,
      }]
    );
    expect(() => query.toString({ columns: ['idUser'], variables: ['noVariable'] })).toThrow();
    expect(() => query.toString({ columns: ['NoColumn'] })).toThrow();
  });
});
