import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts'
import {
  Droplets, Users, TrendingUp, AlertTriangle,
  Gauge, Building2, MapPin, BookOpen,
  ChevronDown, ChevronUp, ExternalLink, Info
} from 'lucide-react'
import {
  META, RINGKASAN, KABUPATEN, KABUPATEN_SHORT,
  PRODUKSI, PELANGGAN, PENYALURAN, KEUANGAN,
  AIR_BAKU, TENAGA_KERJA, LAYANAN
} from './data.js'

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, dec = 0) =>
  n == null ? '—' : Number(n).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec })

const fmtM = (n) => {
  if (n == null) return '—'
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + ' M'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + ' jt'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + ' rb'
  return String(n)
}

const fmtRp = (n) => {
  if (n == null) return '—'
  if (Math.abs(n) >= 1e12) return 'Rp ' + (n / 1e12).toFixed(2) + ' T'
  if (Math.abs(n) >= 1e9)  return 'Rp ' + (n / 1e9).toFixed(1) + ' M'
  if (Math.abs(n) >= 1e6)  return 'Rp ' + (n / 1e6).toFixed(1) + ' jt'
  return 'Rp ' + fmt(n)
}

// ── colour palette ────────────────────────────────────────────────────────────
const C = {
  blue:   '#378ADD', lblue: '#B5D4F4',
  teal:   '#1D9E75', lteal: '#9FE1CB',
  red:    '#E24B4A', lred:  '#F7C1C1',
  amber:  '#BA7517', lamber:'#FAC775',
  green:  '#639922', lgreen:'#C0DD97',
  navy:   '#1A2E4A', gray:  '#888780',
}

const PIE_COLORS = [C.blue, C.teal, C.amber, C.green, C.red, '#7F77DD', '#D4537E', '#888']

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, unit, note, color = 'blue' }) {
  const colorMap = {
    blue:  { bg: '#EBF4FB', accent: C.blue,  iconBg: '#D0E9F7' },
    teal:  { bg: '#E8F7F2', accent: C.teal,  iconBg: '#C2EDD9' },
    amber: { bg: '#FDF5E6', accent: C.amber, iconBg: '#FAE4A8' },
    red:   { bg: '#FEF0F0', accent: C.red,   iconBg: '#F9CECE' },
    green: { bg: '#EEF6E2', accent: C.green, iconBg: '#D5EBAD' },
  }
  const col = colorMap[color] || colorMap.blue
  return (
    <div style={{
      background: col.bg,
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.2rem',
      border: `1px solid ${col.accent}22`,
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: col.iconBg, borderRadius: 'var(--radius-sm)', padding: '6px', display: 'flex' }}>
          <Icon size={15} color={col.accent} strokeWidth={2} />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--c-text-2)', fontWeight: 400 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
        <span style={{ fontSize: '24px', fontWeight: 500, color: 'var(--c-text)', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>{unit}</span>
      </div>
      {note && <div style={{ fontSize: '11px', color: 'var(--c-text-3)', borderTop: '0.5px solid rgba(0,0,0,.08)', paddingTop: '6px', marginTop: '2px' }}>{note}</div>}
    </div>
  )
}

function FindingBox({ children, type = 'info' }) {
  const styles = {
    info:    { border: C.blue,  bg: '#F0F7FF' },
    warn:    { border: C.red,   bg: '#FFF5F5' },
    success: { border: C.teal,  bg: '#F0FAF5' },
    note:    { border: C.amber, bg: '#FFFBF0' },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{
      borderLeft: `3px solid ${s.border}`,
      background: s.bg,
      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      padding: '0.8rem 1rem',
      fontSize: '13px',
      color: 'var(--c-text)',
      lineHeight: 1.65,
      margin: '0.75rem 0',
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ title, desc }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--c-text)', marginBottom: '4px' }}>{title}</h2>
      {desc && <p style={{ fontSize: '13px', color: 'var(--c-text-2)', lineHeight: 1.6 }}>{desc}</p>}
    </div>
  )
}

