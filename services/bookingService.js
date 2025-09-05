import { bookingModel, yachtModel } from '../models/data.js';
import { validateBookingData } from '../utils/validation.js';

export const bookingService = {
    getAvailableYachts() {
        return { success: true, yachts: yachtModel.getAll(), status: 200 };
    },
    
    getUserBookings(username) {
        const bookings = bookingModel.getByUser(username);
        return { success: true, bookings, status: 200 };
    },
    
    createBooking(username, bookingData) {
        if (!yachtModel.exists(bookingData.yachtId)) {
            return { success: false, error: 'Invalid yacht', status: 400 };
        }
        
        const yachtCapacity = yachtModel.getCapacity(bookingData.yachtId);
        
        const validation = validateBookingData(bookingData, yachtCapacity);
        if (!validation.isValid) {
            return { 
                success: false, 
                error: validation.errors[0],
                status: 400 
            };
        }
        const conflictCheck = this.checkBookingConflicts(validation.data);
        if (!conflictCheck.success) {
            return conflictCheck;
        }
        const booking = bookingModel.create({
            ...validation.data,
            memberId: username
        });
        
        return { success: true, booking, status: 201 };
    },
    
    updateBooking(bookingId, updateData, username, userRole) {
        if (!bookingModel.exists(bookingId)) {
            return { success: false, error: 'Booking not found', status: 404 };
        }
        
        const booking = bookingModel.get(bookingId);
        if (booking.memberId !== username && !['crew', 'admin'].includes(userRole)) {
            return { success: false, error: 'Not authorized', status: 403 };
        }
        const updates = {};
        if (updateData.specialRequests && booking.memberId === username) {
            updates.specialRequests = {
                ...booking.specialRequests,
                ...updateData.specialRequests
            };
        }
        
        if (updateData.status && ['crew', 'admin'].includes(userRole)) {
            updates.status = updateData.status;
        }
        if (Object.keys(updates).length === 0) {
            return { success: false, error: 'No valid updates provided', status: 400 };
        }
        
        const updatedBooking = bookingModel.update(bookingId, updates);
        return { success: true, booking: updatedBooking, status: 200 };
    },
    
    cancelBooking(bookingId, username) {
        if (!bookingModel.exists(bookingId)) {
            return { success: false, error: 'Booking not found', status: 404 };
        }
        
        const booking = bookingModel.get(bookingId);
        if (booking.memberId !== username) {
            return { success: false, error: 'Not authorized', status: 403 };
        }
        if (booking.status !== 'pending') {
            return { 
                success: false, 
                error: `Cannot cancel ${booking.status} booking`, 
                status: 400 
            };
        }
        
        const cancelledBooking = bookingModel.cancel(bookingId);
        return { 
            success: true, 
            message: 'Booking cancelled', 
            booking: cancelledBooking,
            status: 200 
        };
    },
    
    checkBookingConflicts(bookingData) {
        const existingBookings = bookingModel.getAll();
        const conflicts = existingBookings.filter(existing => 
            existing.yachtId === bookingData.yachtId &&
            existing.date === bookingData.date &&
            existing.timeSlot === bookingData.timeSlot &&
            existing.status !== 'cancelled'
        );
        
        if (conflicts.length > 0) {
            return { 
                success: false, 
                error: 'Yacht is not available for the selected date and time', 
                status: 409 
            };
        }
        
        return { success: true };
    },
    
    getAllBookings() {
        const bookings = bookingModel.getAll();
        return { success: true, bookings, status: 200 };
    }
};
