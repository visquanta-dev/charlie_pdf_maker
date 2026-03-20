export const brand = {
  colors: {
    primary: "#1B2A4A",
    accent: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
} as const;

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `***-***-${digits.slice(-4)}`;
}
