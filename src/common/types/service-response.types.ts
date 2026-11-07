export interface ServiceMessageResponse {
  message: string;
}

export interface ServiceDataResponse<T> extends ServiceMessageResponse {
  data: T;
}
