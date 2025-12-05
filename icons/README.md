# PWA Icons

Lege hier deine eigenen App-Icons ab:

## Benötigte Größen (für vollständige PWA-Unterstützung):
- `icon-72.png` (72x72)
- `icon-96.png` (96x96)
- `icon-128.png` (128x128)
- `icon-144.png` (144x144)
- `icon-152.png` (152x152)
- `icon-192.png` (192x192) **Pflicht**
- `icon-384.png` (384x384)
- `icon-512.png` (512x512) **Pflicht**

## Design-Empfehlung:
- **Hintergrund:** Dunkel (#1a1a2e)
- **Akzentfarbe:** Orange (#ff6b35)
- **Symbol:** Hantel, Flamme oder "FT" Logo
- **Format:** PNG mit transparentem Hintergrund oder Vollfarbe

## Tools zum Erstellen:
- [Canva](https://canva.com) - Einfach und kostenlos
- [Figma](https://figma.com) - Professionell und kostenlos
- [PWA Asset Generator](https://pwa-asset-generator.vercel.app/) - Generiert alle Größen

Nach dem Hinzufügen der Icons, aktualisiere die `manifest.json` Datei:

```json
"icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
]
```
