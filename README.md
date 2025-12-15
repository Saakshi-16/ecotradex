

---

# EcoTradeX – Real-Time Stock Tracking Dashboard

EcoTradeX is a web application that shows real-time stock price updates using WebSockets.
It offers a responsive interface with instant data refresh for live market monitoring

---

## Live Demo
 
https://ecotradex-4acd.onrender.co

---

## Project Overview

EcoTradeX allows users to:
- Log in using an email
- Select stocks to track
- View live stock price updates
- See visual indicators for price changes
- Toggle between light and dark themes

---

## Features

- Real-time stock updates using Socket.IO  
- Stock subscription system  
- Price increase and decrease indicators  
- Light and dark mode UI  
- Responsive and clean interface  

---
## Multi-User Functionality

EcoTradeX supports multiple users simultaneously using WebSocket communication powered by Socket.IO.

Each user who opens the application establishes a unique socket connection with the server. The backend assigns a distinct socket ID to every user, allowing the system to track users independently.

When users subscribe to specific stocks, their selections are stored against their socket connection. The server sends real-time price updates only for the stocks each user has subscribed to, ensuring personalized data delivery.

When a user disconnects, their socket session and subscriptions are automatically cleared, allowing smooth handling of multiple concurrent users without data conflicts.

## Technology Stack

### Frontend
- React (Vite)
- JavaScript
- CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO

### Deployment
- Render

---


### Backend and Frontend commands

```bash
cd backend
npm install
node server.js
---
cd client-react
npm install
npm run dev

