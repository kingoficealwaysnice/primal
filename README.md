# PRIMAL SYSTEM ⚡
### *Rebuild Your Body. Reclaim Your Discipline.*

Inspired by the dark fantasy leveling aesthetic of *Solo Leveling*, **PRIMAL SYSTEM** is a complete, mobile-first personal fitness, nutrition, and health operating system engineered to take you from your baseline condition to an aesthetic, athletic physique over 90 days.

---

## 📱 LIVE ACCESS

The application is running and accessible on your devices:

* **Local Machine (Mac):** [http://localhost:5173](http://localhost:5173)
* **iPhone (Local Wi-Fi Network):** `http://192.168.0.7:5173`

---

## 📲 IPHONE INSTALLATION GUIDE (SAFARI PWA)

PRIMAL SYSTEM is engineered as a standalone Progressive Web Application (PWA) optimized specifically for iOS Safari:

1. Connect your iPhone to the same Wi-Fi network as this Mac.
2. Open **Safari** on your iPhone.
3. In the URL address bar, enter:
   ```
   http://192.168.0.7:5173
   ```
4. Tap the **Share** button (the square with an upward arrow at the bottom of Safari).
5. Scroll down and tap **"Add to Home Screen"**.
6. Set the icon name as **PRIMAL** and tap **Add**.
7. Close Safari and launch **PRIMAL** directly from your iOS Home Screen. It will launch full-screen without Safari browser bars, with native status-bar translucency and offline caching.

---

## 🏛️ ARCHITECTURE & TECH STACK

* **Frontend:** React 18, TypeScript, Vite
* **Styling & Theme:** Tailwind CSS, Glassmorphism, Solo Leveling Dark Fantasy Design System
* **Animations & Tap Feedback:** Framer Motion, Canvas Confetti
* **Charts & Biometrics:** Recharts (Area charts, Bar charts, Responsive containers)
* **Local Storage & Offline-First:** Dexie.js (Browser IndexedDB)
* **PWA & Service Worker:** `vite-plugin-pwa` with Workbox offline precaching

---

## 🎨 VISUAL DESIGN SYSTEM

* **Background:** Deep Void `#080B14`
* **Secondary Surface:** Obsidian `#101626`
* **Hunter Cards:** Dark Charcoal `#151D30` with glassmorphic border `#725CFF` (18% opacity)
* **Primary System Accent:** Electric Violet `#725CFF`
* **Secondary System Accent:** Cyber Cyan `#00D4FF`
* **Success / XP:** Emerald Awakening `#27E58C`
* **Warning:** Solar Amber `#FFB547`
* **Danger:** Crimson Warning `#FF5263`
* **Typography:** `Space Grotesk` (Headings & Runes), `Inter` (UI & Body), `Outfit` (Accents)

---

## ⚔️ CORE CAPABILITIES & ECOSYSTEM

### 1. Cinematic Awakening & Multi-Step Onboarding
* Typewriter sequence: `[SYSTEM INITIALIZING...]` ➔ `[WELCOME, HUNTER.]` ➔ `[YOUR TRANSFORMATION BEGINS NOW.]`
* **Step 1:** Biometrics (Name, Age, DOB, Gender, Height, Weight, Body Fat %, Activity level, Occupation)
* **Step 2:** Private Physique Photography (Front, Side, Back, Face portraits stored strictly in local IndexedDB)
* **Step 3:** Target Physique Selection (Lean athletic, visible abs, broader shoulders, jawline definition, etc.)
* **Step 4:** Equipment Configuration (Bodyweight only, Bodyweight + Dumbbells, Resistance bands, Full gym)
* **Step 5:** Fitness Benchmarks (Max push-ups, squats, plank hold, pull-ups, physical limitations)
* **Step 6:** Scientific Target Calibration (Mifflin-St Jeor BMR, TDEE, protein targets: 1.8–2.2g/kg, water targets)
* **Step 7:** System Protocol Generation

### 2. Hunter Status Dashboard
* Hunter designation, Level title, current XP, and Day count (`DAY 01 / 90`)
* Animated XP bar with Level-Up detection and ascension celebrations
* Daily Quests Checklist with XP rewards and real-time completion counter
* Circular nutrition progress rings (Calories, Protein, Water)
* Today's Workout Protocol card with direct trial launcher
* Physical performance and biometric trend cards

### 3. Intelligent 90-Day Workout Progression Engine
* **Phase 1: Awakening (Days 1–30):** Structural adaptation and foundational strength. Day 1 Benchmark challenge: 50 push-ups in sets.
* **Phase 2: Evolution (Days 31–60):** Decline push-ups, close grip, Bulgarian split squats, pike push-ups, pull-ups.
* **Phase 3: Primal Form (Days 61–90):** Archer push-ups, pistol squat progressions, dragon flags, high-density circuits.
* **Equipment Modality Switch:** One-tap toggle between **Bodyweight Mode** and **Dumbbell Mode**.
* **Set-by-Set Tracker:** Interactive rep inputs, target vs actuals, completion percentages, [Mark Complete], [Record Partial], [Skip], and [Report Discomfort].
* **Celebration Overlay:** Confetti blast and XP claim sequence.

### 4. Nutrition Intelligence & Natural Language Parser
* Natural language text analyzer: type `"4 boiled eggs, 2 slices of brown bread and one banana"` to extract food items, calculate portions, calories, protein, carbs, and fats.
* Searchable internal database with 150+ foods across Eggs, Chicken, Dairy, Vegetarian Proteins (Soya chunks, Paneer, Tofu, Dal), Grains, Indian Meals (Dal Chawal, Roti Sabzi, Poha, Idli, Dosa), and Supplements.
* Transparent fallback estimation for uncataloged meals with manual adjustment.

### 5. Energy Expenditure & Walking Calculator
* Calculates estimated walking duration to balance energy intake using scientific MET values (Slow, Normal, Brisk, Incline).
* Framed strictly as educational metabolic awareness (never as punishment).

### 6. Facial Aesthetics & Jawline Definition
* Educational guidance on systemic fat loss (clarifying that spot reduction of facial fat is physiologically impossible).
* Daily anti-bloat habits (hydration, sleep, sodium moderation).
* Postural chin tucks, neck SCM stretches, and masseter jaw relaxation routines.
* Private milestone face photo tracking.

### 7. Facial Skincare Management
* Morning Routine checklist (Gentle cleanser, moisturizer, broad spectrum SPF 50+).
* Evening Routine checklist (Cleanser, moisturizer, active treatments like Retinoids / Niacinamide).
* Patch-test safety guidance.
* Awards +15 XP upon routine completion.

### 8. Water & Sleep Tracking
* Quick-log hydration (+250ml, +500ml, +750ml, +1L, or custom ml).
* Sleep duration and quality metrics that adjust recovery advisories.

### 9. Leveling, XP & Trophy Vault
* 10 Hunter Levels:
  1. `LEVEL 1 — AWAKENED` (0 - 499 XP)
  2. `LEVEL 2 — DISCIPLINED` (500 - 1,499 XP)
  3. `LEVEL 3 — INITIATED` (1,500 - 2,999 XP)
  4. `LEVEL 4 — WARRIOR` (3,000 - 5,499 XP)
  5. `LEVEL 5 — HUNTER` (5,500 - 8,999 XP)
  6. `LEVEL 6 — ELITE HUNTER` (9,000 - 13,499 XP)
  7. `LEVEL 7 — ASCENDANT` (13,500 - 19,999 XP)
  8. `LEVEL 8 — APEX` (20,000 - 27,999 XP)
  9. `LEVEL 9 — PRIMAL` (28,000 - 37,999 XP)
  10. `LEVEL 10 — TRANSCENDENT` (38,000+ XP)
* Unlocked achievements: *First Blood, Iron Will, Protein Master, Hydration Titan, Push-up Warrior, Primal Ascendant*.

### 10. Data Backup, Export & Privacy
* **Local Privacy First:** No external server uploads. Everything stays inside browser IndexedDB.
* **Export Data:** One-click download of all records, quests, and logs as a single JSON file.
* **Restore Data:** Upload previously saved JSON file to restore across devices.
* **System Wipe:** Double-confirmation reset option.

---

## 🛠️ LOCAL CLI COMMANDS

Inside `/Users/air/Downloads/HOME/primal-system`:

```bash
# Start Vite development server
npm run dev

# Run TypeScript compilation and production build
npm run build

# Preview production build
npm run preview
```

