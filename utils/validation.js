export const validators = {
    username(username) {
        if (!username || typeof username !== 'string') {
            return { isValid: false, error: 'Username is required' };
        }
        
        const trimmed = username.trim();
        if (!trimmed) {
            return { isValid: false, error: 'Username cannot be empty' };
        }
        
        if (trimmed === 'dog') {
            return { isValid: false, error: 'Access denied' };
        }
        
        if (!trimmed.match(/^[a-zA-Z0-9_-]+$/)) {
            return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
        }
        
        return { isValid: true, value: trimmed };
    },
    
    bookingDate(dateString) {
        if (!dateString) {
            return { isValid: false, error: 'Date is required' };
        }
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { isValid: false, error: 'Invalid date format' };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
            return { isValid: false, error: 'Date must be in the future' };
        }
        
        return { isValid: true, value: dateString };
    },
    
    timeSlot(timeSlot) {
        const validSlots = ['morning', 'afternoon', 'evening', 'full-day'];
        
        if (!timeSlot) {
            return { isValid: false, error: 'Time slot is required' };
        }
        
        if (!validSlots.includes(timeSlot)) {
            return { isValid: false, error: 'Invalid time slot' };
        }
        
        return { isValid: true, value: timeSlot };
    },
    
    partySize(size, maxCapacity) {
        const numSize = parseInt(size);
        
        if (isNaN(numSize) || numSize < 1) {
            return { isValid: false, error: 'Party size must be at least 1' };
        }
        
        if (maxCapacity && numSize > maxCapacity) {
            return { isValid: false, error: `Party size cannot exceed yacht capacity of ${maxCapacity}` };
        }
        
        return { isValid: true, value: numSize };
    },
    
    yachtId(yachtId) {
        if (!yachtId || typeof yachtId !== 'string') {
            return { isValid: false, error: 'Yacht ID is required' };
        }
        
        return { isValid: true, value: yachtId };
    },
    
    specialRequests(requests) {
        if (!requests || typeof requests !== 'object') {
            return { isValid: true, value: {} };
        }
        
        const sanitized = {};
        for (const [key, value] of Object.entries(requests)) {
            if (value && typeof value === 'string' && value.trim()) {
                const cleaned = value.trim().replace(/<[^>]*>/g, '');
                if (cleaned) {
                    sanitized[key] = cleaned;
                }
            }
        }
        
        return { isValid: true, value: sanitized };
    }
};

export function validateBookingData(data, yachtCapacity) {
    const errors = [];
    const validatedData = {};
    
    const yachtResult = validators.yachtId(data.yachtId);
    if (!yachtResult.isValid) {
        errors.push(yachtResult.error);
    } else {
        validatedData.yachtId = yachtResult.value;
    }
    
    const dateResult = validators.bookingDate(data.date);
    if (!dateResult.isValid) {
        errors.push(dateResult.error);
    } else {
        validatedData.date = dateResult.value;
    }
    
    const timeResult = validators.timeSlot(data.timeSlot);
    if (!timeResult.isValid) {
        errors.push(timeResult.error);
    } else {
        validatedData.timeSlot = timeResult.value;
    }
    
    const sizeResult = validators.partySize(data.partySize, yachtCapacity);
    if (!sizeResult.isValid) {
        errors.push(sizeResult.error);
    } else {
        validatedData.partySize = sizeResult.value;
    }
    
    const requestsResult = validators.specialRequests(data.specialRequests);
    validatedData.specialRequests = requestsResult.value;
    
    return {
        isValid: errors.length === 0,
        errors,
        data: validatedData
    };
}
