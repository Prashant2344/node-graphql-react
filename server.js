const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongooge = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express()
dotenv.config()
const port = 3000

require('dotenv').config();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      users: [User!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query : RootQuery
      mutation : RootMutation
    }
  `),
  
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          return {
            ...event._doc, 
            // _id: event.id,
            // date: event.date.toISOString()
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
          ...result._doc
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
  },
  graphiql: true,
}));

mongooge.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vrpgy.mongodb.net/node-graphql?retryWrites=true&w=majority&appName=Cluster0`
).then(() => {
  console.log('Connected to database');
  app.listen(port, () => {
    console.log(`GraphQl server listening on port ${port}`)
  })
})
.catch(err => {
  console.log(err);
});