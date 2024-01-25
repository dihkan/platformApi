import {loginControl} from '../databases/database.js'
import jwt from 'jsonwebtoken'
export const postLoginController = (req , res) =>{
    const  requestData = req.body
    // console.log(requestData)


    loginControl(requestData)
    .then(result => {
        if(result.length> 0)
        {
            const user = {
                id : result[0].uyeId,
                username: result[0].isim,
                role: result[0].rol,
            }
            const token = jwt.sign({user}, process.env.SECRET_KEY)
            console.log("jwt:" , token)
        }else{
            res.status(301).json({error:'Bu kullanıcı bulunamadı'})
        }
    })
    .catch(err => {
        console.log(err);
        // Hata durumunda uygun bir hata yanıtı döndür
        res.status(500).json({ error: 'Sunucu hatası' });
    })
}