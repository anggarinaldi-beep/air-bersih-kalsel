// ============================================================
// DATA AIR BERSIH KALIMANTAN SELATAN
// Sumber: BPS Kalsel, Statistik Air Bersih 2024
// Publikasi No. 63000.25044 | Katalog 6206001.63
//
// CARA UPDATE: jalankan `python scripts/sync_data.py`
// File ini akan otomatis diperbarui dari Google Sheets.
// Jangan edit manual jika menggunakan script sync.
// ============================================================

export const META = {
  tahun_data: 2024,
  publikasi: "Statistik Air Bersih Provinsi Kalimantan Selatan Tahun 2024",
  nomor_publikasi: "63000.25044",
  katalog: "6206001.63",
  sumber: "BPS Provinsi Kalimantan Selatan",
  url_sumber: "https://kalsel.bps.go.id",
  terbit: "Desember 2025",
  diperbarui: "2025-01-01",
};

export const RINGKASAN = {
  total_produksi_m3: 158608036,
  total_pelanggan: 3257783,
  pct_pelanggan_rt: 89.05,
  bocor_total_m3: 34975786,
  pct_bocor: 22.05,
  kap_potensial_l_det: 15276,
  kap_efektif_l_det: 13470,
  nilai_output_rp: 924620192017,
  biaya_input_rp: 656548912902,
  nilai_tambah_rp: 268071279115,
  total_karyawan: 1834,
  pdam_defisit_count: 2,
};

// Urutan kabupaten/kota — konsisten di semua tabel
export const KABUPATEN = [
  "Tanah Laut",
  "Kotabaru",
  "Banjar dan Banjarbaru",
  "Barito Kuala",
  "Tapin",
  "Hulu Sungai Selatan",
  "Hulu Sungai Tengah",
  "Hulu Sungai Utara",
  "Tabalong",
  "Tanah Bumbu",
  "Balangan",
  "Banjarmasin",
];

export const KABUPATEN_SHORT = [
  "Tala", "Kotabaru", "Banjar+Bjb", "Batola",
  "Tapin", "HSS", "HST", "HSU",
  "Tabalong", "Tanbu", "Balangan", "Bjm",
];

// Tabel 1 & 2 — Produksi & Kapasitas
export const PRODUKSI = [
  { kab: "Tanah Laut",            produksi_m3: 3075297,  kap_potensial: 7462, kap_efektif: 7020 },
  { kab: "Kotabaru",              produksi_m3: 5579539,  kap_potensial: 425,  kap_efektif: 360  },
  { kab: "Banjar dan Banjarbaru", produksi_m3: 31487200, kap_potensial: 1104, kap_efektif: 978  },
  { kab: "Barito Kuala",          produksi_m3: 7835780,  kap_potensial: 600,  kap_efektif: 435  },
  { kab: "Tapin",                 produksi_m3: 5647765,  kap_potensial: 512,  kap_efektif: 278  },
  { kab: "Hulu Sungai Selatan",   produksi_m3: 4478773,  kap_potensial: 355,  kap_efektif: 273  },
  { kab: "Hulu Sungai Tengah",    produksi_m3: 3685583,  kap_potensial: 345,  kap_efektif: 193  },
  { kab: "Hulu Sungai Utara",     produksi_m3: 11890948, kap_potensial: 318,  kap_efektif: 388  },
  { kab: "Tabalong",              produksi_m3: 9502252,  kap_potensial: 660,  kap_efektif: 660  },
  { kab: "Tanah Bumbu",           produksi_m3: 11195466, kap_potensial: 635,  kap_efektif: 475  },
  { kab: "Balangan",              produksi_m3: 4510649,  kap_potensial: 460,  kap_efektif: 440  },
  { kab: "Banjarmasin",           produksi_m3: 59718784, kap_potensial: 2400, kap_efektif: 1970 },
];

