# Novedades

Resumen de los cambios incorporados en las dos últimas sesiones.

## Sesión 1: Contraste avanzado — APCA, OKLCH/OKLab, sugerencia de color y WCAG 2.2

### APCA (Advanced Perceptual Contrast Algorithm)

- Sustitución del cálculo APCA casero por la librería oficial **`apca-w3`** (`src/color/apca.js`).
- Nuevos **selectores de tipografía** en la sección de resultados APCA: tamaño de fuente (14–48 px) y peso (100–900). El nivel APCA ahora depende de la tipografía elegida.
- Nuevas claves de configuración `apca.fontSize` y `apca.fontWeight` en el store (`src/main.js`) y handlers `changeAPCAFont` en el controlador.
- Clasificación por niveles actualizada: `Preferred (≥90)`, `Body text (≥75)`, `Text (≥60)`, `Large text (≥45/≥60)`, `Low contrast (≥15/≥45)`, `UI / non-text (≥30)`, `Fail (<15)`. El umbral se relaja para texto grande o en negrita (≥24 px o peso ≥700), como hace WCAG/APCA.
- Nueva **polaridad**: "Dark text on light background" / "Light text on dark background", corregida la fórmula para luz sobre fondo oscuro.
- Nota informativa: APCA es una métrica de guía de diseño (candidata a WCAG 3), no un requisito de conformidad; se sigue usando WCAG 2.x como norma.
- Los **resultados copiados** ahora incluyen la línea APCA (`%apca%: %apca% (%apcaLevel%)`), insertada automáticamente aunque la plantilla guardada sea anterior al soporte APCA.
- Nueva plantilla en Preferencias con los campos `%apca%` y `%apcaLevel%`.

### OKLCH / OKLab (CSS Color 4)

- Nuevo módulo `src/color/oklch.js` basado en **`culori`**: parsea `oklch()/oklcha()/oklab()/oklaba()` y convierte al modelo sRGB interno de CCA.
- Formatos nuevos en el selector de primer plano: OKLCH, OKLCHa, OKLab, OKLaba; en fondo: OKLCH y OKLab.
- Normalización de entrada con `Color.parseString` (strings OKLCH → hex sRGB) y validación con `isOklchString`/`mapOklchFormat`.
- Nueva dependencia: `culori`.

### Sugerencia de color accesible (WCAG AA, ratio objetivo 4.5:1)

- Botones **Foreground / Background** en la sección APCA: proponen un color alternativo que cumple el ratio objetivo manteniendo el tono y la saturación del color fijo, variando la luminosidad (HSL) entre blanco y negro.
- Se muestran hasta **6 muestras alternativas clicables** (swatches), ordenadas de mayor a menor contraste.
- Handler `suggestColor` + `buildSwatches` en el controlador; eventos `suggestionApplied` y `renderSuggestionSwatches` en la vista; estilos para la herramienta de sugerencias en `src/views/css/main.css`.

### WCAG 2.2 — 2.4.11 Focus Appearance (AA)

- Nuevo criterio con resultado **Pass/Fail** según el contraste del indicador de foco (≥ 3:1) (`src/CCAcontroller.js`, `src/views/main.html`, `src/views/js/main.js`).

### Tests automatizados

