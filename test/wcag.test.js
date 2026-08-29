const test = require('node:test')
const assert = require('node:assert')
const Color = require('../src/color/color.js')

// WCAG 2.x relative luminance + contrast ratio reference values.
test('WCAG contrast: black vs white is 21:1', () => {
    assert.strictEqual(Color('#000000').contrast(Color('#ffffff')), 21)
})

test('WCAG contrast: same colour is 1:1', () => {
    assert.strictEqual(Color('#3366aa').contrast(Color('#3366aa')), 1)
})

test('WCAG contrast: green #008000 on white ≈ 5.14', () => {
    const cr = Color('#008000').contrast(Color('#ffffff'))
    assert.ok(Math.abs(cr - 5.137) < 0.01, `expected ≈5.137, got ${cr}`)
})

test('WCAG contrast is symmetric (order independent)', () => {
    const a = Color('#123456').contrast(Color('#fedcba'))
    const b = Color('#fedcba').contrast(Color('#123456'))
    assert.strictEqual(a, b)
})

test('WCAG levels: AA regular threshold 4.5', () => {
    // ~4.6:1 pair (source: W3C examples)
    const cr = Color('#767676').contrast(Color('#ffffff'))
    assert.strictEqual(Color('#767676').level(Color('#ffffff')), 'AA')
    assert.ok(cr >= 4.5)
})

test('WCAG levels: AAA requires 7:1', () => {
    assert.strictEqual(Color('#000000').level(Color('#ffffff')), 'AAA')
})
