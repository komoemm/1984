import { CategorySpec, SurveyItem } from '../types';

export const RAW_1984_SPEC: CategorySpec[] = [
  { cat: "①ごはん・麺・パン", ids: [1, 4, 5, 9, 11, 12, 13, 14, 18, 19, 21, 22, 25, 26, 27, 29, 31, 32, 33, 34, 37, 40] },
  { cat: "②卵", ids: [43, 46, 48, 50, 52, 53, 54, 55, 59, 60, 63] },
  { cat: "③鶏肉", ids: [69, 70, 72, 74, 75, 79, 80, 82, 87] },
  { cat: "④豚肉", ids: [90, 92, 95, 98, 99, 100, 101, 102, 103, 107] },
  { cat: "⑤牛肉", ids: [110, 112, 119] },
  { cat: "⑦豆腐", ids: [137, 138, 139, 140, 141, 143, 150, 151] },
  { cat: "⑧納豆", ids: [156] },
  { cat: "⑨油揚げ", ids: [166] },
  { cat: "⑩生揚げ", ids: [172] },
  { cat: "⑪がんもどき", ids: [178, 179] },
  { cat: "⑫うの花", ids: [183] },
  { cat: "⑯じゃが芋", ids: [202, 203, 204, 205, 208, 210, 211, 213] },
  { cat: "⑰さつま芋", ids: [219, 220, 221, 223, 224] },
  { cat: "⑱里芋", ids: [228, 233] },
  { cat: "⑲山芋", ids: [243] },
  { cat: "⑳キャベツ", ids: [247, 249, 250, 251, 253, 254, 257] },
  { cat: "㉑きゅうり", ids: [260, 261, 262] },
  { cat: "㉒大根", ids: [269, 276, 278, 280, 281, 284, 285] },
  { cat: "㉓人参", ids: [293, 294, 296, 297, 298] },
  { cat: "㉔ホウレン草", ids: [305, 307, 308, 313] },
  { cat: "㉕なす", ids: [318, 320, 325, 327] },
  { cat: "㉖白菜", ids: [331, 333, 338, 339] },
  { cat: "㉗トマト", ids: [342, 343] },
  { cat: "㉘玉葱", ids: [348, 349, 351, 352, 353, 354] },
  { cat: "㉙ピーマン", ids: [358, 359, 360] },
  { cat: "㉚ごぼう", ids: [365, 367] },
  { cat: "㉛小松菜", ids: [373, 374, 376] },
  { cat: "㉜春菊", ids: [386] },
  { cat: "㉝かぼちゃ", ids: [391, 393] },
  { cat: "㉞筍", ids: [398] },
  { cat: "㉟かぶ", ids: [409] },
  { cat: "㊱もやし", ids: [412, 414, 415, 416] },
  { cat: "㊲れんこん", ids: [428, 430] },
  { cat: "㊵葱・わけぎ", ids: [441, 448, 449, 451] },
  { cat: "㊶セロリ", ids: [454] },
  { cat: "㊷しいたけ", ids: [461, 464, 465] },
  { cat: "㊹レタス", ids: [473] },
  { cat: "㊻青梗菜", ids: [482] },
  { cat: "㊼ハム・ソーセージ", ids: [486, 488, 489] },
  { cat: "㊽かまぼこ", ids: [494] },
  { cat: "㊾アジ", ids: [505, 507, 510] },
  { cat: "㊿サバ", ids: [513, 520] },
  { cat: "51イカ", ids: [541] },
  { cat: "52タイ", ids: [547, 549, 550] },
  { cat: "55えび", ids: [570, 571] },
  { cat: "56マグロ", ids: [582] },
  { cat: "57鮭", ids: [590, 592, 593, 599] },
  { cat: "58タコ", ids: [602, 603] },
  { cat: "59カツオ", ids: [610] },
  { cat: "62しじみ、あさり、はまぐり", ids: [630] },
  { cat: "64イワシ", ids: [648, 653] },
  { cat: "69さんま", ids: [688] },
  { cat: "70牛乳", ids: [693, 694, 695] },
  { cat: "71チーズ", ids: [699, 700, 701, 702] }
];

export const FULL_175_SCHEMA: SurveyItem[] = [];
let colCounter = 1;
RAW_1984_SPEC.forEach(entry => {
  entry.ids.forEach(id => {
    FULL_175_SCHEMA.push({
      colIndex: colCounter++,
      cat: entry.cat,
      id: id
    });
  });
});

