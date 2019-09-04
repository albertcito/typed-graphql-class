import { types } from 'typed-graphqlify';

export interface IColumnType {
  name: string;
  resolve: types | Function;
}

export interface IVars {
  [key: string]: string;
}

export interface IColsTypes {
  [key: string]: types | IColsTypes;
}

/** This interfaces if for the column selected */

export interface IColVar {
  columns: Array<ICols | string>;
  variables?: string[];
}

export interface ICols {
  [key: string]: Array<ICols | string> | IColVar;
}
