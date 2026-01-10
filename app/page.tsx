"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  sizes: string[];
  colors: string[];
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Product 1", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
  { id: "p2", name: "Product 2", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
  { id: "p3", name: "Product 3", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
  { id: "p4", name: "Product 4", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
];

type LineItem = {
  productId: string;
  size: string;
  color: string;
  qty: number;
};

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Record<string, LineItem>>({});

  const lockDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString();
  }, []);

  function updateItem(product: Product, patch: Partial<LineItem>) {
    setItems(prev => {
      const current = prev[product.id] ?? {
        productId: product.id,
        size: product.sizes[0],
        color: product.colors[0],
        qty: 0,
      };
      return { ...prev, [product.id]: { ...current, ...patch } };
    });
  }

  function submit() {
    if (!name.trim() || !email.trim()) {
      alert("Please enter name and email");
      return;
    }

    const selected = Object.values(items).filter(i => i.qty > 0);

    alert(
      `Order submitted!\n\nName: ${name}\nEmail: ${email}\nItems:\n` +
        selected.map(i => `${i.productId} ${i.size} ${i.color} x${i.qty}`).join("\n") +
        `\n\nOrder locks on: ${lockDate}`
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Product Picker</h1>
      <p>Submit your selections. You can edit for 7 days.</p>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
      />

      {PRODUCTS.map(p => {
        const item = items[p.id] ?? { qty: 0, size: p.sizes[0], color: p.colors[0] };
        return (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <strong>{p.name}</strong>

            <div>
              Qty:
              <input
                type="number"
                min={0}
                value={item.qty}
                onChange={e => updateItem(p, { qty: Number(e.target.value) })}
                style={{ marginLeft: 8, width: 60 }}
              />
            </div>

            <div>
              Size:
              <select
                value={item.size}
                onChange={e => updateItem(p, { size: e.target.value })}
                style={{ marginLeft: 8 }}
              >
                {p.sizes.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              Color:
              <select
                value={item.color}
                onChange={e => updateItem(p, { color: e.target.value })}
                style={{ marginLeft: 8 }}
              >
                {p.colors.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        );
      })}

      <button onClick={submit} style={{ padding: "10px 20px" }}>
        Submit Order Request
      </button>

      <p style={{ marginTop: 16, fontSize: 12 }}>
        Orders lock on: <strong>{lockDate}</strong>
      </p>
    </main>
  );
}
