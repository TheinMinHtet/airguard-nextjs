import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Leaf, Globe } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { fetchAirQuality, getCoordinatesForCity } from '../services/aqiService';
import { Chat, FunctionDeclaration, Type } from "@google/genai";
import { AQIData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  aqiData: AQIData;
  location: { latitude: number; longitude: number };
  locationName: string;
}

// Function definition for Gemini
const getCityAQIFunctionDeclaration: FunctionDeclaration = {
  name: "getCityAirQuality",
  description: "Get the real-time Air Quality Index (AQI) and pollutant data for a specific city name anywhere in the world.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cityName: {
        type: Type.STRING,
        description: "The name of the city to search for (e.g., 'Tokyo', 'New York', 'Mumbai')."
      }
    },
    required: ["cityName"]
  }
};

const Chatbot: React.FC<ChatbotProps> = ({ aqiData, location, locationName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: 'Hi! I am AirGuard. I can analyze your local air, or check the air quality in ANY city worldwide. Just ask!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize chat with tools
  useEffect(() => {
     const context = {
        locationName,
        coordinates: location,
        airQuality: aqiData,
        timestamp: new Date().toLocaleString()
      };
      
      // We pass the function declaration to the service creator
      chatSessionRef.current = createChatSession(context, [getCityAQIFunctionDeclaration]);
  }, [locationName, location, aqiData]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) return;

      let result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      
      // Handle Function Calls (Tool usage)
      const functionCalls = result.functionCalls;
      
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          if (call.name === "getCityAirQuality") {
            // Robustly handle arguments
            const args = call.args as Record<string, any> || {};
            const cityName = args['cityName'];
            
            let functionResponseContent;

            if (!cityName) {
              console.warn("Function call missing cityName argument:", call);
              functionResponseContent = {
                result: { 
                  found: false, 
                  error: "City name parameter was missing. Please ask the user to specify the city name clearly." 
                }
              };
            } else {
              // 1. Geocode
              const coords = await getCoordinatesForCity(cityName);
              
              if (coords) {
                // 2. Fetch AQI
                const cityAqiData = await fetchAirQuality({ latitude: coords.lat, longitude: coords.lng });
                functionResponseContent = {
                  result: {
                    found: true,
                    city: coords.name,
                    data: cityAqiData.current
                  }
                };
              } else {
                functionResponseContent = {
                  result: { found: false, error: `City '${cityName}' not found. Ask the user for a valid city name.` }
                };
              }
            }

            // 3. Send response back to Gemini
            result = await chatSessionRef.current.sendMessage({
              message: [
                {
                  functionResponse: {
                    name: call.name,
                    id: call.id,
                    response: functionResponseContent
                  }
                }
              ]
            });
          }
        }
      }

      const text = result.text || "I'm taking a moment to calculate that...";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const suggestions = [
    { label: "How is the air here?", icon: <Bot size={14} /> },
    { label: "Check air in Tokyo", icon: <Globe size={14} /> },
    { label: "How to reduce smog?", icon: <Leaf size={14} /> }
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 z-50 hover:scale-105 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Interface Window */}
      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`} style={{ height: '550px', maxHeight: '80vh' }}>
        
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-4 flex justify-between items-center text-white shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AirGuard Assistant</h3>
              <p className="text-xs text-indigo-100 opacity-90">Global Air Expert</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-slate-400">Analyzing...</span>
              </div>
            </div>
          )}
          
          {/* Quick Suggestions */}
          {messages.length < 3 && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.label)}
                  className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any city..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;