import {getById,
        getByName,
        getByMobile,
        insert,
        update,
        control} from '../models/userModel.js';

export const postUserId = async(req, res) => {
    const uyeId = req.body.uyeId
    const result = await getById(uyeId);
    res.status(result.status).json(result.data);
}
export const getUserId = async(req, res) => {
    const uyeId= req.query.uyeId;
    const uyeAdi= req.query.uyeAdi;
    const mobile= req.query.mobile;
    let result
    if(uyeId)
    {
        result = await getById(uyeId)
    }else if(uyeAdi)
    {
        result = await getByName(uyeAdi)
    }else if(mobile)
    {
        result = await getByMobile(mobile)
    }else{
        return res.status(400).send("Lütfen bir sorgu parametresi girin. uyeId yada uyeAdi parametrelerinden biri olmak zorundadır.")
    }
    res.status(result.status).json(result.data);

}
export const getUsersByCountryCity = async(req, res) => {
    const { ulkeId , sehirId} = req.body
    try{

        let query = "SELECT * FROM uyeler uy ";
        const params = []
         // Eğer sehirId verisi gelirse, sorguya eklemek
         if (ulkeId !== undefined || sehirId !== undefined) {
            query += "LEFT JOIN ulkeler u ON uy.ulkeId = u.ulkeId ";
            query += "LEFT JOIN sehirler s ON uy.sehirId = s.sehirId ";
          }
      
          let whereAdded = false;
      
          if (ulkeId !== undefined) {
            query += "WHERE u.ulkeId = ? ";
            params.push(ulkeId);
            whereAdded = true;
          }
      
          if (sehirId !== undefined) {
            if (whereAdded) {
              query += "AND ";
            } else {
              query += "WHERE ";
            }
            query += "s.sehirId = ? ";
            params.push(sehirId);
          }

        const result = await pool.execute(query , params)
        console.log(result[0].length);
        res.json(result[0])
    }catch(error)
    {
        console.log(error)
        res.status(500).json({error: 'Sunucu Hatası'})
    }
}
export const insertUser = async(req , res) => {
    const kontrol = await control(req.body.uyeAdi , req.body.mobile)
    console.log(kontrol);
    if(kontrol.status === 200){
        const result = await insert(req.body)
        res.status(result.status).json(result.data)
    }else if(kontrol.status === 409)
    {
        res.status(kontrol.status).json(kontrol.message)
    }
}
export const updateUser = async(req, res) => {
        const kontrol = await control(req.body.uyeAdi , req.body.mobile)
        console.log(kontrol);

    if(kontrol.status === 200 || kontrol.status === 201){
        const result = await update(req.body)
        res.status(result.status).json(result.data)
    
    }else if(kontrol.status === 409)
    {
        res.status(kontrol.status).json(kontrol.data.message)
    }
}