#!/usr/bin/env python3
"""
sync_data.py — Update src/data.js dari Google Sheets

Cara pakai:
    python scripts/sync_data.py

Ganti SHEET_ID di bawah dengan ID spreadsheet Anda jika berubah.
"""

import csv
import io
import json
import os
import re
import sys
import urllib.request
from datetime import date

# ── Konfigurasi ───────────────────────────────────────────────────────────────
SHEET_ID = "17l_eZWF6lINGfqKv3GyYsyRHYcRhG1cnxBJQUHBgX9E"
BASE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet="

SHEETS = {
    "produksi":    "01_PRODUKSI",
    "pelanggan":   "02_PELANGGAN",
    "penyaluran":  "03_PENYALURAN",
    "keuangan":    "04_KEUANGAN",
    "tenaga_kerja":"05_TENAGA_KERJA",
    "air_baku":    "06_AIR_BAKU",
    "ringkasan":   "RINGKASAN",
}

OUT_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data.js")

# ── Helper ────────────────────────────────────────────────────────────────────
def fetch_csv(sheet_name: str) -> list[dict]:
    url = BASE_URL + urllib.parse.quote(sheet_name)
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            content = r.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(content))
        return [row for row in reader]
    except Exception as e:
        print(f"  [ERROR] Gagal mengambil sheet '{sheet_name}': {e}")
        sys.exit(1)

import urllib.parse

def to_int(v):
    try: return int(str(v).replace(",", "").replace(".", "").strip())
    except: return 0

def to_float(v):
    try: return float(str(v).replace(",", ".").strip().rstrip("%"))
    except: return 0.0

def get_latest_year(rows: list[dict], year_col: str = "tahun_data") -> list[dict]:
    """Ambil hanya baris dengan tahun_data terbesar."""
    years = [to_int(r.get(year_col, 0)) for r in rows]
    latest = max(years, default=0)
    return [r for r in rows if to_int(r.get(year_col, 0)) == latest], latest

def js_obj(d: dict, indent: int = 2) -> str:
    """Convert dict ke JS object literal string."""
    lines = []
    pad = " " * indent
    for k, v in d.items():
        if isinstance(v, str):
            lines.append(f'{pad}{k}: {json.dumps(v, ensure_ascii=False)}')
        elif isinstance(v, bool):
            lines.append(f'{pad}{k}: {"true" if v else "false"}')
        elif isinstance(v, (int, float)):
            lines.append(f'{pad}{k}: {v}')
        else:
            lines.append(f'{pad}{k}: {json.dumps(v)}')
    return "{\n" + ",\n".join(lines) + "\n" + " " * (indent - 2) + "}"

def js_array(arr: list, indent: int = 2) -> str:
    items = [("  " + js_obj(d, indent + 2)) for d in arr]
    return "[\n" + ",\n".join(items) + "\n]"

