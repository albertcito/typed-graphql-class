import Operation from '../../Operation';
import { translationQuery } from '../queries';
import { TTranslationKeys } from '../types';

describe('Operation-Tests', () => {

  it('render Operation - variable  in subqueries', () => {
    const columns: TTranslationKeys[] = [
      'idTranslation',
        {
          text: {
            columns: ['idText', 'text'],
            variables: ['idLang'],
          },
        },
    ];
    const idTranslation = 5;
    const operation = new Operation(
      { idTranslation },
      columns,
      translationQuery,
    );
    const received = {
      query: 'query translation($idLang:String,$idTranslation:Int){translation(idTranslation:$idTranslation){idTranslation text(idLang:$idLang){idText text}}}',
      variables: { idTranslation: 5 },
    };
    const params = operation.params();
    expect(params.query).toEqual(received.query);
    expect(params.variables.idTranslation).toEqual(received.variables.idTranslation);
  });
});
