import {getById,
        getByExhibitionId,
        getByUserId,
        insert,
        update,
        control} from '../models/inviteModel.js';

export const getInviteId = async(req, res) => {
    const inviteId = req.body.inviteId
    const result = await getById(inviteId);
    res.status(result.status).json(result.data);
}
export const getInvites = async(req, res) => {
    const exhibitionId = req.query.exhibitionId;
    const userId = req.query.userId;
    const role=req.query.role || '';
    const status=req.query.status || 1 
    if (!exhibitionId && !userId) {
        return res.status(400).send("Lütfen bir sorgu parametresi girin. 'exhibitionId' veya 'userId' parametrelerinden biri olmak zorundadır.");
    }

    let result
    try{

        if(exhibitionId)
        {
            result = await getByExhibitionId(exhibitionId , role , status)
        }else if(userId)
        {
            result = await getByUserId(userId)
        }
        res.status(result.status).json(result.data);
    }catch(error){
        conlole.error("getInvites fonksiyonun da hata : " , error)
        res.status(500).send("Bir hata oluştu")
    }

}
export const createInvitation = async(req , res) => {

        const result = await insert(req.body)
        
        res.status(result.status).json(result.data)
}
export const updateInvitation = async(req, res) => {
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
export const deleteInvitation = async(req, res) => {
    
}