const express = require('express');
const Datastore = require('nedb');
const app = express();
const port = 3000;

// 解析 JSON 数据
app.use(express.json());

// 解析 urlencoded 数据（form 表单数据）
app.use(express.urlencoded({extended: true}));

// 创建 NeDB 数据库实例
const numberTypeDb = new Datastore({
  filename: 'number_type_list.db', autoload: true, timestampData: true
});
const numberDataDb = new Datastore({
  filename: 'number_data.db', autoload: true, timestampData: true
});

numberTypeDb.ensureIndex({fieldName: 'number', unique: true}, function (err) {
  if (err) {
    console.error('设置唯一索引时出错:', err);
  } else {
    console.log('成功设置唯一索引');
  }
});

numberDataDb.ensureIndex({fieldName: 'serialNumber', unique: true}, function (err) {
  if (err) {
    console.error('设置唯一索引时出错:', err);
  } else {
    console.log('成功设置唯一索引');
  }
});

// 确保数据库自动加载成功
numberTypeDb.loadDatabase((err) => {
  if (err) {
    console.error('数据库加载失败:', err);
  } else {
    console.log('数据库加载成功');
  }
});
numberDataDb.loadDatabase((err) => {
  if (err) {
    console.error('数据库加载失败:', err);
  } else {
    console.log('数据库加载成功');
  }
});
// 定义测试数据
const testData = [{
  "type": "8",
  "corp": "HT",
  "name": "测试数据",
  "serialNumber": "0001",
  "router": "0",
  "imgSrc": "https://test-tools.serta.cn/share//web/file/781968431070052511/17364147073301713//imageless/78196843107005251120250109172507371_97.jpg",
  "remark": "备注一下"
}];
// // 删除数据
// const deleteId = "O5sLqhv2joX4aLPH";
// numberDataDb.remove({ _id: deleteId }, {}, (err, numRemoved) => {
//   if (err) {
//     console.error('删除数据出错:', err);
//   } else {
//     console.log('删除数据成功，删除了', numRemoved, '条记录');
//   }
// });
//
// numberDataDb.insert(testData,(err,newDoc)=>{
//   if (err) {
//     console.error('插入数据时出错:', err);
//   } else {
//     console.log('成功插入数据:', newDoc);
//   }
// })

// 查询所有数据来验证插入结果
numberDataDb.find({}, function (err, docs) {
  if (err) {
    console.error('查询数据时出错:', err);
  } else {
    console.log('数据库中的所有数据:', docs);
  }
});


app.post('/numberType/add', (req, res) => {
  const newTodo = req.body;
  numberTypeDb.insert(newTodo, (err, newDoc) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(newDoc);
    }
  });
});

app.get('/numberType/:number', (req, res) => {
  const number = req.params.number;
  const query = {number: number};
  numberTypeDb.find(query, (err, docs) => {
    if (err) {
      res.status(500).send('查询出错');
    } else {
      res.send(docs);
    }
  })
})

app.post('/numberType/list', (req, res) => {
  console.log('收到请求 /numberType/list'); // 确认请求到达
  numberTypeDb.find({}, (err, docs) => {
    if (err) {
      console.error('数据库查询错误:', err);
      res.status(500).send('查询出错');
    } else {
      console.log('查询结果:', docs); // 输出查询到的数据
      res.send(docs);
    }
  });
});


// 添加新的填报数据
app.post('/numberData/add', (req, res) => {
  const newTodo = req.body;
  numberDataDb.insert(newTodo, (err, newDoc) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(newDoc);
    }
  });
});

app.get('/numberData/max', (req, res) => {
  const type = req.query.type;
  console.log("接收到请求数据,type=",type)
  numberDataDb.find({type: type}).sort({serialNumber: -1}).limit(1).exec((err, docs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (docs.length > 0) {
        res.json(docs[0].serialNumber)
      } else {
        res.json("0001")
      }
    }
  })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

