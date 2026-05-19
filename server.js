import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ AUTH ENDPOINTS ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, companyName, websiteDomain } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, company_name, website_domain)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name`,
      [email, hashedPassword, firstName, lastName, companyName, websiteDomain]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name,
        websiteDomain: user.website_domain,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ GTM CREDENTIALS ENDPOINTS ============

// Save GTM Credentials
app.post('/api/credentials/gtm', verifyToken, async (req, res) => {
  try {
    const { gtmAccountId, gtmContainerId, gtmContainerName, apiKey } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO gtm_credentials (user_id, gtm_account_id, gtm_container_id, gtm_container_name, api_key)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, gtm_container_id) DO UPDATE SET
         gtm_container_name = $4, api_key = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, gtmAccountId, gtmContainerId, gtmContainerName, apiKey]
    );

    await pool.query(
      'INSERT INTO implementation_logs (user_id, action, details, status) VALUES ($1, $2, $3, $4)',
      [userId, 'GTM_CREDENTIALS_SAVED', `Container: ${gtmContainerId}`, 'success']
    );

    res.json({ message: 'GTM credentials saved', data: result.rows[0] });
  } catch (err) {
    console.error('GTM credentials error:', err);
    res.status(500).json({ error: 'Failed to save GTM credentials' });
  }
});

// Get GTM Credentials
app.get('/api/credentials/gtm', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, gtm_account_id, gtm_container_id, gtm_container_name FROM gtm_credentials WHERE user_id = $1',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get GTM credentials error:', err);
    res.status(500).json({ error: 'Failed to fetch GTM credentials' });
  }
});

// ============ LINKEDIN CREDENTIALS ENDPOINTS ============

// Save LinkedIn Credentials
app.post('/api/credentials/linkedin', verifyToken, async (req, res) => {
  try {
    const { linkedinAdAccountId, partnerId, insightTagId, apiKey } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO linkedin_credentials (user_id, linkedin_ad_account_id, partner_id, insight_tag_id, api_key)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, linkedin_ad_account_id) DO UPDATE SET
         partner_id = $3, insight_tag_id = $4, api_key = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, linkedinAdAccountId, partnerId, insightTagId, apiKey]
    );

    await pool.query(
      'INSERT INTO implementation_logs (user_id, action, details, status) VALUES ($1, $2, $3, $4)',
      [userId, 'LINKEDIN_CREDENTIALS_SAVED', `Ad Account: ${linkedinAdAccountId}`, 'success']
    );

    res.json({ message: 'LinkedIn credentials saved', data: result.rows[0] });
  } catch (err) {
    console.error('LinkedIn credentials error:', err);
    res.status(500).json({ error: 'Failed to save LinkedIn credentials' });
  }
});

// Get LinkedIn Credentials
app.get('/api/credentials/linkedin', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, linkedin_ad_account_id, partner_id, insight_tag_id FROM linkedin_credentials WHERE user_id = $1',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get LinkedIn credentials error:', err);
    res.status(500).json({ error: 'Failed to fetch LinkedIn credentials' });
  }
});

// ============ IMPLEMENTATION PROGRESS ENDPOINTS ============

// Save/Update Task Progress
app.post('/api/progress', verifyToken, async (req, res) => {
  try {
    const { phaseKey, taskId, completed, notes } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO implementation_progress (user_id, phase_key, task_id, completed, notes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, phase_key, task_id) DO UPDATE SET
         completed = $4, completed_at = CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END, notes = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, phaseKey, taskId, completed, notes]
    );

    res.json({ message: 'Progress saved', data: result.rows[0] });
  } catch (err) {
    console.error('Progress save error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get All Progress for User
app.get('/api/progress', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM implementation_progress WHERE user_id = $1 ORDER BY phase_key, task_id',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get Progress Summary
app.get('/api/progress/summary', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         phase_key,
         COUNT(*) as total_tasks,
         SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_tasks
       FROM implementation_progress
       WHERE user_id = $1
       GROUP BY phase_key
       ORDER BY phase_key`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get progress summary error:', err);
    res.status(500).json({ error: 'Failed to fetch progress summary' });
  }
});

// ============ CONVERSION EVENTS ENDPOINTS ============

// Save Conversion Event
app.post('/api/events', verifyToken, async (req, res) => {
  try {
    const { eventName, eventKey, description, linkedinConversionId } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO conversion_events (user_id, event_name, event_key, description, linkedin_conversion_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, eventName, eventKey, description, linkedinConversionId]
    );

    res.json({ message: 'Event saved', data: result.rows[0] });
  } catch (err) {
    console.error('Event save error:', err);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

// Get All Events for User
app.get('/api/events', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM conversion_events WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ STATIC FILES & SPA FALLBACK ============

app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GTM + LinkedIn Setup App running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});
