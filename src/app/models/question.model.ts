
export interface IQuestion {
  id?: string,
  topic: number,
  part?: number,
  no: number,
}

export interface ICode {
  id?: string,
  key: string,
  created_at: string,
  times?: number
  uid_user?: string
}


export interface IQuestionOneTwo extends IQuestion {
  audio: string,
  img: string,
  a: string,
  b: string,
  c: string,
  d: string,
  key: string,
  content: string,
}

export interface IQuestionThreeFourFive extends IQuestion {
  img: string,
  group: Array<{
    content: string,
    no: number,
    a: string,
    b: string,
    c: string,
    d: string,
    key: string,
  }>
}

export interface IQuestionSix extends IQuestion {
  img: string,
  content: string,
  group: Array<{
    no: number,
    a: string,
    b: string,
    c: string,
    d: string,
    key: string,
  }>
}

export interface IQuestionSeven extends IQuestion {
  img: string,
  content: string,
  group: Array<{
    content: string,
    no: number,
    a: string,
    b: string,
    c: string,
    d: string,
    key: string,
  }>
}