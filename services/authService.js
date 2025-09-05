import { userModel, sessionModel } from '../models/data.js';
import { validators } from '../utils/validation.js';
import { generateSessionId, createAuthResponse } from '../utils/auth.js';

export const authService = {
    register(username) {
        const validation = validators.username(username);
        if (!validation.isValid) {
            return { success: false, error: validation.error, status: 400 };
        }
        
        if (userModel.exists(validation.value)) {
            return { success: false, error: 'Username already exists', status: 409 };
        }
        
        const user = userModel.create(validation.value);
        
        return { success: true, user, status: 201 };
    },
    
    login(username) {
        const validation = validators.username(username);
        if (!validation.isValid) {
            return { success: false, error: validation.error, status: validation.error === 'Access denied' ? 403 : 400 };
        }
        
        if (!userModel.exists(validation.value)) {
            return { success: false, error: 'User not found. Please register first.', status: 401 };
        }
        
        const sessionId = generateSessionId();
        const user = userModel.get(validation.value);
        sessionModel.create(sessionId, validation.value);
        
        return { 
            success: true, 
            sessionId, 
            user: createAuthResponse(user),
            status: 200 
        };
    },
    
    logout(sessionId) {
        if (sessionId) {
            sessionModel.delete(sessionId);
        }
        return { success: true, status: 200 };
    },
    
    verifySession(sessionId) {
        if (!sessionId) {
            return { success: false, error: 'Not authenticated', status: 401 };
        }
        
        const username = sessionModel.get(sessionId);
        if (!username) {
            return { success: false, error: 'Not authenticated', status: 401 };
        }
        
        const user = userModel.get(username);
        if (!user) {
            sessionModel.delete(sessionId);
            return { success: false, error: 'Not authenticated', status: 401 };
        }
        
        return { 
            success: true, 
            user: createAuthResponse(user),
            username,
            status: 200 
        };
    },
    
    checkPermission(user, action, resource) {
        switch (action) {
            case 'admin':
                return user.role === 'admin' || user.role === 'crew';
            case 'crew':
                return user.role === 'crew';
            case 'member':
                return ['member', 'crew', 'admin'].includes(user.role);
            default:
                return true;
        }
    }
};
