const Leave = require('../models/leave');
const mongoose = require('mongoose');

exports.leaves_get_all = (req, res, next) => {
    Leave.find()
        .select('_id fullName startDate endDate')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                leaves: docs.map(doc => {
                    return {
                        _id: doc._id,
                        fullName: doc.fullName,
                        startDate: doc.startDate,
                        endDate: doc.endDate,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/leaves/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.leave_add = (req, res, next) => {
    const leave = new Leave({
        _id: new mongoose.Types.ObjectId,
        fullName: req.body.fullName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });
    leave.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'leave added successfully',
                createdLeave: {
                    _id: result._id,
                    fullName: result.fullName,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/leaves/' + result._id
                    }
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.leave_delete = (req, res, next) => {
    const id = req.params.id;
    Leave.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'leave deleted successfully',
                createdLeave: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.leave_get_by_id = (req, res, next) => {
    const id = req.params.id;
    Leave.findById(id)
        .select('_id fullName startDate endDate')
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}