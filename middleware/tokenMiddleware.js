import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

export const tokenControl = (req ,res , next) => {
    const token = req.header("Authorization");
    if(!token || !token.startsWith('Bearer'))
    {
        return res.status(401).json({error:'Kimlik doğrulama başarısız'})
    }
    
    const jwtToken = token.substring(7)

    jwt.verify(jwtToken, process.env.SECRET_KEY , (err, user) => {
        if(err)
        {
            return res.status(403).json({error:'Yetkilendirme Başarısız'})
        }
        req.user = user;
        next();
    })
}