import { describe, expect, it } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"

type Row = { id: number; name: string }

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Nom", cell: (ctx) => String(ctx.getValue()) },
]

const data: Row[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
]

describe("DataTable", () => {
  it("renders the header and all rows", () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText("Nom")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("filters rows by the search key", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Rechercher un nom..."
      />
    )
    fireEvent.change(screen.getByPlaceholderText("Rechercher un nom..."), {
      target: { value: "alice" },
    })
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })

  it("shows an empty state when there is no data", () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText("Aucun résultat.")).toBeInTheDocument()
  })

  it("paginates when there are more than 10 rows", () => {
    const manyRows = Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Item ${i}` }))
    render(<DataTable columns={columns} data={manyRows} />)
    expect(screen.getByText(/Page 1 sur 2/)).toBeInTheDocument()
    expect(screen.getByText("Item 0")).toBeInTheDocument()
    expect(screen.queryByText("Item 12")).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole("button")[1])
    expect(screen.getByText(/Page 2 sur 2/)).toBeInTheDocument()
  })
})