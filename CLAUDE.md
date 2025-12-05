# DeMori Fitness Tracker - CLAUDE.md

## Projektbeschreibung
Personalisierte Fitness- und Habit-Tracking PWA (Progressive Web App) für Denise und Moritz.
Fokus auf Gamification, Streaks und Motivation - ohne externe Dependencies.

## Technologie
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (keine Backend-API)
- **PWA**: Service Worker, Manifest, Offline-Support
- **Charts**: Canvas API (selbst implementiert)

## Projektstruktur
```
/
├── index.html          # Haupt-HTML mit allen Modals
├── styles.css          # Dark Theme, Responsive Design
├── manifest.json       # PWA Manifest
├── sw.js              # Service Worker
├── js/
│   ├── config.js      # Konstanten, Trainingspläne, Nutzerprofile, Badges
│   ├── app.js         # Haupt-Controller, UI, Event-Handling
│   ├── data.js        # localStorage Wrapper, CRUD
│   ├── calendar.js    # Kalender-Rendering
│   ├── streaks.js     # Streak-Berechnung, Statistiken, Badge-Check
│   └── notifications.js # Push-Benachrichtigungen
└── icons/             # App Icons
```

## Nutzerprofile

### Denise (20 Jahre)
- **Ziele**: Muskelaufbau, Körperfett reduzieren
- **Körpertyp**: Mesomorph (168cm)
- **Besonderheiten**: Asthma, Laktoseintoleranz
- **Tracking**: Protein (100g), Schlaf vor 23:30, Training 3x/Woche
- **Trainingsplan**: Mo/Mi/Fr Kraft, Di Boxen, So HIIT

### Moritz (22 Jahre)
- **Ziele**: Muskelaufbau, Leistungssteigerung
- **Körpertyp**: Endomorph (189cm)
- **Besonderheiten**: Schichtarbeit
- **Tracking**: Protein (130g), Kalorien (2500 max), Training 3x/Woche
- **Trainingsplan**: Di/Fr Kraft, Mi Jiu-Jitsu, Sa Bouldern, So optional

## Features
1. **Tägliches Tracking**: Training, Protein, Schlaf, Kalorien (je nach User)
2. **Streak-System**: 5 verschiedene Streaks (Training, Protein, Schlaf, Kalorien, Overall)
3. **14 Badges**: Streak-basiert und aktivitätsbasiert
4. **Kalender**: Monatsansicht mit Farbcodierung (grün/orange/rot)
5. **Wöchentliche Pflichten**: Körperdaten (Gewicht, KFA), Fortschrittsfoto
6. **Trainingsplan-Anzeige**: Detaillierte Übungen pro Tag
7. **Fortschritts-Charts**: Gewichts- und Körperfett-Verlauf
8. **Foto-Galerie**: Fortschrittsfotos mit Viewer
9. **Push-Benachrichtigungen**: Morgen/Abend Erinnerungen
10. **Einstellungen**: Ziele, Schedule, Export/Import

## Datenstruktur (localStorage)
```javascript
{
  currentUser: 'denise' | 'moritz',
  users: {
    [userId]: {
      name, avatar, color,
      profile: { age, height, bodyType, conditions, sportHistory },
      goals: { protein, sleepBefore, caloriesMax, caloriesTarget, sleepHours, weeklyWorkouts },
      schedule: { dayOfWeek: [trainingTypes] },
      entries: { dateKey: { training, protein, sleep, calories } },
      streaks: { training, protein, sleep, calories, overall },
      badges: [{ id, earnedAt }],
      measurements: [{ date, weight, bodyFat }],
      photos: [{ date, dataUrl }],
      stats: { totalWorkouts, totalSuccessfulDays }
    }
  },
  settings: { notificationsEnabled, morningReminderTime, eveningReminderTime, ... }
}
```

## Entwicklungsrichtlinien
- **Keine externen Libraries** - Alles vanilla
- **Responsive Design** - Mobile-first
- **Dark Theme** - Orange Akzente (#ff6b35)
- **Deutsch** - Alle UI-Texte auf Deutsch
- **Offline-First** - Service Worker caching

## Wichtige Dateien zum Bearbeiten
- `js/config.js`: Trainingspläne, Badges, Quotes, Nutzerprofile
- `js/app.js`: UI-Logik, Modals, Event-Handler
- `styles.css`: Styling, Animationen
- `index.html`: HTML-Struktur, Modal-Definitionen

## Neue Features (v2.1)
- Trainingsplan-Accordion im Day-Modal (aufklappbar)
- Klickbare Streaks/Stats -> öffnet Detail-Ansicht
- Profil bearbeitbar (Alter, Größe, Körpertyp, Besonderheiten)
- Training-Reminder (feste Zeit ODER X Min vorher)
- Trainingstypen Editor (Name, Icon, Farbe, Dauer)
- Manuelle Reminder (eigene Erinnerungen)
- Google Calendar Sync (wie Reclaim.ai)

## Google Calendar Setup-Anleitung

### 1. Google Cloud Projekt erstellen
1. Gehe zu https://console.cloud.google.com/
2. Erstelle ein neues Projekt (oder wähle ein bestehendes)
3. Gib dem Projekt einen Namen (z.B. "DeMori Fitness Tracker")

### 2. Google Calendar API aktivieren
1. Gehe zu "APIs & Services" > "Library"
2. Suche nach "Google Calendar API"
3. Klicke auf "Aktivieren"

### 3. OAuth 2.0 Credentials erstellen
1. Gehe zu "APIs & Services" > "Credentials"
2. Klicke auf "Create Credentials" > "OAuth 2.0 Client ID"
3. Falls noch nicht geschehen: OAuth-Zustimmungsbildschirm konfigurieren
   - User Type: "Extern"
   - App-Name: "DeMori Fitness Tracker"
   - Scopes: `../auth/calendar.events`
4. Application Type: "Web application"
5. Authorized JavaScript origins:
   - `http://localhost` (für lokale Entwicklung)
   - Deine Domain (wenn gehostet)
6. Authorized redirect URIs: gleiche wie origins
7. Klicke "Erstellen" und kopiere die **Client ID**

### 4. API Key erstellen
1. Klicke auf "Create Credentials" > "API Key"
2. Kopiere den **API Key**
3. Optional: Key einschränken auf Calendar API

### 5. Credentials in App eintragen
Öffne `js/google-calendar.js` und trage ein:
```javascript
CLIENT_ID: 'DEINE_CLIENT_ID_HIER',
API_KEY: 'DEIN_API_KEY_HIER',
```

### 6. Testen
1. Öffne die App und gehe zu Einstellungen
2. Klicke auf "Mit Google verbinden"
3. Autorisiere den Zugriff
4. Klicke auf "Jetzt synchronisieren"

## Bekannte TODOs
- [ ] Foto-Badges prüfen (photo4, photo12)
- [ ] Team-Streak Feature (wenn beide Ziele erreichen)
- [ ] Notification Service Worker verbessern
