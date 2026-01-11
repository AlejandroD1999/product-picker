"use client";

import React, { useMemo, useState } from "react";

const BRAND = {
  // USMC-ish greens (tweak as you want)
  bg: "#0b0f0c",
  panel: "#1f2a1f",
  card: "#141f18",
  input: "#0f1612",
  border: "rgba(124,160,120,0.22)",

  text: "#e7f2ea",
  muted: "rgba(231,242,234,0.70)",

  // Secondary (red)
  red: "#c1121f",
  redHover: "#a50f1a",

  // Primary (green accent)
  green: "#4b5320",
  green2: "#2f3b22",

  radius: 12,
  shadow: "0 10px 28px rgba(0,0,0,0.45)",

  // fallback stack
  font: `"Black Ops One","Saira Condensed","Oswald","Impact",system-ui,sans-serif`,
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
    setItems((prev) => {
      const current =
        prev[product.id] ?? {
          productId: product.id,
          size: product.sizes[0],
          color: product.colors[0],
          qty: 0,
        };

      return {
        ...prev,
        [product.id]: { ...current, ...patch },
      };
    });
  }

  async function submit() {
    if (!name.trim() || !email.trim()) {
      alert("Please enter name and email");
      return;
    }

    const selected = Object.values(items).filter((it) => Number(it.qty) > 0);

    if (selected.length === 0) {
      alert("Please select at least 1 item (qty > 0).");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          items: selected,
          lockDate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error || "Order failed");
        return;
      }

      alert("Order submitted!");
      // optional: clear
      // setItems({});
      // setName("");
      // setEmail("");
    } catch (err) {
      alert("Network error submitting order");
    }
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: ${BRAND.bg};
          --panel: ${BRAND.panel};
          --card: ${BRAND.card};
          --input: ${BRAND.input};
          --border: ${BRAND.border};
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

        html,
        body {
          height: 100%;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
        }

        .wrap {
          min-height: 100vh;
          width: 100%;
        }

        /* Top Command Bar */
        .topbar {
          width: 100%;
          max-width: none;
          margin: 0 0 18px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(31, 42, 31, 0.95),
            rgba(15, 20, 15, 0.92)
          );
          box-shadow: var(--shadow);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brandMark {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background: radial-gradient(circle at 30% 30%, var(--green), var(--green2));
          border: 1px solid rgba(0, 0, 0, 0.35);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          flex: 0 0 auto;
        }

        .brandText {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brandTitle {
          margin: 0;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 900;
        }

        .brandSub {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 1px;
        }

        /* Main Panel */
        .panel {
          padding: 24px 32px;
          width:100%;
          max-width: none;
          margin: 0;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 18px;
        }

.logoRow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 18px;
}

.logoLeft {
  display: flex;
  justify-content: flex-start;
}

.logoLeft img {
  max-width: 240px;
}

.logoCenter {
  text-align: center;
  font-size: 60px;
  font-weight: 900;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--green);
  text-shadow: 0 0 12px rgba(75, 179, 32, 0.25);
}

.logoRight {
  /* intentionally empty for balance */
}

@media (max-width: 720px) {
  .logoRow {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .logoLeft {
    justify-content: center;
  }
}

.logoCenter {
  position: relative;
}

.logoCenter::after {
  content: "";
  display: block;
  width: 48px;
  height: 2px;
  background: var(--green);
  margin: 6px auto 0;
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
          box-shadow: 0 0 0 2px rgba(75, 179, 32, 0.16), 0 16px 30px rgba(0, 0, 0, 0.45);
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
          border: 1px solid rgba(0, 0, 0, 0.35);
          background: linear-gradient(180deg, var(--red), #8f0f12);
          color: #fff;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 12px 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
        }

        .submitBtn:hover {
          background: linear-gradient(180deg, var(--redHover), #8a0f14);
          transform: translateY(-1px);
        }

        .lockText {
          color: var(--muted);
          font-size: 12px;
          margin: 0;
        }

        /* Mobile */
        @media (max-width: 720px) {
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
          }
        }
      `}</style>

      <div className="wrap">
        {/* TOP COMMAND BAR */}
        <div className="topbar">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <p className="brandTitle">BRONCO SWAG GEAR</p>
            <p className="brandSub">AUTHORIZED ORDER PANEL • LOCK DATE: {lockDate}</p>
          </div>
        </div>

        {/* MAIN PANEL */}
        <main className="panel">
          {/* BIG LOGO */}
          <div className="logoRow">
            <div className="logoLeft">
              <img src="/logo.png" alt="Bronco Swag Gear" />
            </div>

            <div className="logoCenter">
              CLC-B
            </div>

            <div className="logoRight" />
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
            const item =
              items[p.id] ?? {
                productId: p.id,
                qty: 0,
                size: p.sizes[0],
                color: p.colors[0],
              };

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
                      <option key={s} value={s}>
                        {s}
                      </option>
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
                      <option key={c} value={c}>
                        {c}
                      </option>
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
      </div>
    </>
  );
}
