const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const Item = require('./models/item');
const Bill = require('./models/bill');

const app = express();
const PORT = process.env.PORT || 3060;
require('dotenv').config()
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Mock data (you can replace this with database queries)
// const items = [
//   { id: 1, title: 'Tea', item: 'Green Tea', price: '$10', count: 0, image: 'https://static.toiimg.com/photo/83173328.cms' },
//   { id: 2, title: 'Coffee', item: 'Espresso', price: '$15', count: 0, image: 'https://static.toiimg.com/photo/83173328.cms' },
//   { id: 3, title: 'Juice', item: 'Orange Juice', price: '$5', count: 0, image: 'https://static.toiimg.com/photo/83173328.cms' },
//   { id: 4, title: 'Juice', item: 'Orange Juice', price: '$5', count: 0, image: 'https://static.toiimg.com/photo/83173328.cms' },
// ];

// Home route
app.get('/', async (req, res) => {

  let items = await  Item.find({});
  console.log(items);
  
  
    res.render('index', { items });
});


// About route
app.post('/checkout', (req, res) => {
    req.session.items = req.body;
    console.log(req.body);
    //res.send('http://192.168.1.41:3060/bill');
    res.send('https://oneteabro.onrender.com/bill');
});


async function getPreviousBillNO(){
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  // Get tomorrow's date at midnight
  const endOfDay = new Date();
  endOfDay.setHours(24,0,0,0);
  try{
    
  let allTicket = await Bill.find({
      created_at: {
          $gte: startOfDay,
          $lt: endOfDay
      }
  })
  console.log(allTicket,allTicket.length);
  
  return allTicket.length;
  }catch(err){
  console.log(err)
  }
}


app.get('/bill',async  (req, res) => {
    if (req.session.items) {
        console.log(req.session.items);
        console.log(req.session);

        //compute
        let billItems = req.session.items;
        let bucket =[];
        let TOTAL = 0;
        for(bi of billItems){
          let itm = {};
          itm.quantity =bi.quantity;
          let I = await Item.findOne({id:bi.item.split("-")[0]});
          itm.price =I.price;
          itm.name = I.title;
          itm.total= I.price * bi.quantity;
          TOTAL+=(I.price * bi.quantity);
          bucket.push(itm);
        }

        console.log("dfsdfsdf",bucket,TOTAL);
        let previousBillNo = await getPreviousBillNO();
        
        let newBill = new Bill({billNo:previousBillNo+1,items:bucket,total:TOTAL});
          await newBill.save();
          console.log(newBill);

        res.render("about",{items:bucket,total:TOTAL,date:new Date().toLocaleString().split(",")[0],billNO:previousBillNo+1});
    } else {
        res.send('Please log in first');
    }
});


app.get("/bill/close",(req,res)=>{
  req.session.destroy(err => {
    if (err) {
        return res.redirect('/bill');
    }
    res.send('Logged out successfully');
});
});

//===============================
// admin



// Get all items
app.get("/admin",async (req,res)=>{
    try {
        const items = await Item.find();
        res.render('admin', { items });
      } catch (err) {
        res.status(500).send(err);
      }
});

app.post("/admin/add",async (req,res)=>{
    const { id, title,  price, image } = req.body;
    console.log(req.body);
    
  const newItem = new Item({ id, title, price, image });
  try {
    await newItem.save();
    console.log(newItem);
    
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send(err);
  }
});



mongoose.connect(process.env.DATABASE_URL , {
})
.then(() =>{
    console.log('MongoDB connected...')


app.listen(PORT,() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

})
.catch(err => console.log(err));
