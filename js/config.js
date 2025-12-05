/**
 * DeMori Fitness Tracker - Konfiguration
 * Konstanten, Trainingspläne, Nutzerprofile und Motivationssprüche
 */

const CONFIG = {
    // App-Version
    VERSION: '2.0.0',

    // Trainingstypen
    TRAINING_TYPES: {
        strength: { name: 'Krafttraining', icon: '💪', color: '#ff6b35' },
        cardio: { name: 'Cardio', icon: '🏃', color: '#4CAF50' },
        boxing: { name: 'Boxen/Kickboxen', icon: '🥊', color: '#e91e63' },
        bouldering: { name: 'Bouldern', icon: '🧗', color: '#9c27b0' },
        jiujitsu: { name: 'Jiu-Jitsu', icon: '🥋', color: '#2196F3' },
        mobility: { name: 'Mobility/Yoga', icon: '🧘', color: '#00bcd4' },
        rest: { name: 'Ruhetag', icon: '😴', color: '#9e9e9e' }
    },

    // Detaillierte Trainingspläne mit Übungen
    WORKOUT_PLANS: {
        denise: {
            // Tag 1: Montag - Ganzkörper Kraft
            strength_day1: {
                name: 'Ganzkörper Tag 1',
                duration: '45-60 min',
                exercises: [
                    { name: 'Kniebeugen mit Kurzhantel', sets: 3, reps: '8-10', muscle: 'Beine' },
                    { name: 'Liegestütze oder KH-Bankdrücken', sets: 3, reps: '10-12', muscle: 'Brust' },
                    { name: 'Einarmiges Rudern mit KH', sets: 3, reps: '10 pro Seite', muscle: 'Rücken' },
                    { name: 'Ausfallschritte mit KH', sets: 3, reps: '12', muscle: 'Beine' },
                    { name: 'Schulterdrücken mit KH', sets: 3, reps: '8-10', muscle: 'Schultern' },
                    { name: 'Plank', sets: 3, reps: '30-60 sek', muscle: 'Core' }
                ]
            },
            // Tag 2: Mittwoch - Ganzkörper Kraft (Variation)
            strength_day2: {
                name: 'Ganzkörper Tag 2',
                duration: '45-60 min',
                exercises: [
                    { name: 'Bulgarian Split Squats', sets: 3, reps: '10 pro Bein', muscle: 'Beine' },
                    { name: 'Klimmzüge/Invertierte Rudern', sets: 3, reps: 'max', muscle: 'Rücken' },
                    { name: 'Enge Liegestütze (Trizeps)', sets: 3, reps: '8-12', muscle: 'Trizeps' },
                    { name: 'Schulter-Seitheben mit KH', sets: 3, reps: '12', muscle: 'Schultern' },
                    { name: 'Bizeps-Curls + Trizeps-Dips (Supersatz)', sets: 2, reps: '12 je', muscle: 'Arme' },
                    { name: 'Seitlicher Unterarmstütz', sets: 3, reps: '20 sek je Seite', muscle: 'Core' }
                ]
            },
            // Tag 3: Freitag - Ganzkörper Kraft
            strength_day3: {
                name: 'Ganzkörper Tag 3',
                duration: '45-60 min',
                exercises: [
                    { name: 'Kreuzheben mit KH', sets: 3, reps: '10', muscle: 'Rücken/Beine' },
                    { name: 'Liegestütze erhöht (Füße auf Stuhl)', sets: 3, reps: '8-10', muscle: 'Brust' },
                    { name: 'Vorgebeugtes KH-Rudern', sets: 3, reps: '10', muscle: 'Rücken' },
                    { name: 'Reverse Lunge (Ausfallschritt rückwärts)', sets: 3, reps: '10 je Bein', muscle: 'Beine' },
                    { name: 'Frontheben mit KH', sets: 3, reps: '12', muscle: 'Schultern' },
                    { name: 'Russian Twists', sets: 3, reps: '20', muscle: 'Core' }
                ]
            },
            boxing: {
                name: 'Boxen/Kickboxen',
                duration: '60 min',
                exercises: [
                    { name: 'Aufwärmen: Seilspringen', sets: 1, reps: '5 min', muscle: 'Cardio' },
                    { name: 'Schattenboxen', sets: 3, reps: '3 min Runden', muscle: 'Ganzkörper' },
                    { name: 'Sandsack-Kombinationen', sets: 5, reps: '3 min Runden', muscle: 'Oberkörper' },
                    { name: 'Kicks und Kniestöße', sets: 3, reps: '2 min je Seite', muscle: 'Beine' },
                    { name: 'Core-Finisher (Sit-ups, Crunches)', sets: 3, reps: '20', muscle: 'Core' },
                    { name: 'Cooldown & Dehnen', sets: 1, reps: '10 min', muscle: 'Flexibilität' }
                ]
            },
            cardio: {
                name: 'Cardio/HIIT',
                duration: '30-45 min',
                exercises: [
                    { name: 'Aufwärmen', sets: 1, reps: '5 min', muscle: 'Cardio' },
                    { name: 'Burpees', sets: 4, reps: '30 sek on / 30 sek off', muscle: 'Ganzkörper' },
                    { name: 'Mountain Climbers', sets: 4, reps: '30 sek on / 30 sek off', muscle: 'Core' },
                    { name: 'Jump Squats', sets: 4, reps: '30 sek on / 30 sek off', muscle: 'Beine' },
                    { name: 'High Knees', sets: 4, reps: '30 sek on / 30 sek off', muscle: 'Cardio' },
                    { name: 'Cooldown & Stretching', sets: 1, reps: '10 min', muscle: 'Flexibilität' }
                ]
            }
        },
        moritz: {
            // Tag 1: Dienstag - Ganzkörper Kraft
            strength_day1: {
                name: 'Ganzkörper Tag 1',
                duration: '45-60 min',
                exercises: [
                    { name: 'Kniebeugen mit Kurzhantel', sets: 4, reps: '8-10', muscle: 'Beine' },
                    { name: 'Klimmzüge (oder negativ)', sets: 4, reps: 'max', muscle: 'Rücken' },
                    { name: 'KH-Bankdrücken (Schrägbank)', sets: 3, reps: '10-12', muscle: 'Brust' },
                    { name: 'Rudern vorgebeugt mit KH', sets: 3, reps: '10', muscle: 'Rücken' },
                    { name: 'Schulterdrücken mit KH', sets: 3, reps: '8-10', muscle: 'Schultern' },
                    { name: 'Plank + Side Plank', sets: 3, reps: '30 sek je', muscle: 'Core' }
                ]
            },
            // Tag 2: Mittwoch - Sport (Jiu-Jitsu oder leichtes Training)
            sport_day: {
                name: 'Jiu-Jitsu oder Mobility',
                duration: '60-90 min',
                exercises: [
                    { name: 'Jiu-Jitsu Training', sets: 1, reps: '60-90 min', muscle: 'Ganzkörper' },
                    { name: 'ODER: Mobility-Routine', sets: 1, reps: '20 min', muscle: 'Flexibilität' },
                    { name: 'Core-Training', sets: 3, reps: '30 sek je Übung', muscle: 'Core' },
                    { name: 'Dehnen', sets: 1, reps: '10 min', muscle: 'Flexibilität' }
                ]
            },
            // Tag 3: Freitag - Ganzkörper Kraft
            strength_day2: {
                name: 'Ganzkörper Tag 2',
                duration: '45-60 min',
                exercises: [
                    { name: 'Bulgarian Split Squats', sets: 3, reps: '10 pro Bein', muscle: 'Beine' },
                    { name: 'KH-Rudern einarmig', sets: 3, reps: '10 pro Arm', muscle: 'Rücken' },
                    { name: 'Dips an Barren', sets: 3, reps: '8-12', muscle: 'Trizeps/Brust' },
                    { name: 'Rumänisches Kreuzheben', sets: 3, reps: '10', muscle: 'Hamstrings' },
                    { name: 'KH-Curls + Trizeps-Extension', sets: 2, reps: '12 je', muscle: 'Arme' },
                    { name: 'Leg Raises / Hanging Knee Raises', sets: 3, reps: '12', muscle: 'Core' }
                ]
            },
            // Samstag: Bouldern
            bouldering: {
                name: 'Bouldern',
                duration: '4-5 Stunden',
                exercises: [
                    { name: 'Aufwärmen (Schultern, Finger)', sets: 1, reps: '15 min', muscle: 'Oberkörper' },
                    { name: 'Boulder-Session', sets: 1, reps: '3-4 Stunden', muscle: 'Ganzkörper' },
                    { name: 'Antagonisten-Training (Liegestütze)', sets: 2, reps: '15', muscle: 'Brust' },
                    { name: 'Dehnen (Unterarme, Schultern, Rücken)', sets: 1, reps: '15 min', muscle: 'Flexibilität' }
                ]
            },
            // Sonntag: Ganzkörper oder Ruhe
            strength_day3: {
                name: 'Ganzkörper Tag 3 (optional)',
                duration: '45 min',
                exercises: [
                    { name: 'Ausfallschritte', sets: 3, reps: '10 je Bein', muscle: 'Beine' },
                    { name: 'Military Press (stehend)', sets: 3, reps: '8', muscle: 'Schultern' },
                    { name: 'Einarmiges KH-Rudern', sets: 3, reps: '10 je', muscle: 'Rücken' },
                    { name: 'Liegestütze mit Zusatzgewicht', sets: 3, reps: '8', muscle: 'Brust' },
                    { name: 'Hip Thrusts / Bridging', sets: 3, reps: '12', muscle: 'Gesäß' },
                    { name: 'Russian Twists', sets: 3, reps: '15', muscle: 'Core' }
                ]
            }
        }
    },

    // Badge-Definitionen
    BADGES: [
        { id: 'firstday', name: 'Erster Schritt', icon: '🌟', requirement: 1, description: 'Ersten Tag erfolgreich abgeschlossen' },
        { id: 'week1', name: 'Woche geschafft', icon: '🏅', requirement: 7, description: '7 Tage Streak erreicht' },
        { id: 'week2', name: '2 Wochen stark', icon: '🎖️', requirement: 14, description: '14 Tage Streak erreicht' },
        { id: 'week3', name: '21 Tage - Gewohnheit!', icon: '🧠', requirement: 21, description: '21 Tage Streak - Gewohnheit gebildet!' },
        { id: 'month1', name: 'Monats-Champion', icon: '🏆', requirement: 30, description: '30 Tage Streak erreicht' },
        { id: 'month2', name: 'Zwei-Monats-Held', icon: '🥇', requirement: 60, description: '60 Tage Streak erreicht' },
        { id: 'master', name: 'Gewohnheits-Meister', icon: '👑', requirement: 100, description: '100 Tage Streak erreicht' },
        { id: 'training10', name: 'Training-Starter', icon: '🎯', requirement: 10, type: 'training', description: '10 Trainings absolviert' },
        { id: 'training25', name: 'Training-Regular', icon: '💪', requirement: 25, type: 'training', description: '25 Trainings absolviert' },
        { id: 'training50', name: 'Training-Pro', icon: '⭐', requirement: 50, type: 'training', description: '50 Trainings absolviert' },
        { id: 'protein7', name: 'Protein-Woche', icon: '🥩', requirement: 7, type: 'protein', description: '7 Tage Protein-Ziel erreicht' },
        { id: 'protein30', name: 'Protein-Profi', icon: '🍖', requirement: 30, type: 'protein', description: '30 Tage Protein-Ziel erreicht' },
        { id: 'photo4', name: 'Foto-Dokumentar', icon: '📸', requirement: 4, type: 'photo', description: '4 Wochen Fortschrittsfotos' },
        { id: 'photo12', name: 'Transformation', icon: '🦋', requirement: 12, type: 'photo', description: '12 Wochen Fortschrittsfotos' }
    ],

    // Motivationssprüche nach erfolgreichem Tag
    QUOTES_SUCCESS: [
        "Super, Ziel erreicht! Weiter so – du wirst jeden Tag stärker. 💪",
        "Stark! Jeder Tag zählt auf deinem Weg zum Erfolg! 🔥",
        "Fantastisch! Du baust gerade echte Gewohnheiten auf! ⭐",
        "Großartig! Deine Disziplin zahlt sich aus! 🏆",
        "Perfekt! Ein weiterer Schritt Richtung Ziel! 🎯",
        "Hammer! Du rockst das! 🚀",
        "Ausgezeichnet! Dein zukünftiges Ich wird dir danken! 💎",
        "Klasse! Konstanz ist der Schlüssel zum Erfolg! 🔑",
        "Wow! Du bist auf dem besten Weg! 🌟",
        "Mega! Bleib genau so dran! 💥",
        "Champion! Das war ein erfolgreicher Tag! 🏅",
        "Respekt! Du ziehst das echt durch! 👏",
        "Beeindruckend! Deine Willenskraft ist stark! 💎",
        "Yeah! Wieder ein Tag geschafft! 🎉",
        "Top! Du machst das großartig! ⚡",
        "Der einzige schlechte Workout ist der, der nicht stattfindet! 💪",
        "Jeder Tropfen Schweiß ist ein Schritt näher zum Ziel! 🏃",
        "Heute hast du dein zukünftiges Ich stolz gemacht! 🌟"
    ],

    // Sprüche bei Streak-Unterbrechung (motivierend, nicht demotivierend)
    QUOTES_STREAK_BREAK: [
        "Kein Problem – heute ist ein neuer Tag! 🌅",
        "Rückschläge gehören dazu – wichtig ist, weiterzumachen! 💪",
        "Morgen ist eine neue Chance! Du schaffst das! 🌟",
        "Eine Pause ist okay – starte jetzt neu durch! 🚀",
        "Jeder Meister ist mal gefallen – steh wieder auf! 🏆",
        "Nicht aufgeben! Dein Körper dankt dir für jeden Versuch! 💪",
        "Ein Ausrutscher macht noch keinen Trend – weiter geht's! 🎯"
    ],

    // Sprüche für Streak-Meilensteine
    QUOTES_MILESTONE: {
        7: "Eine ganze Woche! Du hast bewiesen, dass du es ernst meinst! 🎊",
        14: "Zwei Wochen am Stück! Die Gewohnheit festigt sich! 💪",
        21: "21 Tage – wissenschaftlich gesehen bildet sich jetzt die Gewohnheit! 🧠",
        30: "Ein Monat! Du bist ein echter Champion! 🏆",
        60: "Zwei Monate! Unglaubliche Leistung! 🌟",
        100: "100 TAGE! Du bist ein Gewohnheits-Meister! 👑"
    },

    // Morning Reminder Texte
    REMINDERS_MORNING: [
        "Guten Morgen! Steht heute Training an? Plan: {training}. Auf geht's – jeder Tag zählt! 💪",
        "Moin! Dein heutiger Plan: {training}. Du schaffst das! 🔥",
        "Hey! Heute steht an: {training}. Bleib am Ball! 🎯",
        "Guten Start! {training} wartet auf dich. Los geht's! 🚀",
        "Neuer Tag, neue Chance! Heute: {training}. Du bist stark! 💪"
    ],

    // Evening Reminder Texte
    REMINDERS_EVENING: [
        "Hey! Bitte trage ein, ob du deine Ziele erreicht hast! Fast geschafft für heute! 📝",
        "Abend-Check! Hast du heute alles geschafft? Hake deinen Tag ab! ✅",
        "Zeit für den Tages-Rückblick! Wie lief es heute? 🌙",
        "Nicht vergessen: Trage deine Erfolge ein! Jeder Haken zählt! 📊"
    ],

    // Wochentage (deutsch)
    WEEKDAYS: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    WEEKDAYS_FULL: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],

    // Monate (deutsch)
    MONTHS: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

    // Default-Einstellungen
    DEFAULT_SETTINGS: {
        notificationsEnabled: true,
        morningReminderTime: '09:00',
        eveningReminderTime: '21:00',
        theme: 'dark',
        weeklyPhotoReminder: true,
        weeklyMeasurementDay: 0 // Sonntag
    },

    // Default-Nutzerdaten mit detaillierten Profilen aus dem Plan
    DEFAULT_USERS: {
        denise: {
            name: 'Denise',
            avatar: 'D',
            color: '#e91e63',
            // Profil-Infos
            profile: {
                age: 20,
                height: 168,
                bodyType: 'mesomorph',
                conditions: ['Asthma', 'Laktoseintoleranz'],
                sportHistory: ['7 Jahre Judo', '4 Jahre Ballett', '3 Jahre Kickboxen']
            },
            // Ziele
            goals: {
                protein: 100,           // g/Tag
                sleepBefore: '23:30',   // Uhrzeit
                caloriesMax: null,      // nicht aktiv
                caloriesTarget: 1550,   // Richtwert
                sleepHours: 7,          // Stunden
                weeklyWorkouts: 3       // Kraft-Einheiten
            },
            // Wochenplan (0=So, 1=Mo, ...)
            schedule: {
                '0': ['cardio'],         // Sonntag: HIIT/Cardio
                '1': ['strength'],       // Montag: Kraft Tag 1
                '2': ['boxing'],         // Dienstag: Boxen
                '3': ['strength'],       // Mittwoch: Kraft Tag 2
                '4': ['rest'],           // Donnerstag: Ruhe/Mobility
                '5': ['strength'],       // Freitag: Kraft Tag 3
                '6': ['rest']            // Samstag: frei
            },
            // Welches Workout an welchem Trainingstyp
            workoutMapping: {
                'strength_1': 'strength_day1',
                'strength_3': 'strength_day2',
                'strength_5': 'strength_day3',
                'boxing': 'boxing',
                'cardio': 'cardio'
            },
            entries: {},
            streaks: {
                training: { current: 0, longest: 0 },
                protein: { current: 0, longest: 0 },
                sleep: { current: 0, longest: 0 },
                overall: { current: 0, longest: 0 }
            },
            badges: [],
            measurements: [],
            photos: [],
            stats: {
                totalWorkouts: 0,
                totalSuccessfulDays: 0
            }
        },
        moritz: {
            name: 'Moritz',
            avatar: 'M',
            color: '#2196F3',
            // Profil-Infos
            profile: {
                age: 22,
                height: 189,
                bodyType: 'endomorph',
                conditions: [],
                sportHistory: ['5 Jahre Jiu-Jitsu', 'Calisthenics', 'Bouldern', 'Parkour']
            },
            // Ziele
            goals: {
                protein: 130,           // g/Tag
                sleepBefore: null,      // flexibel wegen Schicht
                caloriesMax: 2500,      // max kcal (für Defizit-Tage)
                caloriesTarget: 2900,   // Ziel für Aufbau
                sleepHours: 6,          // Minimum wegen Schicht
                weeklyWorkouts: 3       // Kraft-Einheiten
            },
            // Wochenplan
            schedule: {
                '0': ['strength'],       // Sonntag: Kraft Tag 3 (optional)
                '1': ['rest'],           // Montag: Ruhe oder Jiu-Jitsu
                '2': ['strength'],       // Dienstag: Kraft Tag 1
                '3': ['jiujitsu'],       // Mittwoch: Jiu-Jitsu oder Mobility
                '4': ['rest'],           // Donnerstag: Ruhe
                '5': ['strength'],       // Freitag: Kraft Tag 2
                '6': ['bouldering']      // Samstag: Bouldern
            },
            workoutMapping: {
                'strength_2': 'strength_day1',
                'strength_5': 'strength_day2',
                'strength_0': 'strength_day3',
                'jiujitsu': 'sport_day',
                'bouldering': 'bouldering'
            },
            entries: {},
            streaks: {
                training: { current: 0, longest: 0 },
                protein: { current: 0, longest: 0 },
                calories: { current: 0, longest: 0 },
                overall: { current: 0, longest: 0 }
            },
            badges: [],
            measurements: [],
            photos: [],
            stats: {
                totalWorkouts: 0,
                totalSuccessfulDays: 0
            }
        }
    },

    // LocalStorage Keys
    STORAGE_KEY: 'demori_fitness_tracker',

    // Hilfsfunktionen
    getRandomQuote(type = 'success') {
        const quotes = type === 'success' ? this.QUOTES_SUCCESS : this.QUOTES_STREAK_BREAK;
        return quotes[Math.floor(Math.random() * quotes.length)];
    },

    getRandomReminder(type = 'morning', trainingInfo = '') {
        const reminders = type === 'morning' ? this.REMINDERS_MORNING : this.REMINDERS_EVENING;
        const text = reminders[Math.floor(Math.random() * reminders.length)];
        return text.replace('{training}', trainingInfo || 'Ruhetag');
    },

    getMilestoneQuote(days) {
        const milestones = Object.keys(this.QUOTES_MILESTONE).map(Number).sort((a, b) => b - a);
        for (const milestone of milestones) {
            if (days >= milestone) {
                return this.QUOTES_MILESTONE[milestone];
            }
        }
        return null;
    },

    formatDate(date) {
        const d = new Date(date);
        return `${d.getDate()}. ${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    },

    formatDateShort(date) {
        const d = new Date(date);
        return `${d.getDate()}. ${this.MONTHS[d.getMonth()].substring(0, 3)}`;
    },

    toDateKey(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    getScheduledTraining(userId, date) {
        const userData = this.DEFAULT_USERS[userId];
        if (!userData) return [];
        const dayOfWeek = new Date(date).getDay();
        return userData.schedule[dayOfWeek] || [];
    },

    getWorkoutPlan(userId, trainingType, dayOfWeek) {
        const userPlans = this.WORKOUT_PLANS[userId];
        if (!userPlans) return null;

        // Mapping für den Tag finden
        const user = this.DEFAULT_USERS[userId];
        const mappingKey = `${trainingType}_${dayOfWeek}`;
        const planKey = user.workoutMapping[mappingKey] || user.workoutMapping[trainingType];

        return userPlans[planKey] || null;
    },

    // Woche des Jahres berechnen
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    // Prüfen ob diese Woche schon ein Foto hochgeladen wurde
    isPhotoWeekComplete(photos, date = new Date()) {
        const currentWeek = this.getWeekNumber(date);
        const currentYear = date.getFullYear();

        return photos.some(photo => {
            const photoDate = new Date(photo.date);
            return this.getWeekNumber(photoDate) === currentWeek &&
                   photoDate.getFullYear() === currentYear;
        });
    },

    // Prüfen ob diese Woche schon Measurements eingetragen wurden
    isMeasurementWeekComplete(measurements, date = new Date()) {
        const currentWeek = this.getWeekNumber(date);
        const currentYear = date.getFullYear();

        return measurements.some(m => {
            const mDate = new Date(m.date);
            return this.getWeekNumber(mDate) === currentWeek &&
                   mDate.getFullYear() === currentYear;
        });
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