export const COLUMN_INFO = [
  { id: 1, label: '1:ない', title: '① 食べたことがない', desc: '食べたことがない (1を選んだ場合は他の選択肢は無効)', color: 'text-rose-400' },
  { id: 2, label: '2:よく', title: '② 頻度: よく食べる', desc: 'ほぼ毎日・よく食べる', color: 'text-amber-300' },
  { id: 3, label: '3:割合', title: '② 頻度: 割合よく食べる', desc: '週に数回食べる', color: 'text-amber-300' },
  { id: 4, label: '4:あまり', title: '② 頻度: あまり食べない', desc: '月に数回程度', color: 'text-amber-300' },
  { id: 5, label: '5:家で', title: '③ 機会: 家で作る', desc: '家庭内で調理・手作り', color: 'text-emerald-300' },
  { id: 6, label: '6:調理', title: '③ 機会: 調理品を買う', desc: '市販の惣菜・レトルト・弁当', color: 'text-emerald-300' },
  { id: 7, label: '7:外食', title: '③ 機会: 外食・店', desc: '外食・店舗での食事', color: 'text-emerald-300' }
];

/**
 * Generates an authentic canvas representation of the 1984 Nutrition Survey Form
 * for instant testing and verification without requiring external files.
 */
export function createSampleSurveyFormImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 1980;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Vintage survey paper background
  ctx.fillStyle = '#f7f6f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint grid paper lines
  ctx.strokeStyle = '#eae6db';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Header Box
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 50, canvas.width - 120, 120);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('昭和59年 国民栄養調査 食物摂取状況調査票（標本票・1984年版）', canvas.width / 2, 95);

  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('厚生省 保健医療局 健康増進課 ／ 被調査世帯番号: [ 0 8 4 - 5 9 1 2 ] ／ 対象者: 昭和59年11月調査', canvas.width / 2, 140);

  // Table Headers
  const startX = 60;
  const startY = 200;
  const tableWidth = canvas.width - 120;
  const rowHeight = 36;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(startX, startY, tableWidth, 54);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, tableWidth, 54);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.fillText('分類・品目群', startX + 16, startY + 32);
  ctx.fillText('行番号', startX + 220, startY + 32);

  ctx.textAlign = 'center';
  ctx.fillText('①未食', startX + 380, startY + 32);
  ctx.fillText('②頻度 (よく/割と/あまり)', startX + 600, startY + 32);
  ctx.fillText('③入手・機会 (自炊/惣菜/外食)', startX + 940, startY + 32);
  ctx.fillText('OCR照合印', startX + 1200, startY + 32);

  // Draw Sample rows matching RAW_1984_SPEC categories
  let curY = startY + 54;
  let count = 0;
  const sampleCats = RAW_1984_SPEC.slice(0, 16);

  sampleCats.forEach(catSpec => {
    catSpec.ids.slice(0, 4).forEach((id, itemIdx) => {
      count++;
      if (curY > canvas.height - 100) return;

      const isEven = count % 2 === 0;
      ctx.fillStyle = isEven ? '#faf9f5' : '#ffffff';
      ctx.fillRect(startX, curY, tableWidth, rowHeight);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, curY, tableWidth, rowHeight);

      ctx.textAlign = 'left';
      ctx.fillStyle = itemIdx === 0 ? '#0f172a' : '#64748b';
      ctx.font = itemIdx === 0 ? 'bold 14px sans-serif' : '13px sans-serif';
      ctx.fillText(itemIdx === 0 ? catSpec.cat : `  └ ${catSpec.cat} 関連 (項目${itemIdx + 1})`, startX + 16, curY + 23);

      // Row ID badge
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`[ ${String(id).padStart(3, '0')} ]`, startX + 220, curY + 23);

      // Column boxes 1 to 7
      const colStarts = [380, 520, 600, 680, 860, 940, 1020];
      colStarts.forEach((cx, colIdx) => {
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(startX + cx - 18, curY + 6, 26, 24);

        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(String(colIdx + 1), startX + cx - 5, curY + 22);

        // Simulated pencil check marks on a few items
        if ((id % 7 === 0 && colIdx === 0) || (id % 3 === 0 && (colIdx === 1 || colIdx === 4)) || (id % 5 === 0 && (colIdx === 2 || colIdx === 5))) {
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(startX + cx - 5, curY + 18, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Stamp
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('検印OK', startX + 1200, curY + 23);

      curY += rowHeight;
    });
  });

  // Footer seal
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 240, canvas.height - 110, 160, 50);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('昭和59年 調査済印', canvas.width - 160, canvas.height - 78);

  return canvas;
}
