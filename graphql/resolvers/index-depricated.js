const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

// Without using async await

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        }
      })
    })
    .catch(err => {
      throw err;
    });
}
  
const user = userId => {
    return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      }
    })
    .catch(err => {
      throw err;
    });
}

module.exports = {
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc, 
            // _id: event.id,
            // date: event.date.toISOString()
            // creator: {
            //   ...event._doc.creator._doc,
            //   _id: event._doc.creator.id
            // }
            creator: user.bind(this, event._doc.creator)
          }
        })
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    },

    createEvent: (args) => {
      // const event = {
      //   _id: Math.random().toString(),
      //   title: args.eventInput.title,
      //   description: args.eventInput.description,
      //   price: +args.eventInput.price,
      //   // date: new Date(args.eventInput.date)
      //   date: args.eventInput.date
      // }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '67d9b6a22b100ca2ac7397ab'
      });
      let createdEvent;
      return event
      .save()
      .then(result => {
        createdEvent =   {
          ...result._doc,
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById('67d9b6a22b100ca2ac7397ab')
      }).then(user => {
        if (!user) {
          throw new Error('User not found');
        }
        user.createdEvents.push(event);
        return user.save();
      }).then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    },
    createUser: (args) => {
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error('User exists already');
          }
          return bcrypt.hash(args.userInput.password, 12)
        }).then(hashedPassword => {
          console.log(hashedPassword);
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save()
        })
        .then(result => {
          console.log(result);
          return {
            ...result._doc,
            password: null
          };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
};