# ── Proses per sheet ──────────────────────────────────────────────────────────
def parse_produksi(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan", "kabupaten/kota"): continue
        out.append({
            "kab": kab,
            "produksi_m3": to_int(r.get("Produksi Air (m³)", 0)),
            "kap_potensial": to_int(r.get("Kapasitas Potensial (l/det)", 0)),
            "kap_efektif": to_int(r.get("Kapasitas Efektif (l/det)", 0)),
        })
    return out, year

def parse_pelanggan(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan",): continue
        out.append({
            "kab": kab,
            "sosial":      to_int(r.get("Sosial", 0)),
            "rt":          to_int(r.get("Rumah Tangga", 0)),
            "pemerintah":  to_int(r.get("Instansi Pemerintah", 0)),
            "niaga":       to_int(r.get("Niaga", 0)),
            "industri":    to_int(r.get("Industri", 0)),
            "khusus":      to_int(r.get("Khusus", 0)),
            "lainnya":     to_int(r.get("Lainnya", 0)),
        })
    return out, year

def parse_penyaluran(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan",): continue
        out.append({
            "kab": kab,
            "vol_sosial":      to_int(r.get("Sosial (m³)", 0)),
            "vol_rt":          to_int(r.get("Rumah Tangga (m³)", 0)),
            "vol_pemerintah":  to_int(r.get("Inst. Pemerintah (m³)", 0)),
            "vol_niaga":       to_int(r.get("Niaga (m³)", 0)),
            "vol_industri":    to_int(r.get("Industri (m³)", 0)),
            "vol_khusus":      to_int(r.get("Khusus (m³)", 0)),
            "vol_lainnya":     to_int(r.get("Lainnya (m³)", 0)),
            "bocor":           to_int(r.get("Bocor (m³)", 0)),
            "pakai_sendiri":   to_int(r.get("Pemakaian Sendiri (m³)", 0)),
        })
    return out, year

def parse_keuangan(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan",): continue
        out.append({
            "kab":    kab,
            "output": to_int(r.get("Nilai Output (Rp)", 0)),
            "input":  to_int(r.get("Biaya/Input (Rp)", 0)),
        })
    return out, year

def parse_air_baku(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan",): continue
        out.append({
            "kab":       kab,
            "sungai":    to_int(r.get("Sungai (m³)", 0)),
            "danau":     to_int(r.get("Danau (m³)", 0)),
            "waduk":     to_int(r.get("Waduk (m³)", 0)),
            "mata_air":  to_int(r.get("Mata Air (m³)", 0)),
            "air_tanah": to_int(r.get("Air Tanah (m³)", 0)),
            "lainnya":   to_int(r.get("Lainnya (m³)", 0)),
        })
    return out, year

def parse_tenaga_kerja(rows):
    latest, year = get_latest_year(rows)
    out = []
    for r in latest:
        kab = r.get("Kabupaten/Kota", "").strip()
        if not kab or kab.lower() in ("kalimantan selatan",): continue
        out.append({
            "kab":      kab,
            "slta_tek": to_int(r.get("SLTA (Teknis)", 0)),
            "dip_tek":  to_int(r.get("Diploma (Teknis)", 0)),
            "s1_tek":   to_int(r.get("S1/DIV (Teknis)", 0)),
            "s2_tek":   to_int(r.get("S2/S3 (Teknis)", 0)),
            "slta_non": to_int(r.get("SLTA (Non-Tek)", 0)),
            "dip_non":  to_int(r.get("Diploma (Non-Tek)", 0)),
            "s1_non":   to_int(r.get("S1/DIV (Non-Tek)", 0)),
            "s2_non":   to_int(r.get("S2/S3 (Non-Tek)", 0)),
        })
    return out, year

def parse_ringkasan(rows):
    data = {}
    for r in rows:
        key = r.get("Indikator", "").strip()
        val = r.get("Nilai", "").strip()
        if key and val:
            data[key] = val
    return data

# ── Build JS output ───────────────────────────────────────────────────────────
def build_js(produksi, pelanggan, penyaluran, keuangan, air_baku, tenaga_kerja, ringkasan, year):
    today = date.today().isoformat()

    def arr_to_js(arr):
        lines = []
        for d in arr:
            inner = ", ".join(
                f"{k}: {json.dumps(v, ensure_ascii=False) if isinstance(v, str) else v}"
                for k, v in d.items()
            )
            lines.append(f"  {{ {inner} }}")
        return "[\n" + ",\n".join(lines) + "\n]"

    kab_list = [d["kab"] for d in produksi]
    kab_short = []
    short_map = {
        "Tanah Laut": "Tala", "Kotabaru": "Kotabaru",
        "Banjar dan Banjarbaru": "Banjar+Bjb", "Barito Kuala": "Batola",
        "Tapin": "Tapin", "Hulu Sungai Selatan": "HSS",
        "Hulu Sungai Tengah": "HST", "Hulu Sungai Utara": "HSU",
        "Tabalong": "Tabalong", "Tanah Bumbu": "Tanbu",
        "Balangan": "Balangan", "Banjarmasin": "Bjm",
    }
    for k in kab_list:
        kab_short.append(short_map.get(k, k[:6]))

    r = ringkasan
    def rv(k, fallback=0):
        try: return int(str(r.get(k, fallback)).replace(",", "").replace(".", "").split(".")[0])
        except: return fallback

    js = f'''// ============================================================
// DATA AIR BERSIH KALIMANTAN SELATAN
// Sumber: BPS Kalsel, Statistik Air Bersih {year}
// Diperbarui otomatis oleh scripts/sync_data.py pada {today}
// JANGAN edit manual — jalankan sync_data.py untuk update
// ============================================================

export const META = {{
  tahun_data: {year},
  publikasi: "Statistik Air Bersih Provinsi Kalimantan Selatan Tahun {year}",
  nomor_publikasi: "63000.25044",
  katalog: "6206001.63",
  sumber: "BPS Provinsi Kalimantan Selatan",
  url_sumber: "https://kalsel.bps.go.id",
  terbit: "Desember {year + 1}",
  diperbarui: "{today}",
}};

export const RINGKASAN = {{
  total_produksi_m3:   {rv("total_produksi_m3", 158608036)},
  total_pelanggan:     {rv("total_pelanggan", 3257783)},
  pct_pelanggan_rt:    {r.get("pct_pelanggan_rt", "89.05")},
  bocor_total_m3:      {rv("bocor_total_m3", 34975786)},
  pct_bocor:           {r.get("pct_bocor", "22.05")},
  kap_potensial_l_det: {rv("kap_potensial_l_det", 15276)},
  kap_efektif_l_det:   {rv("kap_efektif_l_det", 13470)},
  nilai_output_rp:     {rv("nilai_output_rp", 924620192017)},
  biaya_input_rp:      {rv("biaya_input_rp", 656548912902)},
  nilai_tambah_rp:     {rv("nilai_tambah_rp", 268071279115)},
  total_karyawan:      {rv("total_karyawan", 1834)},
  pdam_defisit_count:  {rv("pdam_defisit_count", 2)},
}};

export const KABUPATEN = {json.dumps(kab_list, ensure_ascii=False, indent=2)};

export const KABUPATEN_SHORT = {json.dumps(kab_short, ensure_ascii=False, indent=2)};

export const PRODUKSI = {arr_to_js(produksi)};

export const PELANGGAN = {arr_to_js(pelanggan)};

export const PENYALURAN = {arr_to_js(penyaluran)};

export const KEUANGAN = {arr_to_js(keuangan)};

export const AIR_BAKU = {arr_to_js(air_baku)};

export const TENAGA_KERJA = {arr_to_js(tenaga_kerja)};
'''
    return js

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("Memperbarui data dari Google Sheets...")
    print(f"  Sheet ID: {SHEET_ID}\n")

    print("  Mengambil 01_PRODUKSI...")
    produksi, year = parse_produksi(fetch_csv(SHEETS["produksi"]))
    print(f"    → {len(produksi)} baris, tahun {year}")

    print("  Mengambil 02_PELANGGAN...")
    pelanggan, _ = parse_pelanggan(fetch_csv(SHEETS["pelanggan"]))
    print(f"    → {len(pelanggan)} baris")

    print("  Mengambil 03_PENYALURAN...")
    penyaluran, _ = parse_penyaluran(fetch_csv(SHEETS["penyaluran"]))
    print(f"    → {len(penyaluran)} baris")

    print("  Mengambil 04_KEUANGAN...")
    keuangan, _ = parse_keuangan(fetch_csv(SHEETS["keuangan"]))
    print(f"    → {len(keuangan)} baris")

    print("  Mengambil 06_AIR_BAKU...")
    air_baku, _ = parse_air_baku(fetch_csv(SHEETS["air_baku"]))
    print(f"    → {len(air_baku)} baris")

    print("  Mengambil 05_TENAGA_KERJA...")
    tenaga_kerja, _ = parse_tenaga_kerja(fetch_csv(SHEETS["tenaga_kerja"]))
    print(f"    → {len(tenaga_kerja)} baris")

    print("  Mengambil RINGKASAN...")
    ringkasan = parse_ringkasan(fetch_csv(SHEETS["ringkasan"]))
    print(f"    → {len(ringkasan)} indikator")

    print(f"\n  Menulis ke {OUT_FILE}...")
    js_content = build_js(produksi, pelanggan, penyaluran, keuangan, air_baku, tenaga_kerja, ringkasan, year)

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\n  Selesai. Jalankan berikutnya:")
    print(f"    git add src/data.js")
    print(f"    git commit -m 'update data {year}'")
    print(f"    git push")
    print(f"\n  Vercel akan deploy otomatis dalam ~1 menit.")

if __name__ == "__main__":
    main()
