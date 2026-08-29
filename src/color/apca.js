const { APCAcontrast, sRGBtoY, fontLookupAPCA, reverseAPCA } = require('apca-w3')

// APCA recommended / minimum thresholds (Bronze "Simple Mode" + guidance).
// Guidance based on the current APCA "Readability Criterion" drafts.
// NOTE (2026): APCA is a candidate / design-guidance metric, NOT a finalized
// WCAG 3 conformance requirement (the WCAG 3 contrast algorithm is still
// marked "Exploratory" by the W3C). Keep WCAG 2.x as the normative standard.

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

function colorToY (color) {
    const rgb = color.rgb().color
    return sRGBtoY([rgb[0], rgb[1], rgb[2]])
}

function clamp (v, min, max) {
    return Math.min(Math.max(v, min), max)
}

// Minimum font size (px) required for the given Lc and weight, from the
// official APCA font lookup table (index [1..9] map to weights 100..900).
function minFontSizeFor (absLc, weight) {
    const array = fontLookupAPCA(absLc)
    if (!array) return null
    const idx = WEIGHTS.indexOf(weight)
    if (idx === -1) return null
    return array[idx + 1]
}

// Minimum Lc required for the given font size + weight to be fluently readable.
// We invert the lookup table: find the smallest Lc whose required font size
// <= the chosen size. Weight is clamped 100..900.
// NOTE: this follows the strict "fluent readability" table; used only to expose
// "required Lc" as guidance, not to change the tier classification.
function minLcFor (fontSize, weight) {
    const w = clamp(Math.round((weight || 400) / 100) * 100, 100, 900)
    const size = fontSize || 16
    for (let lc = 90; lc >= 15; lc--) {
        const needed = minFontSizeFor(lc, w)
        if (needed !== null && needed <= size) {
            return lc
        }
    }
    return 15
}

// Classify an Lc (+ typography) into a semantic band for display.
// Large / bold text (>=24px or weight 700+) qualifies for the lower "large
// text" threshold, mirroring the way WCAG/APCA relax contrast for large text.
function getAPCALevel (absLc, fontSize, fontWeight) {
    const largeOrBold = (fontWeight >= 700) || (fontSize >= 24)

    if (absLc >= 90) return { level: 'AAA', label: 'Preferred (≥90)' }
    if (absLc >= 75) return { level: 'AA', label: 'Body text (≥75)' }
    if (absLc >= 60) {
        if (largeOrBold) return { level: 'large', label: 'Large text (≥60)' }
        return { level: 'text', label: 'Text (≥60)' }
    }
    if (absLc >= 45) {
        if (largeOrBold) return { level: 'large', label: 'Large text (≥45)' }
        return { level: 'low', label: 'Low contrast (≥45)' }
    }
    if (absLc >= 30) return { level: 'ui', label: 'UI / non-text (≥30)' }
    if (absLc >= 15) return { level: 'low', label: 'Low contrast (≥15)' }
    return { level: 'fail', label: 'Fail (<15)' }
}

// Main entry point. fgColor and bgColor are CCA "Color" object instances.
// options: { fontSize (px), fontWeight (100-900) }
function apcaContrast (fgColor, bgColor, options = {}) {
    const fontSize = options.fontSize || 16
    const fontWeight = options.fontWeight || 400

    const textY = colorToY(fgColor)
    const bgY = colorToY(bgColor)

    const Lc = APCAcontrast(textY, bgY)
    const absLc = clamp(Math.abs(Lc), 0, 100)
    const rounded = Math.round(absLc * 100) / 100

    const isDarkText = textY < bgY
    const levelData = getAPCALevel(rounded, fontSize, fontWeight)

    return {
        value: isDarkText ? rounded : -rounded,
        absValue: rounded,
        level: levelData.level,
        levelLabel: levelData.label,
        fontSize,
        fontWeight,
        requiredFontSize: minFontSizeFor(rounded, fontWeight),
        polarity: isDarkText ? 'dark-text' : 'light-text'
    }
}

// Converts an Lc value + a known background luminance to an sRGB hex color.
// Used by the inverse-contrast tool. Returns a hex string or false.
function apcaInverse (targetLc, bgY, knownType = 'bg') {
    return reverseAPCA(targetLc, bgY, knownType, 'hex')
}

module.exports = { apcaContrast, apcaInverse, colorToY, minFontSizeFor, minLcFor }
