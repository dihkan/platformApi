import mysql from 'mysql2/promise'
import crypto from 'crypto'
const pool = mysql.createPool({
    host:process.env.HOST,
    port :process.env.MYSQL_PORT,
    user: process.env.USERNAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE_NAME
})
export const getById = async(uyeId) => {
    try {
        const query = `SELECT * FROM uyeler WHERE uyeId = ?`;
        const params = [uyeId];
        const [rows, fields] = await pool.execute(query, params);
        
        // Eğer sonuç boşsa, kullanıcı bulunamadığını belirten bir yanıt döndür
        if (rows.length === 0) {
            return { status: 404, data: { error: "Kullanıcı bulunamadı." }};
        }
        // Kullanıcının bilgilerini döndür
        return { status: 200, data: rows[0] };
    } catch (error) {
        console.error("getById fonksiyonunda hata:", error);
        return { status: 500, data: { error: "Veritabanı sorgusunda hata oluştu." }};
    }
}
export const getByName = async(uyeAdi) => {
    try {
        const query = "SELECT * FROM uyeler WHERE uyeAdi = ?";
        const params = [uyeAdi];
        const [rows, fields] = await pool.execute(query, params);
        
        // Eğer sonuç boşsa, kullanıcı bulunamadığını belirten bir yanıt döndür
        if (rows.length === 0) {
            return { status: 404, data: { error: "Kullanıcı bulunamadı." }};
        }
        // Kullanıcının bilgilerini döndür
        return { status: 200, data: rows[0] };
    } catch (error) {
        console.error("getByName fonksiyonunda hata:", error);
        return { status: 500, data: { error: "Veritabanı sorgusunda hata oluştu." }};
    }
}
export const getByMobile = async(mobile) => {
    try {
        const query = "SELECT * FROM uyeler WHERE mobile = ?";
        const params = [mobile];
        const [rows, fields] = await pool.execute(query, params);
        
        // Eğer sonuç boşsa, kullanıcı bulunamadığını belirten bir yanıt döndür
        if (rows.length === 0) {
            return { status: 404, data: { error: "Kullanıcı bulunamadı." }};
        }
        // Kullanıcının bilgilerini döndür
        return { status: 200, data: rows[0] };
    } catch (error) {
        console.error("getByMobile fonksiyonunda hata:", error);
        return { status: 500, data: { error: "Veritabanı sorgusunda hata oluştu." }};
    }
}
export const control = async (uyeAdi, mobile) => {
    try {
        let query = "SELECT * FROM uyeler";
        const params = [];
        let conditions = [];

        if (uyeAdi) {
            conditions.push("uyeAdi = ?");
            params.push(uyeAdi);
        }
        if (mobile) {
            conditions.push("mobile = ?");
            params.push(mobile);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(' OR ');
        } else {
            // Ne uyeAdi ne de mobile değeri gelmişse
            return { status: 201, data: { message: "Bir mail yada mobile kaydedilmeye çalışılmadı." }};

        }

        const [rows, fields] = await pool.execute(query, params);
        if (rows.length === 0) {
            return { status: 200, data: { message: "Kullanıcı bulunamadı." }};
        } else {
            return { status: 409, data: { message: "Bu kullanıcı adı veya mobil numarası zaten kayıtlı." }};
        }
    } catch (error) {
        console.log(error);
        return { status: 500, data: { error: "Sunucu Hatası..." }};
    }
}
export const insert = async(data) => {
    const {uyeAdi , mobile, password , isim , firmaAdi, titleId , ulkeId, sehirId,sektorId} = data;

    try{
            let query = "INSERT INTO  uyeler (uyeAdi , sifre , isim , rol , firmaAdi , titleId , mobile , kayitTarihi, sektorId ,  ulkeId , sehirId , p ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) "
            const sifre = crypto.createHash("md5").update(password).digest("hex")
            const now = new Date();
            const kayitTarihi = now.toISOString().split('T')[0];
            const params = [uyeAdi, sifre || null, isim || null, 'Visitor', firmaAdi || null, titleId || null, mobile, kayitTarihi, sektorId || null, ulkeId || null, sehirId  || null, password || null]; // Bu değerleri uygun şekilde doldurun
            const result = await pool.execute(query , params)
            return { status: 201, data: result[0].insertId};   
    }catch(error)
    {
        console.log(error)
        return { status: 500, data: { error: "Sunucu Hatası..."}};
    }
}
export const update = async(data) => {
    const {uyeId, uyeAdi , mobile, password , isim , firmaAdi, titleId , ulkeId, sehirId,sektorId} = data;

    let query = "UPDATE uyeler SET ";
    let params = [];
    let updateParts = [];

    if (uyeAdi !== undefined) {
        updateParts.push("uyeAdi = ?");
        params.push(uyeAdi);
    }
    if (password !== undefined) {
        const sifre = crypto.createHash("md5").update(password).digest("hex");
        updateParts.push("sifre = ?");
        params.push(sifre);
        updateParts.push("p = ?");
        params.push(password)
    }
    // Diğer alanlar için benzer kontroller
    if (isim !== undefined) {
        updateParts.push("isim = ?");
        params.push(isim);
    }
    if (firmaAdi !== undefined) {
        updateParts.push("firmaAdi = ?");
        params.push(firmaAdi);
    }  
    if (titleId !== undefined) {
        updateParts.push("titleId = ?");
        params.push(titleId);
    }
    if (mobile !== undefined) {
        updateParts.push("mobile = ?");
        params.push(mobile);
    }
    if (ulkeId !== undefined) {
        updateParts.push("ulkeId = ?");
        params.push(ulkeId);
    }
    if (sehirId !== undefined) {
        updateParts.push("sehirId = ?");
        params.push(sehirId);
    }
    if (titleId !== undefined) {
        updateParts.push("titleId = ?");
        params.push(sektorId);
    }

    // Eğer hiçbir alan güncellenmeyecekse, bir hata döndür
    if (updateParts.length === 0) {
        return { status: 400, data: { error: "Güncellenecek veri yok." } };
    }

    query += updateParts.join(", ");
    query += " WHERE uyeId = ?";
    params.push(uyeId);

    try {
        const [result] = await pool.execute(query, params);
        return { status: 200, data: { affectedRows: result.affectedRows } };
    } catch (error) {
        console.error("update fonksiyonunda hata:", error);
        return { status: 500, data: { error: "Sunucu Hatası..." } };
    }
}