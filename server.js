const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongooge = require('mongoose');
const  Event = require('./models/event');

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

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }


    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
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
        date: new Date(args.eventInput.date)
      });
      return event.save()
      .then(result => {
        console.log(result);
        return {
          ...result._doc
        };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    }
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