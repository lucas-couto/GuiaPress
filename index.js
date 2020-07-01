const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

const CategoriesController = require('./categories/CategoriesController')
const ArticlesController = require('./articles/ArticlesController')
const UserController = require('./users/UserController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

//View engine
app.set('view engine', 'ejs')

//Sessions

//Redis
app.use(session({
    secret: 'ascawqejckdokgçasidqwijcnahuwvvhcdhbvmdhagzvxzpoilucas', cookie:{maxAge: 30000000}

}))


//Static
app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Database
connection.authenticate()
    .then(() => {
        console.log('Success connection')
    })
    .catch((e) => {
        console.log(e)
    })


app.use('/', CategoriesController)
app.use('/', ArticlesController)
app.use('/', UserController)


app.get('/', (req, res) => {
    Article.findAll({
        limit: 2
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories })
        })
    })
})

app.get('/:slug', (req, res) => {
    let slug = req.params.slug

    Article.findOne({ where: { slug: slug } })
        .then(article => {
            if (article) {
                Category.findAll().then(categories => {
                    res.render('article', { article: article, categories: categories })
                })
            } else {
                res.redirect('/')
            }
        })
        .catch(e => {
            res.redirect('/')
        })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug
    Category.findOne({ where: { slug: slug }, include: [{ model: Article }] })
        .then(category => {
            if (category) {
                Category.findAll()
                    .then(categories =>{
                        res.render('index', {articles: category.articles, categories: categories})
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch(e => {
            res.redirect('/')
        })
})


app.listen(3000, () => {
    console.log('Backend rodando...')
})