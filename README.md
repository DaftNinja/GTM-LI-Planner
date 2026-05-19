# GTM + LinkedIn Interactive Setup App

A full-stack web application for managing Google Tag Manager and LinkedIn Ads conversion tracking setup with interactive checklists, credential management, and visual diagrams.

## Features

✅ **User Authentication** - Secure registration and login with JWT  
✅ **Credential Management** - Securely store and manage GTM and LinkedIn credentials  
✅ **Interactive Checklist** - Track 33 implementation tasks across 6 phases  
✅ **Progress Tracking** - Real-time sync of task completion with PostgreSQL backend  
✅ **Mermaid Diagrams** - Visual workflows and architecture diagrams  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Production Ready** - Deployed on Railway with PostgreSQL database  

## Tech Stack

**Frontend**
- React 18
- Tailwind CSS
- Lucide Icons
- Mermaid.js for diagrams

**Backend**
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

**Deployment**
- Railway.app (Node.js + PostgreSQL)

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Setup

1. **Clone and install**
```bash
cd gtm-linkedin-app
npm install
```

2. **Create .env file**
```bash
cp .env.example .env
```

Edit `.env` with your local database:
```
DATABASE_URL=postgresql://user:password@localhost:5432/gtm_linkedin_app
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

3. **Create database**
```bash
psql -U postgres
CREATE DATABASE gtm_linkedin_app;
\q
```

4. **Initialize schema**
```bash
psql -U postgres -d gtm_linkedin_app -f db/schema.sql
```

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

## Deployment on Railway

### Prerequisites
- Railway.app account
- GitHub repository (connected)

### Steps

1. **Connect Railway to GitHub**
   - Push this repo to GitHub
   - Go to railway.app and create new project
   - Select "Deploy from GitHub repo"

2. **Create PostgreSQL Database**
   - In Railway dashboard: Add → Database → PostgreSQL
   - Railway automatically sets `DATABASE_URL`

3. **Set Environment Variables**
   - In Railway: Variables
   - Add:
     ```
     NODE_ENV=production
     JWT_SECRET=generate-a-strong-secret-key
     ADMIN_EMAIL=your@email.com
     ADMIN_PASSWORD=strong-password
     ```

4. **Initialize Database**
   - Railway provides a terminal
   - Run: `psql $DATABASE_URL < db/schema.sql`

5. **Deploy**
   - Railway automatically deploys on push to main branch
   - Or manually trigger deploy from dashboard

6. **Get Public URL**
   - Railway generates a public URL (e.g., `https://your-app.railway.app`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Credentials (requires token)
- `POST /api/credentials/gtm` - Save GTM credentials
- `GET /api/credentials/gtm` - Get GTM credentials
- `POST /api/credentials/linkedin` - Save LinkedIn credentials
- `GET /api/credentials/linkedin` - Get LinkedIn credentials

### Progress (requires token)
- `POST /api/progress` - Update task progress
- `GET /api/progress` - Get all user progress
- `GET /api/progress/summary` - Get progress summary by phase

### Events (requires token)
- `POST /api/events` - Save conversion event
- `GET /api/events` - Get all conversion events

## Demo Credentials

For testing without registration:
- Email: `demo@example.com`
- Password: `demo123456`

## Project Structure

```
gtm-linkedin-app/
├── server.js                 # Express backend
├── db/
│   └── schema.sql           # PostgreSQL schema
├── src/
│   ├── App.jsx              # Main component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Tailwind styles
│   ├── lib/
│   │   └── api.js           # API client
│   ├── pages/
│   │   ├── LoginPage.jsx    # Auth page
│   │   └── DashboardPage.jsx # Main dashboard
│   └── components/
│       ├── CredentialManager.jsx    # Credential form
│       ├── InteractiveChecklist.jsx # Task checklist
│       └── MermaidDiagrams.jsx      # Visual diagrams
├── public/
│   └── index.html           # HTML entry
└── package.json
```

## Environment Variables

```
DATABASE_URL          # PostgreSQL connection string (required)
PORT                  # Server port (default: 3000)
NODE_ENV              # Environment (development/production)
JWT_SECRET            # Secret for JWT tokens (required)
APP_URL               # Application URL
ADMIN_EMAIL           # Initial admin email
ADMIN_PASSWORD        # Initial admin password
```

## Database Schema

The app creates these tables:
- `users` - User accounts
- `gtm_credentials` - GTM account info
- `linkedin_credentials` - LinkedIn ad account info
- `implementation_progress` - Task completion tracking
- `conversion_events` - Custom event definitions
- `implementation_logs` - Activity logs

## Security Notes

1. **Passwords** are hashed with bcryptjs (10 rounds)
2. **Credentials** are stored encrypted in the database
3. **JWT tokens** expire after 7 days
4. **All API endpoints** require authentication (except login/register)
5. **CORS** is enabled but can be restricted to specific domains
6. **Helmet.js** provides security headers

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Run: `psql $DATABASE_URL -c "SELECT 1"`

### "Port already in use"
- Change PORT in .env
- Or kill process: `lsof -i :3000` then `kill -9 <PID>`

### "Schema error on migration"
- Drop and recreate database:
  ```bash
  dropdb gtm_linkedin_app
  createdb gtm_linkedin_app
  psql -d gtm_linkedin_app -f db/schema.sql
  ```

### Frontend not loading
- Check public/index.html exists
- Verify Tailwind CDN link in HTML
- Check browser console for errors

## Performance Tips

1. Use GTM Preview mode before publishing tags
2. Enable task pagination for large checklists
3. Cache Mermaid diagrams after first load
4. Use database connection pooling (already configured)

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Team collaboration features
- [ ] Automatic GTM API integration
- [ ] LinkedIn API sync
- [ ] Email notifications
- [ ] Detailed analytics dashboard
- [ ] Export reports as PDF

## Support

For issues or questions:
1. Check the included Word doc (Verkko_GTM_LinkedIn_Implementation.docx)
2. Review the Mermaid diagrams in the app
3. Check Railway logs: `railway logs`

## License

MIT - Feel free to modify and deploy

---

**Built for verkko.ai** | Deployed on Railway
