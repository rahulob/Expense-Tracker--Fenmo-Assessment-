import { useEffect, useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { CategorySelect } from "../components/CategorySelect"
import { toast } from "sonner"
import apiInstance from "../api/api_instance"
import { ExpenseTable } from "../components/ExpenseTable"

interface Expense {
    id: string
    amount: number
    category: string
    description?: string
    date: string
}

export default function Dashboard() {
    const today = new Date()

    const [form, setForm] = useState({
        amount: "",
        category: "",
        description: "",
        date: today.toISOString().split("T")[0],
    })

    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchCurrentMonthExpenses = async () => {
        setIsLoading(true)
        try {
            const response = await apiInstance.get("/expenses/get-by-date-range", {
                params: {
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                },
            })
            console.log(response);

            setExpenses(response.data || [])
        } catch {
            setExpenses([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCurrentMonthExpenses()
    }, [])

    const createExpense = async () => {
        if (!form.amount) {
            toast.error("Amount is required")
            return
        }

        try {
            await apiInstance.post("/expenses/create", {
                ...form,
                amount: parseFloat(form.amount),
            })

            toast.success("Expense added")

            setForm({
                amount: "",
                category: "",
                description: "",
                date: today.toISOString().split("T")[0],
            })

            fetchCurrentMonthExpenses()
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to add expense")
        }
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount)

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        })

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            {/* Add expense */}
            <Card className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Add Expense</h2>

                <div className="flex gap-4 items-center">
                    <div>
                        <Label>Amount (₹)</Label>
                        <Input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                            className="mt-2"
                        />
                    </div>

                    <CategorySelect
                        value={form.category}
                        onChange={(value) =>
                            setForm({ ...form, category: value ?? "" })
                        }
                    />

                    <div>
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Input
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="mt-2"
                        />
                    </div>
                </div>

                <Button onClick={createExpense}>
                    Add Expense
                </Button>
            </Card>

            {/* Current month expenses */}
            <ExpenseTable
                title={today.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric"
                })}
                caption="Expenses for this month"
                expenses={expenses}
                isLoading={isLoading}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                onSave={async (expense) => {
                    await apiInstance.put(`/expenses/update-by-id/${expense.id}`, expense)
                    fetchCurrentMonthExpenses()
                }}
                onDelete={async (id) => {
                    await apiInstance.delete(`/expenses/delete-by-id/${id}`)
                    fetchCurrentMonthExpenses()
                }}
            />
        </div>
    )
}
