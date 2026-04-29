import { FiBox } from 'react-icons/fi';
import { Input, Select, DataTable } from '@/Components/PosUI';

export default function InventoryTab({
    inventoryForm,
    submitInventory,
    inventoryMode,
    setInventoryMode,
    inventoryToday,
    waterRestocksToday,
    waterRestockForm,
    submitWaterRestock,
}) {
    return (
        <section className="rounded-md border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Daily Ice Variance</h3>
            <div className="mb-4 inline-flex rounded-md border border-gray-200 p-1">
                <button
                    type="button"
                    onClick={() => setInventoryMode('daily')}
                    className={`rounded-md px-3 py-1 text-sm ${inventoryMode === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    Daily Ice Variance
                </button>
                <button
                    type="button"
                    onClick={() => setInventoryMode('water')}
                    className={`rounded-md px-3 py-1 text-sm ${inventoryMode === 'water' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    Water Restock
                </button>
            </div>

            {inventoryMode === 'daily' ? (
                <>
                    <form onSubmit={submitInventory} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            label="Count Date"
                            type="date"
                            value={inventoryForm.data.count_date}
                            onChange={(value) => inventoryForm.setData('count_date', value)}
                        />
                        <Select
                            label="Ice Size"
                            value={inventoryForm.data.ice_size}
                            onChange={(value) => inventoryForm.setData('ice_size', value)}
                            options={[
                                { value: '28mm', label: '28mm (Tube)' },
                                { value: '35mm', label: '35mm (Tube)' },
                            ]}
                        />
                        <Input
                            label="Beginning Sacks"
                            type="number"
                            step="0.01"
                            value={inventoryForm.data.beginning_sacks}
                            onChange={(value) => inventoryForm.setData('beginning_sacks', value)}
                        />
                        <Input
                            label="Harvested Today"
                            type="number"
                            step="0.01"
                            value={inventoryForm.data.harvested_today}
                            onChange={(value) => inventoryForm.setData('harvested_today', value)}
                        />
                        <Input
                            label="Actual Ending Count"
                            type="number"
                            step="0.01"
                            value={inventoryForm.data.actual_ending_count}
                            onChange={(value) => inventoryForm.setData('actual_ending_count', value)}
                        />
                        <Input
                            label="Notes"
                            value={inventoryForm.data.notes}
                            onChange={(value) => inventoryForm.setData('notes', value)}
                        />
                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                CALC VARIANCE & SAVE
                            </button>
                        </div>
                    </form>

                    <table className="mt-4 w-full table-auto border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="px-3 py-2">Ice Size</th>
                                <th className="px-3 py-2">Harvested</th>
                                <th className="px-3 py-2">Sold</th>
                                <th className="px-3 py-2">Expected</th>
                                <th className="px-3 py-2">Actual</th>
                                <th className="px-3 py-2">Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryToday.map((row) => (
                                <tr key={row.id} className="border-t border-gray-200">
                                    <td className="px-3 py-2">{row.ice_size}</td>
                                    <td className="px-3 py-2">{row.harvested_today}</td>
                                    <td className="px-3 py-2">{row.sold_today}</td>
                                    <td className="px-3 py-2">{row.expected_count}</td>
                                    <td className="px-3 py-2">{row.actual_ending_count}</td>
                                    <td
                                        className={`px-3 py-2 ${
                                            Number(row.variance) > 0
                                                ? 'text-red-700'
                                                : 'text-green-700'
                                        }`}
                                    >
                                        {row.variance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <form onSubmit={submitWaterRestock} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            label="Restock Date"
                            type="date"
                            value={waterRestockForm.data.restock_date}
                            onChange={(value) => waterRestockForm.setData('restock_date', value)}
                        />
                        <Input
                            label="Item Name"
                            value={waterRestockForm.data.item_name}
                            onChange={(value) => waterRestockForm.setData('item_name', value)}
                        />
                        <Input
                            label="Quantity"
                            type="number"
                            step="0.01"
                            value={waterRestockForm.data.quantity}
                            onChange={(value) => waterRestockForm.setData('quantity', value)}
                        />
                        <Input
                            label="Unit"
                            value={waterRestockForm.data.unit}
                            onChange={(value) => waterRestockForm.setData('unit', value)}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Notes"
                                value={waterRestockForm.data.notes}
                                onChange={(value) => waterRestockForm.setData('notes', value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                SAVE WATER RESTOCK
                            </button>
                        </div>
                    </form>

                    <DataTable
                        title="Water Restocks Today"
                        icon={<FiBox />}
                        headers={['Date', 'Item', 'Qty', 'Unit']}
                        rows={waterRestocksToday.map((row) => [
                            row.restock_date,
                            row.item_name,
                            row.quantity,
                            row.unit,
                        ])}
                    />
                </>
            )}
        </section>
    );
}
