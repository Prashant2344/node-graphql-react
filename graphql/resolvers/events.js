const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./common');

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

    createEvent: async (args, req) => {
        console.log(req.isAuth);
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
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
                creator: req.userId
            });
            let createdEvent;
            const result = await event.save();
            createdEvent =  transformEvent(result);
            const creator = await User.findById(req.userId);
        
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
};