- Nuevos archivos `test/apca.test.js` y `test/wcag.test.js` (framework `node:test`): polaridad APCA, valores de referencia (negro/blanco = 100, verde #008000 ≈ 74.62), simetría, tier para texto grande, APCA inverso y contrastes WCAG 2.x (21:1, 1:1, verde ≈ 5.137, niveles AA/AAA).
- `package.json`: script `test` pasa a `node --test`.
- Nuevas dependencias: `apca-w3`, `culori`, `colorparsley`.

### Traducciones

- Nuevas claves en los 14 idiomas: niveles APCA, tipografía APCA, 2.4.11 (incluido `sc_2_4_11`), formatos OKLCH/OKLab, herramienta de sugerencias y textos de actualización (`Title`, `Version {version} is available.`, `More details`, `Download`).

## Sesión 2: Accesibilidad — traducción y nombres de los controles de color (sliders)

Se revisaron los inputs de tipo `number` que ajustan los colores de primer plano y de fondo al desplegar los sliders en la página principal. Los `aria-label` de esos campos estaban en inglés y además eran idénticos a los del deslizador correspondiente, lo que confundía a los lectores de pantalla.

### Cambios

- **Traducción de los campos numéricos** (`src/views/js/main.js`)
  - El bucle de traducción de `translateHTML()` ahora selecciona `input[type="range"], input[type="number"]`, por lo que tanto los deslizadores como sus campos de valor reciben el `aria-label` traducido.

- **Nombres accesibles diferenciados** (`src/views/main.html`)
  - Los 21 inputs numéricos pasan de `aria-label="… input"` a `aria-label="… value"`.
  - Ahora el deslizador (rango) y el campo numérico tienen nombres accesibles distintos, facilitando su identificación con lectores de pantalla.

- **Corrección de etiqueta visible sin traducir** (`src/views/main.html`)
  - La etiqueta "Hue" del panel Background HSV usaba la clase `slide-label` en vez de `slider-lb`, por lo que no se traducía. Corregido.

- **Nuevas claves de traducción** (`src/views/translations/*.json`, 14 idiomas)
  - Añadidas 17 claves `… value` por idioma (9 de primer plano y 8 de fondo) correspondientes a los campos numéricos: `en`, `es`, `de`, `fr`, `it`, `pt-BR`, `nl`, `pl`, `hu`, `ru`, `ja`, `ko`, `zh-CN`, `zh-TW`.
  - Ejemplos en español: `Foreground red value` → "Valor del rojo de primer plano", `Background hue value` → "Valor del tono de fondo".

### Archivos modificados (Sesión 2)

- `src/views/js/main.js`
- `src/views/main.html`
- `src/views/translations/en.json`
- `src/views/translations/es.json`
- `src/views/translations/de.json`
- `src/views/translations/fr.json`
- `src/views/translations/it.json`
- `src/views/translations/pt-BR.json`
- `src/views/translations/nl.json`
- `src/views/translations/pl.json`
- `src/views/translations/hu.json`
- `src/views/translations/ru.json`
- `src/views/translations/ja.json`
- `src/views/translations/ko.json`
- `src/views/translations/zh-CN.json`
- `src/views/translations/zh-TW.json`

### Verificación

- Los 14 archivos JSON se validaron (parseo correcto y presencia de las 17 claves).
- No se ejecutaron `npm test` porque `node`/`npm` no están disponibles en el PATH de la sesión. Los tests existentes (`test/apca.test.js`, `test/wcag.test.js`) cubren matemática de color y no se ven afectados por estos cambios.
- Comprobación manual pendiente: `npm start` → abrir los sliders de primer plano/fondo en cada pestaña (RGB/HSL/HSV) y cambiar el idioma a Español.

## Cómo probar la nueva herramienta

### Requisitos previos

- Node.js y un gestor de paquetes (`npm`, `yarn` o `pnpm`).
- Instalar dependencias: `npm install` (o `yarn`).
- Arrancar la app en modo desarrollo: `npm start` (lanza Electron).

### Tests automatizados

```bash
npm test        # equivalente a: node --test
```

Deben pasar los dos archivos de test del directorio `test/`:

- `test/apca.test.js` — polaridad APCA (texto oscuro sobre claro = positivo, claro sobre oscuro = negativo), valores de referencia (negro sobre blanco = 100, verde `#008000` ≈ 74.62), simetría del valor absoluto, tier para texto grande/negrita y APCA inverso.
- `test/wcag.test.js` — contrastes WCAG 2.x de referencia (blanco/negro = 21:1, mismo color = 1:1, verde `#008000` ≈ 5.137) y niveles AA/AAA.

Si algún test falla, lo habitual será un ajuste en `src/color/apca.js` o en la conversión de color, no en la interfaz.

### Prueba manual del APCA (con tipografía)

1. `npm start` y elige dos colores (p. ej. primer plano negro `#000000` y fondo blanco `#FFFFFF`).
2. En la sección **APCA results** comprueba:
   - El valor APCA y el nivel (debe ser "Preferred" para negro/blanco).
   - La **polaridad** ("Dark text on light background" / "Light text on dark background") según qué color es más claro.
   - El desglose por niveles (AAA/AA/Text/Large text/UI).
3. Cambia **Font size** (14 → 48 px) y **Weight** (400 → 700+): el nivel debe relajarse a "Large text" para tamaños ≥ 24 px o pesos ≥ 700 con el mismo valor de contraste.
4. Cambia la combinación a primer plano blanco / fondo negro y comprueba que la polaridad se invierte y el valor es negativo.
5. Copia los resultados (Ctrl+Shift+C) y verifica que la línea APCA (`APCA contrast: <valor> (<nivel>)`) aparece aunque la plantilla guardada sea antigua. En **Preferencias** puedes confirmar que la plantilla incluye `%apca%` y `%apcaLevel%`.

### Prueba manual del sugeridor de color accesible

1. En la sección **APCA results**, pulsa **Foreground** (o **Background**).
2. Verifica que aparece el mensaje "Color sugerido" con el valor en RGB y su ratio (≥ 4.5:1 para WCAG AA), o el mensaje de "no se encontró ningún color accesible" si el destino es inalcanzable.
3. Confirma que se muestra una fila de hasta **6 muestras** (swatches) clicables.
4. Haz clic en una muestra: el color del primer plano (o fondo) debe actualizarse y el contraste recalculado.
5. Prueba de regresión: con un color fijo extremo (p. ej. fondo negro puro) el sugeridor debe proponer blancos/grises muy claros; el tono/saturación del color fijo se mantiene.

### Prueba manual de OKLCH / OKLab

1. En el selector de formato de primer plano elige **OKLCH** (fondo: **OKLCH** u **OKLab**).
2. Escribe en el campo de valor una cadena válida, p. ej. `oklch(70% 0.1 240)` o `oklab(70% 0.05 -0.1)`. El color debe aplicarse y el campo no debe marcar error de formato.
3. Comprueba el resultado copiado y el cambio en los sliders RGB/HSL/HSV: la app convierte internamente a sRGB hex.
4. Escribe una cadena con alpha, p. ej. `oklch(70% 0.1 240 / 0.5)` (o `oklcha(...)`): debe detectarse el formato con alfa.
5. Escribe un valor inválido (`oklch(999)`): debe mostrarse el aviso de formato incorrecto y conservarse el color anterior.
6. Verifica que los deslizadores siguen mostrando valores coherentes (los sliders siguen en RGB/HSL/HSV; OKLCH es solo entrada/salida).

### Prueba manual de WCAG 2.2 — 2.4.11 Focus Appearance

1. Busca el apartado **2.4.11 Focus Appearance (Minimum) (AA)** en **WCAG 2.1 results** (nota: la sección sigue etiquetada como WCAG 2.1; el criterio es WCAG 2.2).
2. Con un contraste ≥ 3:1 entre primer plano y fondo debe marcar **Pass**; por debajo, **Fail**.
3. Puedes usar una pareja conocida: `#767676` sobre `#FFFFFF` (≈ 4.6:1) → Pass; grises casi iguales (≈ 1:1) → Fail.

### Prueba manual de la traducción de sliders (Sesión 2)

1. En **Preferencias → Idioma** selecciona Español y reinicia (o recarga la ventana).
2. Pulsa el botón de **sliders** en primer plano y en fondo y abre las pestañas RGB, HSL y HSV.
3. Comprueba:
   - Las **etiquetas visibles** están traducidas (Rojo, Verde, Azul, Alfa, Tono, Saturación, Claridad, Valor) — incluyendo el panel Background HSV (antes "Hue" quedaba en inglés).
   - Con un lector de pantalla (o inspeccionando el DOM con DevTools), los **deslizadores** anuncian p. ej. "Rojo de primer plano" y los **campos numéricos** "Valor del rojo de primer plano": nombres accesibles distintos e identificables.
4. Alterna el idioma entre Español e Inglés: los aria-label deben cambiar en ambos sentidos sin recargar la app.