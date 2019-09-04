# Typed GraphQL Class

This package depends of the [typed-graphqlify](https://github.com/acro5piano/typed-graphqlify). The goal is to simplify the Query/Mutation use in the code.

## Simple query example:

File `TextType.tsx` in `graphql/types`;
```typescript
const textType: ColumnTypeInterface[] = [
  {
    name: 'idLang',
    resolve: types.string
  },
  {
    name: 'text',
    resolve: types.string
  },
  {
    name: 'idTranslation',
    resolve: types.number
  },
];
export default textType;
```

File: `TextQuery.tsx` in 'graphql/queries'
```typescript
import { textType } from 'graphql/types';
class TextQuery  {
  private readonly query: Query;
  constructor() {
    this.query = new Query(textType, {
      idLang: 'String'
    });
  }

  resolve = ({ columns }: ColVarInterface) => {
    return this.query.toString(
      'text',
      {
        columns,
        variables: ['idLang']
      }
    );
  };
}
export default new Text();
```

How to use it:
```typescript
const query = textQuery.resolve(['text', 'idLang','idTranslation']);
console.log(query);
```
Result
```graphql
query text($idLang: String) {
  text(idLang: $idLang) {
    text
    idLang
    idTranslation
  }
}
```

## Query of queries example:

File `TranslationType.tsx` in `graphql/types`;
```typescript
const translationType: ColumnTypeInterface[] = [
  {
    name: 'idTranslation',
    resolve: types.number
  },
  {
    name: 'code',
    resolve: types.string
  },
  {
    name: 'text',
    resolve: (args: ColVarInterface) => {
      const graphQL = new GraphQL(textType, { idLang: 'String' });
      return graphQL.resolve(args);
    }
  },
  {
    name: 'texts',
    resolve: (args: ColVarInterface) => {
      const graphQL = new GraphQL(textType);
      return graphQL.resolve(args);
    }
  },
];
```
File: `TranslationQuery.tsx` in 'graphql/queries'
```typescript
class Translation {
  private readonly query: Query;
  readonly operation = 'translation';
  constructor() {
    this.query = new Query(translationType, {
      idTranslation: server.int,
      idLang: server.string,
    });
  }
  public resolve = ({ columns, variables }: ColVarInterface) => {
    return this.query.toString(
      this.operation,
      {
        columns,
        variables,
      }
    );
  };
}
export default new Translation();
```
How to use it:
```typescript
const query = translationQuery.resolve({
  columns: [
    'idTranslation',
    'code',
    {
      'text': {
        columns: ['text', 'idLang'],
        variables: ['idLang'],
      }
    }
  ],
  variables: ['idTranslation']
});
console.log(query);
```

Result
```graphql
query translation($idLang: String, $idTranslation: Int) {
  translation(idTranslation: $idTranslation) {
    idTranslation
    code
    text(idLang: $idLang) {
      text
      idLang
    }
  }
}
```

## How to use it with Ajax library

Using the Query of queries example.
```typescript
interface ITranslationArgs {
  idLang: string;
  idTranslation: number;
}
const getTranslation = async (variables: ITranslationArgs) => {
  const query = translationQuery.resolve({
    columns: [
      'idTranslation',
      'code',
      {
        'text': {
          columns: ['text', 'idLang'],
          variables: ['idLang'],
        }
      }
    ],
    variables: Object.keys(variables)
  });
  const url = 'http://mydomain.com/graphql';
  const response = await axios.post(url, { query, variables });
  console.log(response);
}
```