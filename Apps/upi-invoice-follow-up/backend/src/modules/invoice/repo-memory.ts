import { buildInvoice } from "./model.js";
import type { CreateInvoiceInput } from "./model.js";
import type { InvoiceRepository, ListInvoicesOptions } from "./repo.js";
import type { Invoice } from "./model.js";

export function createInvoiceRepoMemory( deps: { now?: () => string} = {}): InvoiceRepository {

    const now = deps.now ?? (() => new Date().toISOString());
    const byId = new Map<string, Invoice>();
    const byPublicId = new Map<string, Invoice>();

    return {
        async create(input: CreateInvoiceInput): Promise<Invoice> {
            const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            const publicId = `public_${id.slice(4)}`;
            const createdAt = now();
            const invoice = buildInvoice(input, { id, publicId, createdAt, updatedAt: createdAt});
            byId.set(invoice.id, invoice);
            byPublicId.set(invoice.publicId, invoice);
            return invoice;
        },
        async getById(id: string) {
            return byId.get(id) ?? null;
        },
        async getByPublicId(publicId: string) {
            return byPublicId.get(publicId) ?? null;
        },
        async list(options: ListInvoicesOptions) {
            const { page, limit, status } = options;
            let items = [...byId.values()];
            if(status) items = items.filter((i) => i.status === status);
            const total = items.length;
            const offset = (page - 1) * limit;
            items = items.slice(offset, offset + limit);
            return { items, total };
        },
        async markPaid(id: string) {
            const inv = byId.get(id);
            if(!inv) return null;
            const updated = { ...inv, status: "paid" as const, updatedAt: now()};
            byId.set(id, updated);
            byPublicId.set(inv.publicId, updated);
            return updated;
        }
    }
}