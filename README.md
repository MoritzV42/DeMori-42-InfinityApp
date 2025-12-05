# DeMori Fitness Tracker

Personalisierte Fitness- und Habit-Tracking Progressive Web App (PWA) - maßgeschneidert für Denise und Moritz.

## Features

### Tägliches Tracking
- Training abhaken (gemäß individuellem Wochenplan)
- Protein-Ziel erreicht
- Schlafzeit eingehalten (Denise)
- Kalorien unter Maximum (Moritz)

### Streak-System
- **5 verschiedene Streaks**: Training, Protein, Schlaf, Kalorien, Overall
- Motivierende Nachrichten bei Erfolg
- Aufmunternde Sprüche bei Streak-Unterbrechung
- Meilenstein-Zitate (7, 14, 21, 30, 60, 100 Tage)

### 14 Badges zum Freischalten
- Streak-basiert: Erster Schritt, Woche geschafft, 21 Tage, Monats-Champion, ...
- Aktivitätsbasiert: Training-Pro, Protein-Profi, Foto-Dokumentar, ...

### Kalender
- Monatsübersicht mit Farbcodierung
- Grün = alle Ziele erreicht
- Orange = teilweise erreicht
- Rot = nicht erreicht
- Blauer Rahmen = heute

### Wöchentliche Pflichten
- **Körperdaten**: Gewicht und Körperfettanteil eintragen
- **Fortschrittsfoto**: Wöchentliches Foto dokumentieren
- Status-Anzeige auf Dashboard

### Trainingsplan
- Detaillierte Übungen pro Tag
- Sätze, Wiederholungen, Zielmuskel
- Personalisiert für Denise und Moritz:
  - **Denise**: 3x Ganzkörper-Kraft, Boxen, HIIT
  - **Moritz**: 3x Ganzkörper-Kraft, Jiu-Jitsu, Bouldern

### Fortschritts-Charts
- Gewichtsverlauf über Zeit
- Körperfett-Verlauf
- Foto-Galerie mit Viewer

### Einstellungen
- Push-Benachrichtigungen (Morgen/Abend)
- Ziele anpassen (Protein, Schlaf, Kalorien)
- Trainingsplan bearbeiten
- Daten exportieren/importieren
- Profil-Übersicht

## Technologie

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Keine externen Abhängigkeiten**
- **Storage**: localStorage (offline-first)
- **PWA**: Installierbar, Offline-Support, Push-Notifications
- **Charts**: Canvas API (selbst implementiert)

## Installation

### Als PWA (empfohlen)
1. Öffne `index.html` in Chrome/Safari
2. Klicke auf "Zum Startbildschirm hinzufügen" oder "App installieren"
3. Die App funktioniert auch offline!

### Lokal entwickeln
```bash
# Einfach index.html im Browser öffnen
# oder mit einem lokalen Server:
python -m http.server 8000
# Dann: http://localhost:8000
```

## Projektstruktur

```
├── index.html          # Haupt-HTML mit allen Modals
├── styles.css          # Dark Theme, Responsive
├── manifest.json       # PWA Manifest
├── sw.js              # Service Worker
├── js/
│   ├── config.js      # Konstanten, Pläne, Profile, Badges
│   ├── app.js         # Haupt-Controller, UI
│   ├── data.js        # localStorage CRUD
│   ├── calendar.js    # Kalender-Rendering
│   ├── streaks.js     # Streak-Berechnung, Stats
│   └── notifications.js # Push-Benachrichtigungen
├── icons/             # App Icons
├── CLAUDE.md          # Entwickler-Dokumentation
└── README.md          # Diese Datei
```

## Nutzerprofile

### Denise
- Ziele: Muskelaufbau, Körperfett reduzieren
- Tracking: Protein 100g, Schlaf vor 23:30
- Besonderheiten: Asthma, Laktoseintoleranz

### Moritz
- Ziele: Muskelaufbau, Leistungssteigerung
- Tracking: Protein 130g, Kalorien max 2500
- Besonderheiten: Schichtarbeit

## Screenshots

Die App verwendet ein dunkles Theme mit orangefarbenen Akzenten (#ff6b35).

## Lizenz

Private Nutzung - Erstellt für Denise und Moritz.

---

Made with Claude Code
