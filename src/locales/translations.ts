import { Language } from '../types';

export const CATEGORY_TRANSLATIONS: Record<string, { ja: string; en: string }> = {
  "①ごはん・麺・パン": { ja: "①ごはん・麺・パン", en: "① Rice, Noodles & Bread" },
  "②卵": { ja: "②卵", en: "② Eggs" },
  "③鶏肉": { ja: "③鶏肉", en: "③ Chicken" },
  "④豚肉": { ja: "④豚肉", en: "④ Pork" },
  "⑤牛肉": { ja: "⑤牛肉", en: "⑤ Beef" },
  "⑦豆腐": { ja: "⑦豆腐", en: "⑦ Tofu" },
  "⑧納豆": { ja: "⑧納豆", en: "⑧ Natto" },
  "⑨油揚げ": { ja: "⑨油揚げ", en: "⑨ Fried Tofu" },
  "⑩生揚げ": { ja: "⑩生揚げ", en: "⑩ Thick Fried Tofu" },
  "⑪がんもどき": { ja: "⑪がんもどき", en: "⑪ Tofu Fritter" },
  "⑫うの花": { ja: "⑫うの花", en: "⑫ Soy Curd Pulp" },
  "⑯じゃが芋": { ja: "⑯じゃが芋", en: "⑯ Potatoes" },
  "⑰さつま芋": { ja: "⑰さつま芋", en: "⑰ Sweet Potatoes" },
  "⑱里芋": { ja: "⑱里芋", en: "⑱ Taro" },
  "⑲山芋": { ja: "⑲山芋", en: "⑲ Yam" },
  "⑳キャベツ": { ja: "⑳キャベツ", en: "⑳ Cabbage" },
  "㉑きゅうり": { ja: "㉑きゅうり", en: "㉑ Cucumber" },
  "㉒大根": { ja: "㉒大根", en: "㉒ Daikon Radish" },
  "㉓人参": { ja: "㉓人参", en: "㉓ Carrot" },
  "㉔ホウレン草": { ja: "㉔ホウレン草", en: "㉔ Spinach" },
  "㉕なす": { ja: "㉕なす", en: "㉕ Eggplant" },
  "㉖白菜": { ja: "㉖白菜", en: "㉖ Chinese Cabbage" },
  "㉗トマト": { ja: "㉗トマト", en: "㉗ Tomato" },
  "㉘玉葱": { ja: "㉘玉葱", en: "㉘ Onion" },
  "㉙ピーマン": { ja: "㉙ピーマン", en: "㉙ Green Pepper" },
  "㉚ごぼう": { ja: "㉚ごぼう", en: "㉚ Burdock" },
  "㉛小松菜": { ja: "㉛小松菜", en: "㉛ Mustard Spinach" },
  "㉜春菊": { ja: "㉜春菊", en: "㉜ Garland Chrysanthemum" },
  "㉝かぼちゃ": { ja: "㉝かぼちゃ", en: "㉝ Pumpkin" },
  "㉞筍": { ja: "㉞筍", en: "㉞ Bamboo Shoot" },
  "㉟かぶ": { ja: "㉟かぶ", en: "㉟ Turnip" },
  "㊱もやし": { ja: "㊱もやし", en: "㊱ Bean Sprouts" },
  "㊲れんこん": { ja: "㊲れんこん", en: "㊲ Lotus Root" },
  "㊵葱・わけぎ": { ja: "㊵葱・わけぎ", en: "㊵ Green Onion" },
  "㊶セロリ": { ja: "㊶セロリ", en: "㊶ Celery" },
  "㊷しいたけ": { ja: "㊷しいたけ", en: "㊷ Shiitake" },
  "㊹レタス": { ja: "㊹レタス", en: "㊹ Lettuce" },
  "㊻青梗菜": { ja: "㊻青梗菜", en: "㊻ Bok Choy" },
  "㊼ハム・ソーセージ": { ja: "㊼ハム・ソーセージ", en: "㊼ Ham & Sausage" },
  "㊽かまぼこ": { ja: "㊽かまぼこ", en: "㊽ Fish Cake" },
  "㊾アジ": { ja: "㊾アジ", en: "㊾ Horse Mackerel" },
  "㊿サバ": { ja: "㊿サバ", en: "㊿ Mackerel" },
  "51イカ": { ja: "51イカ", en: "51 Squid" },
  "52タイ": { ja: "52タイ", en: "52 Sea Bream" },
  "55えび": { ja: "55えび", en: "55 Shrimp" },
  "56マグロ": { ja: "56マグロ", en: "56 Tuna" },
  "57鮭": { ja: "57鮭", en: "57 Salmon" },
  "58タコ": { ja: "58タコ", en: "58 Octopus" },
  "59カツオ": { ja: "59カツオ", en: "59 Bonito" },
  "62しじみ、あさり、はまぐり": { ja: "62しじみ、あさり、はまぐり", en: "62 Clams" },
  "64イワシ": { ja: "64イワシ", en: "64 Sardine" },
  "69さんま": { ja: "69さんま", en: "69 Pacific Saury" },
  "70牛乳": { ja: "70牛乳", en: "70 Milk" },
  "71チーズ": { ja: "71チーズ", en: "71 Cheese" }
};

