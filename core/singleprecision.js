export function float(n) {
    return Math.fround(n);
}
export function float_mult(a, b) {
    a = Math.fround(a);
    b = Math.fround(b);
    return Math.fround(a*b);
}
