 "use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, Plus, DollarSign, UtensilsCrossed } from "lucide-react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

export default function MenuPage() {

  const [menuItems, setMenuItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [form, setForm] = useState<any>({
    name: "",
    category: "",
    price: "",
    description: ""
  })

  const [file, setFile] = useState<File | null>(null)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  // ⭐ Fetch Menu
  const fetchMenu = async () => {

    try {

      const res = await fetch(`${API_BASE}/api/menu`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : []

      setMenuItems(data)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  // ⭐ Add Menu
  const handleAdd = async (e: React.FormEvent) => {

    e.preventDefault()

    const data = new FormData()

    data.append("name", form.name)
    data.append("category", form.category)
    data.append("price", form.price)
    data.append("description", form.description)

    if (file) data.append("file", file)

    await fetch(`${API_BASE}/api/menu/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: data
    })

    setIsAddOpen(false)
    fetchMenu()
  }

  // ⭐ Edit Menu
  const handleEdit = async (e: React.FormEvent) => {

    e.preventDefault()

    const data = new FormData()

    data.append("id", selectedItem.id)
    data.append("name", form.name)
    data.append("category", form.category)
    data.append("price", form.price)
    data.append("description", form.description)

    if (file) data.append("file", file)

    await fetch(`${API_BASE}/api/menu/update`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: data
    })

    setIsEditOpen(false)
    fetchMenu()
  }

  // ⭐ Delete
  const handleDelete = async (id: number) => {

    await fetch(`${API_BASE}/api/menu/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    fetchMenu()
  }

  // ⭐ Filtering
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((m) => m.category)))
  ]

  const filtered = menuItems.filter((item: any) => {

    if (selectedCategory !== "All" &&
      item.category !== selectedCategory) return false

    if (search &&
      !item.name.toLowerCase().includes(search.toLowerCase()))
      return false

    return true
  })

  const avgPrice = Math.round(
    menuItems.reduce((a, m) => a + (m.price || 0), 0) /
    (menuItems.length || 1)
  )

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <UtensilsCrossed />
            <div>
              <p className="font-bold">{menuItems.length}</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <DollarSign />
            <div>
              <p className="font-bold">Ksh {avgPrice}</p>
              <p className="text-xs">Avg Price</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Search + Categories */}
      <div className="flex gap-3 flex-wrap">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" />

          <Input
            placeholder="Search..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}

      </div>

      {/* Menu Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {filtered.map(item => {

          const imageUrl = item.image
            ? `${API_BASE}${item.image}`
            : "/placeholder.png"

          return (
            <Card key={item.id}>
              <CardContent className="p-4">

                <img
                  src={imageUrl}
                  className="h-36 w-full object-cover rounded-xl"
                />

                <h2 className="font-semibold mt-2">
                  {item.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {item.category}
                </p>

                <p className="font-bold text-primary">
                  Ksh {Number(item.price).toFixed(2)}
                </p>

                <div className="flex justify-between mt-3">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(item)
                      setForm(item)
                      setIsEditOpen(true)
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>

                </div>

              </CardContent>
            </Card>
          )
        })}

      </div>

      {/* ⭐ ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <form
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-xl w-96 space-y-3"
          >

            <h2 className="text-lg font-semibold">Add Menu Item</h2>

            <Input
              placeholder="Name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="Category"
              onChange={e => setForm({ ...form, category: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Price"
              onChange={e => setForm({ ...form, price: e.target.value })}
            />

            <Input
              placeholder="Description"
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <Input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline"
                onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>

              <Button type="submit">
                Save
              </Button>
            </div>

          </form>
        </div>
      )}

      {/* ⭐ EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <form
            onSubmit={handleEdit}
            className="bg-white p-6 rounded-xl w-96 space-y-3"
          >

            <h2 className="text-lg font-semibold">
              Edit Menu Item
            </h2>

            <Input
              value={form.name || ""}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              value={form.category || ""}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <Input
              type="number"
              value={form.price || ""}
              onChange={e =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <Input
              value={form.description || ""}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">
                Update
              </Button>
            </div>

          </form>
        </div>
      )}

    </div>
  )
} 