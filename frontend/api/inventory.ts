// frontend/api/inventory.ts
import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {InventoryItem} from '../shared/data-models';

export default function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const demo: InventoryItem[] = [
        {
            id: '123' as any,
            sku: 'ABC-001',
            name: 'Sample Widget',
            category: 'cat-1' as any,
            stockLevel: 42,
            reorderPoint: 10,
            unitPrice: 9.99,
            totalValue: 42 * 9.99,
            warehouseId: 'wh-1' as any,
            lastActivity: new Date().toISOString() as any
        }
    ];
    res.status(200).json(demo);
}