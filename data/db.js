const { Client } = require('pg');
const config = require("../config");

const client = new Client(config.db);

client.connect(function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("Bağlandı");
});

// PostgreSQL sorgularını gerçekleştirmek için kullanılacak fonksiyon
const query = async (sql, values) => {
    try {
        const result = await client.query(sql, values);
        return result.rows;
    } catch (err) {
        console.error('Sorgu hatası:', err.message); // PostgreSQL hata mesajını log'la
        console.error('Sorgu:', sql); // Hata oluşan sorguyu log'la
        console.error('Parametreler:', values); // Hata ol
    }
};

module.exports = {
    query, // Dışarıya query fonksiyonunu export et
    end: () => client.end() // client'ı kapatmak için bir fonksiyon ekledik
};
