const culori = require('culori')

// OKLCH / OKLab (CSS Color 4) helpers built on top of culori.
// The internal colour model of CCA stays sRGB-based; these helpers convert
// only at the string boundary (parsing input / formatting output).

const OKLCH_FUNCS = ['oklch', 'oklcha', 'oklab', 'oklaba']

function isOklchString (str) {
    if (typeof str !== 'string') return false
    const lower = str.toLowerCase().trim()
    return OKLCH_FUNCS.some(f => lower.startsWith(f + '(') && lower.endsWith(')'))
}

// Convert an OKLCH/OKLab string to an sRGB hex string (with alpha -> 8 digits),
// or null if it cannot be parsed.
function oklchToHex (str) {
    if (!isOklchString(str)) return null
    let parsed
    try {
        parsed = culori.parse(str)
    } catch (e) {
        return null
    }
    if (!parsed) return null
    const rgb = culori.converter('rgb')(parsed)
    if (!rgb) return null

    const r = Math.round(clamp(rgb.r, 0, 1) * 255)
    const g = Math.round(clamp(rgb.g, 0, 1) * 255)
    const b = Math.round(clamp(rgb.b, 0, 1) * 255)
    const a = typeof parsed.alpha === 'number' ? parsed.alpha : 1

    if (a < 1) {
        const aa = Math.round(clamp(a, 0, 1) * 255).toString(16).padStart(2, '0').toUpperCase()
        return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('') + aa
    }
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('')
}

// Format an sRGB color (r,g,b in 0-255, alpha 0-1) as an OKLCH/OKLab string.
function rgbToOklch (r, g, b, alpha, format = 'oklch', includeAlpha = false) {
    const rgb = { mode: 'rgb', r: r / 255, g: g / 255, b: b / 255, alpha: typeof alpha === 'number' ? alpha : 1 }
    const target = format === 'oklab' ? culori.converter('oklab')(rgb) : culori.converter('oklch')(rgb)
    if (!target) return null

    const l = formatNumber(target.l, 3)
    const c = formatNumber(target.c === undefined ? target.a : target.c, 4)
    const h = target.h === undefined ? '' : formatNumber(target.h, 2)
    const a = (includeAlpha && typeof alpha === 'number') ? formatNumber(alpha, 3) : ''

    if (format === 'oklab') {
        return `oklab(${l} ${c}${h ? ' ' + h : ''}${a ? ' / ' + a : ''})`
    }
    return `oklch(${l} ${c} ${h}${a ? ' / ' + a : ''})`
}

function clamp (v, min, max) {
    return Math.min(Math.max(v, min), max)
}

function formatNumber (num, dec) {
    const val = round(num, dec)
    return String(val)
}

function round (num, dec) {
    return Number(num.toFixed(dec))
}

module.exports = { isOklchString, oklchToHex, rgbToOklch, OKLCH_FUNCS }
