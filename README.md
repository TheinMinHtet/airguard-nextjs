AirGuard AI – Air Quality & Health Recommendation App

Tech Stack: Next.js 15

AirGuard AI is a modern platform that provides real-time air quality information with AI-powered health recommendations. It helps users monitor pollution levels, receive personalized advice, and make informed choices to protect their health.

Features

Real-time AQI Monitoring: View current air quality for your location.

Health-Safe Suggestions: AI advice to reduce exposure during high pollution.

Pollutant Trend Charts: Hourly trends for PM2.5, PM10, NO₂, O₃, SO₂, and more.

Push Notifications: Alerts for unhealthy air quality levels.

Eco-Friendly Tips: Recommendations for plants and products to improve indoor air quality.

Chatbot: Ask questions about air quality and get instant AI advice.
## 🚀 Getting Started

Follow these steps to run the project locally.

### **1–4. Setup & Run the Project (All Steps Combined)**

```bash
# 1. Clone the repository
git clone https://github.com/TheinMinHtet/airguard-nextjs.git

# 2. Move into the project folder
cd airguard-nextjs

# 3. Install dependencies
npm install

# 4. Add environment variable
echo "NEXT_PUBLIC_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx" > .env.local

# 5. Start development server
npm run dev

Project Structure
components/   → Reusable UI components
pages/        → Next.js routes/pages
services/     → AQI & AI request handlers
types/        → TypeScript interfaces
