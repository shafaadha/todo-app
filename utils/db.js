const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test1').then(()=>
    console.log('Connected!'));