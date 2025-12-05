/**
 * DeMori Fitness Tracker - Notifications Module
 * Push-Benachrichtigungen und Reminder
 */

const NotificationManager = {
    permission: 'default',
    checkInterval: null,

    /**
     * Initialisiert das Notification-System
     */
    async init() {
        // Prüfe ob Notifications unterstützt werden
        if (!('Notification' in window)) {
            console.log('Notifications werden nicht unterstützt');
            return false;
        }

        this.permission = Notification.permission;

        // Service Worker für Push registrieren
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registriert:', registration.scope);
            } catch (err) {
                console.log('Service Worker Registrierung fehlgeschlagen:', err);
            }
        }

        // Starte Reminder-Check wenn erlaubt
        if (this.permission === 'granted') {
            this.startReminderCheck();
        }

        return this.permission === 'granted';
    },

    /**
     * Fragt nach Notification-Berechtigung
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            this.permission = result;

            if (result === 'granted') {
                this.startReminderCheck();
                // Zeige Bestätigung
                this.showNotification(
                    'Benachrichtigungen aktiviert!',
                    'Du erhältst jetzt Erinnerungen für deine Fitness-Ziele.'
                );
            }

            return result === 'granted';
        } catch (err) {
            console.error('Fehler bei Permission-Anfrage:', err);
            return false;
        }
    },

    /**
     * Zeigt eine Notification
     */
    showNotification(title, body, options = {}) {
        if (this.permission !== 'granted') return;

        const defaultOptions = {
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-96.png',
            vibrate: [200, 100, 200],
            tag: 'fitness-tracker',
            renotify: true,
            ...options
        };

        // Versuche über Service Worker (für Background)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body,
                    ...defaultOptions
                });
            });
        } else {
            // Fallback: Direkte Notification
            new Notification(title, {
                body,
                ...defaultOptions
            });
        }
    },

    /**
     * Startet den periodischen Reminder-Check
     */
    startReminderCheck() {
        // Stoppe vorherigen Check
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Prüfe alle 5 Minuten
        this.checkInterval = setInterval(() => {
            this.checkReminders();
        }, 5 * 60 * 1000);

        // Einmal sofort prüfen
        this.checkReminders();
    },

    /**
     * Prüft ob eine Erinnerung fällig ist
     */
    checkReminders() {
        const settings = DataManager.getSettings();
        if (!settings.notificationsEnabled) return;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

        // Morgen-Reminder
        const morningTime = settings.morningReminderTime || '09:00';
        const morningKey = `morningShown_${CONFIG.toDateKey(now)}`;

        if (this._isTimeInRange(currentTime, morningTime, 30) && !sessionStorage.getItem(morningKey)) {
            this.showMorningReminder();
            sessionStorage.setItem(morningKey, 'true');
        }

        // Abend-Reminder
        const eveningTime = settings.eveningReminderTime || '21:00';
        const eveningKey = `eveningShown_${CONFIG.toDateKey(now)}`;

        if (this._isTimeInRange(currentTime, eveningTime, 30) && !sessionStorage.getItem(eveningKey)) {
            this.showEveningReminder();
            sessionStorage.setItem(eveningKey, 'true');
        }
    },

    /**
     * Prüft ob aktuelle Zeit im Bereich ist
     */
    _isTimeInRange(current, target, rangeMinutes) {
        const [cH, cM] = current.split(':').map(Number);
        const [tH, tM] = target.split(':').map(Number);

        const currentMinutes = cH * 60 + cM;
        const targetMinutes = tH * 60 + tM;

        return currentMinutes >= targetMinutes && currentMinutes < targetMinutes + rangeMinutes;
    },

    /**
     * Zeigt Morgen-Reminder
     */
    showMorningReminder() {
        const userId = DataManager.getCurrentUser();
        if (!userId) return;

        const today = new Date();
        const trainingInfo = this.getTrainingInfo(userId, today);

        const message = CONFIG.getRandomReminder('morning', trainingInfo);

        this.showNotification('Guten Morgen! 🌅', message, {
            tag: 'morning-reminder'
        });
    },

    /**
     * Zeigt Abend-Reminder
     */
    showEveningReminder() {
        const userId = DataManager.getCurrentUser();
        if (!userId) return;

        // Prüfe ob heute schon eingetragen
        const todayKey = CONFIG.toDateKey(new Date());
        const entry = DataManager.getEntry(todayKey, userId);

        if (entry) {
            // Schon eingetragen - positive Nachricht
            this.showNotification('Guter Tag! ✨', 'Du hast heute schon alles eingetragen. Weiter so!', {
                tag: 'evening-reminder'
            });
        } else {
            // Noch nicht eingetragen - Erinnerung
            const message = CONFIG.getRandomReminder('evening');
            this.showNotification('Abend-Check! 🌙', message, {
                tag: 'evening-reminder'
            });
        }
    },

    /**
     * Gibt Training-Info für ein Datum zurück
     */
    getTrainingInfo(userId, date) {
        const scheduled = DataManager.getScheduledTraining(date, userId);

        if (!scheduled || scheduled.length === 0) {
            return 'Ruhetag';
        }

        const trainingNames = scheduled.map(type => {
            const info = CONFIG.TRAINING_TYPES[type];
            return info ? info.name : type;
        });

        return trainingNames.join(', ');
    },

    /**
     * Zeigt eine Erinnerung für einen bestimmten Zeitpunkt
     */
    scheduleNotification(title, body, delay) {
        setTimeout(() => {
            this.showNotification(title, body);
        }, delay);
    },

    /**
     * Stoppt alle Reminder
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },

    /**
     * Prüft ob Notifications aktiviert sind
     */
    isEnabled() {
        const settings = DataManager.getSettings();
        return this.permission === 'granted' && settings.notificationsEnabled;
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
