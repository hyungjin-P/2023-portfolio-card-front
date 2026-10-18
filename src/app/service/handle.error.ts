import { throwError } from 'rxjs'

export default (error: any) => {
  const errorObj: any = {
    error: error?.error,
    status: error?.status,
    message: error?.error.message
  };

  return throwError(errorObj);
}
