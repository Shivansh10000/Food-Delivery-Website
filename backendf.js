const express = require('express')
const res = require('express/lib/response')
const app = express()
const port = 27017
const fs = require('fs')
const bodyparser = require('body-parser')
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/contact');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
//contact refers to delivery here
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age : {
        type: Number,
        min:20,
        max:60,
    },
    gender : String,
    rating: Number,
    phone: Number,
    city: String
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email : String,
    phone : Number,
    address : String,
    loginid : String,
    city : String,
    password : String
});
const loginSchema = new mongoose.Schema({
    login: String,
    password : String,
    email : String,
});
const servicesSchema = new mongoose.Schema({
    name: String,
    city : String,
    rating : Number,
    address : String,
    contact : Number,
});
const menuSchema = new mongoose.Schema({
    name: String,
    price : Number,
    rating : Number,
    restaurantname : String,
    veg : String
});
const orderSchema = new mongoose.Schema({
    loginid: String,
    dishes: String,
    time: String,
    phone: Number,
    city: String
});


var contact = mongoose.model('contact', contactSchema);
var registration = mongoose.model('registration', registrationSchema);
var login = mongoose.model('login', loginSchema);
var services = mongoose.model('services', servicesSchema);
var menu = mongoose.model('menu', menuSchema);
var order = mongoose.model('order', orderSchema);

app.use(express.static('public'));
app.use(express.urlencoded())

const path = require('path')
const { notDeepEqual } = require('assert')
const { time } = require('console')
app.use('/static', express.static(path.join(__dirname, 'public')))


const getDocument = async () =>{
    const output1 = await registration.find();
    return output1;
 }
 let regvar = getDocument();

app.get('', (req, res) => {
    res.sendFile(__dirname + '/foodsite.html')
})
app.get('/services.html', (req, res) => {
    res.sendFile(__dirname + '/services.html')
})
app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/about.html')
})
app.post('/about.html', (req, res) => {
    var myMenu = new menu(req.body);
    console.log(myMenu);
    myMenu.save().then(()=>{
        res.send("This information was saved to the database");
    })
    
})
app.get('/contact.html', (req, res) => {
    res.sendFile(__dirname + '/contact.html')
})
app.post('/contact.html', (req, res) => {
    var myData = new contact(req.body);
    console.log(myData);
    myData.save().then(()=>{
        res.send("This information was saved to the database");
    })
    
})

app.post('/foodsite.html', (req, res) => {
    var myregistration = new registration(req.body);
    let somenum = getRandomInt(99999)
    const reqlogin = req.body.name + somenum;
    let pass = req.body.password;
    let email = req.body.email;
    fs.writeFileSync('loginidinfo.txt',reqlogin)
    fs.writeFileSync('loginpasswordinfo.txt',pass)
    const mylogin = new login({ login: reqlogin,password: pass,email: email });
    mylogin.save().then(()=>{
        console.log(mylogin);
    })
    myregistration.save().then(()=>{
        console.log(myregistration);
        res.send("You have successfully registered <br> Your login id is " + reqlogin + "<br> Your password is "+pass);
    })
    
})
app.get('/ordering.html', (req, res) => {
    res.sendFile(__dirname + '/ordering.html')
})



app.post('/ordering.html', (req, res) => {
    login.findOne({
        login: req.body.login,
        password: req.body.password
    }, (err, store) =>
    { if(store) res.sendFile(__dirname + '/welcome.html');
      else res.send("You are not registered yet please register before login") });
})
let arr;
menu.find({},function(err,menu){
    if(err) console.warn(err);
    arr = menu;
})
app.get('/menus.html', (req, res) => {
    res.sendFile(__dirname + '/menus.html')
})
app.post('/menus.html', (req, res) => {
    let i;
    for(i=0; i<arr.length; i++)
    {
        if(req.body.name == arr[i].name) res.send(`Dish Name : ${arr[i].name} <br> Price : ${arr[i].price} <br> Rating : ${arr[i].rating} <br> Restaurant Name : ${arr[i].restaurantname} <br> Vegetarian : ${arr[i].veg} <br><br>`)
    }
})

app.get('/placeorder.html', (req, res) => {
    res.sendFile(__dirname + '/placeorder.html')
})

contact.find({},function(err,contact){
    if(err) console.warn(err);
    let arr = contact;
    console.log(arr[2].name);
})

app.post('/services.html', (req, res) => {
    var myservices = new services(req.body);
    console.log(myservices);
    myservices.save().then(()=>{
        res.send("This information was saved to the database");
    })
    
})
app.post('/placeorder.html', (req, res) => {
    login.findOne({
        login: req.body.loginid,
    }, (err, store) =>
    { if(store) console.log("found one match")
    else return
      })
    
    menu.findOne({
        name: req.body.dishname,
    }, (err, store) =>
    { if(store) console.log("found one match")
    else return
      })

    menu.findOne({
        restaurantname: req.body.restaurantname,
    }, (err, store) =>
    { if(store) console.log("found one match")
    else return
      })
    
      const myplaceorder = new order({ loginid: req.body.loginid, dishes: req.body.dishname,time: new Date(), phone: req.body.phone, city: req.body.city});
      myplaceorder.save().then(()=>{
        res.send("Thank you your order was placed ");
    })
      
    // var myplaceorder = new order(req.body);
    // console.log(myplaceorder);
    // myplaceorder.save().then(()=>{
    //     res.send("This information was saved to the database");
    // })
    
})






app.listen(port, () => console.info('listening'))
//this works !