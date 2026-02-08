# FunKids Studio (MERN)

Corporate-level startup website for a digital media and animation production company.

## Structure

- `/client` React frontend (Vite, React Router)
- `/server` Node + Express backend

## Setup

### 1) Backend

```bash
cd /Users/sourabh/Documents/Funkids\ Studio/server
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Update `MONGODB_URI` if needed. For admin auth, set `JWT_SECRET`.
Set `YT_API_KEY` to enable YouTube channel sync (logo, banner, subscribers, videos).

Run server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 2) Frontend

```bash
cd /Users/sourabh/Documents/Funkids\ Studio/client
npm install
```

Create `.env` (optional if using default):

```bash
cp .env.example .env
```

Run client:

```bash
npm run dev
```

Client runs at `http://localhost:5173`.

### 3) Admin Panel

Create an admin user (stored in MongoDB):

```bash
cd /Users/sourabh/Documents/Funkids\ Studio/server
npm install
npm run create-admin -- --email you@example.com --password yourpass
```

Then visit `/admin/login` to sign in. After login, `/admin` lets you manage projects and view contact messages.

## API

- `POST /api/contact` save contact message
- `GET /api/contact` list contact messages
- `GET /api/projects` list productions
- `POST /api/projects` create a production
- `POST /api/auth/login` admin login (JWT)
- `GET /api/admin-users` list admins
- `POST /api/admin-users` create admin
- `PATCH /api/admin-users/:id/password` reset admin password
- `DELETE /api/admin-users/:id` remove admin
- `GET /api/jobs` list opportunities
- `POST /api/jobs` create opportunity (admin)
- `PUT /api/jobs/:id` update opportunity (admin)
- `DELETE /api/jobs/:id` remove opportunity (admin)
- `POST /api/jobs/:id/apply` submit application
- `GET /api/jobs/applications/all` list applications (admin)
- `GET /api/products` list store products
- `GET /api/products/all` list all products (admin)
- `POST /api/products` create product (admin)
- `PUT /api/products/:id` update product (admin)
- `DELETE /api/products/:id` remove product (admin)
- `POST /api/orders` place store order (no payment)
- `GET /api/orders` list store orders (admin)
- `GET /api/ytchannels` list active YouTube channels
- `GET /api/ytchannels/:id` channel details
- `GET /api/admin/ytchannels` list all YouTube channels (admin)
- `POST /api/admin/ytchannels/lookup` fetch channels by URL/handle (admin)
- `POST /api/admin/ytchannels` create channel (admin)
- `PUT /api/admin/ytchannels/:id` update channel (admin)
- `DELETE /api/admin/ytchannels/:id` remove channel (admin)
- `POST /api/admin/ytchannels/:id/sync` manual sync (admin)
- `GET /api/videos` list Netflix-style videos
- `GET /api/videos/featured` featured video
- `POST /api/admin/videos` add video (admin)
- `DELETE /api/admin/videos/:id` delete video (admin)
- `POST /api/analytics/track` track play/watch
- `GET /api/analytics` analytics (admin)
- `GET /api/settings` site settings
- `PUT /api/settings` update settings (admin)

## Example Admin Request (YT Channel)

```json
{
  "name": "Sona Mona Rhymes",
  "channelUrl": "https://www.youtube.com/@SonaMonaRhymes",
  "description": "Joyful sing-alongs and playful learning for kids.",
  "featuredVideoId": "dQw4w9WgXcQ",
  "featuredVideoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "isActive": true
}
```

## Example Admin Request (Video)

```json
{
  "title": "Alphabet Adventure",
  "videoId": "dQw4w9WgXcQ",
  "channelName": "Sona Mona Rhymes",
  "channelId": "UCxxxxxxxxxxxx",
  "channelLogo": "https://example.com/logo.jpg",
  "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "category": "Rhymes",
  "isFeatured": true
}
```

## Example Admin Request (YT Channel Lookup)

```json
{
  "query": "https://www.youtube.com/@SonaMonaRhymes"
}
```

## YouTube Subscriber Count

Set `YT_API_KEY` in `/Users/sourabh/Documents/Funkids Studio/server/.env` to enable subscriber count.

## Production Build (Serve React from Express)

```bash
cd /Users/sourabh/Documents/Funkids\ Studio
npm run install:all
npm run build:client
npm start
```

Express will serve the React build from `/client/dist` when `NODE_ENV=production`.

## Deployment Scripts

From the repo root:

```bash
npm run deploy
```

## Branding

“Produced by FunKids Studio” is displayed across the site.
