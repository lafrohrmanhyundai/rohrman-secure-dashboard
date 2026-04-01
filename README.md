# Rohrman Secure Dashboard

This package turns your dashboard into a real protected website with a server-side login page.

## Default login
- Username: `rhs`
- Password: `rhs2026`

## Run locally
1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run:
   npm install
   npm start
4. Open:
   http://localhost:3000

## Optional environment variables
- `APP_USERNAME`
- `APP_PASSWORD`
- `SESSION_SECRET`
- `PORT`

Example:
APP_USERNAME=rhs APP_PASSWORD=rhs2026 SESSION_SECRET=change-me npm start

## Deploy
This works on platforms that support Node/Express, including:
- Render
- Railway
- Fly.io
- a VPS
- traditional cPanel Node hosting

For Vercel/Netlify static hosting alone, this exact server app is not the right fit without adaptation.
