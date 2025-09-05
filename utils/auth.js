import { randomUUID } from 'crypto';

export function generateSessionId() {
    return randomUUID();
}

export function createAuthResponse(user) {
    return {
        username: user.username,
        role: user.role
    };
}

export function handleAuthError(res, status, message) {
    return res.status(status).json({ error: message });
}
