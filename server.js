const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongooge = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express()
dotenv.config()
const port = 3000

require('dotenv').config();

app.use(bodyParser.json());

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

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