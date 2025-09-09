import { FieldPath } from "@angular/fire/compat/firestore";
export type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';
export interface IFirebaseWriteResult {
  id?: string,
  success: boolean,
  message?: string,
}
export interface IFirebaseQuery {
  fieldPath: string | FieldPath,
  opStr: WhereFilterOp,
  value: any,
  type?: 'and' | 'or'
}