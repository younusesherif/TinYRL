const express = require('express')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb');
const random = require('./random');

const uri = "mongodb+srv://younuse:sherif@cluster0-umi9i.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useUnifiedTopology: true,useNewUrlParser: true});

async function main(){

    try {
        await client.connect();
        console.log('connected');
    } 
    catch (e) {
        console.error(e);
    } 
}
main().catch(console.error); 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/first',async(req,res)=>{
    const link = req.body.name;
    const id = random(5);
    await client.db("new").collection("persons").insertOne({name:id,address:link});  
    
    res.render(__dirname + "/main.html", {name:id,link:link});
});
app.get('/first/:code', async(req, res) =>{
    const urlCode = req.params.code;
    var querry = {name:urlCode};
    var a="";
    await client.db("new").collection("persons").find(querry).toArray(function(err, result) {
        console.log(result);
        res.redirect(result[0].address);
        if (err) throw err;});
});
client.close();
//app.listen(3000, () => console.log(`server run on port 3000!`))
app.listen(process.env.PORT || 3000)