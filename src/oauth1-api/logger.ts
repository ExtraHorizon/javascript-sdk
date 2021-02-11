export class RequestLogger {
  private requestStart = new Date();

  constructor(private method: string, private url: string) {
    console.log(`--> ${this.requestStart.toISOString()} ${method} ${url}`);
  }

  end(statusCode: number) {
    const requestEnd = new Date();
    console.log(
      `<-- ${requestEnd.toISOString()} ` +
      `${statusCode} in ${requestEnd.getTime() - this.requestStart.getTime()}ms ` +
      `${this.method} ${this.url}`
    );
  }
}
