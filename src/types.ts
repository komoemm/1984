export interface CategorySpec {
  cat: string;
  ids: number[];
}

export interface SurveyItem {
  colIndex: number;
  cat: string;
  id: number;
}

export interface SurveyRowAnswer {
  notEaten: boolean;            // 1: 食べたことがない
  frequency: 1 | 2 | 3 | null;  // 1: よく食べる, 2: 割合よく食べる, 3: あまり食べない
  occasion: 1 | 2 | 3 | null;   // 1: 家で作る, 2: 調理したものを買う, 3: 外食
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
