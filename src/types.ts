export type Language = 'ja' | 'en';

export interface CategorySpec {
  cat: string;
  ids: number[];
}

export interface SurveyItem {
  colIndex: number;
  cat: string;
  id: number;
}

export interface SurveyRowData {
  never_eaten: boolean;     // 1: 食べたことない -> 1 if selected
  frequency: number | null; // 2: 頻度 (1: よく食べる, 2: 割合よく食べる, 3: あまり食べない)
  occasion_home: boolean;   // 3: 機会 (家) -> 1 if selected
  occasion_store: boolean;  // 4: 機会 (調理) -> 1 if selected
  occasion_out: boolean;    // 5: 機会 (外食) -> 1 if selected

  // Backward compatibility aliases
  neverEaten?: boolean;
  notEaten?: boolean;
  occasion?: 1 | 2 | 3 | null;
}

export type SurveyRowAnswer = SurveyRowData;

export function createDefaultSurveyRow(): SurveyRowData {
  return {
    never_eaten: false,
    neverEaten: false,
    notEaten: false,
    frequency: null,
    occasion_home: false,
    occasion_store: false,
    occasion_out: false,
    occasion: null
  };
}

export interface CategoryStatus {
  cat: string;
  filled: number;
  total: number;
  isComplete: boolean;
  isStarted: boolean;
}

export interface SelectionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning';
}

export type ToolType = 'draw' | 'pan';
