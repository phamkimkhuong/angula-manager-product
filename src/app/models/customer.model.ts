export interface ICustomer {
    id?: string,
    created_at: string,
    name: string,
    email: string,
    phone?: string,
    quantity_user: number,
    expired_date: string,
    domain?: string,
}