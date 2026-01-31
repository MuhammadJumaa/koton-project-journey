# Koton Proje Yolculuğu

Koton DX WebApp projesi oluşturmanın 11 adımını öğrenmek için interaktif bir oyun.
    
## Canlı Demo

**Frontend:** https://game-hazel-six-44.vercel.app

## Backend Sunucusu Kurulumu (Çok Oyunculu Mod İçin)

Çok oyunculu özelliği etkinleştirmek için backend sunucusunu Render.com'a deploy edin:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/MuhammadJumaa/koton-project-journey)

### Manuel Kurulum

1. [Render.com](https://render.com) hesabı oluşturun
2. "New +" > "Web Service" seçin
3. GitHub reposunu bağlayın: `MuhammadJumaa/koton-project-journey`
4. Ayarlar:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variable:** `CORS_ORIGINS` = `https://game-hazel-six-44.vercel.app`

5. Deploy ettikten sonra, Vercel'de environment variable ekleyin:
   - `VITE_SOCKET_URL` = `https://your-render-url.onrender.com`

## Yerel Geliştirme

```bash
# Frontend
npm install
npm run dev

# Backend (ayrı terminal)
cd server
npm install
npm start
```

## Teknolojiler

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + Socket.IO
- **Hosting:** Vercel (frontend) + Render (backend)
