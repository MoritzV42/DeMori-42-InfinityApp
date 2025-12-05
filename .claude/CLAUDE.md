# DeMori Fitness Tracker - Projektdokumentation

## Projektübersicht

PWA-basierte Fitness-Habit-Tracker-App für **Denise (20)** und **Moritz (22)** mit dem Ziel, einen 4-Monats-Trainings- und Ernährungsplan zu verfolgen.

## Technologie-Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (keine Frameworks)
- **Styling:** CSS mit BEM-Konvention, Dunkles Theme (#1a1a2e + #ff6b35)
- **Datenspeicherung:** localStorage (JSON)
- **PWA:** Service Worker für Offline-Support und Push-Notifications
- **Deployment:** Lokal / Raspberry Pi / Cloudflare Workers

## Dateistruktur

```
DeMori-42-InfinityApp/
├── index.html              # Haupt-HTML mit allen Screens und Modals
├── styles.css              # Vollständiges CSS (BEM-Konvention)
├── manifest.json           # PWA-Manifest
├── sw.js                   # Service Worker
├── js/
│   ├── config.js           # Konstanten, Trainingspläne, Quotes, Defaults
│   ├── data.js             # localStorage CRUD-Operationen (DataManager)
│   ├── calendar.js         # Kalender-Rendering und Navigation
│   ├── streaks.js          # Streak-Berechnung und Statistiken
│   ├── notifications.js    # Push-Benachrichtigungen
│   └── app.js              # Haupt-Controller, Event-Handling
├── icons/                  # PWA-Icons (vom Nutzer bereitzustellen)
└── .claude/
    └── CLAUDE.md           # Diese Dokumentation
```

## Nutzerprofile

### Denise (20 Jahre)
- **Ziele:** Muskelaufbau, Körperfett reduzieren, Schlafqualität verbessern
- **Körperdaten:** 168 cm, 53 kg, ~20-24% KFA, Mesomorph
- **Ernährung:** ~1550 kcal/Tag, >100g Protein, Schlaf vor 23:30
- **Training:** Mo/Mi/Fr Kraft, Di Boxen, So Cardio
- **Besonderheiten:** Asthma, Laktoseintoleranz
- **Equipment:** Kurzhanteln bis 18kg, Yogamatte, Home-Gym

### Moritz (22 Jahre)
- **Ziele:** Muskelaufbau, Leistungssteigerung, mehr Energie
- **Körperdaten:** 189 cm, 71 kg, ~15% KFA, Endomorph
- **Ernährung:** ~2900 kcal/Tag, >130g Protein, <2500 kcal Limit
- **Training:** Di/Mi/Fr Kraft, Sa Bouldern, Jiu-Jitsu (wechselnd)
- **Besonderheiten:** Schichtarbeit (Früh/Spät), unregelmäßiger Alltag
- **Equipment:** Kurzhanteln bis 18kg, Schrägbank, Klimmzugstange, Dip-Barren

## Core Features

### 1. Tägliche Checkliste
- Training gemäß Plan (Ja/Nein)
- Protein-Ziel erreicht (Ja/Nein)
- Schlaf-Ziel (nur Denise)
- Kalorien-Limit (nur Moritz)

### 2. Kalender
- Monatsansicht mit Farbcodierung
- Grün = alle Ziele erreicht
- Gelb = teilweise erreicht
- Rot = nicht erreicht
- Montag als Wochenstart (europäisch)

### 3. Streak-System
- Individual-Streaks pro Habit
- Gesamt-Streak (alle Ziele)
- Längster Streak ever
- Motivierende Nachrichten bei Streak-Break

### 4. Badges/Gamification
- 7 Tage: "Woche geschafft"
- 14 Tage: "2 Wochen stark"
- 30 Tage: "Monats-Champion"
- 100 Tage: "Gewohnheits-Meister"
- + Training/Protein-spezifische Badges

### 5. Wöchentliche Körperdaten
- Gewicht (kg)
- Körperfettanteil (%)
- Grafischer Verlauf über Zeit

### 6. Fortschrittsfotos
- Wöchentliche Pflicht-Fotos
- Gespeichert lokal
- Vergleichsansicht

### 7. Detaillierter Trainingsplan
- Konkrete Übungen pro Tag
- Sätze und Wiederholungen
- Progressive Overload Tracking

### 8. Push-Notifications
- Morgen-Reminder (09:00)
- Abend-Reminder (21:00)
- Motivationssprüche

## Datenmodell (localStorage)

```javascript
{
  "currentUser": "denise",
  "users": {
    "denise": {
      "name": "Denise",
      "goals": { protein: 100, sleepBefore: "23:30", caloriesMax: null },
      "schedule": { "1": ["strength"], ... },
      "entries": { "2025-12-01": { training: true, protein: true, ... } },
      "streaks": { training: {current, longest}, ... },
      "badges": [{ id, earnedAt }],
      "measurements": [{ date, weight, bodyFat }],
      "photos": [{ date, dataUrl }]
    },
    "moritz": { ... }
  },
  "settings": { notificationsEnabled, morningReminderTime, eveningReminderTime }
}
```

## Entwicklungsrichtlinien

1. **Mobile-First:** Optimiert für Smartphone-Nutzung
2. **Offline-First:** Service Worker cached alle Assets
3. **Keine externen Abhängigkeiten:** Pure Vanilla JS
4. **Motivierend, nicht demotivierend:** Positive Sprüche bei Rückschlägen
5. **80/20-Prinzip:** Fokus auf Kernfunktionen

## Commands

```bash
# Lokaler Server starten
python -m http.server 8000

# Dann öffnen
http://localhost:8000
```

## Wichtige Hinweise

- Service Worker benötigt HTTPS oder localhost für Push-Notifications
- Icons müssen vom Nutzer bereitgestellt werden (192x192, 512x512 PNG)
- Fortschrittsfotos werden als Base64 in localStorage gespeichert (Speicherlimit beachten)
