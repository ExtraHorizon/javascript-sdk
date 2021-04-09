interface IErrorResponse {
    code: number;
    name: string;
    message: string;
}

export type ErrorResponse = Partial<IErrorResponse>;
