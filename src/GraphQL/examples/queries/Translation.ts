import { Query } from '../../';
import { translationType } from '../types';
class Translation extends Query {
  constructor() {
    super(
      'translation',
      translationType,
      {
        idLang: 'String',
        idTranslation: 'Int',
      },
    );
  }
}
export default new Translation();
