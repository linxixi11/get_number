import Dexie from 'dexie';

const db = new Dexie('number_type');

// 定义数据库版本和表结构
db.version(1).stores({
  number_type: '++id, &number, name,created,last_updated',
  number_data: '++id, &type, corp,name,serialNumber,router,imgSrc,remark,created,last_updated'
});

// 添加表数据
async function addNumberType(req) {
  const result = await db.number_type.put(req);
  console.log("添加成功")
  return result;
}

// 根据 id 删除数据
async function deleteNumberDataById(id) {
  try {
    await db.number_type.delete(id);
    console.log(`id 为 ${id} 的数据删除成功`);
  } catch (error) {
    console.error(`删除 id 为 ${id} 的数据时出错:`, error);
    throw error;
  }
}

async function selectNumberTypeList(req) {
  const result = await db.number_type.toArray(req);
  console.log("查询到的数据是：",result);
  return result;
}

// 根据 id 更新 表中的数据
async function updateNumberDataById(id, updatedData) {
  try {
    const result = await db.number_type.update(id, updatedData);
    if (result) {
      console.log(`id 为 ${id} 的数据更新成功`);
    } else {
      console.log(`未找到 id 为 ${id} 的数据，更新失败`);
    }
    return result;
  } catch (error) {
    console.error(`更新 id 为 ${id} 的数据时出错:`, error);
    throw error;
  }
}
export default {
  addNumberType,
  deleteNumberDataById,
  selectNumberTypeList,
  updateNumberDataById
}


