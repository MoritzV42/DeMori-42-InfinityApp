/**
 * DeMori Fitness Tracker - Google Calendar Sync
 * Synchronisiert Trainings mit Google Calendar (wie Reclaim.ai)
 *
 * SETUP-ANLEITUNG:
 * 1. Gehe zu https://console.cloud.google.com/
 * 2. Erstelle ein neues Projekt oder wähle ein bestehendes
 * 3. Aktiviere die "Google Calendar API" unter APIs & Services > Library
 * 4. Erstelle OAuth 2.0 Credentials:
 *    - APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID
 *    - Application Type: Web application
 *    - Authorized JavaScript origins: http://localhost (und deine Domain)
 *    - Authorized redirect URIs: http://localhost (und deine Domain)
 * 5. Kopiere die Client ID und trage sie unten ein
 * 6. Erstelle einen API Key unter APIs & Services > Credentials > Create Credentials > API Key
 * 7. Trage den API Key unten ein
 */

const GoogleCalendarSync = {
    // === HIER DEINE CREDENTIALS EINTRAGEN ===
    CLIENT_ID: '', // Deine Google OAuth Client ID
    API_KEY: '',   // Dein Google API Key
    // =========================================

    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/calendar.events',

    isInitialized: false,
    isSignedIn: false,
    tokenClient: null,

    /**
     * Initialisiert Google Calendar API
     */
    async init() {
        // Prüfe ob Credentials gesetzt sind
        if (!this.CLIENT_ID || !this.API_KEY) {
            console.log('Google Calendar: Keine Credentials konfiguriert');
            return false;
        }

        try {
            // Lade Google API Script
            await this.loadGoogleScript();

            // Initialisiere gapi
            await new Promise((resolve, reject) => {
                gapi.load('client', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: this.API_KEY,
                            discoveryDocs: [this.DISCOVERY_DOC],
                        });
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            // Initialisiere Token Client
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES,
                callback: (response) => {
                    if (response.error) {
                        console.error('OAuth Error:', response);
                        return;
                    }
                    this.isSignedIn = true;
                    this.onSignInChange(true);
                },
            });

            this.isInitialized = true;

            // Prüfe ob bereits eingeloggt (Token im localStorage)
            const savedToken = this.getSavedToken();
            if (savedToken) {
                gapi.client.setToken(savedToken);
                this.isSignedIn = true;
            }

            return true;
        } catch (err) {
            console.error('Google Calendar Init Fehler:', err);
            return false;
        }
    },

    /**
     * Lädt das Google API Script
     */
    loadGoogleScript() {
        return new Promise((resolve, reject) => {
            // Prüfe ob bereits geladen
            if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
                resolve();
                return;
            }

            // Lade gapi
            const gapiScript = document.createElement('script');
            gapiScript.src = 'https://apis.google.com/js/api.js';
            gapiScript.onload = () => {
                // Lade GSI
                const gsiScript = document.createElement('script');
                gsiScript.src = 'https://accounts.google.com/gsi/client';
                gsiScript.onload = resolve;
                gsiScript.onerror = reject;
                document.head.appendChild(gsiScript);
            };
            gapiScript.onerror = reject;
            document.head.appendChild(gapiScript);
        });
    },

    /**
     * Startet den Login-Prozess
     */
    signIn() {
        if (!this.isInitialized) {
            console.error('Google Calendar nicht initialisiert');
            return;
        }

        this.tokenClient.requestAccessToken({ prompt: 'consent' });
    },

    /**
     * Logout
     */
    signOut() {
        const token = gapi.client.getToken();
        if (token) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
        this.isSignedIn = false;
        this.clearSavedToken();
        this.onSignInChange(false);
    },

    /**
     * Callback bei Login-Status-Änderung
     */
    onSignInChange(isSignedIn) {
        // Speichere Token
        if (isSignedIn) {
            const token = gapi.client.getToken();
            this.saveToken(token);
        }

        // Update UI
        const statusEl = document.getElementById('google-calendar-status');
        const optionsEl = document.getElementById('google-calendar-options');
        const connectBtn = document.getElementById('btn-connect-google');

        if (statusEl) {
            if (isSignedIn) {
                statusEl.classList.add('connected');
                statusEl.querySelector('.status-text').textContent = 'Verbunden';
            } else {
                statusEl.classList.remove('connected');
                statusEl.querySelector('.status-text').textContent = 'Nicht verbunden';
            }
        }

        if (optionsEl) {
            optionsEl.classList.toggle('hidden', !isSignedIn);
        }

        if (connectBtn) {
            connectBtn.textContent = isSignedIn ? 'Neu verbinden' : 'Mit Google verbinden';
        }
    },

    /**
     * Speichert Token im localStorage
     */
    saveToken(token) {
        if (token) {
            localStorage.setItem('demori_google_token', JSON.stringify(token));
        }
    },

    /**
     * Lädt Token aus localStorage
     */
    getSavedToken() {
        const saved = localStorage.getItem('demori_google_token');
        return saved ? JSON.parse(saved) : null;
    },

    /**
     * Löscht gespeicherten Token
     */
    clearSavedToken() {
        localStorage.removeItem('demori_google_token');
    },

    /**
     * Erstellt ein Workout-Event im Kalender
     */
    async createWorkoutEvent(date, workoutPlan, trainingType) {
        if (!this.isSignedIn) {
            console.error('Nicht eingeloggt');
            return null;
        }

        const userId = DataManager.getCurrentUser();
        const settings = DataManager.getSettings();
        const trainingTime = settings.calendarTrainingTime || '17:00';

        // Datum und Zeit zusammenbauen
        const [hours, minutes] = trainingTime.split(':').map(Number);
        const startDate = new Date(date);
        startDate.setHours(hours, minutes, 0, 0);

        // Dauer aus Plan berechnen (z.B. "45-60 min" -> 60 min)
        let durationMinutes = 60; // Default
        if (workoutPlan?.duration) {
            const match = workoutPlan.duration.match(/(\d+)/g);
            if (match && match.length > 0) {
                durationMinutes = parseInt(match[match.length - 1]); // Nimm den größeren Wert
            }
        }

        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        // Übungen als Text formatieren
        let description = '';
        if (workoutPlan?.exercises) {
            description += '## Übungen:\n\n';
            workoutPlan.exercises.forEach((ex, i) => {
                description += `${i + 1}. ${ex.name} - ${ex.sets}×${ex.reps} (${ex.muscle})\n`;
            });
            description += '\n';
        }

        // App-Link hinzufügen
        const appUrl = window.location.origin + window.location.pathname;
        description += `\n📱 Öffne die App: ${appUrl}`;

        const typeInfo = CONFIG.TRAINING_TYPES[trainingType] || { icon: '💪', name: 'Training' };

        const event = {
            summary: `${typeInfo.icon} ${workoutPlan?.name || typeInfo.name} - DeMori Fitness`,
            description: description,
            start: {
                dateTime: startDate.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: endDate.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            reminders: {
                useDefault: true, // Google übernimmt die Erinnerungen
            },
        };

        try {
            const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });
            console.log('Event erstellt:', response.result);
            return response.result;
        } catch (err) {
            console.error('Event erstellen fehlgeschlagen:', err);
            return null;
        }
    },

    /**
     * Synchronisiert die Trainings für heute
     */
    async syncToday() {
        if (!this.isSignedIn) {
            console.error('Nicht eingeloggt');
            return false;
        }

        const userId = DataManager.getCurrentUser();
        const today = new Date();
        const dayOfWeek = today.getDay();
        const schedule = DataManager.getSchedule(userId);
        const scheduled = schedule[dayOfWeek] || [];

        if (scheduled.length === 0 || scheduled.includes('rest')) {
            console.log('Heute kein Training geplant');
            return true;
        }

        let success = true;
        for (const trainingType of scheduled) {
            const plan = CONFIG.getWorkoutPlan(userId, trainingType, dayOfWeek);
            const result = await this.createWorkoutEvent(today, plan, trainingType);
            if (!result) success = false;
        }

        return success;
    },

    /**
     * Synchronisiert die Trainings für die nächsten X Tage
     */
    async syncWeek(days = 7) {
        if (!this.isSignedIn) {
            console.error('Nicht eingeloggt');
            return false;
        }

        const userId = DataManager.getCurrentUser();
        const schedule = DataManager.getSchedule(userId);
        let success = true;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dayOfWeek = date.getDay();
            const scheduled = schedule[dayOfWeek] || [];

            if (scheduled.length === 0 || scheduled.includes('rest')) {
                continue;
            }

            for (const trainingType of scheduled) {
                const plan = CONFIG.getWorkoutPlan(userId, trainingType, dayOfWeek);
                const result = await this.createWorkoutEvent(date, plan, trainingType);
                if (!result) success = false;
            }
        }

        return success;
    },

    /**
     * Prüft ob Credentials konfiguriert sind
     */
    isConfigured() {
        return this.CLIENT_ID && this.API_KEY;
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleCalendarSync;
}
