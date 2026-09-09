export interface CategorySpec {
  cat: string;
  ids: number[];
}

export interface SurveyItem {
  colIndex: number;
  cat: string;
  id: number;
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
