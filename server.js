const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongooge = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express()
dotenv.config()
const port = 3000

require('dotenv').config();

app.use(bodyParser.json());



app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true,
}));

mongooge.connect(
  `mongodb+srv://silpakaprashant:31Cvvw13JfRTl8yH@cluster0.vrpgy.mongodb.net/node-graphql?retryWrites=true&w=majority&appName=Cluster0`
).then(() => {
  console.log('Connected to database');
  app.listen(port, () => {
    console.log(`GraphQl server listening on port ${port}`)
  })
})
.catch(err => {
  console.log(err);
});