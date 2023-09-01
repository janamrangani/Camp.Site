const mongoose = require('mongoose');
const Site = require('../models/site');
const data = require('./data.js');

mongoose.connect('mongodb+srv://janamrangani:Janam1231@cluster0.o1k3n8d.mongodb.net/campsites?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Site.deleteMany({});
    for (let site of data) {
        const s = new Site(site);
        await s.save();
    }
}

seedDB();