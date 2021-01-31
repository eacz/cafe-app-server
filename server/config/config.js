process.env.PORT = process.env.PORT || 4000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.MONGO_URL = urlDB;
//JWT

process.env.TOKEN_EXP = 60 * 60 * 24 * 30;
process.env.SECRET_KEY = process.env.SECRET_KEY_PROD || 'dev-secret-key';
