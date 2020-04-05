# Typed GraphQL Class

This package depends of the [typed-graphqlify](https://github.com/acro5piano/typed-graphqlify).  The goal is to simplify write the Query or Mutation, writing the query as an array.

To install: `npm i typed-graphql-class`

![Write the queries as array](https://cdn-images-1.medium.com/max/2600/1*L8skUE0F1vkuc_Yn_EDFKw.png)


## Usage
- [Solution](#solution)
- [Simple query example](#simple-query-example)
- [Query of queries example](#query-of-queriesexample)
- [How to use it with Ajax library](#how-to-use-it-with-ajax-library)
- [Autocomplete queries](#autocomplete-queries)
   - [Simple query Example](#simple-query-example)
   - [Query of queries example](#query-of-queries-example)
- [Operation Class](#operation-class)

## Solution

- Create the (types)[https://graphql.org/learn/schema/#type-system] with the interface `IColumnType`.
- Define the query or mutation class.
- Call the query or mutation class with the columns and/or variables in an array, and get the query ready to send to the server.

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
    super(
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
    super(
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

## Autocomplete queries

There are two examples to create the `type` to create the array typed.
<img width="700" height="350" src="https://cdn-images-1.medium.com/max/1600/1*2p2-lt_yvzzt7b_r_KONKQ.gif">

### Simple query Example
```typescript
export interface IText {
  idText: number;
  text: string;
  idLang: string;
  idTranslation: number;
}

export type TTextKeys = keyof IText;
```
## Query of queries example:

```typescript
export interface ITranslation {
  idTranslation: number;
  code: string;
  text: IText;
}

export interface ITextArgs {
  columns: TTextKeys[],
  variables: ['idLang'];
}

type TTranslationSimpleKeys = keyof Omit<ITranslation, 'text'>;

export type TTranslationKeys = (
  TTranslationSimpleKeys |
  { text: ITextArgs }
);

```

## Operation Class

The Operation class return two values that are needed to the ajax call. For instance
```typescript
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
  translationQuery
);
const params = operation.params();
```
The params variable has the query and the variables values:
```typescript
const received = {
  query: `
    query translation($idLang: String, $idTranslation: Int) {
      translation(idTranslation: $idTranslation) {
        idTranslation
        code
        text(idLang: $idLang) {
          text
          idLang
        }
      }
    }`,
  variables: { "idTranslation": 5 },
};
```

So you now you can do it, in order to call the endpoint:
```typescript
const response = await axios.post(url, operation.params());
```

😀🙂
