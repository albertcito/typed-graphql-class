import { ITranslation } from "./Translation";
import { ITextArgs } from "../Text";

type TTranslationSimpleKeys = keyof Omit<ITranslation, 'text'>;
export type TTranslationKeys = (
  TTranslationSimpleKeys |
  { text: ITextArgs }
);
