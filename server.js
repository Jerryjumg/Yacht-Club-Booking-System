import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { authService } from './services/authService.js';
import { bookingService } from './services/bookingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
function requireAuth(req, res, next) {
    const sessionId = req.cookies.sid;
    const authResult = authService.verifySession(sessionId);
    
    if (!authResult.success) {
        return res.status(authResult.status).json({ error: authResult.error });
    }
    
    req.user = authResult.user;
    req.username = authResult.username;
    next();
}

function requireRole(role) {
    return (req, res, next) => {
        if (!authService.checkPermission(req.user, role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}


app.post('/api/users/register', (req, res) => {
    const result = authService.register(req.body.username);
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.status(result.status).json({ message: 'Registration successful' });
});

app.post('/api/session', (req, res) => {
    const result = authService.login(req.body.username);
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.cookie('sid', result.sessionId, { httpOnly: true });
    res.status(result.status).json(result.user);
});

app.delete('/api/session', (req, res) => {
    const result = authService.logout(req.cookies.sid);
    
    res.clearCookie('sid');
    res.status(result.status).json({ message: 'Logged out successfully' });
});

app.get('/api/session', (req, res) => {
    const sessionId = req.cookies.sid;
    const result = authService.verifySession(sessionId);
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.status(result.status).json(result.user);
});

app.get('/api/yachts', requireAuth, (req, res) => {
    const result = bookingService.getAvailableYachts();
    res.status(result.status).json(result.yachts);
});

app.get('/api/bookings', requireAuth, (req, res) => {
    const { status } = req.query;
    let result = bookingService.getUserBookings(req.username);
    
    if (status && result.bookings) {
        result.bookings = result.bookings.filter(b => b.status === status);
    }
    
    res.status(result.status).json(result.bookings);
});

app.post('/api/bookings', requireAuth, (req, res) => {
    const result = bookingService.createBooking(req.username, req.body);
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.status(result.status).json(result.booking);
});

app.put('/api/bookings/:id', requireAuth, (req, res) => {
    const result = bookingService.updateBooking(
        req.params.id, 
        req.body, 
        req.username, 
        req.user.role
    );
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.status(result.status).json(result.booking);
});

app.delete('/api/bookings/:id', requireAuth, (req, res) => {
    const result = bookingService.cancelBooking(req.params.id, req.username);
    
    if (!result.success) {
        return res.status(result.status).json({ error: result.error });
    }
    
    res.status(result.status).json({ message: result.message });
});


app.get('/api/admin/bookings', requireAuth, requireRole('admin'), (req, res) => {
    const result = bookingService.getAllBookings();
    res.status(result.status).json(result.bookings);
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
