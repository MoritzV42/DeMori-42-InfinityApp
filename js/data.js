/**
 * DeMori Fitness Tracker - Data Manager
 * Verwaltet alle localStorage Operationen
 */

const DataManager = {
    data: null,

    /**
     * Initialisiert den DataManager und lädt vorhandene Daten
     */
    init() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                // Migration: Füge fehlende Felder hinzu
                this._migrateData();
            } catch (e) {
                console.error('Fehler beim Laden der Daten:', e);
                this._initializeDefaults();
            }
        } else {
            this._initializeDefaults();
        }
        return this.data;
    },

    /**
     * Initialisiert mit Default-Werten
     */
    _initializeDefaults() {
        this.data = {
            currentUser: null,
            users: JSON.parse(JSON.stringify(CONFIG.DEFAULT_USERS)),
            settings: { ...CONFIG.DEFAULT_SETTINGS }
        };
        this._save();
    },

    /**
     * Migriert alte Daten zu neuem Format
     */
    _migrateData() {
        // Stelle sicher, dass alle User-Felder existieren
        for (const userId of Object.keys(this.data.users)) {
            const user = this.data.users[userId];
            const defaults = CONFIG.DEFAULT_USERS[userId];

            if (!user.streaks) user.streaks = defaults.streaks;
            if (!user.badges) user.badges = [];
            if (!user.measurements) user.measurements = [];
            if (!user.stats) user.stats = { totalWorkouts: 0, totalSuccessfulDays: 0 };
            if (!user.schedule) user.schedule = defaults.schedule;
            if (!user.goals) user.goals = defaults.goals;
        }

        // Stelle sicher, dass Settings existieren
        if (!this.data.settings) {
            this.data.settings = { ...CONFIG.DEFAULT_SETTINGS };
        }

        this._save();
    },

    /**
     * Speichert Daten in localStorage
     */
    _save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
            return false;
        }
    },

    /**
     * Gibt den aktuellen Nutzer zurück
     */
    getCurrentUser() {
        return this.data.currentUser;
    },

    /**
     * Setzt den aktuellen Nutzer
     */
    setCurrentUser(userId) {
        if (this.data.users[userId]) {
            this.data.currentUser = userId;
            this._save();
            return true;
        }
        return false;
    },

    /**
     * Gibt alle Daten eines Nutzers zurück
     */
    getUserData(userId = null) {
        const id = userId || this.data.currentUser;
        return this.data.users[id] || null;
    },

    /**
     * Gibt den Tageseintrag für ein bestimmtes Datum zurück
     */
    getEntry(date, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return null;

        const dateKey = CONFIG.toDateKey(date);
        return user.entries[dateKey] || null;
    },

    /**
     * Speichert einen Tageseintrag
     */
    saveEntry(date, entry, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        const dateKey = CONFIG.toDateKey(date);
        user.entries[dateKey] = {
            ...entry,
            savedAt: new Date().toISOString()
        };

        this._save();
        return true;
    },

    /**
     * Gibt den Trainingsplan eines Nutzers zurück
     */
    getSchedule(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.schedule : null;
    },

    /**
     * Aktualisiert den Trainingsplan
     */
    updateSchedule(schedule, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        user.schedule = schedule;
        this._save();
        return true;
    },

    /**
     * Gibt die Ziele eines Nutzers zurück
     */
    getGoals(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.goals : null;
    },

    /**
     * Aktualisiert die Ziele
     */
    updateGoals(goals, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        user.goals = { ...user.goals, ...goals };
        this._save();
        return true;
    },

    /**
     * Gibt die Streaks zurück
     */
    getStreaks(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.streaks : null;
    },

    /**
     * Aktualisiert die Streaks
     */
    updateStreaks(streaks, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        user.streaks = streaks;
        this._save();
        return true;
    },

    /**
     * Gibt alle Badges eines Nutzers zurück
     */
    getBadges(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.badges : [];
    },

    /**
     * Fügt ein Badge hinzu
     */
    addBadge(badgeId, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        // Prüfe ob Badge bereits vorhanden
        if (user.badges.some(b => b.id === badgeId)) {
            return false;
        }

        user.badges.push({
            id: badgeId,
            earnedAt: new Date().toISOString()
        });

        this._save();
        return true;
    },

    /**
     * Gibt die Statistiken zurück
     */
    getStats(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.stats : null;
    },

    /**
     * Aktualisiert die Statistiken
     */
    updateStats(stats, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        user.stats = { ...user.stats, ...stats };
        this._save();
        return true;
    },

    /**
     * Gibt alle Messungen zurück
     */
    getMeasurements(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.measurements : [];
    },

    /**
     * Fügt eine Messung hinzu
     */
    addMeasurement(measurement, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        user.measurements.push({
            ...measurement,
            date: CONFIG.toDateKey(new Date())
        });

        this._save();
        return true;
    },

    /**
     * Gibt die App-Einstellungen zurück
     */
    getSettings() {
        return this.data.settings;
    },

    /**
     * Aktualisiert die Einstellungen
     */
    saveSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this._save();
        return true;
    },

    /**
     * Gibt alle Einträge eines Nutzers zurück
     */
    getAllEntries(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.entries : {};
    },

    /**
     * Gibt Einträge für einen bestimmten Monat zurück
     */
    getEntriesForMonth(year, month, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return {};

        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        const entries = {};

        for (const [dateKey, entry] of Object.entries(user.entries)) {
            if (dateKey.startsWith(prefix)) {
                entries[dateKey] = entry;
            }
        }

        return entries;
    },

    /**
     * Exportiert alle Daten als JSON
     */
    exportData() {
        return JSON.stringify(this.data, null, 2);
    },

    /**
     * Importiert Daten aus JSON
     */
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = imported;
            this._migrateData();
            return true;
        } catch (e) {
            console.error('Import fehlgeschlagen:', e);
            return false;
        }
    },

    /**
     * Setzt alle Daten zurück (Vorsicht!)
     */
    resetAll() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        this._initializeDefaults();
        return true;
    },

    /**
     * Prüft ob heute ein Trainingstag ist
     */
    isTrainingDay(date = new Date(), userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        const dayOfWeek = new Date(date).getDay();
        const scheduled = user.schedule[dayOfWeek];
        return scheduled && scheduled.length > 0;
    },

    /**
     * Gibt das geplante Training für ein Datum zurück
     */
    getScheduledTraining(date = new Date(), userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return [];

        const dayOfWeek = new Date(date).getDay();
        return user.schedule[dayOfWeek] || [];
    },

    /**
     * Zählt die Trainings in einem Zeitraum
     */
    countWorkouts(startDate, endDate, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return 0;

        let count = 0;
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (const [dateKey, entry] of Object.entries(user.entries)) {
            const entryDate = new Date(dateKey);
            if (entryDate >= start && entryDate <= end && entry.training) {
                count++;
            }
        }

        return count;
    },

    /**
     * Berechnet die Erfolgsquote
     */
    calculateSuccessRate(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return 0;

        const entries = Object.values(user.entries);
        if (entries.length === 0) return 0;

        let successfulDays = 0;
        for (const entry of entries) {
            if (this._isDayComplete(entry, user.goals)) {
                successfulDays++;
            }
        }

        return Math.round((successfulDays / entries.length) * 100);
    },

    /**
     * Prüft ob ein Tag vollständig erfolgreich war
     */
    _isDayComplete(entry, goals) {
        // Training muss geschafft sein (wenn es ein Trainingstag war)
        // Für Ruhetage: training wird auf true gesetzt wenn kein Training geplant war
        if (entry.training !== true && entry.training !== 'rest') return false;

        // Protein muss erreicht sein
        if (entry.protein !== true) return false;

        // Schlaf-Ziel wenn vorhanden
        if (goals.sleepBefore && entry.sleep !== true) return false;

        // Kalorien-Ziel wenn vorhanden
        if (goals.caloriesMax && entry.calories !== true) return false;

        return true;
    },

    // ============ PROFIL ============

    /**
     * Aktualisiert das Profil eines Nutzers
     */
    updateProfile(profileData, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        if (!user.profile) user.profile = {};
        user.profile = { ...user.profile, ...profileData };
        this._save();
        return true;
    },

    // ============ CUSTOM REMINDERS ============

    /**
     * Gibt alle Custom Reminders zurück
     */
    getCustomReminders() {
        return this.data.settings.customReminders || [];
    },

    /**
     * Fügt einen Custom Reminder hinzu
     */
    addCustomReminder(reminder) {
        if (!this.data.settings.customReminders) {
            this.data.settings.customReminders = [];
        }
        this.data.settings.customReminders.push(reminder);
        this._save();
        return true;
    },

    /**
     * Entfernt einen Custom Reminder
     */
    removeCustomReminder(reminderId) {
        if (!this.data.settings.customReminders) return false;
        this.data.settings.customReminders = this.data.settings.customReminders.filter(
            r => r.id !== reminderId
        );
        this._save();
        return true;
    },

    // ============ TRAINING TYPES ============

    /**
     * Gibt alle Trainingstypen zurück (Default + Custom)
     */
    getAllTrainingTypes() {
        const customTypes = this.data.settings.customTrainingTypes || {};
        return { ...CONFIG.TRAINING_TYPES, ...customTypes };
    },

    /**
     * Gibt einen einzelnen Trainingstyp zurück
     */
    getTrainingType(typeId) {
        const customTypes = this.data.settings.customTrainingTypes || {};
        return customTypes[typeId] || CONFIG.TRAINING_TYPES[typeId] || null;
    },

    /**
     * Speichert einen Trainingstyp
     */
    saveTrainingType(typeId, typeData) {
        if (!this.data.settings.customTrainingTypes) {
            this.data.settings.customTrainingTypes = {};
        }
        this.data.settings.customTrainingTypes[typeId] = typeData;
        this._save();
        return true;
    },

    /**
     * Aktualisiert einen Trainingstyp
     */
    updateTrainingType(typeId, typeData) {
        // Wenn es ein Default-Typ ist, erstelle eine Custom-Kopie
        if (CONFIG.TRAINING_TYPES[typeId]) {
            if (!this.data.settings.customTrainingTypes) {
                this.data.settings.customTrainingTypes = {};
            }
            this.data.settings.customTrainingTypes[typeId] = {
                ...CONFIG.TRAINING_TYPES[typeId],
                ...typeData
            };
        } else {
            // Custom Type updaten
            if (this.data.settings.customTrainingTypes?.[typeId]) {
                this.data.settings.customTrainingTypes[typeId] = {
                    ...this.data.settings.customTrainingTypes[typeId],
                    ...typeData
                };
            }
        }
        this._save();
        return true;
    },

    /**
     * Löscht einen Custom Trainingstyp
     */
    deleteTrainingType(typeId) {
        if (!this.data.settings.customTrainingTypes) return false;
        // Nur Custom Types können gelöscht werden
        if (this.data.settings.customTrainingTypes[typeId]?.isCustom) {
            delete this.data.settings.customTrainingTypes[typeId];
            this._save();
            return true;
        }
        return false;
    },

    // ============ PHOTOS ============

    /**
     * Gibt alle Fotos zurück
     */
    getPhotos(userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        return user ? user.photos || [] : [];
    },

    /**
     * Fügt ein Foto hinzu
     */
    addPhoto(photo, userId = null) {
        const id = userId || this.data.currentUser;
        const user = this.data.users[id];
        if (!user) return false;

        if (!user.photos) user.photos = [];
        user.photos.push(photo);
        this._save();
        return true;
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
