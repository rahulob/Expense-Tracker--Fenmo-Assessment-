import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Button } from "./ui/button"

export const CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
] as const

interface CategorySelectProps {
    value?: string
    onChange: (value?: string) => void
    placeholder?: string
    disabled?: boolean
    showAll?: boolean
}

export function CategorySelect({
    value,
    onChange,
    placeholder = "Select category",
    disabled = false,
    showAll = false,
}: CategorySelectProps) {
    return (
        <div className="space-y-1 w-45">
            <Label className="text-sm font-medium">
                Category
            </Label>

            <div className="relative">
                <Select
                    value={value}
                    onValueChange={(val) => onChange(val)}
                    disabled={disabled}
                >
                    <SelectTrigger className="pr-8">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>

                    <SelectContent>
                        {value && !disabled && (
                            <Button onClick={() => onChange(undefined)}>
                                Clear
                            </Button>
                        )}
                        {showAll && (
                            <SelectItem value="all">
                                All Categories
                            </SelectItem>
                        )}

                        {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
