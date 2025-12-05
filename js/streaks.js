/**
 * DeMori Fitness Tracker - Streaks Module
 * Streak-Berechnung, Badges und Statistiken
 */

const StreakManager = {
    /**
     * Berechnet alle Streaks für einen Nutzer neu
     */
    calculateStreaks(userId = null) {
        const id = userId || DataManager.getCurrentUser();
        const user = DataManager.getUserData(id);
        if (!user) return null;

        const entries = user.entries;
        const goals = user.goals;

        // Sortiere Einträge nach Datum (neueste zuerst)
        const sortedDates = Object.keys(entries).sort().reverse();

        if (sortedDates.length === 0) {
            return {
                training: { current: 0, longest: 0 },
                protein: { current: 0, longest: 0 },
                sleep: { current: 0, longest: 0 },
                calories: { current: 0, longest: 0 },
                overall: { current: 0, longest: 0 }
            };
        }

        // Streak-Berechnungsfunktion
        const calcStreak = (checkFn) => {
            let current = 0;
            let longest = 0;
            let counting = true;
            let tempStreak = 0;

            // Starte von heute und gehe rückwärts
            const today = CONFIG.toDateKey(new Date());
            const yesterday = CONFIG.toDateKey(new Date(Date.now() - 86400000));

            for (let i = 0; i < sortedDates.length; i++) {
                const dateKey = sortedDates[i];
                const entry = entries[dateKey];

                if (checkFn(entry, dateKey)) {
                    tempStreak++;
                    if (counting) current = tempStreak;
                } else {
                    if (tempStreak > longest) longest = tempStreak;
                    tempStreak = 0;
                    counting = false;
                }
            }

            // Letzten Streak prüfen
            if (tempStreak > longest) longest = tempStreak;

            return { current, longest };
        };

        // Training Streak (nur Trainingstage zählen)
        const trainingStreak = this._calculateTrainingStreak(entries, user.schedule);

        // Protein Streak
        const proteinStreak = calcStreak((entry) => entry.protein === true);

        // Schlaf Streak (nur wenn Ziel gesetzt)
        let sleepStreak = { current: 0, longest: 0 };
        if (goals.sleepBefore) {
            sleepStreak = calcStreak((entry) => entry.sleep === true);
        }

        // Kalorien Streak (nur wenn Ziel gesetzt)
        let caloriesStreak = { current: 0, longest: 0 };
        if (goals.caloriesMax) {
            caloriesStreak = calcStreak((entry) => entry.calories === true);
        }

        // Overall Streak (alle relevanten Ziele erfüllt)
        const overallStreak = this._calculateOverallStreak(entries, goals, user.schedule);

        const streaks = {
            training: trainingStreak,
            protein: proteinStreak,
            sleep: sleepStreak,
            calories: caloriesStreak,
            overall: overallStreak
        };

        // Longest-Werte mit bisherigen vergleichen
        const oldStreaks = user.streaks || {};
        for (const key of Object.keys(streaks)) {
            const oldLongest = oldStreaks[key]?.longest || 0;
            if (oldLongest > streaks[key].longest) {
                streaks[key].longest = oldLongest;
            }
        }

        // Speichern
        DataManager.updateStreaks(streaks, id);

        return streaks;
    },

    /**
     * Berechnet Training-Streak (berücksichtigt nur Trainingstage)
     */
    _calculateTrainingStreak(entries, schedule) {
        let current = 0;
        let longest = 0;
        let tempStreak = 0;
        let counting = true;

        // Gehe von heute rückwärts
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const date = new Date(today.getTime() - i * 86400000);
            const dateKey = CONFIG.toDateKey(date);
            const dayOfWeek = date.getDay();

            // Ist es ein Trainingstag?
            const scheduled = schedule[dayOfWeek];
            const isTrainingDay = scheduled && scheduled.length > 0;

            if (!isTrainingDay) continue; // Ruhetage überspringen

            const entry = entries[dateKey];
            const didTraining = entry && entry.training === true;

            if (didTraining) {
                tempStreak++;
                if (counting) current = tempStreak;
            } else {
                if (tempStreak > longest) longest = tempStreak;
                tempStreak = 0;
                counting = false;
            }
        }

        if (tempStreak > longest) longest = tempStreak;

        return { current, longest };
    },

    /**
     * Berechnet Overall-Streak (alle Ziele erfüllt)
     */
    _calculateOverallStreak(entries, goals, schedule) {
        let current = 0;
        let longest = 0;
        let tempStreak = 0;
        let counting = true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const date = new Date(today.getTime() - i * 86400000);
            const dateKey = CONFIG.toDateKey(date);
            const dayOfWeek = date.getDay();

            const entry = entries[dateKey];
            if (!entry) {
                // Kein Eintrag = Streak gebrochen (außer heute)
                if (i > 0) {
                    if (tempStreak > longest) longest = tempStreak;
                    tempStreak = 0;
                    counting = false;
                }
                continue;
            }

            // Prüfe alle relevanten Ziele
            let allMet = true;

            // Training (wenn Trainingstag)
            const scheduled = schedule[dayOfWeek];
            const isTrainingDay = scheduled && scheduled.length > 0;
            if (isTrainingDay && entry.training !== true) {
                allMet = false;
            }

            // Protein
            if (entry.protein !== true) allMet = false;

            // Schlaf (wenn Ziel)
            if (goals.sleepBefore && entry.sleep !== true) allMet = false;

            // Kalorien (wenn Ziel)
            if (goals.caloriesMax && entry.calories !== true) allMet = false;

            if (allMet) {
                tempStreak++;
                if (counting) current = tempStreak;
            } else {
                if (tempStreak > longest) longest = tempStreak;
                tempStreak = 0;
                counting = false;
            }
        }

        if (tempStreak > longest) longest = tempStreak;

        return { current, longest };
    },

    /**
     * Prüft ob neue Badges verdient wurden
     */
    checkForNewBadges(userId = null) {
        const id = userId || DataManager.getCurrentUser();
        const user = DataManager.getUserData(id);
        if (!user) return [];

        const streaks = user.streaks;
        const earnedBadges = user.badges || [];
        const newBadges = [];

        for (const badge of CONFIG.BADGES) {
            // Bereits verdient?
            if (earnedBadges.some(b => b.id === badge.id)) continue;

            let earned = false;

            if (badge.type === 'training') {
                // Training-Badge: Gesamtzahl Trainings
                const totalWorkouts = this._countTotalWorkouts(user.entries);
                if (totalWorkouts >= badge.requirement) earned = true;
            } else if (badge.type === 'protein') {
                // Protein-Badge: Protein-Streak
                if (streaks.protein.current >= badge.requirement || streaks.protein.longest >= badge.requirement) {
                    earned = true;
                }
            } else {
                // Overall-Streak Badge
                if (streaks.overall.current >= badge.requirement || streaks.overall.longest >= badge.requirement) {
                    earned = true;
                }
            }

            if (earned) {
                DataManager.addBadge(badge.id, id);
                newBadges.push(badge);
            }
        }

        return newBadges;
    },

    /**
     * Zählt alle absolvierten Trainings
     */
    _countTotalWorkouts(entries) {
        let count = 0;
        for (const entry of Object.values(entries)) {
            if (entry.training === true) count++;
        }
        return count;
    },

    /**
     * Gibt Statistiken zurück
     */
    getStatistics(userId = null) {
        const id = userId || DataManager.getCurrentUser();
        const user = DataManager.getUserData(id);
        if (!user) return null;

        const entries = user.entries;
        const goals = user.goals;
        const schedule = user.schedule;

        // Gesamtzahlen
        const totalEntries = Object.keys(entries).length;
        const totalWorkouts = this._countTotalWorkouts(entries);

        // Erfolgsquote
        let successfulDays = 0;
        for (const [dateKey, entry] of Object.entries(entries)) {
            const date = new Date(dateKey);
            const dayOfWeek = date.getDay();
            const scheduled = schedule[dayOfWeek];
            const isTrainingDay = scheduled && scheduled.length > 0;

            let allMet = true;
            if (isTrainingDay && entry.training !== true) allMet = false;
            if (entry.protein !== true) allMet = false;
            if (goals.sleepBefore && entry.sleep !== true) allMet = false;
            if (goals.caloriesMax && entry.calories !== true) allMet = false;

            if (allMet) successfulDays++;
        }

        const successRate = totalEntries > 0 ? Math.round((successfulDays / totalEntries) * 100) : 0;

        // Trainings diesen Monat
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        let workoutsThisMonth = 0;
        for (const [dateKey, entry] of Object.entries(entries)) {
            if (new Date(dateKey) >= thisMonthStart && entry.training === true) {
                workoutsThisMonth++;
            }
        }

        // Protein-Tage
        let proteinDays = 0;
        for (const entry of Object.values(entries)) {
            if (entry.protein === true) proteinDays++;
        }

        // Durchschnittliche Streak
        const streaks = user.streaks;

        return {
            totalEntries,
            totalWorkouts,
            successfulDays,
            successRate,
            workoutsThisMonth,
            proteinDays,
            proteinRate: totalEntries > 0 ? Math.round((proteinDays / totalEntries) * 100) : 0,
            longestOverallStreak: streaks.overall?.longest || 0,
            currentOverallStreak: streaks.overall?.current || 0,
            longestTrainingStreak: streaks.training?.longest || 0,
            badgesEarned: user.badges?.length || 0,
            totalBadges: CONFIG.BADGES.length
        };
    },

    /**
     * Gibt eine motivierende Nachricht bei Streak-Unterbrechung
     */
    getStreakBreakMessage(oldStreak) {
        if (oldStreak >= 30) {
            return `Wow, ${oldStreak} Tage waren eine unfassbare Leistung! Neues Ziel: ${oldStreak + 1} Tage! 💪`;
        } else if (oldStreak >= 14) {
            return `${oldStreak} Tage waren stark! Du weißt, dass du es kannst. Auf zu neuen Höhen! 🚀`;
        } else if (oldStreak >= 7) {
            return `${oldStreak} Tage waren ein guter Start! Neues Ziel: Die Woche übertreffen! 🎯`;
        } else {
            return CONFIG.getRandomQuote('break');
        }
    },

    /**
     * Prüft ob heute bereits eingetragen wurde
     */
    isTodayComplete(userId = null) {
        const id = userId || DataManager.getCurrentUser();
        const todayKey = CONFIG.toDateKey(new Date());
        const entry = DataManager.getEntry(todayKey, id);
        return entry !== null;
    }
};

// Für Module verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreakManager;
}
