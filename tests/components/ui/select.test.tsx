import { describe, expect, it } from "vitest"
import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Harness() {
  const [value, setValue] = useState("a")
  return (
    <Select value={value} onValueChange={(next) => setValue(next ?? "")}>
      <SelectTrigger>
        <SelectValue>{value === "a" ? "Option A" : "Option B"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Groupe</SelectLabel>
          <SelectItem value="a">Option A</SelectItem>
          <SelectSeparator />
          <SelectItem value="b">Option B</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

describe("Select primitives", () => {
  it("opens the select and shows the group label and separator", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    expect(screen.getByRole("combobox")).toHaveTextContent("Option A")
    await user.click(screen.getByRole("combobox"))
    expect(await screen.findByText("Groupe")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Option B" })).toBeInTheDocument()
  })

  it("selects an item", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: "Option B" })
    await user.click(option)
    expect(screen.getByRole("combobox")).toHaveTextContent("Option B")
  })
})