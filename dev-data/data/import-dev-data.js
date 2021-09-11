const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
    .then(con => console.log('DB connection succesful!'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

const importData = async () =>{
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch(err){
        console.log(err);
    }
};

const deleteData = async () =>{
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch(err){
        console.log(err);
    }
};

if(process.argv[2] === '--import'){
    importData();
}
if(process.argv[2] === '--delete'){
    deleteData();
}

