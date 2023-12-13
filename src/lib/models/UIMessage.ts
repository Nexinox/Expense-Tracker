export interface IUIMessage {
  message: string;
  type: string;
  timeout?: number;
  btnText?: string;
  callback?: () => void;
}

export class UIMessage{
  public id: string = Math.random().toString(36);
  public message: string = "";
  public type: string = UIMessageType.INFO;
  public timeout?: number;
  public btnText?: string;
  public callback?: () => void;

  constructor(obj: IUIMessage) {
    this.message = obj.message;
    this.type = obj.type;
    this.timeout = obj.timeout;
    this.btnText = obj.btnText;
    this.callback = obj.callback;

    if (!obj.timeout && !obj.btnText && !obj.callback) {
      this.timeout = 5000;
    }
  }
}

export enum UIMessageType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning"
}