const Color = require('./color.js') // https://github.com/Qix-/color/
const cssKeywords = require('color-name');
const blinder = require('color-blind');
const { apcaContrast } = require('./apca.js')
const { isOklchString, oklchToHex, rgbToOklch } = require('./oklch.js')

Color.prototype.real = null
Color.prototype.displayedValue = null

Color.prototype.setReal = function(bg) {
    this.real = this.alphaBg(bg)
}

Color.prototype.getReal = function() {
    if (this.real != null) {
        return this.real
    } else {
        return this
    }
}

Color.prototype.protanopia = function() {
    let rgb = blinder.protanopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.deuteranopia = function() {
    let rgb = blinder.deuteranopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.tritanopia = function() {
    let rgb = blinder.tritanopia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.protanomaly = function() {
    let rgb = blinder.protanomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.deuteranomaly = function() {
    let rgb = blinder.deuteranomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.tritanomaly = function() {
    let rgb = blinder.tritanomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.achromatopsia = function() {
    let rgb = blinder.achromatopsia(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.achromatomaly = function() {
    let rgb = blinder.achromatomaly(this.hex(), true);
    return Color.rgb(rgb.R, rgb.G, rgb.B)
}

Color.prototype.getColorTextString=function (format) {
    switch (format) {
        case 'rgb':
            return this.getReal().rgb().string()
        case 'rgba':
            return this.rgb().string(undefined,true)
        case 'hsl':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return this.getReal().hsl().round().string()
        case 'hsla':
            // Return rounded values for HSL. This is due to a bug in `color-string` Qix-/color#127
            return this.hsl().round().string(undefined,true)
        case 'hsv':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return this.getReal().hsv().round().string()
        case 'hsva':
            // Return rounded values for HSV. This is due to a bug in `color-string` Qix-/color#127
            return this.hsv().round().string(undefined,true)
        case 'hexa':
            return this.hexa()
        case 'oklch':
            return rgbToOklch(this.getReal().red(), this.getReal().green(), this.getReal().blue(), this.getReal().alpha(), 'oklch', false)
        case 'oklcha':
            return rgbToOklch(this.red(), this.green(), this.blue(), this.alpha(), 'oklch', true)
        case 'oklab':
            return rgbToOklch(this.getReal().red(), this.getReal().green(), this.getReal().blue(), this.getReal().alpha(), 'oklab', false)
        case 'oklaba':
            return rgbToOklch(this.red(), this.green(), this.blue(), this.alpha(), 'oklab', true)
        default: //hex
            return this.getReal().hex()
    }
}

Color.prototype.apcaContrast = function(otherColor, options) {
    return apcaContrast(this.getReal(), otherColor, options)
}

/* Normalize an input colour string. OKLCH/OKLab strings are converted to sRGB
   hex so they can be stored/analysed in CCA's internal sRGB model. Non-OKLCH
   strings are returned unchanged. */
Color.parseString = function (str) {
    const hex = oklchToHex(str)
    return hex || str
}

module.exports = Color