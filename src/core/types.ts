export type HttpConfig = {
    readonly method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    readonly path: string;
    readonly query?: Record<string, any>;
    readonly body?: any;
    readonly authenticate?: boolean;
    readonly snakeCaseRequest?: boolean;
}
