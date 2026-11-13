import { AGE_MODES } from "../data/age-modes.js";

export function renderSettings(settings) {
  const age = AGE_MODES[settings.ageMode] || AGE_MODES.explorer;
  const toggle = (key, label, description) => `
    <div class="setting-row">
      <div><strong>${label}</strong><div class="muted" style="font-size:12px;margin-top:4px">${description}</div></div>
      <button class="toggle" type="button" data-action="toggle-setting" data-setting="${key}" aria-pressed="${settings[key]}"></button>
    </div>`;
  return `
    <section class="page">
      <div class="page-heading"><div><span class="pill">⚙️ PENGATURAN</span><h1>Atur Petualanganmu</h1><p>Sesuaikan pengalaman bermain agar terasa nyaman.</p></div></div>
      <div class="settings-card panel">
        <h2 style="margin-top:0">Profil permainan</h2>
        <div class="setting-row">
          <div><strong>Kelompok usia</strong><div class="muted" style="font-size:12px;margin-top:4px">${age.name} · ${age.age}</div></div>
          <button class="btn btn-soft" type="button" data-action="change-age">Ubah</button>
        </div>
        <h2 style="margin:24px 0 4px">Suara dan musik</h2>
        ${toggle("voice","Instruksi suara","Narasi berbahasa Indonesia.")}
        ${toggle("soundEffects","Efek suara","Suara saat memilih jawaban dan mendapat bintang.")}
        ${toggle("music","Musik latar","Opsional; aktif jika file musik telah ditambahkan.")}
        <h2 style="margin:24px 0 4px">Data permainan</h2>
        <p class="muted" style="font-size:13px">Progres tersimpan di browser/perangkat ini. Menghapus data akan mengembalikan semua misi ke awal.</p>
        <button class="btn btn-ghost" type="button" data-action="reset-progress">Reset Progres</button>
        <button class="btn btn-primary btn-block" style="margin-top:18px" type="button" data-action="dashboard">Selesai</button>
      </div>
    </section>`;
}
