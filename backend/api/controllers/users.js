const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_sign_up = (req, res, next) => {
    User.find({
            UserName: req.body.UserName
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'UserName exists'
                })
            } else {
                bcrypt.hash(req.body.Password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            UserName: req.body.UserName,
                            Password: hash
                        });
                        user.save()
                            .then(
                                result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User created successfully'
                                    })
                                }
                            )
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            });
                    };
                });
            }
        })
}

exports.user_login = (req, res, next) => {
    User.find({UserName: req.body.UserName})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed !'
                })
            }
            bcrypt.compare(req.body.Password, user[0].Password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed !'
                    })
                }
                if(result) {
                    const token = jwt.sign({
                        UserName: user[0].UserName,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: 'Auth successful !',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed !'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.user_delete = (req, res, next) => {
    const id = req.params.id;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted successfully',
                createdLeave: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}