const express = require("express");
const bodyParser = require("body-parser"); // extract jsoN content from incoming requests
const { graphqlHTTP } = require("express-graphql"); // exports middleware function take  incoming requests and funnel them through graphql query parser and foward them to right resolvers
 //create schema as a string and converting it to js is taken care by graphql  --
const path = require("path")
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");

const graphQlResolvers = require("./graphql/resolvers/index");

const isAuth = require('./middleware/is-auth')

const app = express();

const PORT = process.env.PORT || 8000



app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
app.use(isAuth);

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQlSchema,  // creator is an object that only has id in the schema
        rootValue: graphQlResolvers,
        graphiql: true,

    })
);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'frontend','build','index.html'));
    })


}


mongoose
    .connect(
        process.env.MONGODB_URI || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.osuak.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    });

console.log(mongoose.connection.readyState);
