export const removeDecimal = (val: string): string => {
    const index = val.indexOf('.');
    if (index === -1) return val;
    return val.slice(0, index);
}