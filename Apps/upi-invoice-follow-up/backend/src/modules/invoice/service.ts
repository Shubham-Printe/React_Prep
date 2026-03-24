import type { CreateInvoiceInput } from "./model.js";
import type { InvoiceRepository, ListInvoicesOptions } from "./repo.js";

export function createInvoiceService(deps: { repo: InvoiceRepository }) {
    return {
        async create(input: CreateInvoiceInput) {
            return deps.repo.create(input);
        },
        async getById(id: string) {
            return deps.repo.getById(id);
        },
        async getByPublicId(publicId: string) {
            return deps.repo.getByPublicId(publicId);
        },
        async list(options: ListInvoicesOptions) {
            return deps.repo.list(options);
        },
        async markPaid(id: string) {
            return deps.repo.markPaid(id);
        },
    };
}

export type InvoiceService = ReturnType<typeof createInvoiceService>;