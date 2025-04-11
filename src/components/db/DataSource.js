// 导入 NeDB 模块
const Datastore = require('nedb')

// 创建数据库实例,最大600M或100W行
const numberTypeDb = new Datastore({
  filename: './number_data.db',
  autoload: true,
  timestampData: true
})

// // 定义测试数据
// const testData = [{
//   "table": "number_type",
//   "table_content":{
//     "number":"8",
//     "name":"零件图"
//   }
// }];

// numberTypeDb.insert(testData,(err,newDoc)=>{
//   if (err) {
//     console.error('插入数据时出错:', err);
//   } else {
//     console.log('成功插入数据:', newDoc);
//   }
// })

// 确保数据库自动加载成功
function loadData(){
  numberTypeDb.loadDatabase((err) => {
    if (err) {
      console.error('数据库加载失败:', err);
    } else {
      console.log('数据库加载成功');
    }
  });
}


// 插入数据函数
function insertData(data, callback) {
  numberTypeDb.insert(data, callback)
}

// 查询数据函数
function findData(query, callback) {
  numberTypeDb.find(query, callback)
}

// 查询数据函数 排序
function findSortData(query, sortOptions, callback) {
  numberTypeDb.find(query, {sort: sortOptions}, callback)
}

// 更新数据函数
function updateData(query, update, options, callback) {
  numberTypeDb.update(query, update, options, callback)
}

// 删除数据
function removeData(query, callback) {
  // 调用 NeDB 的 remove 方法
  numberTypeDb.remove(query, {multi: true}, function (err, numRemoved) {
    if (err) {
      callback(err)
    } else {
      callback(null, numRemoved)
    }
  })
}

// 导出数据库操作函数
module.exports = {
  loadData,
  insertData,
  findData,
  findSortData,
  updateData,
  removeData
}
