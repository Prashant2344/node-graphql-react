const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString()
    }
}

// const events = async eventIds => {
//     try {
//         const events = await Event.find({ _id: { $in: eventIds } });
//         return events.map(event => {
//             return {
//                 ...event._doc,
//                 _id: event.id,
//                 date: new Date(event._doc.date).toISOString(),
//                 creator: user.bind(this, event.creator)
//             };
//         });
//     } catch (error) {
//       throw error;
//     }
// }



module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
              return transformEvent(event)
            });
        } catch(error) {
            throw error;
        }
    },

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

    createEvent: async (args) => {
      // const event = {
      //   _id: Math.random().toString(),
      //   title: args.eventInput.title,
      //   description: args.eventInput.description,
      //   price: +args.eventInput.price,
      //   // date: new Date(args.eventInput.date)
      //   date: args.eventInput.date
      // }
        try{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '67d9b6a22b100ca2ac7397ab'
            });
            let createdEvent;
            const result = await event.save();
            createdEvent =  transformEvent(result);
            const creator = await User.findById('67d9b6a22b100ca2ac7397ab');
        
            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
        
            return createdEvent;
        } catch(error) {
            throw error;
        }
      
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
              throw new Error('User exists already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
  
            console.log(hashedPassword);
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            const result = await user.save();
  
            console.log(result);
            return {
              ...result._doc,
              password: null
            };
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