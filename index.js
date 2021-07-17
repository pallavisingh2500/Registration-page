const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose
    .connect(
        'mongodb://localhost:27017/skynoxTech',
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    )
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

// Welcome Page
app.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
app.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);



// Routes
app.use('/users', require('./routes/users.js'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running on ${PORT}`));
app.listen(3000, () => {
    console.log("server running at port 3000");
})