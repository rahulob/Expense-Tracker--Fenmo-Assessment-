import { useState } from "react"
import { Card } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Edit3 } from "lucide-react"
import { CategorySelect } from "../components/CategorySelect"

export interface Expense {
    id: string
    amount: number
    category?: string
    description?: string
    date: string
}

interface ExpenseTableProps {
    title: string
    caption: string
    expenses: Expense[]
    isLoading?: boolean
    formatDate: (date: string) => string
    formatCurrency: (amount: number) => string
    onSave: (expense: Expense) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function ExpenseTable({
    title,
    caption,
    expenses,
    isLoading = false,
    formatDate,
    formatCurrency,
    onSave,
    onDelete,
}: ExpenseTableProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editing, setEditing] = useState<Expense | null>(null)
    const [form, setForm] = useState<Partial<Expense>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const openEdit = (expense: Expense) => {
        setEditing(expense)
        setForm({
            ...expense,
            date: expense.date.split("T")[0],
        })
        setIsEditOpen(true)
    }

    const closeEdit = () => {
        setIsEditOpen(false)
        setEditing(null)
        setForm({})
    }

    const save = async () => {
        if (!editing || !form.amount || !form.date) return
        setIsSaving(true)
        await onSave({ ...editing, ...form } as Expense)
        setIsSaving(false)
        closeEdit()
    }

    const remove = async () => {
        if (!editing) return
        setIsDeleting(true)
        await onDelete(editing.id)
        setIsDeleting(false)
        closeEdit()
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "food": return "text-orange-600 font-semibold"
            case "transport": return "text-blue-600 font-semibold"
            case "shopping": return "text-purple-600 font-semibold"
            case "entertainment": return "text-pink-600 font-semibold"
            case "bills": return "text-gray-600 font-semibold"
            default: return "text-gray-800 font-semibold"
        }
    }

    const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    )

    return (
        <Card className="p-4 mt-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>

                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-red-600 font-mono">
                        {isLoading ? "—" : formatCurrency(totalAmount)}
                    </p>
                </div>
            </div>

            <Table className="min-w-[700px]">
                <TableCaption>{caption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                Loading expenses...
                            </TableCell>
                        </TableRow>
                    ) : expenses.length ? (
                        expenses.map((expense) => (
                            <TableRow key={expense.id} className="hover:bg-gray-50/50">
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell className="font-mono font-bold text-red-600">
                                    {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-sm ${getCategoryColor(expense.category ?? "")}`}>
                                        {expense.category || "Other"}
                                    </span>
                                </TableCell>
                                <TableCell className="truncate max-w-md">
                                    {expense.description || "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(expense)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No expenses found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>Update or delete your expense</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Amount (₹)</Label>
                            <Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
                        </div>

                        <CategorySelect value={form.category || ""} onChange={(v) => setForm({ ...form, category: v })} />

                        <div className="grid gap-2">
                            <Label>Description (optional)</Label>
                            <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button variant="destructive" onClick={remove} disabled={isDeleting || isSaving}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={closeEdit} disabled={isDeleting || isSaving}>Cancel</Button>
                            <Button onClick={save} disabled={isDeleting || isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
