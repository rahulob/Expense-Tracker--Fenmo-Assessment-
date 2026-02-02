import { useEffect, useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Edit3 } from "lucide-react"
import { toast } from "sonner"
import apiInstance from "../api/api_instance"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "../components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"

interface Expense {
    id: string
    amount: number
    description: string
    category: string
    date: string
}

export default function ViewExpenses() {
    const [viewMode, setViewMode] = useState<"filtered" | "all">("filtered")
    const [month, setMonth] = useState("0")
    const [year, setYear] = useState(new Date().getFullYear().toString())
    const [category, setCategory] = useState("all")
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Edit dialog states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
    const [editForm, setEditForm] = useState<Partial<Expense>>({})
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true)
            setExpenses([])

            try {
                const endpoint = viewMode === "all"
                    ? "/expenses/get-all"
                    : "/expenses/get-by-date-range"

                const params: any = viewMode === "all"
                    ? { category: category === "all" ? undefined : category }
                    : {
                        month: parseInt(month),
                        year: parseInt(year),
                        category: category === "all" ? undefined : category
                    }

                const response = await apiInstance.get(endpoint, { params })
                const expenseData = response.data.expenses || response.data
                setExpenses(expenseData)
            } catch (error: any) {
                toast.error(error.response?.data?.detail || "Failed to fetch expenses.")
                setExpenses([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchExpenses()
    }, [viewMode, month, year, category])

    const openEditDialog = (expense: Expense) => {
        setEditingExpense(expense)
        setEditForm({
            amount: expense.amount,
            description: expense.description,
            category: expense.category,
            date: expense.date.split('T')[0] // Format date for input
        })
        setIsEditDialogOpen(true)
    }

    const closeEditDialog = () => {
        setIsEditDialogOpen(false)
        setEditingExpense(null)
        setEditForm({})
    }

    const saveEdit = async () => {
        if (!editingExpense || !editForm.amount || !editForm.description || !editForm.category || !editForm.date) {
            toast.error("Please fill all fields")
            return
        }

        setIsSaving(true)
        try {
            await apiInstance.put(`/expenses/update-by-id/${editingExpense.id}`, editForm)
            toast.success("Expense updated successfully!")

            // Update the expense in the local state
            setExpenses(expenses.map(exp =>
                exp.id === editingExpense.id
                    ? { ...exp, ...editForm } as Expense
                    : exp
            ))

            closeEditDialog()
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to update expense")
        } finally {
            setIsSaving(false)
        }
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount)
    }

    const getTotalAmount = () => {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0)
    }

    return (
        <div className="p-4 mx-auto max-w-6xl">
            <Card className="p-6 space-y-4">
                <h2 className="text-xl font-bold">View Expenses</h2>

                {/* View Mode Toggle */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={viewMode === "filtered" ? "default" : "outline"}
                        onClick={() => setViewMode("filtered")}
                        className="flex-1"
                    >
                        Filtered View
                    </Button>
                    <Button
                        variant={viewMode === "all" ? "default" : "outline"}
                        onClick={() => setViewMode("all")}
                        className="flex-1"
                    >
                        View All
                    </Button>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    {viewMode === "filtered" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Month</label>
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger>
                                        <SelectValue>{month === "0" ? "Entire Year" : month}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Entire Year</SelectItem>
                                        {[...Array(12)].map((_, idx) => (
                                            <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                                                {new Date(2026, idx, 1).toLocaleDateString('en-US', { month: 'short' })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Year</label>
                                <Input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    min={2020}
                                    max={2030}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Transport">Transport</SelectItem>
                                        <SelectItem value="Shopping">Shopping</SelectItem>
                                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                                        <SelectItem value="Bills">Bills</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Transport">Transport</SelectItem>
                                        <SelectItem value="Shopping">Shopping</SelectItem>
                                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                                        <SelectItem value="Bills">Bills</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-4 mt-6 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {viewMode === "all" ? "All Expense Records" : "Filtered Expense Records"}
                    </h3>
                    <div className="text-2xl font-bold text-red-600">
                        Total: {formatCurrency(getTotalAmount())}
                    </div>
                </div>

                <Table className="min-w-[700px]">
                    <TableCaption>
                        {viewMode === "all"
                            ? `All expenses${category !== "all" ? ` - ${category}` : ""}`
                            : month === "0"
                                ? `Expenses for ${year}${category !== "all" ? ` - ${category}` : ""}`
                                : `${new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}${category !== "all" ? ` - ${category}` : ""}`
                        }
                    </TableCaption>
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
                        ) : expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <TableRow key={expense.id} className="hover:bg-gray-50/50">
                                    <TableCell className="px-4 py-3 font-medium">
                                        {formatDate(expense.date)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="font-mono text-lg font-bold text-red-600">
                                            {formatCurrency(expense.amount)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-sm ${getCategoryColor(expense.category)}`}>
                                            {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="max-w-md truncate block">{expense.description}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(expense)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No expenses found{viewMode === "filtered" && category !== "all" ? ` for ${category}` : ""}.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>
                            Make changes to your expense here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={editForm.date || ''}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-amount">Amount (₹)</Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={editForm.amount || ''}
                                onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={editForm.category || ''}
                                onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                            >
                                <SelectTrigger id="edit-category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Bills">Bills</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                type="text"
                                placeholder="Enter description"
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={closeEditDialog}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={saveEdit}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}