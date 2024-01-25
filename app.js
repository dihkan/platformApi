import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import auth from './routes/auth.js'
import api from './routes/api.js'


const app = new express() 
app.use(express.json())
app.use("/auth" , auth)
app.use("/api" , api)

const PORT = process.env.PORT || 3001
app.listen(PORT  , () => {
    console.log(`http://localhost:${PORT} üzerinde çalışan Server!!!`)
})