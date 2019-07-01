const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const LeavesController = require('../controllers/leaves');


router.get('/all', LeavesController.leaves_get_all);

router.post('/add_leave', checkAuth, LeavesController.leave_add);

router.delete('/delete/:id', checkAuth, LeavesController.leave_delete);

router.get('/get/:id', checkAuth, LeavesController.leave_get_by_id);

module.exports = router;