// Tabel 13.1 — Pelanggan per kategori
export const PELANGGAN = [
  { kab: "Tanah Laut",            sosial: 2774,  rt: 105201,  pemerintah: 2860,  niaga: 4508,   industri: 133,  khusus: 11,  lainnya: 0    },
  { kab: "Kotabaru",              sosial: 170,   rt: 18590,   pemerintah: 611,   niaga: 2313,   industri: 28,   khusus: 32,  lainnya: 0    },
  { kab: "Banjar dan Banjarbaru", sosial: 1486,  rt: 104968,  pemerintah: 780,   niaga: 6757,   industri: 33,   khusus: 5,   lainnya: 0    },
  { kab: "Barito Kuala",          sosial: 329,   rt: 38237,   pemerintah: 422,   niaga: 369,    industri: 0,    khusus: 0,   lainnya: 28   },
  { kab: "Tapin",                 sosial: 507,   rt: 19139,   pemerintah: 231,   niaga: 1047,   industri: 0,    khusus: 0,   lainnya: 0    },
  { kab: "Hulu Sungai Selatan",   sosial: 10336, rt: 231802,  pemerintah: 15175, niaga: 0,      industri: 0,    khusus: 0,   lainnya: 0    },
  { kab: "Hulu Sungai Tengah",    sosial: 403,   rt: 17287,   pemerintah: 0,     niaga: 1857,   industri: 0,    khusus: 0,   lainnya: 0    },
  { kab: "Hulu Sungai Utara",     sosial: 911,   rt: 26215,   pemerintah: 796,   niaga: 3406,   industri: 0,    khusus: 0,   lainnya: 9    },
  { kab: "Tabalong",              sosial: 9759,  rt: 284519,  pemerintah: 690,   niaga: 46523,  industri: 73,   khusus: 0,   lainnya: 0    },
  { kab: "Tanah Bumbu",           sosial: 706,   rt: 33912,   pemerintah: 228,   niaga: 3915,   industri: 11,   khusus: 1,   lainnya: 0    },
  { kab: "Balangan",              sosial: 676,   rt: 19486,   pemerintah: 309,   niaga: 842,    industri: 0,    khusus: 1,   lainnya: 0    },
  { kab: "Banjarmasin",           sosial: 31114, rt: 2001668, pemerintah: 7700,  niaga: 192044, industri: 1285, khusus: 137, lainnya: 2418 },
];

// Tabel 13 & subtabel — Volume penyaluran (m3)
export const PENYALURAN = [
  { kab: "Tanah Laut",            vol_sosial: 49912,    vol_rt: 1691340,   vol_pemerintah: 214085,  vol_niaga: 151700,   vol_industri: 62602,  vol_khusus: 90018,   vol_lainnya: 0,      bocor: 672528,    pakai_sendiri: 143112  },
  { kab: "Kotabaru",              vol_sosial: 95246,    vol_rt: 4311870,   vol_pemerintah: 239157,  vol_niaga: 820602,   vol_industri: 16832,  vol_khusus: 95832,   vol_lainnya: 0,      bocor: 0,         pakai_sendiri: 0       },
  { kab: "Banjar dan Banjarbaru", vol_sosial: 610053,   vol_rt: 13217340,  vol_pemerintah: 1073771, vol_niaga: 2019323,  vol_industri: 79741,  vol_khusus: 1222,    vol_lainnya: 0,      bocor: 8238368,   pakai_sendiri: 6247382 },
  { kab: "Barito Kuala",          vol_sosial: 150774,   vol_rt: 6182008,   vol_pemerintah: 174309,  vol_niaga: 227264,   vol_industri: 0,      vol_khusus: 0,       vol_lainnya: 7092,   bocor: 1094333,   pakai_sendiri: 0       },
  { kab: "Tapin",                 vol_sosial: 451253,   vol_rt: 3384680,   vol_pemerintah: 101146,  vol_niaga: 358612,   vol_industri: 0,      vol_khusus: 0,       vol_lainnya: 0,      bocor: 1351048,   pakai_sendiri: 1026    },
  { kab: "Hulu Sungai Selatan",   vol_sosial: 377527,   vol_rt: 3762535,   vol_pemerintah: 338711,  vol_niaga: 0,        vol_industri: 0,      vol_khusus: 0,       vol_lainnya: 0,      bocor: 0,         pakai_sendiri: 0       },
  { kab: "Hulu Sungai Tengah",    vol_sosial: 451589,   vol_rt: 2734002,   vol_pemerintah: 0,       vol_niaga: 499992,   vol_industri: 0,      vol_khusus: 0,       vol_lainnya: 0,      bocor: 0,         pakai_sendiri: 0       },
  { kab: "Hulu Sungai Utara",     vol_sosial: 501696,   vol_rt: 4601232,   vol_pemerintah: 264972,  vol_niaga: 764496,   vol_industri: 0,      vol_khusus: 0,       vol_lainnya: 4824,   bocor: 5163885,   pakai_sendiri: 589843  },
  { kab: "Tabalong",              vol_sosial: 284095,   vol_rt: 4860074,   vol_pemerintah: 254182,  vol_niaga: 1340874,  vol_industri: 1817,   vol_khusus: 0,       vol_lainnya: 0,      bocor: 2183872,   pakai_sendiri: 577338  },
  { kab: "Tanah Bumbu",           vol_sosial: 215732,   vol_rt: 9073677,   vol_pemerintah: 174921,  vol_niaga: 1689093,  vol_industri: 19283,  vol_khusus: 22248,   vol_lainnya: 0,      bocor: 0,         pakai_sendiri: 512     },
  { kab: "Balangan",              vol_sosial: 238541,   vol_rt: 3757695,   vol_pemerintah: 150519,  vol_niaga: 332367,   vol_industri: 0,      vol_khusus: 31527,   vol_lainnya: 0,      bocor: 0,         pakai_sendiri: 0       },
  { kab: "Banjarmasin",           vol_sosial: 1287678,  vol_rt: 31020621,  vol_pemerintah: 733516,  vol_niaga: 5914474,  vol_industri: 127837, vol_khusus: 1528340, vol_lainnya: 244281, bocor: 16271752,  pakai_sendiri: 2590285 },
];

