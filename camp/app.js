const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Site = require('./models/site');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const sitesRoutes = require('./routes/sites');

mongoose.connect('mongodb+srv://janamrangani:Janam1231@cluster0.o1k3n8d.mongodb.net/campsites?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('components', path.join(__dirname, 'components'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/', sitesRoutes);

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'janammm@gmail.com', username: 'janammm' });
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.get('/', (req, res) => {
    const destinations = [
        {
            "imageURL": "https://images.unsplash.com/photo-1673007852227-9f58760eab24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZWZyb250fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            "title": "Lakefront",
            "description": "Get best lakeside experience to live in around the globe.",
            "category": "lakefront"
        },
        {
            "imageURL": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNhbXBpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
            "title": "Camping",
            "description": "Get best camping site to camp in different part of the world.",
            "category": "camping"
        },
        {
            "imageURL": "https://images.unsplash.com/photo-1656019065945-00b0c64c125d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fHRyZWVob3VzZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
            "title": "Treehouses",
            "description": "Get best Treehouses to spend your vaction around the globe.",
            "category": "treehouse"
        }
    ];
    res.render('home', { destinations });
})

app.get('/categories/:category', async (req, res) => {
    const category = req.params.category.toUpperCase();
    const sites = await Site.find({ "category": category }).populate('author');
    res.render('sites', { category, sites });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

