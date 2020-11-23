const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');


// express app
const app = express();

// connect to MongoDB
const dbURI = 'mongodb+srv://user:user@cluster0.aosag.mongodb.net/node-zero?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(4000))
.catch((err) => console.log(err));

// register view engine
app.set('view_engine', 'ejs');

// middleware & static files
app.use(express.static('public'));                  // '.use' specific middleware to a path.
app.use(express.urlencoded({ extended: true }));    // middleware required to accept form data
app.use(morgan('tiny'));


// routes are searched sequentially until a match is found.
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'about' });
});


// blog routes

app.get('/blogs/create', (req, res) => {
    res.render('create.ejs', { title: 'create' });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index.ejs', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/table', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('table.ejs', { title: 'data table', blogs: result })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    console.log(req.body.title);
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details.ejs', { blog: result, title: 'Blog details' });
    })
    .catch(err => {
        res.status(404).render('404.ejs', { title: 'Blog not found' });
    });
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/blogs' });
    })
    .catch(err => {
        console.log(err);
    })
})


// 404 page
app.use((req, res) => {
    res.status(404).render('404.ejs', { title: '404' });
});