// Tabel 15 — Keuangan
export const KEUANGAN = [
  { kab: "Tanah Laut",            output: 20446891314,   input: 12794094725  },
  { kab: "Kotabaru",              output: 32637946273,   input: 14245892378  },
  { kab: "Banjar dan Banjarbaru", output: 221458284659,  input: 171154270096 },
  { kab: "Barito Kuala",          output: 50759235332,   input: 62180818102  },
  { kab: "Tapin",                 output: 35822056858,   input: 20443087746  },
  { kab: "Hulu Sungai Selatan",   output: 24782169300,   input: 7719011296   },
  { kab: "Hulu Sungai Tengah",    output: 36600095461,   input: 8364953197   },
  { kab: "Hulu Sungai Utara",     output: 48994157959,   input: 44547476340  },
  { kab: "Tabalong",              output: 11043237000,   input: 25079604471  },
  { kab: "Tanah Bumbu",           output: 52882762030,   input: 36552088124  },
  { kab: "Balangan",              output: 49850631121,   input: 12831934346  },
  { kab: "Banjarmasin",           output: 339342724710,  input: 240645682081 },
];

// Tabel 16 — Air baku per sumber (m3)
export const AIR_BAKU = [
  { kab: "Tanah Laut",            sungai: 1367966,   danau: 0,      waduk: 1025908,  mata_air: 0, air_tanah: 0,      lainnya: 954210  },
  { kab: "Kotabaru",              sungai: 5414943,   danau: 0,      waduk: 2213568,  mata_air: 0, air_tanah: 0,      lainnya: 632448  },
  { kab: "Banjar dan Banjarbaru", sungai: 30770139,  danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 717061, lainnya: 0       },
  { kab: "Barito Kuala",          sungai: 12930177,  danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Tapin",                 sungai: 7067579,   danau: 160920, waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Hulu Sungai Selatan",   sungai: 8402950,   danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Hulu Sungai Tengah",    sungai: 3783432,   danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Hulu Sungai Utara",     sungai: 11883845,  danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Tabalong",              sungai: 9502252,   danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Tanah Bumbu",           sungai: 15953277,  danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Balangan",              sungai: 190000,    danau: 0,      waduk: 0,        mata_air: 0, air_tanah: 0,      lainnya: 0       },
  { kab: "Banjarmasin",           sungai: 32019265,  danau: 0,      waduk: 25951037, mata_air: 0, air_tanah: 0,      lainnya: 4314904 },
];

// Tabel 3 — Tenaga kerja
export const TENAGA_KERJA = [
  { kab: "Tanah Laut",            slta_tek: 22,  dip_tek: 5,  s1_tek: 4,   s2_tek: 0,  slta_non: 13,  dip_non: 4,  s1_non: 5,   s2_non: 0  },
  { kab: "Kotabaru",              slta_tek: 34,  dip_tek: 8,  s1_tek: 14,  s2_tek: 2,  slta_non: 23,  dip_non: 7,  s1_non: 21,  s2_non: 2  },
  { kab: "Banjar dan Banjarbaru", slta_tek: 61,  dip_tek: 15, s1_tek: 40,  s2_tek: 6,  slta_non: 90,  dip_non: 5,  s1_non: 37,  s2_non: 7  },
  { kab: "Barito Kuala",          slta_tek: 107, dip_tek: 9,  s1_tek: 26,  s2_tek: 1,  slta_non: 107, dip_non: 6,  s1_non: 28,  s2_non: 1  },
  { kab: "Tapin",                 slta_tek: 37,  dip_tek: 6,  s1_tek: 7,   s2_tek: 0,  slta_non: 27,  dip_non: 3,  s1_non: 27,  s2_non: 0  },
  { kab: "Hulu Sungai Selatan",   slta_tek: 27,  dip_tek: 3,  s1_tek: 11,  s2_tek: 0,  slta_non: 15,  dip_non: 3,  s1_non: 9,   s2_non: 1  },
  { kab: "Hulu Sungai Tengah",    slta_tek: 38,  dip_tek: 6,  s1_tek: 10,  s2_tek: 0,  slta_non: 33,  dip_non: 9,  s1_non: 21,  s2_non: 1  },
  { kab: "Hulu Sungai Utara",     slta_tek: 44,  dip_tek: 4,  s1_tek: 15,  s2_tek: 0,  slta_non: 21,  dip_non: 2,  s1_non: 20,  s2_non: 1  },
  { kab: "Tabalong",              slta_tek: 31,  dip_tek: 3,  s1_tek: 11,  s2_tek: 1,  slta_non: 10,  dip_non: 3,  s1_non: 23,  s2_non: 1  },
  { kab: "Tanah Bumbu",           slta_tek: 77,  dip_tek: 7,  s1_tek: 16,  s2_tek: 0,  slta_non: 44,  dip_non: 1,  s1_non: 28,  s2_non: 0  },
  { kab: "Balangan",              slta_tek: 49,  dip_tek: 0,  s1_tek: 4,   s2_tek: 0,  slta_non: 37,  dip_non: 1,  s1_non: 4,   s2_non: 1  },
  { kab: "Banjarmasin",           slta_tek: 113, dip_tek: 33, s1_tek: 80,  s2_tek: 2,  slta_non: 26,  dip_non: 14, s1_non: 97,  s2_non: 5  },
];

// Tabel 17 — Kecamatan yang dilayani
export const LAYANAN = [
  { kab: "Tanah Laut",            kecamatan_dalam: 11, kecamatan_luar: 0 },
  { kab: "Kotabaru",              kecamatan_dalam: 7,  kecamatan_luar: 0 },
  { kab: "Banjar dan Banjarbaru", kecamatan_dalam: 21, kecamatan_luar: 0 },
  { kab: "Barito Kuala",          kecamatan_dalam: 15, kecamatan_luar: 0 },
  { kab: "Tapin",                 kecamatan_dalam: 11, kecamatan_luar: 0 },
  { kab: "Hulu Sungai Selatan",   kecamatan_dalam: 10, kecamatan_luar: 0 },
  { kab: "Hulu Sungai Tengah",    kecamatan_dalam: 8,  kecamatan_luar: 0 },
  { kab: "Hulu Sungai Utara",     kecamatan_dalam: 9,  kecamatan_luar: 0 },
  { kab: "Tabalong",              kecamatan_dalam: 12, kecamatan_luar: 0 },
  { kab: "Tanah Bumbu",           kecamatan_dalam: 12, kecamatan_luar: 0 },
  { kab: "Balangan",              kecamatan_dalam: 8,  kecamatan_luar: 0 },
  { kab: "Banjarmasin",           kecamatan_dalam: 5,  kecamatan_luar: 1 },
];
