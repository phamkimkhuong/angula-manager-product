export interface DataChart {
    name: string,
    total: number
}

export interface ResponseDto<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T
}
