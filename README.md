# BloodLink – Real-Time Blood Bank & Donor Locator System

BloodLink is a comprehensive full-stack solution designed to bridge the gap between blood donors and those in urgent need. This project includes both a **Native Android Application** and a **Responsive Web Dashboard**.

## 🚀 Key Features

- **Real-Time Tracking**: GPS-integrated donor and hospital locator.
- **Emergency Requests**: Broadcast urgent blood needs to everyone within a 5km radius.
- **AI Chat Assistant**: Integrated Gemini AI for instant donor-requester communication.
- **Smart Booking**: Live availability check and appointment scheduling at nearby blood banks.
- **Google Authentication**: Seamless one-tap login and profile syncing.
- **Cross-Platform**: Unified experience across Mobile, Tablet, and Desktop.

## 🛠️ Tech Stack

### Mobile App (Android)
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Modern Declarative UI)
- **Maps**: Google Maps SDK for Android
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Realtime Database
- **AI**: Google Gemini 1.5 Flash API

### Web Dashboard
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase Ecosystem

---

## 📖 How to Run & Test

### 1. Android Application
1. Open the project in **Android Studio**.
2. Connect a physical device or emulator.
3. Sync Gradle and click the **Run** button.
4. **Test Case**: Go to the 'Maps' tab to verify live location and nearby hospital pins.

### 2. Web Application
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. **Test Case**: Open `http://localhost:5173` and attempt to submit an 'Emergency Request'.

### 3. Cloud CI/CD (GitHub Actions)
This project is configured with GitHub Actions to automatically:
1. **Deploy the Web App** to Firebase Hosting.
2. **Run Appium E2E Tests** in a cloud-based Android Emulator.
3. **Generate an Excel Analysis Report** (Available in the 'Actions' tab artifacts).

---

## 👨‍💻 Author
**M Surya Mahesh**

---

*This project was built for educational and clinical-grade health management purposes.*
