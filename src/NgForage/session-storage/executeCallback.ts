/** @internal */
export function executeCallback(promise: Promise<any>, callback?: any): void {
  if (callback) {
    promise.then(
      (result: any) => {
        callback(null, result);
      },
      (error: any) => {
        callback(error);
      }
    );
  }
}
