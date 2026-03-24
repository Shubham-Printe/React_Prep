import type { Invoice, CreateInvoiceInput } from "./model.js";

export interface ListInvoicesOptions {
    page: number;
    limit: number;
    status?: Invoice["status"];
}

export interface InvoiceRepository {
    create(input: CreateInvoiceInput): Promise<Invoice>;
    getById(id: string): Promise<Invoice | null>;
    getByPublicId(publicId: string): Promise<Invoice | null>;
    list(options: ListInvoicesOptions): Promise<{ items: Invoice[]; total: number }>;
    markPaid(id: string): Promise<Invoice | null>;
}
