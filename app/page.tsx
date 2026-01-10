"use client";

import { useMemo, useState } from "react";
const BRAND = {
  // USMC-ish greens (adjust if you want lighter/darker)
  bg: "#0b0f0c",            // deep near-black green
  panel: "#1f2a1f",         // main panels
  card: "#141f18",          // product cards
  input: "#0f1612",         // inputs/selects
  border: "rgba(124, 160, 120, 0.22)",

  text: "#e7f2ea",
  muted: "rgba(231, 242, 234, 0.70)",

  // Secondary (red)
  red: "#c1121f",
  redHover: "#a50f1a",

  // Primary (USMC green accent)
  green: "#4b5320",
  green2: "#2f3b22",

  radius: 12,
  shadow: "0 10px 28px rgba(0,0,0,0.45)",

  // “Stencil vibe” fallback stack (best with Black Ops One / Saira Condensed if you add fonts later)
  font: `"Black Ops One", "Saira Condensed", "Oswald", "Impact", system-ui, sans-serif`,
};
type Product = {
  id: string;
  name: string;
  sizes: string[];
  colors: string[];
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Hoodie", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
  { id: "p2", name: "T-Shirt", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Green"] },
  { id: "p3", name: "Coffee Mug", sizes: ["One Size"], colors: ["Black", "Green"] },
  { id: "p4", name: "Coozie", sizes: ["One Size"], colors: ["Black", "Green"] },
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

async function submit() {
  if (!name.trim() || !email.trim()) {
    alert("Please enter name and email");
    return;
  }

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      items,
      lockDate,
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Order failed");
    return;
  }

  alert("Order submitted!");
}

return (
  <>
    <style jsx global>{`
      :root {
        --bg: ${BRAND.bg};
        --panel: ${BRAND.panel};
        --card: ${BRAND.card};
        --input: ${BRAND.input};
        --border: ${BRAND.borders};
        --text: ${BRAND.text};
        --muted: ${BRAND.muted};
        --green: ${BRAND.green};
        --green2: ${BRAND.green2};
        --red: ${BRAND.red};
        --redHover: ${BRAND.redHover};
        --radius: ${BRAND.radius}px;
        --shadow: ${BRAND.shadow};
        --font: ${BRAND.font};
      }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: var(--font);
      }

      .wrap {
        min-height: 100vh;
        padding: 22px 14px 44px;
      }

      /* Top Command Bar */
      .topbar {
        max-width: 860px;
        margin: 0 auto 18px;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: linear-gradient(180deg, rgba(31,42,31,0.95), rgba(15,20,15,0.92));
        box-shadow: var(--shadow);
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .brandMark {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: rgba(0,0,0,0.25);
        display: grid;
        place-items: center;
        overflow: hidden;
        flex: 0 0 auto;
      }

      .brandMark img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .brandText {
        flex: 1;
        line-height: 1.1;
      }

      .brandTitle {
        margin: 0;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-weight: 800;
        font-size: 18px;
      }

      .brandSub {
        margin: 6px 0 0;
        color: var(--muted);
        font-size: 12px;
      }

      /* Main Panel */
      .panel {
        max-width: 860px;
        margin: 0 auto;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 18px;
      }

      .logoRow {
        text-align: center;
        margin-bottom: 16px;
        padding-bottom: 14px;
        border-bottom: 2px solid var(--green);
      }

      .logoRow img {
        max-width: 240px;
        width: 100%;
        filter: drop-shadow(0 6px 14px rgba(0,0,0,0.6));
      }

      .pageTitle {
        margin: 14px 0 6px;
        text-align: center;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-weight: 900;
        font-size: 22px;
      }

      .pageHint {
        margin: 0 0 16px;
        text-align: center;
        color: var(--muted);
        font-size: 13px;
      }

      /* Form Fields */
      .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 14px;
      }

      .field {
        width: 100%;
        padding: 12px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--input);
        color: var(--text);
        outline: none;
      }

      .field:focus {
        border-color: rgba(75, 179, 32, 0.75);
        box-shadow: 0 0 0 4px rgba(75, 179, 32, 0.18);
      }

      /* Product Cards */
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        margin-top: 14px;
        transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
      }

      .card:hover {
        transform: translateY(-1px);
        border-color: rgba(75, 179, 32, 0.55);
        box-shadow: 0 0 0 2px rgba(75, 179, 32, 0.16), 0 16px 30px rgba(0,0,0,0.45);
      }

      .cardHead {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed rgba(231, 242, 234, 0.18);
      }

      .cardName {
        margin: 0;
        font-size: 16px;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 800;
      }

      .cardTag {
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .row {
        display: grid;
        grid-template-columns: 120px 1fr;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }

      .label {
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .num {
        width: 110px;
      }

      .select {
        width: 100%;
      }

      /* Submit Button */
      .submitRow {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-top: 14px;
        border-top: 1px solid rgba(231, 242, 234, 0.14);
      }

      .submitBtn {
        appearance: none;
        border: 1px solid rgba(0,0,0,0.35);
        background: linear-gradient(180deg, var(--red), #8f0f12);
        color: #fff;
        font-weight: 900;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 12px 16px;
        border-radius: 14px;
        cursor: pointer;
        transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
        box-shadow: 0 10px 22px rgba(0,0,0,0.45);
      }

      .submitBtn:hover {
        background: linear-gradient(180deg, var(--redHover), #a80f14);
        box-shadow: 0 0 0 3px rgba(193, 18, 31, 0.22), 0 16px 30px rgba(0,0,0,0.55);
        transform: translateY(-1px);
      }

      .lockText {
        color: var(--muted);
        font-size: 12px;
        margin: 0;
      }

      /* Mobile */
      @media (max-width: 720px) {
        .topbar {
          padding: 12px 12px;
        }
        .grid2 {
          grid-template-columns: 1fr;
        }
        .row {
          grid-template-columns: 1fr;
        }
        .num {
          width: 100%;
        }
        .submitBtn {
          width: 100%;
          padding: 14px 16px;
        }
      }
    `}</style>

    <div className="wrap">
      {/* TOP COMMAND BAR */}
      <div className="topbar">
        <div className="brandMark">
          <img src="/logo.png" alt="Brand" />
        </div>

        <div className="brandText">
          <p className="brandTitle">BRONCO SWAG GEAR</p>
          <p className="brandSub">AUTHORIZED ORDER PANEL • LOCK DATE: {lockDate}</p>
        </div>
      </div>

      {/* MAIN PANEL */}
      <main className="panel">
        {/* BIG LOGO */}
        <div className="logoRow">
          <img src="/logo.png" alt="Bronco Swag Gear" />
        </div>

        <h1 className="pageTitle">Product Picker</h1>
        <p className="pageHint">Submit your selections. You can edit for 7 days.</p>

        <div className="grid2">
          <input
            className="field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {PRODUCTS.map((p) => {
          const item = items[p.id] ?? { qty: 0, size: p.sizes[0], color: p.colors[0] };

          return (
            <div key={p.id} className="card">
              <div className="cardHead">
                <h3 className="cardName">{p.name}</h3>
                <span className="cardTag">ITEM • {p.id.toUpperCase()}</span>
              </div>

              <div className="row">
                <div className="label">Quantity</div>
                <input
                  className="field num"
                  type="number"
                  min={0}
                  value={item.qty}
                  onChange={(e) => updateItem(p, { qty: Number(e.target.value) })}
                />
              </div>

              <div className="row">
                <div className="label">Size</div>
                <select
                  className="field select"
                  value={item.size}
                  onChange={(e) => updateItem(p, { size: e.target.value })}
                >
                  {p.sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="label">Color</div>
                <select
                  className="field select"
                  value={item.color}
                  onChange={(e) => updateItem(p, { color: e.target.value })}
                >
                  {p.colors.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}

        <div className="submitRow">
          <button className="submitBtn" onClick={submit}>
            Submit Order Request
          </button>

          <p className="lockText">
            Orders lock on: <strong>{lockDate}</strong>
          </p>
        </div>
      </main>
    );
  }