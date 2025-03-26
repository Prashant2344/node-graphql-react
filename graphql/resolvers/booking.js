const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { singleEvent, user, transformEvent, transformBooking } = require('./common');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch(error) {
            throw error;
        }
    },
    bookEvent: async (args) => {
        const fetchEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '67d9b6a22b100ca2ac7397ab',
            event: fetchEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            console.log(booking.event._doc.creator);
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: args.bookingid });
            return event;
        } catch(err) {
            throw err;
        }
    }
};