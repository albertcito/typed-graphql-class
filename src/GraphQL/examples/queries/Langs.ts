import { Query } from '../../';
import { langType } from '../types';
class Langs extends Query {
  constructor() {
    super('langs', langType );
  }
}
export default new Langs();
