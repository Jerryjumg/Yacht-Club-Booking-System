const state = {
    sessions: {},
    users: {},
    yachts: {
        'yacht-1': {
            id: 'yacht-1',
            name: 'Serenity',
            type: 'Hickley 42',
            homeHarbor: 'Newport',
            capacity: 8,
            amenities: ['galley', 'sound-system', 'swim-platform']
        },
        'yacht-2': {
            id: 'yacht-2',
            name: 'Freedom',
            type: 'Sabre 45',
            homeHarbor: 'Nantucket',
            capacity: 10,
            amenities: ['galley', 'sound-system', 'radar', 'ac']
        },'yacht-3': {
            id: 'yacht-3',
            name: 'Azure Dream',
            type: 'Hinckley Picnic Boat 40',
            homeHarbor: 'Martha\'s Vineyard',
            capacity: 6,
            amenities: ['galley', 'sound-system', 'swim-platform', 'sun-deck', 'wine-cooler']
        },
        'yacht-4': {
            id: 'yacht-4',
            name: 'Windchaser',
            type: 'MJM 50z',
            homeHarbor: 'Chatham',
            capacity: 12,
            amenities: ['galley', 'sound-system', 'radar', 'ac', 'generator', 'bbq-grill']
        },
        'yacht-5': {
            id: 'yacht-5',
            name: 'Moonlight Bay',
            type: 'Back Cove 41',
            homeHarbor: 'Provincetown',
            capacity: 8,
            amenities: ['galley', 'sound-system', 'swim-platform', 'fishing-gear', 'paddle-boards']
        },
        'yacht-6': {
            id: 'yacht-6',
            name: 'Sea Breeze',
            type: 'Hunt Harrier 36',
            homeHarbor: 'Newport',
            capacity: 7,
            amenities: ['galley', 'sound-system', 'swim-platform', 'snorkel-gear']
        },
        'yacht-7': {
            id: 'yacht-7',
            name: 'Coastal Explorer',
            type: 'Grady-White Canyon 456',
            homeHarbor: 'Block Island',
            capacity: 14,
            amenities: ['galley', 'sound-system', 'radar', 'ac', 'generator', 'diving-platform', 'fish-finder']
        },
        'yacht-8': {
            id: 'yacht-8',
            name: 'Sunset Chaser',
            type: 'Chris-Craft Catalina 34',
            homeHarbor: 'Edgartown',
            capacity: 9,
            amenities: ['galley', 'sound-system', 'swim-platform', 'teak-deck', 'champagne-cooler']
        }
    },
    bookings: {},
    counters: {
        bookingId: 1
    }
};

export const sessionModel = {
    create(sessionId, username) {
        state.sessions[sessionId] = username;
    },
    
    get(sessionId) {
        return state.sessions[sessionId];
    },
    
    delete(sessionId) {
        delete state.sessions[sessionId];
    },
    
    exists(sessionId) {
        return sessionId in state.sessions;
    }
};

export const userModel = {
    create(username, userData) {
        state.users[username] = {
            username,
            role: 'member',
            memberSince: new Date().toISOString(),
            preferences: {
                favoriteHarbor: null,
                typicalPartySize: 4
            },
            ...userData
        };
        return state.users[username];
    },
    
    get(username) {
        return state.users[username];
    },
    
    exists(username) {
        return username in state.users;
    },
    
    getAll() {
        return Object.values(state.users);
    },
    
    updateRole(username, role) {
        if (state.users[username]) {
            state.users[username].role = role;
            return state.users[username];
        }
        return null;
    }
};

export const yachtModel = {
    get(yachtId) {
        return state.yachts[yachtId];
    },
    
    getAll() {
        return Object.values(state.yachts);
    },
    
    exists(yachtId) {
        return yachtId in state.yachts;
    },
    
    getCapacity(yachtId) {
        return state.yachts[yachtId]?.capacity;
    }
};

export const bookingModel = {
    create(bookingData) {
        const bookingId = `booking-${state.counters.bookingId++}`;
        state.bookings[bookingId] = {
            id: bookingId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            ...bookingData
        };
        return state.bookings[bookingId];
    },
    
    get(bookingId) {
        return state.bookings[bookingId];
    },
    
    update(bookingId, updateData) {
        if (state.bookings[bookingId]) {
            state.bookings[bookingId] = {
                ...state.bookings[bookingId],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            return state.bookings[bookingId];
        }
        return null;
    },
    
    getByUser(username) {
        return Object.values(state.bookings)
            .filter(booking => booking.memberId === username);
    },
    
    getAll() {
        return Object.values(state.bookings);
    },
    
    exists(bookingId) {
        return bookingId in state.bookings;
    },
    
    cancel(bookingId) {
        if (state.bookings[bookingId]) {
            state.bookings[bookingId].status = 'cancelled';
            state.bookings[bookingId].cancelledAt = new Date().toISOString();
            return state.bookings[bookingId];
        }
        return null;
    }
};
