process.env.PORT = process.env.PORT || 4000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://127.0.0.1:27017/cafe'
} else {
    urlDB='mongodb+srv://eacz:cafeapp@main.aodkn.mongodb.net/cafe'
}
process.env.MONGO_URL = urlDB;