const TICK_STYLE = { fontSize: 11, fill: '#888780', fontFamily: 'DM Sans, sans-serif' }
const GRID_STYLE = { stroke: 'rgba(0,0,0,.07)' }

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}>
      <div style={{ fontWeight: 500, marginBottom: 4, color: 'var(--c-text)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-text-2)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.name}: <strong style={{ color: 'var(--c-text)' }}>{formatter ? formatter(p.value, p.name) : fmt(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

// ── TAB: Produksi ─────────────────────────────────────────────────────────────
function TabProduksi() {
  const chartData = PRODUKSI.map((d, i) => ({
    name: KABUPATEN_SHORT[i],
    produksi: +(d.produksi_m3 / 1e6).toFixed(2),
    potensial: d.kap_potensial,
    efektif: d.kap_efektif,
    rasio: Math.round(d.kap_efektif / d.kap_potensial * 100),
  }))

  return (
    <div>
      <SectionHeader
        title="Produksi & Kapasitas"
        desc="Produksi air bersih tahun 2024 dan perbandingan kapasitas potensial vs efektif per PDAM."
      />
      <FindingBox type="warn">
        <strong>Paradoks Tanah Laut:</strong> Kapasitas potensial terbesar se-Kalsel (7.462 l/detik) — hampir 3× Banjarmasin — namun produksi aktualnya terendah se-provinsi (3,1 juta m³). Ini sinyal kuat adanya kendala operasional atau infrastruktur yang belum terungkap dalam data ini.
      </FindingBox>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Produksi air minum per kabupaten/kota (juta m³)</div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={GRID_STYLE.stroke} />
            <XAxis type="number" tick={TICK_STYLE} tickFormatter={v => v + ' jt'} />
            <YAxis type="category" dataKey="name" tick={TICK_STYLE} width={72} />
            <Tooltip content={<CustomTooltip formatter={(v) => v + ' juta m³'} />} />
            <Bar dataKey="produksi" name="Produksi" radius={[0, 3, 3, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === 11 ? C.blue : C.lblue} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Kapasitas potensial vs efektif (liter/detik)</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8, fontSize: 12, color: 'var(--c-text-2)' }}>
          {[['Potensial', C.lblue], ['Efektif', C.blue]].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={GRID_STYLE.stroke} />
            <XAxis type="number" tick={TICK_STYLE} tickFormatter={v => v + ' l/dt'} />
            <YAxis type="category" dataKey="name" tick={TICK_STYLE} width={72} />
            <Tooltip content={<CustomTooltip formatter={(v) => v + ' l/detik'} />} />
            <Bar dataKey="potensial" name="Potensial" fill={C.lblue} radius={[0, 2, 2, 0]} />
            <Bar dataKey="efektif" name="Efektif" fill={C.blue} radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── TAB: Pelanggan ────────────────────────────────────────────────────────────
function TabPelanggan() {
  const pieData = [
    { name: 'Rumah Tangga', value: 2901024 },
    { name: 'Niaga', value: 263581 },
    { name: 'Sosial', value: 59171 },
    { name: 'Inst. Pemerintah', value: 29802 },
    { name: 'Industri', value: 1563 },
    { name: 'Khusus', value: 187 },
    { name: 'Lainnya', value: 2455 },
  ]
  const totalPel = pieData.reduce((a, b) => a + b.value, 0)

  const barData = PELANGGAN.map((d, i) => ({
    name: KABUPATEN_SHORT[i],
    rt: d.rt,
    lainnya: d.sosial + d.pemerintah + d.niaga + d.industri + d.khusus + d.lainnya,
  }))

  return (
    <div>
      <SectionHeader
        title="Komposisi Pelanggan"
        desc={`Total ${fmt(RINGKASAN.total_pelanggan)} pelanggan PAM di seluruh Kalimantan Selatan tahun 2024.`}
      />
      <FindingBox type="info">
        <strong>Banjarmasin mendominasi:</strong> 2.001.668 pelanggan rumah tangga di Banjarmasin — setara 69% dari total seluruh provinsi — terpusat di satu kota. Tabalong (284 rb) dan HSS (232 rb) berada di posisi berikutnya, jauh di belakang.
      </FindingBox>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Komposisi pelanggan</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${fmt(v)} (${(v / totalPel * 100).toFixed(1)}%)`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', fontSize: 11, color: 'var(--c-text-2)', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />
                {d.name} {(d.value / totalPel * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Angka kunci pelanggan</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Rumah tangga', val: '2.901.024', sub: '89,05% dari total', color: C.blue },
              { label: 'Niaga', val: '263.581', sub: '8,09% dari total', color: C.teal },
              { label: 'Sosial', val: '59.171', sub: '1,82% dari total', color: C.amber },
              { label: 'Instansi pemerintah', val: '29.802', sub: '0,91% dari total', color: C.green },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--c-bg)', border: '0.5px solid var(--c-border)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${item.color}` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>{item.label} · {item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Pelanggan per kabupaten/kota</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 12, color: 'var(--c-text-2)' }}>
          {[['Rumah Tangga', C.blue], ['Kategori Lain', C.lblue]].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={GRID_STYLE.stroke} />
            <XAxis type="number" tick={TICK_STYLE} tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'jt' : (v / 1e3).toFixed(0) + 'rb'} />
            <YAxis type="category" dataKey="name" tick={TICK_STYLE} width={72} />
            <Tooltip content={<CustomTooltip formatter={fmt} />} />
            <Bar dataKey="rt" name="Rumah Tangga" stackId="a" fill={C.blue} radius={[0, 0, 0, 0]} />
            <Bar dataKey="lainnya" name="Kategori Lain" stackId="a" fill={C.lblue} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── TAB: Keuangan ─────────────────────────────────────────────────────────────
function TabKeuangan() {
  const withNT = KEUANGAN.map((d, i) => ({
    ...d,
    nilai_tambah: d.output - d.input,
    kab_short: KABUPATEN_SHORT[i],
  }))

  const barData = withNT.map(d => ({
    name: d.kab_short,
    output: +(d.output / 1e9).toFixed(1),
    input: +(d.input / 1e9).toFixed(1),
    nt: +((d.output - d.input) / 1e9).toFixed(1),
  }))

  return (
    <div>
      <SectionHeader
        title="Keuangan PDAM"
        desc="Perbandingan nilai output, biaya input, dan nilai tambah seluruh PDAM di Kalimantan Selatan tahun 2024."
      />
      <FindingBox type="warn">
        <strong>Dua PDAM merugi:</strong> Barito Kuala (defisit Rp 11,4 miliar) dan Tabalong (defisit Rp 14,0 miliar) mencatat biaya operasional melebihi output. Sebaliknya, Balangan — kabupaten kecil — mencatat rasio nilai tambah tertinggi kedua se-provinsi secara proporsional.
      </FindingBox>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Output vs biaya/input (miliar rupiah)</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 12, color: 'var(--c-text-2)' }}>
          {[['Nilai Output', C.lblue], ['Biaya/Input', C.red]].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData} margin={{ left: 10, right: 10, top: 4, bottom: 30 }}>
            <CartesianGrid vertical={false} stroke={GRID_STYLE.stroke} />
            <XAxis dataKey="name" tick={{ ...TICK_STYLE, angle: -35, textAnchor: 'end' }} />
            <YAxis tick={TICK_STYLE} tickFormatter={v => 'Rp' + v + 'M'} />
            <Tooltip content={<CustomTooltip formatter={(v) => 'Rp ' + v + ' M'} />} />
            <Bar dataKey="output" name="Nilai Output" fill={C.lblue} radius={[3, 3, 0, 0]} />
            <Bar dataKey="input" name="Biaya/Input" fill={C.red} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Nilai tambah atas dasar harga pasar (miliar rupiah)</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ left: 10, right: 10, top: 4, bottom: 30 }}>
            <CartesianGrid vertical={false} stroke={GRID_STYLE.stroke} />
            <XAxis dataKey="name" tick={{ ...TICK_STYLE, angle: -35, textAnchor: 'end' }} />
            <YAxis tick={TICK_STYLE} tickFormatter={v => 'Rp' + v + 'M'} />
            <Tooltip content={<CustomTooltip formatter={(v) => (v >= 0 ? '+' : '') + 'Rp ' + v + ' M'} />} />
            <Bar dataKey="nt" name="Nilai Tambah" radius={[3, 3, 0, 0]}>
              {barData.map((d, i) => <Cell key={i} fill={d.nt >= 0 ? C.teal : C.red} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--c-bg-3)' }}>
              {['Kabupaten/Kota', 'Output (Rp)', 'Input (Rp)', 'Nilai Tambah (Rp)', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Kabupaten/Kota' ? 'left' : 'right', fontSize: 11, fontWeight: 500, color: 'var(--c-text-2)', borderBottom: '1px solid var(--c-border-2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withNT.map((d, i) => {
              const nt = d.nilai_tambah
              return (
                <tr key={i} style={{ borderBottom: '0.5px solid var(--c-border)', background: i % 2 === 1 ? 'var(--c-bg-2)' : 'var(--c-bg)' }}>
                  <td style={{ padding: '7px 10px', fontWeight: 400 }}>{d.kab}</td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtRp(d.output)}</td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtRp(d.input)}</td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: nt >= 0 ? C.teal : C.red, fontWeight: 500 }}>
                    {nt >= 0 ? '+' : ''}{fmtRp(nt)}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 11, background: nt >= 0 ? '#E8F7F2' : '#FEF0F0', color: nt >= 0 ? C.teal : C.red }}>
                      {nt >= 0 ? 'Surplus' : 'Defisit'}
                    </span>
                  </td>
                </tr>
              )
            })}
            <tr style={{ background: '#EBF4FB', borderTop: '1px solid var(--c-border-2)' }}>
              <td style={{ padding: '8px 10px', fontWeight: 500 }}>Kalimantan Selatan</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 500 }}>{fmtRp(RINGKASAN.nilai_output_rp)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 500 }}>{fmtRp(RINGKASAN.biaya_input_rp)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 500, color: C.teal }}>+{fmtRp(RINGKASAN.nilai_tambah_rp)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#E8F7F2', color: C.teal }}>Surplus</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── TAB: Penyaluran ───────────────────────────────────────────────────────────
function TabPenyaluran() {
  const pieData = [
    { name: 'Rumah Tangga', value: 88.6 },
    { name: 'Niaga', value: 14.1 },
    { name: 'Bocor', value: 35.0 },
    { name: 'Sosial', value: 4.7 },
    { name: 'Inst. Pemerintah', value: 3.7 },
    { name: 'Khusus', value: 1.8 },
    { name: 'Industri', value: 0.3 },
    { name: 'Lainnya & Sendiri', value: 10.4 },
  ]

  const bakuData = AIR_BAKU.map((d, i) => ({
    name: KABUPATEN_SHORT[i],
    sungai: +(d.sungai / 1e6).toFixed(2),
    waduk: +(d.waduk / 1e6).toFixed(2),
    lain: +((d.danau + d.air_tanah + d.lainnya) / 1e6).toFixed(2),
  }))

  const pctBocor = (RINGKASAN.bocor_total_m3 / RINGKASAN.total_produksi_m3 * 100).toFixed(1)

  return (
    <div>
      <SectionHeader
        title="Air yang Disalurkan"
        desc="Dari 158,6 juta m³ yang diproduksi, 22% hilang sebelum sampai ke pelanggan."
      />
      <FindingBox type="warn">
        <strong>Kebocoran {pctBocor}%:</strong> Setiap 5 liter air yang diproduksi, lebih dari 1 liter bocor dalam penyaluran. Secara absolut, 35 juta m³ hilang — setara kebutuhan air kota Tapin dan Kotabaru selama satu tahun penuh.
      </FindingBox>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Distribusi volume air (juta m³)</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.name === 'Bocor' ? C.red : PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v + ' juta m³']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Rumah tangga', val: '88,6 juta m³', sub: '55,9% dari total', color: C.blue },
            { label: 'Niaga', val: '14,1 juta m³', sub: '8,9% dari total', color: C.teal },
            { label: 'Bocor dalam penyaluran', val: '35,0 juta m³', sub: '22,1% — air terbuang', color: C.red },
            { label: 'Sosial + Pemerintah', val: '8,4 juta m³', sub: '5,3% dari total', color: C.amber },
          ].map((item, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--c-bg)', border: '0.5px solid var(--c-border)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.val}</div>
              <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>{item.label} · {item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--c-text-3)', marginBottom: 8 }}>Sumber air baku per kabupaten/kota (juta m³)</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 12, color: 'var(--c-text-2)' }}>
          {[['Sungai', C.blue], ['Waduk', C.lblue], ['Danau/Tanah/Lainnya', C.teal]].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={bakuData} margin={{ left: 10, right: 10, top: 4, bottom: 30 }}>
            <CartesianGrid vertical={false} stroke={GRID_STYLE.stroke} />
            <XAxis dataKey="name" tick={{ ...TICK_STYLE, angle: -35, textAnchor: 'end' }} />
            <YAxis tick={TICK_STYLE} tickFormatter={v => v + ' jt'} />
            <Tooltip content={<CustomTooltip formatter={(v) => v + ' juta m³'} />} />
            <Bar dataKey="sungai" name="Sungai" stackId="a" fill={C.blue} />
            <Bar dataKey="waduk" name="Waduk" stackId="a" fill={C.lblue} />
            <Bar dataKey="lain" name="Lainnya" stackId="a" fill={C.teal} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <FindingBox type="success">
          <strong>Dominasi air sungai:</strong> 139,3 juta m³ (82%) air baku bersumber dari sungai. Hanya tiga PDAM — Tanah Laut, Kotabaru, dan Banjarmasin — yang memanfaatkan waduk. Kalimantan Selatan tidak menggunakan mata air sama sekali sebagai sumber air baku PDAM.
        </FindingBox>
      </div>
    </div>
  )
}

