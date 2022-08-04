var express = require('express');
var router = express.Router();
var employeeControl = require('../controllers/C_employee')
    /* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('WELCOME TO EMPLOYEES DATA');
});
router.get('/getDetails', employeeControl.getemployeeData)
router.post('/postDetails', employeeControl.postemployeeData)
router.post('/fullDetails', employeeControl.postfulldetails)
router.put('/updateTitles', employeeControl.updatetitles)
router.delete('/deleteUser', employeeControl.deleteuser)
router.get('/getfullDetails', employeeControl.getfulldetails)
router.post('/onetime', employeeControl.getonetime)
router.post('/genetoken', employeeControl.gettoken)
router.post('/updatepassword', employeeControl.updatepassword)
router.post('/login', employeeControl.getauthdata)
router.post('/testencrypt', employeeControl.getencrypt)
router.post('/verifytoken', employeeControl.Token_verify)
router.post('/verifyRtoken', employeeControl.Rtoken_verify)
module.exports = router;


// {
//     "f_name": "mounica",
//     "l_name": "bing",
//     "email": "bing@gamil.com",
//     "dept_name": "testing",
//     "emp_id": 12,
//     "dept_id": 3,
//     "title": "jr_tester",
//     "salary": 45000
// }