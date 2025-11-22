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
Getting StartedFollow these steps to set up and run the AirGuard AI application locally.1. Clone the repositoryUse the following command to clone the project:git clone [https://github.com/TheinMinHtet/airguard-nextjs.git](https://github.com/TheinMinHtet/airguard-nextjs.git)
cd airguard-nextjs
2. Install dependenciesInstall all required Node.js packages:npm install
3. Setup environment variablesCreate a file named .env.local in the root directory and add your Gemini API key. This key is crucial for the AI-powered features.Note: Replace xxxxxxxxxxxxxxxxxxxxxxx with your actual API key.# Create the environment file and add the key
echo "NEXT_PUBLIC_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx" > .env.local
4. Run the development serverStart the application in development mode:npm run dev
The application will be accessible at http://localhost:3000.
