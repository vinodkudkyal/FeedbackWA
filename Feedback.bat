@echo off

echo Starting Vite Frontend...
start cmd /k "npm run dev"

echo Starting Node.js Backend...
start cmd /k "cd server && node CombinedSessionTry.js"

echo Both frontend and backend are running.
pause
