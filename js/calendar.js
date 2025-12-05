/**
 * DeMori Fitness Tracker - Calendar Module
 * Kalender-Rendering und Navigation
 */

const Calendar = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    onDayClickCallback: null,
    container: null,

    /**
     * Initialisiert den Kalender
     */
    init(containerId, onDayClick) {
        this.container = document.getElementById(containerId);
        this.onDayClickCallback = onDayClick;
        this.render();
    },

    /**
     * Rendert den Kalender für den aktuellen Monat
     */
    render() {
        if (!this.container) return;

        const year = this.currentYear;
        const month = this.currentMonth;

        // Update Titel
        const titleEl = document.getElementById('calendar-month-title');
        if (titleEl) {
            titleEl.textContent = `${CONFIG.MONTHS[month]} ${year}`;
        }

        // Grid leeren
        this.container.innerHTML = '';

        // Erster Tag des Monats (0 = Sonntag)
        const firstDay = new Date(year, month, 1).getDay();
        // Umrechnung auf Montag als Start (0 = Montag)
        const startOffset = (firstDay + 6) % 7;

        // Anzahl Tage im Monat
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Heute
        const today = new Date();
        const todayKey = CONFIG.toDateKey(today);

        // User ID
        const userId = DataManager.getCurrentUser();

        // Leere Zellen vor dem ersten Tag
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day calendar-day--empty';
            this.container.appendChild(emptyCell);
        }

        // Tage des Monats
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const date = new Date(year, month, day);
            const isToday = dateKey === todayKey;
            const isFuture = date > today;

            // Status ermitteln
            const status = this.getDayStatus(userId, dateKey, isFuture);

            // Ist ein Trainingstag?
            const scheduled = DataManager.getScheduledTraining(date, userId);
            const hasTraining = scheduled && scheduled.length > 0;

            // Zelle erstellen
            const dayCell = document.createElement('div');
            dayCell.className = `calendar-day calendar-day--${status}`;
            if (isToday) dayCell.classList.add('calendar-day--today');
            if (hasTraining && !isFuture) dayCell.classList.add('calendar-day--has-training');

            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
            `;

            // Click Handler
            if (!isFuture) {
                dayCell.addEventListener('click', () => {
                    if (this.onDayClickCallback) {
                        this.onDayClickCallback(dateKey);
                    }
                });
            }

            this.container.appendChild(dayCell);
        }
    },

    /**
     * Ermittelt den Status eines Tages
     */
    getDayStatus(userId, dateKey, isFuture) {
        if (isFuture) return 'future';

        const entry = DataManager.getEntry(dateKey, userId);
        if (!entry) return 'pending';

        const goals = DataManager.getGoals(userId);
        const date = new Date(dateKey);
        const scheduled = DataManager.getScheduledTraining(date, userId);
        const isTrainingDay = scheduled && scheduled.length > 0;

        // Zähle erfüllte und relevante Ziele
        let fulfilled = 0;
        let total = 0;

        // Training (wenn Trainingstag)
        if (isTrainingDay) {
            total++;
            if (entry.training === true) fulfilled++;
        }

        // Protein
        total++;
        if (entry.protein === true) fulfilled++;

        // Schlaf (wenn Ziel gesetzt)
        if (goals && goals.sleepBefore) {
            total++;
            if (entry.sleep === true) fulfilled++;
        }

        // Kalorien (wenn Ziel gesetzt)
        if (goals && goals.caloriesMax) {
            total++;
            if (entry.calories === true) fulfilled++;
        }

        // Status bestimmen
        if (total === 0) return 'pending';
        if (fulfilled === total) return 'complete';
        if (fulfilled === 0) return 'missed';
        return 'partial';
    },

    /**
     * Navigiert zum vorherigen Monat
     */
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.render();
    },

    /**
     * Navigiert zum nächsten Monat
     */
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.render();
    },

    /**
     * Springt zu einem bestimmten Monat
     */
    goToMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        this.render();
    },

    /**
     * Springt zum aktuellen Monat
     */
    goToToday() {
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth();
        this.render();
    },

    /**
     * Gibt Statistiken für den aktuellen Monat zurück
     */
    getMonthStats(userId = null) {
        const id = userId || DataManager.getCurrentUser();
        const entries = DataManager.getEntriesForMonth(this.currentYear, this.currentMonth, id);

        let complete = 0;
        let partial = 0;
        let missed = 0;

        for (const dateKey of Object.keys(entries)) {
            const status = this.getDayStatus(id, dateKey, false);
            if (status === 'complete') complete++;
            else if (status === 'partial') partial++;
            else if (status === 'missed') missed++;
        }

        return { complete, partial, missed, total: Object.keys(entries).length };
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calendar;
}