// ── TAB: Profil Wilayah ───────────────────────────────────────────────────────
function TabProfil() {
  const [selected, setSelected] = useState(null)

  const maxProd = Math.max(...PRODUKSI.map(d => d.produksi_m3))

  const getDetail = (i) => {
    const p = PRODUKSI[i]
    const pel = PELANGGAN[i]
    const pen = PENYALURAN[i]
    const keu = KEUANGAN[i]
    const tk = TENAGA_KERJA[i]
    const lay = LAYANAN[i]
    const nt = keu.output - keu.input
    const totalPel = pel.rt + pel.sosial + pel.pemerintah + pel.niaga + pel.industri + pel.khusus + pel.lainnya
    const bocorPct = pen.bocor > 0 ? (pen.bocor / p.produksi_m3 * 100).toFixed(1) + '%' : '—'
    const totalTK = (tk.slta_tek + tk.dip_tek + tk.s1_tek + tk.s2_tek) + (tk.slta_non + tk.dip_non + tk.s1_non + tk.s2_non)

    return [
      { label: 'Produksi air', val: fmtM(p.produksi_m3), sub: 'm³/tahun' },
      { label: 'Kapasitas potensial', val: fmt(p.kap_potensial), sub: 'liter/detik' },
      { label: 'Kapasitas efektif', val: fmt(p.kap_efektif), sub: 'liter/detik (' + Math.round(p.kap_efektif / p.kap_potensial * 100) + '%)' },
      { label: 'Total pelanggan', val: fmt(totalPel), sub: 'semua kategori' },
      { label: 'Pelanggan RT', val: fmt(pel.rt), sub: Math.round(pel.rt / totalPel * 100) + '% dari total' },
      { label: 'Nilai output', val: fmtRp(keu.output), sub: 'miliar rupiah' },
      { label: 'Biaya/input', val: fmtRp(keu.input), sub: 'miliar rupiah' },
      { label: 'Nilai tambah', val: (nt >= 0 ? '+' : '') + fmtRp(nt), sub: nt >= 0 ? 'Surplus' : 'Defisit', color: nt >= 0 ? C.teal : C.red },
      { label: 'Kebocoran', val: bocorPct, sub: 'dari total produksi' },
      { label: 'Jumlah karyawan', val: fmt(totalTK), sub: 'teknis + non-teknis' },
      { label: 'Kecamatan dilayani', val: fmt(lay.kecamatan_dalam + lay.kecamatan_luar), sub: 'dalam + luar wilayah' },
    ]
  }

  return (
    <div>
      <SectionHeader
        title="Profil per Wilayah"
        desc="Pilih kabupaten/kota untuk melihat data lengkap PDAM setempat."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10, marginBottom: '1rem' }}>
        {KABUPATEN.map((kab, i) => {
          const pct = Math.round(PRODUKSI[i].produksi_m3 / maxProd * 100)
          const isSelected = selected === i
          return (
            <button key={i} onClick={() => setSelected(isSelected ? null : i)} style={{
              background: isSelected ? '#EBF4FB' : 'var(--c-bg)',
              border: isSelected ? `1.5px solid ${C.blue}` : '0.5px solid var(--c-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all .15s',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-text)', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {kab}
                {isSelected ? <ChevronUp size={13} color={C.blue} /> : <ChevronDown size={13} color="var(--c-text-3)" />}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-text-3)', marginBottom: 5 }}>
                {fmtM(PRODUKSI[i].produksi_m3)} m³ produksi
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'var(--c-bg-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct + '%', background: isSelected ? C.blue : C.lblue, borderRadius: 2, transition: 'width .3s' }} />
              </div>
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div style={{
          background: 'var(--c-bg)',
          border: `1px solid ${C.blue}33`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.2rem',
          marginTop: '0.5rem',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: '1rem', color: 'var(--c-text)' }}>
            {KABUPATEN[selected]}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
            {getDetail(selected).map((item, i) => (
              <div key={i} style={{ background: 'var(--c-bg-2)', borderRadius: 'var(--radius-md)', padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: 'var(--c-text-3)', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: item.color || 'var(--c-text)' }}>{item.val}</div>
                <div style={{ fontSize: 10, color: 'var(--c-text-3)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── TAB: Tentang ──────────────────────────────────────────────────────────────
function TabTentang() {
  return (
    <div>
      <SectionHeader title="Tentang Dashboard" desc="Panduan membaca data dan cara memperbarui informasi." />

      <FindingBox type="info">
        <strong>Sumber data:</strong> Seluruh data bersumber dari publikasi resmi <em>Statistik Air Bersih Provinsi Kalimantan Selatan Tahun {META.tahun_data}</em> (Katalog BPS: {META.katalog}, Nomor Publikasi: {META.nomor_publikasi}), diterbitkan oleh {META.sumber}, {META.terbit}.
      </FindingBox>

      <FindingBox type="note">
        <strong>Konvensi BPS N-1:</strong> Buku yang terbit tahun 2025 berisi data tahun 2024. Label tahun pada dashboard mengacu pada <em>tahun data</em>, bukan tahun publikasi.
      </FindingBox>

      <div style={{ margin: '1.25rem 0' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: '.75rem' }}>Cara membaca angka</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
          {[
            ['Volume air', 'm³ (meter kubik) atau juta m³. 1 juta m³ ≈ 400 kolam renang olimpik.'],
            ['Kapasitas produksi', 'Liter per detik (l/detik). Potensial = kapasitas terpasang. Efektif = yang benar-benar dipakai.'],
            ['Nilai keuangan', 'Miliar rupiah (M). Nilai tambah negatif = PDAM merugi tahun tersebut.'],
            ['Kebocoran', 'Air yang hilang dalam jaringan distribusi sebelum sampai ke meter pelanggan.'],
          ].map(([term, def], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--c-bg-2)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ minWidth: 140, color: C.navy, fontWeight: 500 }}>{term}</strong>
              <span style={{ color: 'var(--c-text-2)' }}>{def}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '1.25rem 0' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: '.75rem' }}>Cara memperbarui data</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
          {[
            ['Langkah 1', 'Unduh PDF BPS terbaru dari kalsel.bps.go.id'],
            ['Langkah 2', 'Buka Google Sheets template, tambah baris data tahun baru di setiap sheet'],
            ['Langkah 3', 'Jalankan: python scripts/sync_data.py — file src/data.js diperbarui otomatis'],
            ['Langkah 4', 'git commit -am "update data [tahun]" && git push — Vercel deploy otomatis'],
          ].map(([step, action], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--c-bg-2)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ minWidth: 80, color: C.blue, fontWeight: 500 }}>{step}</strong>
              <span style={{ color: 'var(--c-text-2)', fontFamily: action.startsWith('python') || action.startsWith('git') ? 'monospace' : 'inherit', fontSize: action.startsWith('python') || action.startsWith('git') ? 12 : 13 }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1rem', background: 'var(--c-bg-3)', borderRadius: 'var(--radius-lg)', fontSize: 12, color: 'var(--c-text-2)', marginTop: '1rem' }}>
        Dashboard ini dikembangkan untuk <strong>data.mentaos.id</strong> — platform data jurnalisme Kalimantan Selatan.<br />
        Data: <a href={META.url_sumber} target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>{META.url_sumber}</a>
      </div>
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'produksi',   label: 'Produksi',  icon: Droplets    },
  { id: 'pelanggan',  label: 'Pelanggan', icon: Users       },
  { id: 'keuangan',   label: 'Keuangan',  icon: TrendingUp  },
  { id: 'penyaluran', label: 'Penyaluran',icon: Gauge       },
  { id: 'profil',     label: 'Profil Wilayah', icon: MapPin },
  { id: 'tentang',    label: 'Tentang',   icon: BookOpen    },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('produksi')

  const pctBocor = (RINGKASAN.bocor_total_m3 / RINGKASAN.total_produksi_m3 * 100).toFixed(1)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg-2)' }}>
      {/* Header */}
      <header style={{ background: 'var(--c-navy)', color: '#fff', padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#7BAED4', marginBottom: '.4rem', fontWeight: 400 }}>
            data.mentaos.id · Dashboard Data Publik
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 600, lineHeight: 1.15, marginBottom: '.4rem' }}>
            Statistik Air Bersih<br />Kalimantan Selatan
          </h1>
          <p style={{ fontSize: 13, color: '#9DB8CC', lineHeight: 1.6, marginBottom: '1rem' }}>
            Data tahun {META.tahun_data} · Sumber:{' '}
            <a href={META.url_sumber} target="_blank" rel="noopener noreferrer" style={{ color: '#7BAED4' }}>
              {META.sumber}
            </a>
            {' '}· Publikasi {META.terbit}
          </p>

          {/* Stat cards ringkasan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {[
              { icon: Droplets,      label: 'Total produksi', val: '158,6', unit: 'juta m³',  note: 'Bjm terbesar: 59,7 jt m³',  color: 'blue'  },
              { icon: Users,         label: 'Total pelanggan', val: '3,26', unit: 'juta',      note: '89% rumah tangga',           color: 'teal'  },
              { icon: AlertTriangle, label: 'Tingkat bocor',   val: pctBocor+'%', unit: '',   note: '35 juta m³ hilang/tahun',    color: 'red'   },
              { icon: TrendingUp,    label: 'Nilai output',    val: '924,6', unit: 'miliar Rp',note: 'Nilai tambah: 268 M',        color: 'green' },
              { icon: Gauge,         label: 'Kapasitas efektif',val:'13.470',unit: 'l/detik', note: '88% dari kapasitas potensial',color: 'amber' },
            ].map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div style={{ background: 'var(--c-bg)', borderBottom: '1px solid var(--c-border)', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '.7rem 1rem', border: 'none', borderBottom: active ? `2px solid ${C.navy}` : '2px solid transparent',
                background: 'none', color: active ? 'var(--c-text)' : 'var(--c-text-2)',
                fontSize: 13, fontWeight: active ? 500 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
                flexShrink: 0,
              }}>
                <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1.25rem 3rem' }}>
        {activeTab === 'produksi'   && <TabProduksi />}
        {activeTab === 'pelanggan'  && <TabPelanggan />}
        {activeTab === 'keuangan'   && <TabKeuangan />}
        {activeTab === 'penyaluran' && <TabPenyaluran />}
        {activeTab === 'profil'     && <TabProfil />}
        {activeTab === 'tentang'    && <TabTentang />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--c-border)', padding: '1.25rem 1.5rem', background: 'var(--c-bg)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 11, color: 'var(--c-text-3)' }}>
          <span>
            <strong style={{ color: 'var(--c-text-2)' }}>data.mentaos.id</strong> · Data: {META.sumber} ({META.terbit}) · Katalog {META.katalog}
          </span>
          <a href={META.url_sumber} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.blue, fontSize: 11 }}>
            <ExternalLink size={11} /> Sumber data
          </a>
        </div>
      </footer>
    </div>
  )
}
