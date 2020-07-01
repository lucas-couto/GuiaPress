const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
    User.findAll().then(users =>{
        res.render('admin/users/index', {users: users})
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/user/create', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user) {
            res.redirect('/admin/users/create')
        } else {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
            let passwordHash = hash

            User.create({
                email: email,
                password: passwordHash
            }).then(() => {
                res.redirect('/')
            }).catch(e =>{
                res.redirect('/')
            })
        }
    })

})

router.get('/login', (req,res) =>{
    res.render('admin/users/login')
})

router.post('/authenticate', (req,res) =>{
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where:{email:email}
    }).then(user =>{
        if(user){
            let correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })

})

router.get('/logout', (req,res) =>{
    req.session.user = undefined
    res.redirect('/')
})


module.exports = router