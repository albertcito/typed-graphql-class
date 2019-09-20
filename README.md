# Typed GraphQL Class

This package depends of the [typed-graphqlify](https://github.com/acro5piano/typed-graphqlify). The goal is to simplify the Query/Mutation use in the code.

To install: `npm i typed-graphql-class`

## Why

Because a nested queries looks very ugly and more difficult to read if you need add variables in the nested columns. Also if I want to create many instances of the same query requesting others columns I have to define the column type every time.

## Solution

The code provee the define the queries and mutations as classes and I call them only defining the columns and variables.

## Simple query example:

File `TextType.tsx` in `graphql/types`;
```typescript
import { types } from 'typed-graphql-class';
import { IColumnType } from 'typed-graphql-class/dist/interfaces';
const textType: IColumnType[] = [
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
import { Query } from 'typed-graphql-class';
import { textType } from 'graphql/types';
class TextQuery extends Query {
  constructor() {
    this.query = new Query(
      'text',
      textType,
      { idLang: 'String' }
    );
  }
}
export default new Text();
```

How to use it:
```typescript
const query = textQuery.toString({
  columns: ['text', 'idLang','idTranslation'],
  variables: ['idLang']
});
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
import { types, GraphQL } from 'typed-graphql-class';
import { IColumnType } from 'typed-graphql-class/dist/interfaces';
const translationType: IColumnType[] = [
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
import { Query } from 'typed-graphql-class';
class Translation extends Query{
  constructor() {
    this.query = new Query(
      'translation',
      translationType,
      {
        idTranslation: server.int,
        idLang: server.string,
      }
    );
  }
}
export default new Translation();
```
How to use it:
```typescript
const query = translationQuery.toString({
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
  const query = translationQuery.toString({
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