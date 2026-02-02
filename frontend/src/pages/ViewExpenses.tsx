import { useEffect, useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { toast } from "sonner"
import apiInstance from "../api/api_instance"
import { CategorySelect } from "../components/CategorySelect"
import { ExpenseTable } from "../components/ExpenseTable"

interface Expense {
    id: string
    amount: number
    description?: string
    category?: string
    date: string
}

export default function ViewExpenses() {
    const [viewMode, setViewMode] = useState<"filtered" | "all">("filtered")
    const [month, setMonth] = useState("0")
    const [year, setYear] = useState(new Date().getFullYear().toString())
    const [category, setCategory] = useState<string | undefined>()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const normalizeCategoryParam = (category?: string) => {
        if (category === "all") return undefined
        if (category === "Other") return ""
        return category
    }

    const fetchExpenses = async () => {
        setIsLoading(true)
        setExpenses([])

        try {
            const endpoint = viewMode === "all"
                ? "/expenses/get-all"
                : "/expenses/get-by-date-range"

            const params: any = viewMode === "all"
                ? { category: normalizeCategoryParam(category) }
                : {
                    month: parseInt(month),
                    year: parseInt(year),
                    category: normalizeCategoryParam(category)
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
    useEffect(() => {

        fetchExpenses()
    }, [viewMode, month, year, category])

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CategorySelect
                            value={category}
                            onChange={(value) => setCategory(value)}
                        />
                        {viewMode === "filtered" && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </Card>
            <ExpenseTable
                title="Expenses"
                caption="View your past expenses here"
                expenses={expenses}
                isLoading={isLoading}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                onSave={async (expense) => {
                    await apiInstance.put(`/expenses/update-by-id/${expense.id}`, expense)
                    fetchExpenses()
                }}
                onDelete={async (id) => {
                    await apiInstance.delete(`/expenses/delete-by-id/${id}`)
                    fetchExpenses()
                }}
            />
        </div>
    )
}