export const translations = {
  ja: {
    // Header
    'header.appTitle': '1984 Japan Food Survey Digitizer',
    'header.appSubtitle': '昭和59年 国民栄養調査 食物摂取頻度調査票（人手照合 & 列番号入力システム）',
    'header.badge': '190品目 定義済',
    'header.loadSurvey': '調査票読込 (PDF/画像)',
    'header.load': '読込',
    'header.sampleForm': 'サンプル票',
    'header.rotate': '90°時計回りに回転',
    'header.clearBox': '選択枠クリア (C)',
    'header.key0': '0: 未食(Next)',
    'header.key13': '1–3: 頻度→機会(Next)',
    'header.keySpace': 'Space: クリア',
    'header.keyEnter': 'Enter/↓: 次へ',
    'header.langSwitch': '表示言語切替 (Language switcher)',

    // Form Panel
    'form.rapidEntry': '迅速入力モード',
    'form.matrixSummary': '{count} / 54 完了',
    'form.itemsFilled': '{filled} / {total} 入力済',
    'form.categorySelectorLabel': '調査分類（54カテゴリ & 190行番号定義）',
    'form.nextIncomplete': '次の未完了へ',
    'form.guideNever': '①未食: [0]',
    'form.guideFreq': '②頻度: [1:よく 2:割と 3:稀]',
    'form.guideOcc': '③機会: [1:手作 2:惣菜 3:外食]',
    'form.line': '行番号 {id}',
    'form.neverEatenBadge': '未食',
    'form.freqBadge': '頻度:{val}',
    'form.occBadge': '機会:{val}',
    'form.unselected': '-- 未選択 --',
    'form.clearRowTitle': 'この行の選択をクリア (Space)',
    'form.neverEatenOption': '① 食べたことがない',
    'form.key0Badge': 'Key: 0',
    'form.freqGroupLabel': '② 頻度',
    'form.occGroupLabel': '③ 機会',
    'form.freq1': '1: よく食べる',
    'form.freq2': '2: 割合よく',
    'form.freq3': '3: あまり',
    'form.occ1': '1: 家で作る',
    'form.occ2': '2: 惣菜・調理済',
    'form.occ3': '3: 外食',
    'form.copyTsv': 'Copy TSV (Excel 3-Cols)',
    'form.clearCategory': '現カテゴリ消去',
    'form.downloadCsv': '1984年調査CSV出力 (1品目3列)',

    // Category Matrix Modal
    'modal.matrixTitle': '全54カテゴリ 入力進捗状況マトリクス',
    'modal.matrixSubtitle': 'クリックすると対象カテゴリの入力画面に即座にジャンプします',
    'modal.filterAll': 'すべて ({count})',
    'modal.filterIncomplete': '未完了 ({count})',
    'modal.filterComplete': '完了済 ({count})',
    'modal.overallProgress': '全体進捗',
    'modal.matrixItemStatus': '{filled}/{total} 項目',

    // Incomplete Warning Modal
    'modal.warningTitle': '未入力カテゴリが存在します',
    'modal.warningSubtitle': '以下のカテゴリに未選択の項目が残っています',
    'modal.warningFilled': '{filled} / {total} 入力済',
    'modal.returnToForm': '入力画面に戻る',
    'modal.forceExport': '未入力を空欄のままCSV出力',

    // Document Viewer
    'viewer.uploadTitle': '調査票PDF / 画像をアップロード',
    'viewer.uploadDesc': 'クリックまたはPDF・画像ファイルをここにドラッグ＆ドロップしてください。\n（PDFは複数ページの閲覧・拡大縮小に対応）',
    'viewer.selectFile': 'ファイルを選択',
    'viewer.openSample': 'サンプル調査票を開く',

    // Toasts
    'toast.tsvCopied': 'Excel貼り付け用TSVをクリップボードにコピーしました（1品目あたり3列）',
    'toast.categoryCleared': '「{cat}」の入力を消去しました',
    'toast.allCompleted': '全190項目の入力が完了しました！CSV出力が可能です。',
    'toast.selectionBoxCleared': '選択枠をクリアしました',
    'toast.jumpNext': '次の未完了へジャンプ: {cat}',
    'toast.pdfRenderError': 'PDF ページの描画に失敗しました',
    'toast.sampleLoaded': 'サンプル調査票（昭和59年版）を読み込みました',
    'toast.csvDownloaded': '1984年調査CSVをダウンロードしました！'
  },
  en: {
    // Header
    'header.appTitle': '1984 Japan Food Survey Digitizer',
    'header.appSubtitle': '1984 National Nutrition Survey Food Frequency Questionnaire (Verification & Entry)',
    'header.badge': '190 Items Defined',
    'header.loadSurvey': 'Load Survey (PDF/Img)',
    'header.load': 'Load',
    'header.sampleForm': 'Sample Form',
    'header.rotate': 'Rotate 90° Clockwise',
    'header.clearBox': 'Clear Crop Box (C)',
    'header.key0': '0: Never (Next)',
    'header.key13': '1–3: Freq→Occ (Next)',
    'header.keySpace': 'Space: Clear',
    'header.keyEnter': 'Enter/↓: Next',
    'header.langSwitch': 'Switch language',

    // Form Panel
    'form.rapidEntry': 'Rapid Entry Mode',
    'form.matrixSummary': '{count} / 54 Done',
    'form.itemsFilled': '{filled} / {total} Filled',
    'form.categorySelectorLabel': 'Survey Category (54 Categories & 190 Line IDs)',
    'form.nextIncomplete': 'Next Incomplete',
    'form.guideNever': '① Never: [0]',
    'form.guideFreq': '② Freq: [1:Often 2:Fairly 3:Rare]',
    'form.guideOcc': '③ Occ: [1:Home 2:Store 3:Dine]',
    'form.line': 'Line #{id}',
    'form.neverEatenBadge': 'Never',
    'form.freqBadge': 'Freq:{val}',
    'form.occBadge': 'Occ:{val}',
    'form.unselected': '-- Unselected --',
    'form.clearRowTitle': 'Clear this row (Space)',
    'form.neverEatenOption': '① Never eaten',
    'form.key0Badge': 'Key: 0',
    'form.freqGroupLabel': '② Frequency',
    'form.occGroupLabel': '③ Occasion',
    'form.freq1': '1: Often',
    'form.freq2': '2: Fairly often',
    'form.freq3': '3: Seldom',
    'form.occ1': '1: Homemade',
    'form.occ2': '2: Prepared/Store',
    'form.occ3': '3: Dining out',
    'form.copyTsv': 'Copy TSV (Excel 3-Cols)',
    'form.clearCategory': 'Clear Category',
    'form.downloadCsv': 'Download 1984 Survey CSV (3 Cols/Item)',

    // Category Matrix Modal
    'modal.matrixTitle': 'All 54 Categories Progress Matrix',
    'modal.matrixSubtitle': 'Click any category to jump immediately to its entry form',
    'modal.filterAll': 'All ({count})',
    'modal.filterIncomplete': 'Incomplete ({count})',
    'modal.filterComplete': 'Completed ({count})',
    'modal.overallProgress': 'Overall Progress',
    'modal.matrixItemStatus': '{filled}/{total} items',

    // Incomplete Warning Modal
    'modal.warningTitle': 'Incomplete Categories Detected',
    'modal.warningSubtitle': 'The following categories contain unselected items',
    'modal.warningFilled': '{filled} / {total} filled',
    'modal.returnToForm': 'Return to Form',
    'modal.forceExport': 'Export CSV with Blanks',

    // Document Viewer
    'viewer.uploadTitle': 'Upload Survey PDF or Image',
    'viewer.uploadDesc': 'Click or drag & drop your PDF or image file here.\n(Multi-page navigation and zoom supported)',
    'viewer.selectFile': 'Select File',
    'viewer.openSample': 'Open Sample Form',

    // Toasts
    'toast.tsvCopied': 'Copied TSV to clipboard (3 columns per item for Excel)',
    'toast.categoryCleared': 'Cleared inputs for "{cat}"',
    'toast.allCompleted': 'All 190 items completed! Ready for CSV export.',
    'toast.selectionBoxCleared': 'Selection box cleared',
    'toast.jumpNext': 'Jumped to next incomplete: {cat}',
    'toast.pdfRenderError': 'Failed to render PDF page',
    'toast.sampleLoaded': 'Loaded sample 1984 survey form',
    'toast.csvDownloaded': '1984 Survey CSV downloaded successfully!'
  }
} as const;

export type TranslationKey = keyof typeof translations.ja;

export function getCategoryLabel(catJa: string, lang: Language): string {
  const match = CATEGORY_TRANSLATIONS[catJa];
  if (match) {
    return lang === 'en' ? match.en : match.ja;
  }
  return catJa;
}
