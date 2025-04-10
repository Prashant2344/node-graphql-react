const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { singleEvent, user, transformEvent, transformBooking } = require('./common');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find({ user: req.userId});

            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch(error) {
            throw error;
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const fetchEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            console.log(booking.event._doc.creator);
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch(err) {
            throw err;
        }
    }
};