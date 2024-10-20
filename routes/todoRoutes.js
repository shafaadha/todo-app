const express = require('express');
const router = express.Router();
const Todo = require('../model/todo');
const expressLayouts = require('express-ejs-layouts')




// Menampilkan halaman utama
router.get('/', async (req, res) => {
    const category = req.query.category || 'All';
    const dateTime = new Date();
    const day = dateTime.getDate();
    const status = req.query.status || 'All';
    const search = req.query.search || '';
    const dueDateFilter = req.query.dueDate || '';
    try {
      //filter category
      const filter = {};
      if(category !== 'All') { 
        filter.category = category;
      }

      //filter status
      if(status === 'completed'){
        filter.completed = true;
      }else{
        filter.completed = false;
      }

      //filter judul atau task
      if(search){
        filter.$or = [
          { title:{$regex: search, $option: 'i'}},
          { task: {$regex: search, $option: 'i'}}
        ];
      }

      const todos = await Todo.find(filter);
      res.render('index', { todos: todos, category: category, date: day });
    } catch (err) {
      console.error(err);  // Tambahkan logging untuk memeriksa error
      res.status(500).send('Error fetching todos');
    }
  });
  

// Menambahkan todo baru
router.post('/add', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    task: req.body.task,
    category: req.body.category,
    dueDate: req.body.dueDate,
  });

  try {
    await todo.save();
    console.log(todo)
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Unable to add todo');
  }
});

// Tandai todo sebagai selesai
router.get('/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = true;
    await todo.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Unable to complete task');
  }
});

// Hapus todo
router.delete('/delete/:id', async (req, res) => {
  try {
    // Pastikan menggunakan filter yang benar
    await Todo.deleteOne({ _id: req.params.id });
    res.redirect('/');
  } catch (err) {
    console.error(err); // Log error untuk memeriksa detail kesalahan
    res.status(500).send('Unable to delete task');
  }
});

//tampilan edit
router.get('/edit/:title', async (req, res)=>{
  const todo = await Todo.findOne({title: req.params.title})
  res.render('edit',{
    layouts: 'layouts/layouts',
    todo
  })
})

//proses edit
router.put('/edit/:id', async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          task: req.body.task,
          category: req.body.category,
        },
      }
    );
    res.redirect('/');
  } catch (err) {
    console.error(err); // Log error
    res.status(500).send('Unable to update todo');
  }
});




module.exports = router;
