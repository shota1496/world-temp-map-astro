// 月平均気温(℃)から、服装の「目安」を返す。体感には個人差・天候差があります。
export function clothingHint(temp) {
  if (temp < 5) return "厚手のコート・手袋";
  if (temp < 12) return "コート・マフラー";
  if (temp < 18) return "薄手の上着・長袖";
  if (temp < 25) return "長袖〜半袖";
  return "半袖・暑さ対策";
}

export const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
