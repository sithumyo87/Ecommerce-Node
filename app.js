require('dotenv').config();
const express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io')(server),
mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
helper = require('./utilies/helper'),
fileupload = require('express-fileupload');

mongoose.connect(`mongodb://localhost:27017/${process.env.DBNAME}`);

app.use(express.json())
app.use(fileupload());

const permitRouter = require('./routes/permit');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const catRouter = require('./routes/category');
const subcatRouter = require('./routes/subcat');
const childcatRouter = require('./routes/childcat');
const tagRouter= require('./routes/Tag');
const deliveryRouter = require('./routes/delivery');
const warrantyRouter = require('./routes/warranty');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

const {AnyRole,AnyPermit, validateToken,validateRole} = require('./utilies/validate');


app.use("/permit",permitRouter);
app.use("/role",validateToken(),validateRole("Owner"),roleRouter);
app.use("/user",userRouter);
app.use("/cat",catRouter);
app.use("/subcat",subcatRouter);
app.use("/childcat",childcatRouter);
app.use('/tag',tagRouter);
app.use('/delivery',deliveryRouter);
app.use('/warranty',warrantyRouter);
app.use('/product',productRouter)
app.use('/order',orderRouter)

app.use((err,req,res,next)=>{
    // console.log(err.stack);
    err.status = err.status || 500;
    res.status(500).json({con:false,msg:err.message})
});

const defaultuser = async() =>{
    let migartor = require('./migrations/migrate');
    // await migartor.migrate();
    // await migartor.backup();
    // await migartor.rpmigrate();
    // await migartor.userRole();
}
// defaultuser();
// io.on('connection', socket => {
//     socket.on("test",data =>{
//         console.log("Data get",data);
//         socket.emit("Success",{"Myanmar":"Mingalar pr"})
//     })
// });

io.of('/chat').use(async(socket,next)=>{
    let token = socket.handshake.query.token;
    if(token){
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        if (decode) {
          // console.log(decode);
          let user = await helper.get(decode._id);
          // console.log(req.user);
          if (user) {
            socket.userData = user;
            next();
          } else {
            next(new Error("Tokenization Error"));
          }
        } else {
          next(new Error("Tokenization Error"));
        }
      }else{
        next(new Error("Tokenization Error"));
      };
    // console.log("Hello");
}).on("connection",socket =>{
    require('./utilies/chat').initalization(io,socket);
})





server.listen(process.env.PORT,console.log(`Server is running at Port ${process.env.PORT}`))