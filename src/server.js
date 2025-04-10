const express = require('express');
const Datastore = require('nedb');
const app = express();
const port = 3000;

// 解析 JSON 数据
app.use(express.json());

// 创建 NeDB 数据库实例
const numberTypeDb = new Datastore({ filename: 'number_type_list.db', autoload: true });
const numberDataDb = new Datastore({ filename: 'get_number.db', autoload: true });

// 添加新的填报数据类型
app.post('/numberType/add', (req, res) => {
  const newTodo = req.body;
  db.insert(newTodo, (err, newDoc) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(newDoc);
    }
  });
});
// 添加新的填报数据
app.post('/numberData/add', (req, res) => {
  const newTodo = req.body;
  db.insert(newTodo, (err, newDoc) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(newDoc);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

