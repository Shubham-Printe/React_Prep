export type InvoiceStatus = "draft" | "sent" | "paid";

export interface Invoice {
    id: string;
    publicId: string;
    amount: number;
    description: string;
    dueDate?: string;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInvoiceInput {
    amount: number;
    description: string;
    dueDate?: string;
}

export function buildInvoice(
    input: CreateInvoiceInput, 
    opts: { id: string; publicId: string; createdAt: string, updatedAt: string}
): Invoice {
    return {
        ...opts,
        amount: input.amount,
        description: input.description,
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
        status: "draft",
    };
}