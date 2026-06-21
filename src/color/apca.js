function sRGBtoY(r, g, b) {
    function linearize(v) {
        v = v / 255
        if (v <= 0.04045) return v / 12.92
        return Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max)
}

function getAPCALevel(absLc) {
    if (absLc >= 90) return { level: 'AAA', label: 'Preferred (AAA)' }
    if (absLc >= 75) return { level: 'AA', label: 'Good (AA)' }
    if (absLc >= 60) return { level: 'text', label: 'Text' }
    if (absLc >= 45) return { level: 'large', label: 'Large text' }
    if (absLc >= 30) return { level: 'ui', label: 'UI components' }
    if (absLc >= 15) return { level: 'low', label: 'Low contrast' }
    return { level: 'fail', label: 'Fail' }
}

function apcaContrast(fgColor, bgColor) {
    const textRGB = fgColor.rgb().color
    const bgRGB = bgColor.rgb().color

    const textY = sRGBtoY(textRGB[0], textRGB[1], textRGB[2])
    const bgY = sRGBtoY(bgRGB[0], bgRGB[1], bgRGB[2])

    const isDarkText = textY < bgY

    let Lc
    if (isDarkText) {
        Lc = (Math.pow(bgY, 0.56) - Math.pow(textY, 0.57)) * 1.14 * 100
    } else {
        Lc = (Math.pow(bgY, 0.56) - Math.pow(textY, 0.57)) * 1.14 * 100
    }

    Lc = Math.round(clamp(Math.abs(Lc), 0, 100) * 100) / 100

    const levelData = getAPCALevel(Lc)

    return {
        value: isDarkText ? Lc : -Lc,
        absValue: Lc,
        level: levelData.level,
        levelLabel: levelData.label
    }
}

module.exports = { apcaContrast }
