export class ResData {
  id: number;
  type: string;
  res: string;

  constructor(id: number, type: string, res: string) {
    this.id = id;
    this.type = type;
    this.res = res;
  }
}

export class httpData {
  id: number;
  content: string;
  createTime: string;

  constructor(id: number, content: string, createTime: string) {
    this.id = id;
    this.content = content;
    this.createTime = createTime;
  }
}