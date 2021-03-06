const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.signup = (req, res, next ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12).then(
        hashedPw => {
            const user = new User({
                email,
                password: hashedPw,
                name
            });
            return user.save();
        }
    )
    .then(result => {
        res.status(201).json({message: 'OK', userId: result._id})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.login = (req, res, next ) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({email})
        .then(
            user => {
                if (!user) {
                    const error = new Error('User with this email couldnot be found')
                    error.statusCode = 401;
                    throw error;
                }

                loadedUser = user;
                return bcrypt.compare(password, user.password);
            })
            .then(isEqual => {
                if (!isEqual) {
                    const error = new Error('Wrong password');
                    error.statusCode = 401;
                    throw error;
                }

                const token = jwt.sign(
                        { email: loadedUser.email, userId: loadedUser._id.toString() },
                        'secretToken',
                        { expiresIn: '1h' }
                    );
                res.status(200).json({token, userId: loadedUser._id.toString()})

            })
            .catch(err => console.log(err))
}