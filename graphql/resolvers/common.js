const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds } });
});

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.sort((a,b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
        });
        // Use Promise.all to ensure async handling inside map
        const resolvedEvents = await Promise.all(events.map(async (event) => {
            // const creator = await user(event.creator);  // Await the user function to resolve creator
            return transformEvent(event);
        }));

        return resolvedEvents;
    } catch (error) {
        throw error;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        
        return event;
        // return transformEvent(event);

    } catch (error) {
        throw error;
    }
}

const user = async userId => {
    try {
        // const user = await User.findById(userId)
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
    } catch(error) {
        throw error;
    }
}

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

exports.events = events;
exports.singleEvent = singleEvent;
exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
