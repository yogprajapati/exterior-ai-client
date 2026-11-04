const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });

export const formatInr = (value: number): string => inr.format(value);
export const formatNumber = (value: number): string => decimal.format(value);

export const pluralize = (word: string): string => (word.endsWith("y") ? `${word.slice(0, -1)}ies` : `${word}s`);
