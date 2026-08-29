const test = require('node:test')
const assert = require('node:assert')
const { apcaContrast, apcaInverse } = require('../src/color/apca.js')
const CCAColor = require('../src/color/CCAcolor.js')

// Reference Lc values verified against the official apca-w3 v0.1.9 library.
test('APCA polarity: dark text on light background is positive', () => {
    const r = apcaContrast(CCAColor('#000000'), CCAColor('#ffffff'), { fontSize: 16, fontWeight: 400 })
    assert.ok(r.value > 0, 'dark-on-light should be positive')
})

test('APCA polarity: light text on dark background is negative', () => {
    const r = apcaContrast(CCAColor('#ffffff'), CCAColor('#000000'), { fontSize: 16, fontWeight: 400 })
    assert.ok(r.value < 0, 'light-on-dark should be negative')
})

test('APCA known value: black on white is near the maximum', () => {
    const r = apcaContrast(CCAColor('#000000'), CCAColor('#ffffff'), { fontSize: 16, fontWeight: 400 })
    assert.strictEqual(r.absValue, 100)
})

test('APCA known value: green #008000 on white ≈ 74.6', () => {
    const r = apcaContrast(CCAColor('#008000'), CCAColor('#ffffff'), { fontSize: 16, fontWeight: 400 })
    assert.ok(Math.abs(r.absValue - 74.62) < 0.2, `expected ≈74.62, got ${r.absValue}`)
})

test('APCA known value: white on green is negative mirror', () => {
    const r = apcaContrast(CCAColor('#ffffff'), CCAColor('#008000'), { fontSize: 16, fontWeight: 400 })
    assert.ok(r.value < 0, 'white-on-green should be negative')
    assert.ok(Math.abs(r.absValue - 80.02) < 0.2, `expected ≈80.02, got ${r.absValue}`)
})

test('APCA magnitude is symmetric under polarity swap', () => {
    const dark = apcaContrast(CCAColor('#000000'), CCAColor('#ffffff'))
    const light = apcaContrast(CCAColor('#ffffff'), CCAColor('#000000'))
    assert.strictEqual(dark.absValue, light.absValue)
})

test('APCA large/bold text gets the relaxed large-text tier', () => {
    const small = apcaContrast(CCAColor('#767676'), CCAColor('#ffffff'), { fontSize: 16, fontWeight: 400 })
    const large = apcaContrast(CCAColor('#767676'), CCAColor('#ffffff'), { fontSize: 24, fontWeight: 700 })
    assert.strictEqual(small.level, 'text')
    assert.strictEqual(large.level, 'large')
})

test('APCA inverse returns a hex color', () => {
    const hex = apcaInverse(75, 1.0)
    assert.strictEqual(typeof hex, 'string')
    assert.match(hex, /^#[0-9a-f]{6}$/i)
})
