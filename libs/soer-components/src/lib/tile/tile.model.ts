export type TileStatus = 'normal' | 'critical' | 'warning' | 'none'

export interface TileModel {
  title: string;
  suffix?: string;
  status: TileStatus;
  value: string | number;
}
