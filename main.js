const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const ejs = require('ejs')

const app = express()

app.use(express.json())
dotenv.config()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

const secretKey = process.env.mySecreatKey


const PORT = 4000

const users = [{
    id:"1",
    username:"Hemanth",
    password:"1234",
    isAdmin:false
},
{
    id:"2",
    username:"Vassu",
    password:"1234",
    isAdmin:true
}]

const verifyUser = (req,res, next)=>{
    const userToken = req.headers.authorization
    if (userToken) {
        const token = userToken.split(" ")[1]
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ err: "token is not valid" })
            }
            req.user = user
            next()
        })

    } else {
        res.status(401).json("you are not authenticated")
    }
}

app.post('/api/login',(req,res)=>{
    const {username,password} = req.body;

    const user = users.find((person)=>{
        return person.username==username && person.password==password
    })
    if (user) {
        const accessToken = jwt.sign({
            id:user.id, 
            username:user.username,
            isAdmin:user.isAdmin
        },secretKey)
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            accessToken
        })
    }else{
        res.status(500).json("user credentials is not matched")
    }
})

app.delete('/api/users/:userId', verifyUser,(req,res)=>{
    if (req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user is deleted succesfully")
    }else{
        res.status(401).json("your are not aloowed to delete ")
    }
})

app.get("/Hemanth",(req,res)=>{
    res.render("Hemanth")
})
app.get("/Vaasu",(req,res)=>{
    res.render("Vaasu")
})

app.get('/api/login/:userId',(req, res)=>{
    const userId = req.params.userId
    if(userId){
        if(userId==="1"){
            res.redirect('/Hemanth')
        }else if(userId==="2"){
            res.redirect('/Vaasu')
        }
    }else{
        res.status(401).json("user not found")
    }
})

app.post("/app/Logout",(req,res)=>{
    const userToken = req.headers.authorization
    if (userToken) {
        const token = userToken.split(" ")[1]
        if(token){
            let allTokens = []
            const tokenIndex = allTokens.indexOf(token)
            if(tokenIndex !== -1){
                allTokens.splice(tokenIndex,1)
                res.status(200).json("logout succesfully")
                res.redirect("/")
            }else{
                res.status(401).json("your not valid your")
            }
        }else{
            res.status(400).json("Token is not found")
        }
    }else{
        res.status(400).json("your not authenticated")
    }
})
app.get('/api/logout',(req,res)=>{
    res.redirect('/')
})
app.get('/',(req,res)=>{
    res.render('welcome')
})

app.listen(PORT,()=>{
    console.log(`server is running at port number ${PORT}`)
})