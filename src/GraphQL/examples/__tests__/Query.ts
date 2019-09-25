import {
  Query,
  types,
} from '../../';
import { langsQuery, translationQuery } from '../queries';
import { userType } from '../types';

describe('GraphQL-Type-Query', () => {

  it('render GraphQL - basic', () => {
    const columns = [
      'idLang',
      'name',
      'localName',
    ];
    const queryString = langsQuery.toString({ columns });
    expect(queryString).toEqual('query langs{langs{idLang name localName}}');
  });

  it('render GraphQL - variable', () => {
    const query = new Query('user', userType, { idUser: 'Int' });
    const columns = [
      'idUser',
      'name',
      'email',
    ];
    const queryString = query.toString({columns, variables: ['idUser']});
    expect(queryString).toEqual('query user($idUser:Int){user(idUser:$idUser){idUser name email}}');
  });

  it('render GraphQL - variable  in subqueries', () => {
    const queryString = translationQuery.toString({
      columns: [
        'idTranslation',
        {
          text: {
            columns: ['idText', 'text'],
            variables: ['idLang'],
          },
        },
      ],
      variables: ['idTranslation'],
    });
    expect(queryString).toEqual('query translation($idLang:String,$idTranslation:Int){translation(idTranslation:$idTranslation){idTranslation text(idLang:$idLang){idText text}}}');
  });

  it('properly errors on invalid input', () => {
    const query = new Query(
      'user',
      [{
        name: 'idUser',
        resolve: types.number,
      }],
    );

    expect(() => query.toString({ columns: ['idUser'], variables: ['noVariable'] })).toThrow();
    expect(() => query.toString({ columns: ['NoColumn'] })).toThrow();
  });
});
