/**
 * DeMori Fitness Tracker - Main App Controller
 * Haupt-Controller für UI und Event-Handling
 * Version 2.0 - Mit Körperdaten, Fotos, Trainingsplan
 */

const App = {
    selectedDate: null,
    currentPhotoIndex: 0,
    photoData: null,

    /**
     * Initialisiert die App
     */
    async init() {
        console.log('DeMori Fitness Tracker v' + CONFIG.VERSION);

        // Data Manager initialisieren
        DataManager.init();

        // Event Listener einrichten
        this.setupEventListeners();

        // Prüfe ob User bereits ausgewählt
        const currentUser = DataManager.getCurrentUser();

        // Loading ausblenden
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');

            if (currentUser) {
                this.showDashboard();
            } else {
                this.showUserSelection();
            }
        }, 500);

        // Notifications initialisieren
        NotificationManager.init();

        // URL-Parameter prüfen (für Shortcuts)
        this.handleURLParams();
    },

    /**
     * Richtet alle Event Listener ein
     */
    setupEventListeners() {
        // User Selection
        document.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', () => {
                const userId = card.dataset.user;
                this.selectUser(userId);
            });
        });

        // Header Buttons
        document.getElementById('btn-switch-user')?.addEventListener('click', () => {
            this.showUserSelection();
        });

        document.getElementById('btn-badges')?.addEventListener('click', () => {
            this.showBadges();
        });

        document.getElementById('btn-stats')?.addEventListener('click', () => {
            this.showStats();
        });

        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this.showSettings();
        });

        // Calendar Navigation
        document.getElementById('btn-prev-month')?.addEventListener('click', () => {
            Calendar.prevMonth();
        });

        document.getElementById('btn-next-month')?.addEventListener('click', () => {
            Calendar.nextMonth();
        });

        // Today Button
        document.getElementById('btn-today-checklist')?.addEventListener('click', () => {
            this.openDayModal(CONFIG.toDateKey(new Date()));
        });

        // Weekly Actions
        document.getElementById('btn-weekly-data')?.addEventListener('click', () => {
            this.showWeeklyDataModal();
        });

        document.getElementById('btn-weekly-photo')?.addEventListener('click', () => {
            this.showWeeklyPhotoModal();
        });

        document.getElementById('btn-workout-plan')?.addEventListener('click', () => {
            this.showWorkoutPlan();
        });

        document.getElementById('btn-progress')?.addEventListener('click', () => {
            this.showProgress();
        });

        // Modal Close Buttons
        document.getElementById('btn-close-modal')?.addEventListener('click', () => {
            this.closeModal('day-modal');
        });

        document.getElementById('btn-close-badges')?.addEventListener('click', () => {
            this.closeModal('badges-modal');
        });

        document.getElementById('btn-close-stats')?.addEventListener('click', () => {
            this.closeModal('stats-modal');
        });

        document.getElementById('btn-close-settings')?.addEventListener('click', () => {
            this.closeModal('settings-modal');
        });

        document.getElementById('btn-close-quote')?.addEventListener('click', () => {
            this.closeModal('quote-modal');
        });

        document.getElementById('btn-close-badge-earned')?.addEventListener('click', () => {
            this.closeModal('badge-earned-modal');
        });

        document.getElementById('btn-close-weekly-data')?.addEventListener('click', () => {
            this.closeModal('weekly-data-modal');
        });

        document.getElementById('btn-close-weekly-photo')?.addEventListener('click', () => {
            this.closeModal('weekly-photo-modal');
        });

        document.getElementById('btn-close-workout-plan')?.addEventListener('click', () => {
            this.closeModal('workout-plan-modal');
        });

        document.getElementById('btn-close-progress')?.addEventListener('click', () => {
            this.closeModal('progress-modal');
        });

        document.getElementById('btn-close-photo-viewer')?.addEventListener('click', () => {
            this.closeModal('photo-viewer-modal');
        });

        // Modal Backdrop Clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Save Day Button
        document.getElementById('btn-save-day')?.addEventListener('click', () => {
            this.saveDay();
        });

        // Weekly Data Save
        document.getElementById('btn-save-weekly-data')?.addEventListener('click', () => {
            this.saveWeeklyData();
        });

        // Weekly Photo
        this.setupPhotoUpload();

        document.getElementById('btn-save-weekly-photo')?.addEventListener('click', () => {
            this.saveWeeklyPhoto();
        });

        // Photo Viewer Navigation
        document.getElementById('btn-photo-prev')?.addEventListener('click', () => {
            this.navigatePhoto(-1);
        });

        document.getElementById('btn-photo-next')?.addEventListener('click', () => {
            this.navigatePhoto(1);
        });

        // Settings Event Listeners
        this.setupSettingsListeners();

        // Accordion Toggle
        document.getElementById('accordion-toggle')?.addEventListener('click', () => {
            this.toggleAccordion();
        });

        // Klickbare Streaks
        document.querySelector('.streak-card')?.addEventListener('click', () => {
            this.showStats();
        });

        document.querySelectorAll('.mini-streak').forEach(streak => {
            streak.addEventListener('click', () => {
                this.showStats();
            });
        });

        // Klickbare Quick Stats
        document.querySelectorAll('.stat-item').forEach(stat => {
            stat.addEventListener('click', () => {
                this.showStats();
            });
        });
    },

    /**
     * Togglet das Workout-Accordion
     */
    toggleAccordion() {
        const toggle = document.getElementById('accordion-toggle');
        const content = document.getElementById('accordion-content');
        toggle.classList.toggle('active');
        content.classList.toggle('hidden');
    },

    /**
     * Füllt das Workout-Accordion mit Übungen
     */
    fillWorkoutAccordion(userId, scheduled, dayOfWeek) {
        const content = document.getElementById('accordion-content');
        content.innerHTML = '';

        for (const trainingType of scheduled) {
            const plan = CONFIG.getWorkoutPlan(userId, trainingType, dayOfWeek);

            if (plan && plan.exercises) {
                // Workout Header
                const header = document.createElement('div');
                header.className = 'accordion-workout-header';
                header.innerHTML = `
                    <span class="accordion-workout-name">${plan.name}</span>
                    <span class="accordion-workout-duration">${plan.duration}</span>
                `;
                content.appendChild(header);

                // Übungen
                for (const exercise of plan.exercises) {
                    const exerciseEl = document.createElement('div');
                    exerciseEl.className = 'accordion-exercise';
                    exerciseEl.innerHTML = `
                        <span class="accordion-exercise-name">${exercise.name}</span>
                        <span class="accordion-exercise-sets">${exercise.sets}×${exercise.reps}</span>
                        <span class="accordion-exercise-muscle">${exercise.muscle}</span>
                    `;
                    content.appendChild(exerciseEl);
                }
            } else {
                // Fallback wenn kein Plan gefunden
                const typeInfo = CONFIG.TRAINING_TYPES[trainingType];
                const fallback = document.createElement('div');
                fallback.className = 'accordion-workout-header';
                fallback.innerHTML = `
                    <span class="accordion-workout-name">${typeInfo?.icon || '💪'} ${typeInfo?.name || trainingType}</span>
                    <span class="accordion-workout-duration">Nach Gefühl</span>
                `;
                content.appendChild(fallback);
            }
        }
    },

    /**
     * Setup Photo Upload
     */
    setupPhotoUpload() {
        const uploadArea = document.getElementById('photo-upload-area');
        const fileInput = document.getElementById('input-photo');
        const preview = document.getElementById('photo-preview');
        const placeholder = document.getElementById('photo-placeholder');
        const saveBtn = document.getElementById('btn-save-weekly-photo');

        uploadArea?.addEventListener('click', () => {
            fileInput?.click();
        });

        fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showToast('Bitte wähle ein Bild aus');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('Bild zu groß (max. 5MB)');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                // Resize image for storage
                this.resizeImage(event.target.result, 800, 800, (resizedDataUrl) => {
                    this.photoData = resizedDataUrl;
                    preview.src = resizedDataUrl;
                    preview.classList.remove('hidden');
                    placeholder.style.display = 'none';
                    saveBtn.disabled = false;
                });
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Resize image for storage
     */
    resizeImage(dataUrl, maxWidth, maxHeight, callback) {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            callback(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
    },

    /**
     * Settings Event Listeners
     */
    setupSettingsListeners() {
        // Notifications Toggle
        document.getElementById('setting-notifications')?.addEventListener('change', async (e) => {
            if (e.target.checked) {
                const granted = await NotificationManager.requestPermission();
                if (!granted) {
                    e.target.checked = false;
                    this.showToast('Benachrichtigungen wurden nicht erlaubt');
                    return;
                }
            }
            DataManager.saveSettings({ notificationsEnabled: e.target.checked });
        });

        // Time Settings
        document.getElementById('setting-morning-time')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ morningReminderTime: e.target.value });
        });

        document.getElementById('setting-evening-time')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ eveningReminderTime: e.target.value });
        });

        // Goal Settings
        document.getElementById('setting-protein')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ protein: parseInt(e.target.value) });
            this.updateUI();
        });

        document.getElementById('setting-sleep-before')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ sleepBefore: e.target.value || null });
            this.updateUI();
        });

        document.getElementById('setting-calories')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ caloriesMax: parseInt(e.target.value) || null });
            this.updateUI();
        });

        document.getElementById('setting-sleep-hours')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ sleepHours: parseFloat(e.target.value) || 7 });
            this.updateUI();
        });

        document.getElementById('setting-calories-target')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ caloriesTarget: parseInt(e.target.value) || null });
            this.updateUI();
        });

        document.getElementById('setting-weekly-workouts')?.addEventListener('change', (e) => {
            DataManager.updateGoals({ weeklyWorkouts: parseInt(e.target.value) || 3 });
            this.updateUI();
        });

        // Data Buttons
        document.getElementById('btn-export-data')?.addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('btn-import-data')?.addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file')?.addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('btn-reset-data')?.addEventListener('click', () => {
            if (confirm('Wirklich ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
                DataManager.resetAll();
                this.showUserSelection();
                this.showToast('Alle Daten wurden gelöscht');
            }
        });

        // Profil Settings
        document.getElementById('setting-age')?.addEventListener('change', (e) => {
            DataManager.updateProfile({ age: parseInt(e.target.value) || null });
        });

        document.getElementById('setting-height')?.addEventListener('change', (e) => {
            DataManager.updateProfile({ height: parseInt(e.target.value) || null });
        });

        document.getElementById('setting-bodytype')?.addEventListener('change', (e) => {
            DataManager.updateProfile({ bodyType: e.target.value });
        });

        document.getElementById('setting-conditions')?.addEventListener('change', (e) => {
            const conditions = e.target.value.split(',').map(s => s.trim()).filter(s => s);
            DataManager.updateProfile({ conditions });
        });

        document.getElementById('setting-sporthistory')?.addEventListener('change', (e) => {
            const sportHistory = e.target.value.split(',').map(s => s.trim()).filter(s => s);
            DataManager.updateProfile({ sportHistory });
        });

        // Training Reminder
        document.getElementById('setting-training-reminder')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ trainingReminderEnabled: e.target.checked });
            this.updateReminderOptionsVisibility();
        });

        document.querySelectorAll('input[name="reminder-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                DataManager.saveSettings({ trainingReminderMode: e.target.value });
                this.updateReminderModeVisibility();
            });
        });

        document.getElementById('setting-training-time')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ trainingReminderTime: e.target.value });
        });

        document.getElementById('setting-training-minutes')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ trainingReminderMinutes: parseInt(e.target.value) || 60 });
        });

        // Custom Reminder
        document.getElementById('btn-add-reminder')?.addEventListener('click', () => {
            this.showCustomReminderModal();
        });

        document.getElementById('btn-close-custom-reminder')?.addEventListener('click', () => {
            this.closeModal('custom-reminder-modal');
        });

        document.getElementById('btn-save-custom-reminder')?.addEventListener('click', () => {
            this.saveCustomReminder();
        });

        // Training Types
        document.getElementById('btn-add-training-type')?.addEventListener('click', () => {
            this.showTrainingTypeModal();
        });

        document.getElementById('btn-close-training-type')?.addEventListener('click', () => {
            this.closeModal('training-type-modal');
        });

        document.getElementById('btn-save-training-type')?.addEventListener('click', () => {
            this.saveTrainingType();
        });

        document.getElementById('btn-delete-training-type')?.addEventListener('click', () => {
            this.deleteTrainingType();
        });

        // Emoji Picker
        document.querySelectorAll('.emoji-option').forEach(option => {
            option.addEventListener('click', () => {
                document.getElementById('type-icon').value = option.dataset.emoji;
            });
        });

        // Google Calendar
        document.getElementById('btn-connect-google')?.addEventListener('click', () => {
            if (GoogleCalendarSync.isConfigured()) {
                GoogleCalendarSync.signIn();
            } else {
                this.showToast('Google Calendar nicht konfiguriert. Siehe CLAUDE.md für Setup-Anleitung.');
            }
        });

        document.getElementById('btn-disconnect-google')?.addEventListener('click', () => {
            GoogleCalendarSync.signOut();
        });

        document.getElementById('btn-sync-calendar')?.addEventListener('click', async () => {
            this.showToast('Synchronisiere mit Google Calendar...');
            const success = await GoogleCalendarSync.syncWeek(7);
            if (success) {
                this.showToast('Trainings für die nächsten 7 Tage synchronisiert!');
            } else {
                this.showToast('Synchronisierung fehlgeschlagen');
            }
        });

        document.getElementById('setting-calendar-time')?.addEventListener('change', (e) => {
            DataManager.saveSettings({ calendarTrainingTime: e.target.value });
        });
    },

    /**
     * Zeigt Custom Reminder Modal
     */
    showCustomReminderModal() {
        document.getElementById('reminder-title').value = '';
        document.getElementById('reminder-time').value = '12:00';
        document.querySelectorAll('#reminder-days input').forEach(cb => cb.checked = false);
        document.getElementById('custom-reminder-modal').classList.remove('hidden');
    },

    /**
     * Speichert Custom Reminder
     */
    saveCustomReminder() {
        const title = document.getElementById('reminder-title').value.trim();
        const time = document.getElementById('reminder-time').value;
        const days = [];
        document.querySelectorAll('#reminder-days input:checked').forEach(cb => {
            days.push(parseInt(cb.value));
        });

        if (!title) {
            this.showToast('Bitte gib einen Titel ein');
            return;
        }

        if (days.length === 0) {
            this.showToast('Bitte wähle mindestens einen Tag');
            return;
        }

        const reminder = {
            id: 'reminder_' + Date.now(),
            title,
            time,
            days,
            enabled: true
        };

        DataManager.addCustomReminder(reminder);
        this.closeModal('custom-reminder-modal');
        this.renderCustomReminders();
        this.showToast('Erinnerung hinzugefügt!');
    },

    /**
     * Rendert Custom Reminders Liste
     */
    renderCustomReminders() {
        const container = document.getElementById('custom-reminders-list');
        if (!container) return;

        const reminders = DataManager.getCustomReminders();
        container.innerHTML = '';

        if (reminders.length === 0) {
            container.innerHTML = '<div class="no-reminders">Keine eigenen Erinnerungen</div>';
            return;
        }

        const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        reminders.forEach(reminder => {
            const daysText = reminder.days.map(d => dayNames[d]).join(', ');
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `
                <div class="reminder-item-info">
                    <span class="reminder-item-title">${reminder.title}</span>
                    <span class="reminder-item-time">${reminder.time} - ${daysText}</span>
                </div>
                <button class="reminder-item-delete" data-id="${reminder.id}">×</button>
            `;
            container.appendChild(item);
        });

        // Delete Buttons
        container.querySelectorAll('.reminder-item-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                DataManager.removeCustomReminder(btn.dataset.id);
                this.renderCustomReminders();
                this.showToast('Erinnerung gelöscht');
            });
        });
    },

    /**
     * Zeigt Training Type Modal
     */
    showTrainingTypeModal(typeId = null) {
        const modal = document.getElementById('training-type-modal');
        const titleEl = document.getElementById('type-modal-title');
        const deleteBtn = document.getElementById('btn-delete-training-type');

        document.getElementById('type-edit-id').value = typeId || '';

        if (typeId) {
            // Bearbeiten
            titleEl.textContent = 'Trainingstyp bearbeiten';
            const type = DataManager.getTrainingType(typeId);
            if (type) {
                document.getElementById('type-name').value = type.name;
                document.getElementById('type-icon').value = type.icon;
                document.getElementById('type-color').value = type.color;
                document.getElementById('type-duration').value = type.duration || '';
                deleteBtn.style.display = type.isCustom ? 'block' : 'none';
            }
        } else {
            // Neu
            titleEl.textContent = 'Neuen Trainingstyp erstellen';
            document.getElementById('type-name').value = '';
            document.getElementById('type-icon').value = '';
            document.getElementById('type-color').value = '#ff6b35';
            document.getElementById('type-duration').value = '';
            deleteBtn.style.display = 'none';
        }

        modal.classList.remove('hidden');
    },

    /**
     * Speichert Training Type
     */
    saveTrainingType() {
        const id = document.getElementById('type-edit-id').value;
        const name = document.getElementById('type-name').value.trim();
        const icon = document.getElementById('type-icon').value.trim();
        const color = document.getElementById('type-color').value;
        const duration = document.getElementById('type-duration').value.trim();

        if (!name) {
            this.showToast('Bitte gib einen Namen ein');
            return;
        }

        if (!icon) {
            this.showToast('Bitte wähle ein Icon');
            return;
        }

        const typeData = { name, icon, color, duration };

        if (id) {
            DataManager.updateTrainingType(id, typeData);
        } else {
            const newId = 'custom_' + Date.now();
            DataManager.saveTrainingType(newId, { ...typeData, isCustom: true });
        }

        this.closeModal('training-type-modal');
        this.renderTrainingTypesList();
        this.showToast('Trainingstyp gespeichert!');
    },

    /**
     * Löscht Training Type
     */
    deleteTrainingType() {
        const id = document.getElementById('type-edit-id').value;
        if (!id) return;

        if (confirm('Trainingstyp wirklich löschen?')) {
            DataManager.deleteTrainingType(id);
            this.closeModal('training-type-modal');
            this.renderTrainingTypesList();
            this.showToast('Trainingstyp gelöscht');
        }
    },

    /**
     * Rendert Training Types Liste
     */
    renderTrainingTypesList() {
        const container = document.getElementById('training-types-list');
        if (!container) return;

        const types = DataManager.getAllTrainingTypes();
        container.innerHTML = '';

        Object.entries(types).forEach(([id, type]) => {
            const item = document.createElement('div');
            item.className = 'training-type-item';
            item.innerHTML = `
                <div class="training-type-info">
                    <span class="training-type-icon">${type.icon}</span>
                    <div>
                        <span class="training-type-name">${type.name}</span>
                        ${type.duration ? `<span class="training-type-duration">${type.duration}</span>` : ''}
                    </div>
                </div>
                <div class="training-type-color" style="background: ${type.color}"></div>
            `;
            item.addEventListener('click', () => this.showTrainingTypeModal(id));
            container.appendChild(item);
        });
    },

    /**
     * Update Visibility für Reminder Options
     */
    updateReminderOptionsVisibility() {
        const enabled = document.getElementById('setting-training-reminder').checked;
        const options = document.getElementById('training-reminder-options');
        if (options) {
            options.style.display = enabled ? 'block' : 'none';
        }
    },

    /**
     * Update Visibility für Reminder Mode
     */
    updateReminderModeVisibility() {
        const mode = document.querySelector('input[name="reminder-mode"]:checked')?.value || 'fixed';
        const fixedContainer = document.getElementById('reminder-fixed-container');
        const beforeContainer = document.getElementById('reminder-before-container');

        if (fixedContainer) fixedContainer.style.display = mode === 'fixed' ? 'block' : 'none';
        if (beforeContainer) beforeContainer.style.display = mode === 'before' ? 'block' : 'none';
    },

    /**
     * URL-Parameter verarbeiten
     */
    handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'today') {
            setTimeout(() => {
                if (DataManager.getCurrentUser()) {
                    this.openDayModal(CONFIG.toDateKey(new Date()));
                }
            }, 600);
        }
    },

    /**
     * Zeigt User Selection Screen
     */
    showUserSelection() {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('user-selection').classList.remove('hidden');
    },

    /**
     * Wählt einen User aus
     */
    selectUser(userId) {
        DataManager.setCurrentUser(userId);
        this.showDashboard();
    },

    /**
     * Zeigt Dashboard
     */
    showDashboard() {
        document.getElementById('user-selection').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');

        // UI aktualisieren
        this.updateUI();

        // Kalender initialisieren
        Calendar.init('calendar-grid', (dateKey) => {
            this.openDayModal(dateKey);
        });

        // Prüfe wöchentliche Pflichten
        this.checkWeeklyTasks();
    },

    /**
     * Prüft wöchentliche Aufgaben (Foto, Körperdaten)
     */
    checkWeeklyTasks() {
        const userId = DataManager.getCurrentUser();
        const user = DataManager.getUserData(userId);
        if (!user) return;

        const dataStatus = document.getElementById('weekly-data-status');
        const photoStatus = document.getElementById('weekly-photo-status');

        // Körperdaten Status
        if (CONFIG.isMeasurementWeekComplete(user.measurements || [])) {
            dataStatus.textContent = '✓';
            dataStatus.className = 'action-status done';
        } else {
            dataStatus.textContent = '!';
            dataStatus.className = 'action-status pending';
        }

        // Foto Status
        if (CONFIG.isPhotoWeekComplete(user.photos || [])) {
            photoStatus.textContent = '✓';
            photoStatus.className = 'action-status done';
        } else {
            photoStatus.textContent = '!';
            photoStatus.className = 'action-status pending';
        }
    },

    /**
     * Aktualisiert alle UI-Elemente
     */
    updateUI() {
        const userId = DataManager.getCurrentUser();
        if (!userId) return;

        const user = DataManager.getUserData(userId);
        const goals = user.goals;

        // Header aktualisieren
        const avatar = document.querySelector('.header-avatar');
        if (avatar) {
            avatar.textContent = user.avatar;
            avatar.style.background = user.color;
        }

        document.getElementById('header-title').textContent = user.name;

        // Streaks berechnen und anzeigen
        const streaks = StreakManager.calculateStreaks(userId);

        document.getElementById('main-streak-count').textContent = streaks.overall.current;
        document.getElementById('training-streak').textContent = streaks.training.current;
        document.getElementById('protein-streak').textContent = streaks.protein.current;

        // Schlaf-Streak (nur wenn Ziel gesetzt)
        const sleepContainer = document.getElementById('sleep-streak-container');
        if (goals.sleepBefore) {
            sleepContainer.style.display = 'flex';
            document.getElementById('sleep-streak').textContent = streaks.sleep?.current || 0;
        } else {
            sleepContainer.style.display = 'none';
        }

        // Kalorien-Streak (nur wenn Ziel gesetzt)
        const caloriesContainer = document.getElementById('calories-streak-container');
        if (goals.caloriesMax) {
            caloriesContainer.style.display = 'flex';
            document.getElementById('calories-streak').textContent = streaks.calories?.current || 0;
        } else {
            caloriesContainer.style.display = 'none';
        }

        // Quick Stats
        const stats = StreakManager.getStatistics(userId);
        document.getElementById('stat-success-rate').textContent = stats.successRate + '%';
        document.getElementById('stat-workouts-month').textContent = stats.workoutsThisMonth;
        document.getElementById('stat-longest-streak').textContent = stats.longestOverallStreak;

        // Kalender neu rendern
        if (Calendar.container) {
            Calendar.render();
        }

        // Wöchentliche Tasks prüfen
        this.checkWeeklyTasks();
    },

    /**
     * Öffnet Day Modal
     */
    openDayModal(dateKey) {
        this.selectedDate = dateKey;
        const userId = DataManager.getCurrentUser();
        const user = DataManager.getUserData(userId);
        const goals = user.goals;

        // Datum formatieren
        document.getElementById('modal-date').textContent = CONFIG.formatDate(dateKey);

        // Training-Info
        const date = new Date(dateKey);
        const dayOfWeek = date.getDay();
        const schedule = DataManager.getSchedule(userId);
        const scheduled = schedule[dayOfWeek] || [];
        const trainingInfo = document.getElementById('training-info');
        const trainingText = document.querySelector('.training-text');

        // Workout Accordion
        const accordion = document.getElementById('workout-accordion');
        const accordionContent = document.getElementById('accordion-content');
        const accordionToggle = document.getElementById('accordion-toggle');

        if (scheduled.length > 0 && !scheduled.includes('rest')) {
            const trainingNames = scheduled.map(type => {
                const info = CONFIG.TRAINING_TYPES[type];
                return info ? `${info.icon} ${info.name}` : type;
            });
            trainingText.textContent = 'Heute: ' + trainingNames.join(', ');
            trainingInfo.classList.remove('rest-day');
            document.getElementById('check-training-label').textContent = 'Training gemäß Plan absolviert';

            // Workout-Plan laden und Accordion füllen
            accordion.style.display = 'block';
            this.fillWorkoutAccordion(userId, scheduled, dayOfWeek);
        } else {
            trainingText.textContent = '😴 Heute ist Ruhetag';
            trainingInfo.classList.add('rest-day');
            document.getElementById('check-training-label').textContent = 'Ruhetag eingehalten (kein Training nötig)';

            // Accordion verstecken bei Ruhetag
            accordion.style.display = 'none';
        }

        // Accordion zurücksetzen (eingeklappt)
        accordionContent.classList.add('hidden');
        accordionToggle.classList.remove('active');

        // Protein-Label
        document.getElementById('check-protein-label').textContent = `Protein-Ziel erreicht (>${goals.protein}g)`;

        // Schlaf-Container
        const sleepContainer = document.getElementById('check-sleep-container');
        if (goals.sleepBefore) {
            sleepContainer.style.display = 'flex';
            document.getElementById('check-sleep-label').textContent = `Schlaf vor ${goals.sleepBefore}`;
        } else {
            sleepContainer.style.display = 'none';
        }

        // Kalorien-Container
        const caloriesContainer = document.getElementById('check-calories-container');
        if (goals.caloriesMax) {
            caloriesContainer.style.display = 'flex';
            document.getElementById('check-calories-label').textContent = `Kalorien unter ${goals.caloriesMax} kcal`;
        } else {
            caloriesContainer.style.display = 'none';
        }

        // Bestehenden Eintrag laden
        const entry = DataManager.getEntry(dateKey, userId);
        document.getElementById('check-training').checked = entry?.training === true;
        document.getElementById('check-protein').checked = entry?.protein === true;
        document.getElementById('check-sleep').checked = entry?.sleep === true;
        document.getElementById('check-calories').checked = entry?.calories === true;

        // Modal öffnen
        document.getElementById('day-modal').classList.remove('hidden');
    },

    /**
     * Speichert den Tag
     */
    saveDay() {
        const userId = DataManager.getCurrentUser();
        const dateKey = this.selectedDate;
        const date = new Date(dateKey);

        // Werte auslesen
        const training = document.getElementById('check-training').checked;
        const protein = document.getElementById('check-protein').checked;
        const sleep = document.getElementById('check-sleep').checked;
        const calories = document.getElementById('check-calories').checked;

        // Alten Eintrag holen (für Streak-Vergleich)
        const oldStreaks = DataManager.getStreaks(userId);

        // Speichern
        const entry = { training, protein, sleep, calories };
        DataManager.saveEntry(dateKey, entry, userId);

        // Modal schließen
        this.closeModal('day-modal');

        // Streaks neu berechnen
        const newStreaks = StreakManager.calculateStreaks(userId);

        // UI aktualisieren
        this.updateUI();

        // Prüfe auf neue Badges
        const newBadges = StreakManager.checkForNewBadges(userId);
        if (newBadges.length > 0) {
            this.showBadgeEarned(newBadges[0]);
        } else {
            // Prüfe ob alle Ziele erreicht
            const goals = DataManager.getGoals(userId);
            const schedule = DataManager.getSchedule(userId);
            const dayOfWeek = date.getDay();
            const scheduled = schedule[dayOfWeek] || [];
            const isTrainingDay = scheduled.length > 0 && !scheduled.includes('rest');

            let allMet = true;
            if (isTrainingDay && !training) allMet = false;
            if (!protein) allMet = false;
            if (goals.sleepBefore && !sleep) allMet = false;
            if (goals.caloriesMax && !calories) allMet = false;

            if (allMet) {
                this.showMotivationalQuote();
            } else {
                this.showToast('Eintrag gespeichert!');
            }
        }

        // Prüfe auf Streak-Unterbrechung
        if (oldStreaks && oldStreaks.overall.current > 0 && newStreaks.overall.current === 0) {
            const message = StreakManager.getStreakBreakMessage(oldStreaks.overall.current);
            setTimeout(() => {
                this.showToast(message);
            }, 2000);
        }
    },

    /**
     * Zeigt Weekly Data Modal
     */
    showWeeklyDataModal() {
        const userId = DataManager.getCurrentUser();
        const user = DataManager.getUserData(userId);

        // Letzte Werte als Placeholder
        const lastMeasurement = user.measurements?.[user.measurements.length - 1];
        document.getElementById('input-weight').value = lastMeasurement?.weight || '';
        document.getElementById('input-bodyfat').value = lastMeasurement?.bodyFat || '';

        document.getElementById('weekly-data-modal').classList.remove('hidden');
    },

    /**
     * Speichert wöchentliche Körperdaten
     */
    saveWeeklyData() {
        const weight = parseFloat(document.getElementById('input-weight').value);
        const bodyFat = parseFloat(document.getElementById('input-bodyfat').value);

        if (!weight || weight < 30 || weight > 200) {
            this.showToast('Bitte gib ein gültiges Gewicht ein');
            return;
        }

        const measurement = {
            date: CONFIG.toDateKey(new Date()),
            weight: weight,
            bodyFat: bodyFat || null
        };

        DataManager.addMeasurement(measurement);
        this.closeModal('weekly-data-modal');
        this.showToast('Körperdaten gespeichert!');
        this.checkWeeklyTasks();
    },

    /**
     * Zeigt Weekly Photo Modal
     */
    showWeeklyPhotoModal() {
        // Reset
        this.photoData = null;
        document.getElementById('photo-preview').classList.add('hidden');
        document.getElementById('photo-placeholder').style.display = 'flex';
        document.getElementById('btn-save-weekly-photo').disabled = true;
        document.getElementById('input-photo').value = '';

        document.getElementById('weekly-photo-modal').classList.remove('hidden');
    },

    /**
     * Speichert wöchentliches Foto
     */
    saveWeeklyPhoto() {
        if (!this.photoData) {
            this.showToast('Bitte wähle zuerst ein Foto aus');
            return;
        }

        const photo = {
            date: CONFIG.toDateKey(new Date()),
            dataUrl: this.photoData
        };

        DataManager.addPhoto(photo);
        this.closeModal('weekly-photo-modal');
        this.showToast('Fortschrittsfoto gespeichert!');
        this.checkWeeklyTasks();

        // Prüfe auf Foto-Badges
        const newBadges = StreakManager.checkForNewBadges(DataManager.getCurrentUser());
        if (newBadges.length > 0) {
            setTimeout(() => {
                this.showBadgeEarned(newBadges[0]);
            }, 500);
        }
    },

    /**
     * Zeigt Trainingsplan
     */
    showWorkoutPlan() {
        const userId = DataManager.getCurrentUser();
        const schedule = DataManager.getSchedule(userId);
        const content = document.getElementById('workout-plan-content');
        content.innerHTML = '';

        const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mo-So

        for (const dayIndex of dayOrder) {
            const dayName = CONFIG.WEEKDAYS_FULL[dayIndex];
            const trainings = schedule[dayIndex] || [];

            if (trainings.length === 0 || trainings.includes('rest')) {
                // Ruhetag
                const dayEl = document.createElement('div');
                dayEl.className = 'workout-day';
                dayEl.innerHTML = `
                    <div class="workout-day-header" style="background: var(--color-text-muted)">
                        <span class="workout-day-name">${dayName}</span>
                        <span class="workout-day-duration">Ruhetag 😴</span>
                    </div>
                `;
                content.appendChild(dayEl);
                continue;
            }

            for (const trainingType of trainings) {
                const workoutKey = `${trainingType}_${dayIndex}`;
                const plans = CONFIG.WORKOUT_PLANS[userId];
                const user = CONFIG.DEFAULT_USERS[userId];
                const planKey = user?.workoutMapping?.[workoutKey] || user?.workoutMapping?.[trainingType];
                const plan = plans?.[planKey];

                if (!plan) continue;

                const typeInfo = CONFIG.TRAINING_TYPES[trainingType] || {};
                const dayEl = document.createElement('div');
                dayEl.className = 'workout-day';

                let exercisesHtml = '';
                for (const ex of plan.exercises) {
                    exercisesHtml += `
                        <div class="exercise-item">
                            <span class="exercise-name">${ex.name}</span>
                            <span class="exercise-sets">${ex.sets}×${ex.reps}</span>
                            <span class="exercise-muscle">${ex.muscle}</span>
                        </div>
                    `;
                }

                dayEl.innerHTML = `
                    <div class="workout-day-header" style="background: ${typeInfo.color || 'var(--color-accent)'}">
                        <span class="workout-day-name">${dayName}: ${typeInfo.icon || ''} ${plan.name}</span>
                        <span class="workout-day-duration">${plan.duration}</span>
                    </div>
                    <div class="workout-exercises">
                        ${exercisesHtml}
                    </div>
                `;
                content.appendChild(dayEl);
            }
        }

        document.getElementById('workout-plan-modal').classList.remove('hidden');
    },

    /**
     * Zeigt Fortschritt/Grafiken
     */
    showProgress() {
        const userId = DataManager.getCurrentUser();
        const user = DataManager.getUserData(userId);

        // Weight Chart
        this.renderChart('weight-chart', user.measurements || [], 'weight', 'kg');

        // Body Fat Chart
        this.renderChart('bodyfat-chart', user.measurements || [], 'bodyFat', '%');

        // Photo Gallery
        this.renderPhotoGallery(user.photos || []);

        document.getElementById('progress-modal').classList.remove('hidden');
    },

    /**
     * Rendert ein einfaches Liniendiagramm
     */
    renderChart(canvasId, data, field, unit) {
        const canvas = document.getElementById(canvasId);
        const container = canvas.parentElement;

        if (!data || data.length === 0) {
            container.innerHTML = `<div class="chart-empty">Noch keine Daten vorhanden</div>`;
            return;
        }

        const ctx = canvas.getContext('2d');
        const width = container.clientWidth - 32;
        const height = 160;
        canvas.width = width;
        canvas.height = height;

        // Filter valid data
        const validData = data.filter(d => d[field] !== null && d[field] !== undefined);
        if (validData.length === 0) {
            container.innerHTML = `<div class="chart-empty">Noch keine Daten vorhanden</div>`;
            return;
        }

        // Calculate bounds
        const values = validData.map(d => d[field]);
        const minVal = Math.min(...values) * 0.95;
        const maxVal = Math.max(...values) * 1.05;
        const range = maxVal - minVal || 1;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#2a2a4a';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(40, y + 10);
            ctx.lineTo(width - 10, y + 10);
            ctx.stroke();
        }

        // Draw Y-axis labels
        ctx.fillStyle = '#6c6c6c';
        ctx.font = '10px sans-serif';
        for (let i = 0; i <= 4; i++) {
            const value = maxVal - (range / 4) * i;
            const y = (height / 4) * i + 14;
            ctx.fillText(value.toFixed(1), 5, y);
        }

        // Draw line
        const padding = 50;
        const chartWidth = width - padding - 10;
        const chartHeight = height - 30;
        const stepX = validData.length > 1 ? chartWidth / (validData.length - 1) : chartWidth;

        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        ctx.beginPath();

        validData.forEach((d, i) => {
            const x = padding + i * stepX;
            const y = 10 + chartHeight - ((d[field] - minVal) / range) * chartHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#ff6b35';
        validData.forEach((d, i) => {
            const x = padding + i * stepX;
            const y = 10 + chartHeight - ((d[field] - minVal) / range) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw X-axis labels (dates)
        ctx.fillStyle = '#6c6c6c';
        ctx.font = '9px sans-serif';
        const maxLabels = 5;
        const labelStep = Math.ceil(validData.length / maxLabels);
        validData.forEach((d, i) => {
            if (i % labelStep === 0 || i === validData.length - 1) {
                const x = padding + i * stepX;
                const date = new Date(d.date);
                const label = `${date.getDate()}.${date.getMonth() + 1}`;
                ctx.fillText(label, x - 10, height - 5);
            }
        });

        // Update legend
        const legendId = canvasId.replace('-chart', '-legend');
        const legend = document.getElementById(legendId);
        if (legend && validData.length > 0) {
            const first = validData[0][field];
            const last = validData[validData.length - 1][field];
            const diff = last - first;
            const diffText = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
            legend.innerHTML = `Start: ${first.toFixed(1)}${unit} | Aktuell: ${last.toFixed(1)}${unit} | Differenz: ${diffText}${unit}`;
        }
    },

    /**
     * Rendert Foto-Galerie
     */
    renderPhotoGallery(photos) {
        const gallery = document.getElementById('photo-gallery');
        gallery.innerHTML = '';

        if (!photos || photos.length === 0) {
            gallery.innerHTML = '<div class="photo-gallery-empty">Noch keine Fortschrittsfotos vorhanden</div>';
            return;
        }

        // Sort by date descending (newest first)
        const sortedPhotos = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedPhotos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'photo-gallery-item';
            item.innerHTML = `
                <img src="${photo.dataUrl}" alt="Fortschrittsfoto ${CONFIG.formatDateShort(photo.date)}">
                <div class="photo-gallery-date">${CONFIG.formatDateShort(photo.date)}</div>
            `;
            item.addEventListener('click', () => {
                this.openPhotoViewer(sortedPhotos, index);
            });
            gallery.appendChild(item);
        });
    },

    /**
     * Öffnet Foto-Viewer
     */
    openPhotoViewer(photos, index) {
        this.viewerPhotos = photos;
        this.currentPhotoIndex = index;
        this.updatePhotoViewer();
        document.getElementById('photo-viewer-modal').classList.remove('hidden');
    },

    /**
     * Aktualisiert Foto-Viewer
     */
    updatePhotoViewer() {
        const photo = this.viewerPhotos[this.currentPhotoIndex];
        document.getElementById('photo-viewer-image').src = photo.dataUrl;
        document.getElementById('photo-viewer-date').textContent = CONFIG.formatDate(photo.date);

        // Navigation Buttons
        document.getElementById('btn-photo-prev').style.visibility =
            this.currentPhotoIndex > 0 ? 'visible' : 'hidden';
        document.getElementById('btn-photo-next').style.visibility =
            this.currentPhotoIndex < this.viewerPhotos.length - 1 ? 'visible' : 'hidden';
    },

    /**
     * Navigiert im Foto-Viewer
     */
    navigatePhoto(direction) {
        const newIndex = this.currentPhotoIndex + direction;
        if (newIndex >= 0 && newIndex < this.viewerPhotos.length) {
            this.currentPhotoIndex = newIndex;
            this.updatePhotoViewer();
        }
    },

    /**
     * Schließt ein Modal
     */
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    },

    /**
     * Zeigt Badges Modal
     */
    showBadges() {
        const userId = DataManager.getCurrentUser();
        const earnedBadges = DataManager.getBadges(userId);
        const grid = document.getElementById('badges-grid');
        grid.innerHTML = '';

        for (const badge of CONFIG.BADGES) {
            const earned = earnedBadges.find(b => b.id === badge.id);
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge' + (earned ? ' badge--earned' : '');
            badgeEl.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
            `;
            badgeEl.title = badge.description + (earned ? `\nVerdient am: ${CONFIG.formatDate(earned.earnedAt)}` : '\nNoch nicht verdient');
            grid.appendChild(badgeEl);
        }

        document.getElementById('badges-modal').classList.remove('hidden');
    },

    /**
     * Zeigt Stats Modal
     */
    showStats() {
        const userId = DataManager.getCurrentUser();
        const stats = StreakManager.getStatistics(userId);
        const content = document.getElementById('stats-content');

        content.innerHTML = `
            <div class="stats-card">
                <div class="stats-card-icon">📊</div>
                <div class="stats-card-value">${stats.successRate}%</div>
                <div class="stats-card-label">Erfolgsquote</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">🔥</div>
                <div class="stats-card-value">${stats.longestOverallStreak}</div>
                <div class="stats-card-label">Längste Streak</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">💪</div>
                <div class="stats-card-value">${stats.totalWorkouts}</div>
                <div class="stats-card-label">Trainings gesamt</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">📅</div>
                <div class="stats-card-value">${stats.workoutsThisMonth}</div>
                <div class="stats-card-label">Trainings (Monat)</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">🥩</div>
                <div class="stats-card-value">${stats.proteinRate}%</div>
                <div class="stats-card-label">Protein-Quote</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">🏆</div>
                <div class="stats-card-value">${stats.badgesEarned}/${stats.totalBadges}</div>
                <div class="stats-card-label">Badges</div>
            </div>
            <div class="stats-card full-width">
                <div class="stats-card-icon">📝</div>
                <div class="stats-card-value">${stats.totalEntries}</div>
                <div class="stats-card-label">Tage getrackt</div>
            </div>
        `;

        document.getElementById('stats-modal').classList.remove('hidden');
    },

    /**
     * Zeigt Settings Modal
     */
    showSettings() {
        const userId = DataManager.getCurrentUser();
        const user = DataManager.getUserData(userId);
        const goals = user.goals;
        const settings = DataManager.getSettings();
        const profile = user.profile || {};

        // Werte setzen
        document.getElementById('setting-notifications').checked = settings.notificationsEnabled;
        document.getElementById('setting-morning-time').value = settings.morningReminderTime || '09:00';
        document.getElementById('setting-evening-time').value = settings.eveningReminderTime || '21:00';
        document.getElementById('setting-protein').value = goals.protein || 100;
        document.getElementById('setting-weekly-workouts').value = goals.weeklyWorkouts || 3;

        // Schlaf-Einstellungen
        const sleepSettingContainer = document.getElementById('setting-sleep-container');
        const sleepHoursContainer = document.getElementById('setting-sleep-hours-container');
        if (userId === 'denise') {
            sleepSettingContainer.style.display = 'flex';
            document.getElementById('setting-sleep-before').value = goals.sleepBefore || '';
        } else {
            sleepSettingContainer.style.display = 'none';
        }
        // Schlafstunden für beide
        sleepHoursContainer.style.display = 'flex';
        document.getElementById('setting-sleep-hours').value = goals.sleepHours || 7;

        // Kalorien-Einstellungen
        const caloriesSettingContainer = document.getElementById('setting-calories-container');
        const caloriesTargetContainer = document.getElementById('setting-calories-target-container');
        if (userId === 'moritz') {
            caloriesSettingContainer.style.display = 'flex';
            caloriesTargetContainer.style.display = 'flex';
            document.getElementById('setting-calories').value = goals.caloriesMax || '';
            document.getElementById('setting-calories-target').value = goals.caloriesTarget || '';
        } else {
            caloriesSettingContainer.style.display = 'none';
            caloriesTargetContainer.style.display = 'none';
        }

        // Profil bearbeitbar
        document.getElementById('setting-age').value = profile.age || '';
        document.getElementById('setting-height').value = profile.height || '';
        document.getElementById('setting-bodytype').value = profile.bodyType || 'mesomorph';
        document.getElementById('setting-conditions').value = (profile.conditions || []).join(', ');
        document.getElementById('setting-sporthistory').value = (profile.sportHistory || []).join(', ');

        // Aktuelles Gewicht (readonly - aus letzter Messung)
        const lastMeasurement = user.measurements?.[user.measurements.length - 1];
        document.getElementById('setting-current-weight').value = lastMeasurement?.weight || '-';

        // Training Reminder
        document.getElementById('setting-training-reminder').checked = settings.trainingReminderEnabled || false;
        const reminderMode = settings.trainingReminderMode || 'fixed';
        document.getElementById('reminder-mode-fixed').checked = reminderMode === 'fixed';
        document.getElementById('reminder-mode-before').checked = reminderMode === 'before';
        document.getElementById('setting-training-time').value = settings.trainingReminderTime || '17:00';
        document.getElementById('setting-training-minutes').value = settings.trainingReminderMinutes || 60;
        this.updateReminderOptionsVisibility();
        this.updateReminderModeVisibility();

        // Custom Reminders rendern
        this.renderCustomReminders();

        // Schedule Editor rendern
        this.renderScheduleEditor();

        // Training Types rendern
        this.renderTrainingTypesList();

        // Google Calendar Status
        if (GoogleCalendarSync.isConfigured()) {
            GoogleCalendarSync.onSignInChange(GoogleCalendarSync.isSignedIn);
        }
        document.getElementById('setting-calendar-time').value = settings.calendarTrainingTime || '17:00';

        document.getElementById('settings-modal').classList.remove('hidden');
    },

    /**
     * Rendert den Schedule Editor
     */
    renderScheduleEditor() {
        const userId = DataManager.getCurrentUser();
        const schedule = DataManager.getSchedule(userId);
        const editor = document.getElementById('schedule-editor');
        editor.innerHTML = '';

        const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const dayIndices = [1, 2, 3, 4, 5, 6, 0];

        dayIndices.forEach((dayIndex, i) => {
            const daySchedule = schedule[dayIndex] || [];
            const dayEl = document.createElement('div');
            dayEl.className = 'schedule-day';
            dayEl.innerHTML = `
                <span class="schedule-day-name">${days[i]}</span>
                <div class="schedule-day-options">
                    ${Object.entries(CONFIG.TRAINING_TYPES).map(([type, info]) => `
                        <button class="schedule-option ${daySchedule.includes(type) ? 'active' : ''}"
                                data-day="${dayIndex}" data-type="${type}">
                            ${info.icon}
                        </button>
                    `).join('')}
                </div>
            `;
            editor.appendChild(dayEl);
        });

        editor.querySelectorAll('.schedule-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const day = btn.dataset.day;
                const type = btn.dataset.type;
                this.toggleSchedule(parseInt(day), type);
                btn.classList.toggle('active');
            });
        });
    },

    /**
     * Toggled einen Trainingstag
     */
    toggleSchedule(dayIndex, type) {
        const userId = DataManager.getCurrentUser();
        const schedule = DataManager.getSchedule(userId);

        if (!schedule[dayIndex]) {
            schedule[dayIndex] = [];
        }

        const index = schedule[dayIndex].indexOf(type);
        if (index === -1) {
            schedule[dayIndex] = [type];
        } else {
            schedule[dayIndex].splice(index, 1);
        }

        DataManager.updateSchedule(schedule, userId);
        Calendar.render();
    },

    /**
     * Exportiert Daten als JSON
     */
    exportData() {
        const data = DataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `fitness-tracker-backup-${CONFIG.toDateKey(new Date())}.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showToast('Daten exportiert!');
    },

    /**
     * Importiert Daten aus JSON
     */
    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = DataManager.importData(e.target.result);
            if (success) {
                this.showToast('Daten importiert!');
                this.updateUI();
                this.closeModal('settings-modal');
            } else {
                this.showToast('Import fehlgeschlagen!');
            }
        };
        reader.readAsText(file);
    },

    /**
     * Zeigt Toast-Nachricht
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');

        messageEl.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    },

    /**
     * Zeigt Motivationsspruch
     */
    showMotivationalQuote() {
        const quote = CONFIG.getRandomQuote('success');
        document.getElementById('quote-text').textContent = quote;
        document.getElementById('quote-modal').classList.remove('hidden');
    },

    /**
     * Zeigt Badge-Earned Modal
     */
    showBadgeEarned(badge) {
        document.getElementById('earned-badge-icon').textContent = badge.icon;
        document.getElementById('earned-badge-name').textContent = badge.name;
        document.getElementById('earned-badge-description').textContent = badge.description;
        document.getElementById('badge-earned-modal').classList.remove('hidden');
    }
};

// App starten wenn DOM geladen
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
