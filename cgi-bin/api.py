#!/usr/bin/env python3
import json
import os
import sqlite3
import sys
import csv
import io
from urllib.parse import parse_qs
from datetime import datetime

DB_PATH = "portfolio.db"

def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row

    # Enhanced portfolio table with new fields
    db.execute("""
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game TEXT,
            card_name TEXT,
            set_name TEXT,
            quantity INTEGER DEFAULT 1,
            purchase_price REAL DEFAULT 0,
            current_price REAL DEFAULT 0,
            condition_grade TEXT DEFAULT 'Raw',
            platform TEXT DEFAULT 'eBay',
            notes TEXT DEFAULT '',
            acquired_date TEXT DEFAULT '',
            sold_price REAL DEFAULT NULL,
            sold_date TEXT DEFAULT NULL,
            is_sold INTEGER DEFAULT 0,
            sym TEXT DEFAULT '',
            lang TEXT DEFAULT 'EN',
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Migrate existing portfolio table if needed (add new columns)
    existing_cols = [row[1] for row in db.execute("PRAGMA table_info(portfolio)").fetchall()]
    new_cols = [
        ("condition_grade", "TEXT DEFAULT 'Raw'"),
        ("platform", "TEXT DEFAULT 'eBay'"),
        ("notes", "TEXT DEFAULT ''"),
        ("acquired_date", "TEXT DEFAULT ''"),
        ("sold_price", "REAL DEFAULT NULL"),
        ("sold_date", "TEXT DEFAULT NULL"),
        ("is_sold", "INTEGER DEFAULT 0"),
        ("sym", "TEXT DEFAULT ''"),
        ("lang", "TEXT DEFAULT 'EN'"),
    ]
    for col_name, col_def in new_cols:
        if col_name not in existing_cols:
            try:
                db.execute(f"ALTER TABLE portfolio ADD COLUMN {col_name} {col_def}")
            except Exception:
                pass

    # Watchlist table
    db.execute("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL,
            card_name TEXT,
            game TEXT,
            alert_target REAL DEFAULT NULL,
            notes TEXT DEFAULT '',
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    db.commit()
    return db

def send_response(status, data, content_type="application/json"):
    print(f"Status: {status}")
    print(f"Content-Type: {content_type}")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS")
    print("Access-Control-Allow-Headers: Content-Type")
    print()
    if content_type == "application/json":
        print(json.dumps(data))
    else:
        print(data)

def main():
    method = os.environ.get("REQUEST_METHOD", "GET").upper()
    query_string = os.environ.get("QUERY_STRING", "")
    params = parse_qs(query_string)

    # Handle CORS preflight
    if method == "OPTIONS":
        send_response(200, {})
        return

    action = params.get("action", ["list"])[0]
    resource = params.get("resource", ["portfolio"])[0]
    db = get_db()

    # ─── WATCHLIST RESOURCE ───────────────────────────────────────
    if resource == "watchlist":
        if method == "GET":
            rows = db.execute("SELECT * FROM watchlist ORDER BY added_at DESC").fetchall()
            send_response(200, [dict(r) for r in rows])

        elif method == "POST":
            try:
                content_length = int(os.environ.get("CONTENT_LENGTH", 0))
                body = sys.stdin.read(content_length) if content_length > 0 else sys.stdin.read()
                data = json.loads(body)
                cursor = db.execute(
                    """INSERT INTO watchlist (ticker, card_name, game, alert_target, notes)
                       VALUES (?, ?, ?, ?, ?)""",
                    [
                        data.get("ticker", ""),
                        data.get("card_name", ""),
                        data.get("game", ""),
                        data.get("alert_target"),
                        data.get("notes", ""),
                    ]
                )
                db.commit()
                row = db.execute("SELECT * FROM watchlist WHERE id = ?", [cursor.lastrowid]).fetchone()
                send_response(201, dict(row))
            except Exception as e:
                send_response(500, {"error": str(e)})

        elif method == "DELETE":
            item_id = params.get("id", [None])[0]
            if item_id:
                db.execute("DELETE FROM watchlist WHERE id = ?", [item_id])
                db.commit()
                send_response(200, {"deleted": True, "id": item_id})
            else:
                send_response(400, {"error": "Missing id"})

        elif method == "PUT":
            try:
                content_length = int(os.environ.get("CONTENT_LENGTH", 0))
                body = sys.stdin.read(content_length) if content_length > 0 else sys.stdin.read()
                data = json.loads(body)
                item_id = data.get("id")
                if item_id:
                    db.execute(
                        "UPDATE watchlist SET alert_target = ?, notes = ? WHERE id = ?",
                        [data.get("alert_target"), data.get("notes", ""), item_id]
                    )
                    db.commit()
                    row = db.execute("SELECT * FROM watchlist WHERE id = ?", [item_id]).fetchone()
                    send_response(200, dict(row) if row else {"error": "Not found"})
                else:
                    send_response(400, {"error": "Missing id"})
            except Exception as e:
                send_response(500, {"error": str(e)})
        return

    # ─── PORTFOLIO RESOURCE (default) ─────────────────────────────
    if method == "GET":
        if action == "list":
            rows = db.execute(
                "SELECT * FROM portfolio ORDER BY added_at DESC"
            ).fetchall()
            send_response(200, [dict(r) for r in rows])

        elif action == "summary":
            rows = db.execute("SELECT * FROM portfolio WHERE is_sold = 0").fetchall()
            items = [dict(r) for r in rows]

            sold_rows = db.execute("SELECT * FROM portfolio WHERE is_sold = 1").fetchall()
            sold_items = [dict(r) for r in sold_rows]

            total_cost = sum(r["purchase_price"] * r["quantity"] for r in items)
            total_value = sum(r["current_price"] * r["quantity"] for r in items)
            total_gain = total_value - total_cost
            pct_change = ((total_value - total_cost) / total_cost * 100) if total_cost > 0 else 0

            realized_gain = sum(
                ((r["sold_price"] or 0) - r["purchase_price"]) * r["quantity"]
                for r in sold_items
            )

            by_game = {}
            for r in items:
                g = r["game"]
                if g not in by_game:
                    by_game[g] = {"cost": 0, "value": 0, "count": 0}
                by_game[g]["cost"] += r["purchase_price"] * r["quantity"]
                by_game[g]["value"] += r["current_price"] * r["quantity"]
                by_game[g]["count"] += r["quantity"]

            send_response(200, {
                "total_cost": round(total_cost, 2),
                "total_value": round(total_value, 2),
                "total_gain": round(total_gain, 2),
                "pct_change": round(pct_change, 2),
                "realized_gain": round(realized_gain, 2),
                "by_game": by_game,
                "count": len(items),
                "sold_count": len(sold_items)
            })

        elif action == "export":
            # CSV export
            rows = db.execute("SELECT * FROM portfolio ORDER BY game, card_name").fetchall()
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow([
                "ID", "Game", "Card Name", "Set", "Qty", "Purchase Price",
                "Current Price", "Condition", "Platform", "Notes",
                "Acquired Date", "Lang", "Sym", "Sold Price", "Sold Date", "Is Sold",
                "Unrealized P&L", "Added At"
            ])
            for r in rows:
                row = dict(r)
                pnl = (row["current_price"] - row["purchase_price"]) * row["quantity"]
                writer.writerow([
                    row["id"], row["game"], row["card_name"], row["set_name"],
                    row["quantity"], row["purchase_price"], row["current_price"],
                    row["condition_grade"], row["platform"], row["notes"],
                    row["acquired_date"], row.get("lang", "EN"), row.get("sym", ""),
                    row["sold_price"] or "", row["sold_date"] or "",
                    "YES" if row["is_sold"] else "NO",
                    round(pnl, 2), row["added_at"]
                ])
            csv_data = output.getvalue()
            send_response(200, csv_data, content_type="text/csv")

        else:
            send_response(400, {"error": "Unknown action"})

    elif method == "POST":
        try:
            content_length = int(os.environ.get("CONTENT_LENGTH", 0))
            body = sys.stdin.read(content_length) if content_length > 0 else sys.stdin.read()
            data = json.loads(body)

            if action == "add":
                cursor = db.execute(
                    """INSERT INTO portfolio
                       (game, card_name, set_name, quantity, purchase_price, current_price,
                        condition_grade, platform, notes, acquired_date, sym, lang)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    [
                        data.get("game", ""),
                        data.get("card_name", ""),
                        data.get("set_name", ""),
                        int(data.get("quantity", 1)),
                        float(data.get("purchase_price", 0)),
                        float(data.get("current_price", 0)),
                        data.get("condition_grade", "Raw"),
                        data.get("platform", "eBay"),
                        data.get("notes", ""),
                        data.get("acquired_date", datetime.now().strftime("%Y-%m-%d")),
                        data.get("sym", ""),
                        data.get("lang", "EN"),
                    ]
                )
                db.commit()
                row = db.execute("SELECT * FROM portfolio WHERE id = ?", [cursor.lastrowid]).fetchone()
                send_response(201, dict(row))

            elif action == "update":
                item_id = data.get("id")
                if not item_id:
                    send_response(400, {"error": "Missing id"})
                    return
                fields = []
                values = []
                updatable = [
                    "current_price", "purchase_price", "quantity", "condition_grade",
                    "platform", "notes", "acquired_date", "card_name", "set_name", "lang", "sym"
                ]
                for f in updatable:
                    if f in data:
                        fields.append(f"{f} = ?")
                        values.append(data[f])
                if fields:
                    values.append(item_id)
                    db.execute(f"UPDATE portfolio SET {', '.join(fields)} WHERE id = ?", values)
                    db.commit()
                row = db.execute("SELECT * FROM portfolio WHERE id = ?", [item_id]).fetchone()
                send_response(200, dict(row) if row else {"error": "Not found"})

            elif action == "sell":
                item_id = data.get("id")
                sold_price = data.get("sold_price")
                if item_id and sold_price is not None:
                    db.execute(
                        """UPDATE portfolio SET is_sold = 1, sold_price = ?, sold_date = ?
                           WHERE id = ?""",
                        [float(sold_price), datetime.now().strftime("%Y-%m-%d"), item_id]
                    )
                    db.commit()
                    row = db.execute("SELECT * FROM portfolio WHERE id = ?", [item_id]).fetchone()
                    send_response(200, dict(row) if row else {"error": "Not found"})
                else:
                    send_response(400, {"error": "Missing id or sold_price"})

            elif action == "bulk_delete":
                # Bulk delete by ids array
                ids = data.get("ids", [])
                if not ids:
                    send_response(400, {"error": "Missing ids array"})
                    return
                placeholders = ",".join("?" * len(ids))
                db.execute(f"DELETE FROM portfolio WHERE id IN ({placeholders})", ids)
                db.commit()
                send_response(200, {"deleted": True, "count": len(ids), "ids": ids})

            elif action == "bulk_sell":
                # Bulk mark as sold
                ids = data.get("ids", [])
                sold_price_override = data.get("sold_price")  # None = use current_price
                if not ids:
                    send_response(400, {"error": "Missing ids array"})
                    return
                today = datetime.now().strftime("%Y-%m-%d")
                updated = 0
                for item_id in ids:
                    row = db.execute("SELECT * FROM portfolio WHERE id = ?", [item_id]).fetchone()
                    if row:
                        sp = sold_price_override if sold_price_override is not None else dict(row)["current_price"]
                        db.execute(
                            "UPDATE portfolio SET is_sold = 1, sold_price = ?, sold_date = ? WHERE id = ?",
                            [float(sp), today, item_id]
                        )
                        updated += 1
                db.commit()
                send_response(200, {"sold": True, "count": updated, "ids": ids})

            elif action == "import":
                # Bulk import from CSV data array
                items = data if isinstance(data, list) else data.get("items", [])
                if not items:
                    send_response(400, {"error": "No items to import"})
                    return
                inserted = 0
                today = datetime.now().strftime("%Y-%m-%d")
                for item in items:
                    try:
                        db.execute(
                            """INSERT INTO portfolio
                               (game, card_name, set_name, quantity, purchase_price, current_price,
                                condition_grade, platform, notes, acquired_date, sym, lang)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                            [
                                item.get("game", "pokemon"),
                                item.get("card_name", ""),
                                item.get("set_name", ""),
                                int(item.get("quantity", 1)),
                                float(item.get("purchase_price", 0)),
                                float(item.get("current_price", 0)),
                                item.get("condition_grade", "Raw"),
                                item.get("platform", "eBay"),
                                item.get("notes", ""),
                                item.get("acquired_date", today),
                                item.get("sym", ""),
                                item.get("lang", "EN"),
                            ]
                        )
                        inserted += 1
                    except Exception:
                        pass
                db.commit()
                # Return the newly added rows
                rows = db.execute(
                    "SELECT * FROM portfolio ORDER BY added_at DESC LIMIT ?", [inserted]
                ).fetchall()
                send_response(201, {"imported": inserted, "items": [dict(r) for r in rows]})

            else:
                send_response(400, {"error": "Unknown POST action"})

        except json.JSONDecodeError:
            send_response(400, {"error": "Invalid JSON"})
        except Exception as e:
            send_response(500, {"error": str(e)})

    elif method == "DELETE":
        item_id = params.get("id", [None])[0]
        if item_id:
            db.execute("DELETE FROM portfolio WHERE id = ?", [item_id])
            db.commit()
            send_response(200, {"deleted": True, "id": item_id})
        else:
            send_response(400, {"error": "Missing id"})

    else:
        send_response(405, {"error": "Method not allowed"})

if __name__ == "__main__":
    main()
