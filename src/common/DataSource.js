import Dexie from 'dexie';

const db = new Dexie('number');

// 定义数据库版本和表结构
db.version(1).stores({
  number_type: '++id, &number, name,created,last_updated',
  number_data: '++id, type, corp,name,[type+serialNumber],router,imgSrc,remark,created,last_updated'
});


// 添加表数据
async function addNumberType(data) {
  const result = await db.number_type.put(data);
  console.log("添加成功")
  return result;
}

// 根据 id 删除数据
async function deleteNumberTypeById(id) {
  try {
    await db.number_type.delete(id);
    console.log(`id 为 ${id} 的数据删除成功`);
  } catch (error) {
    console.error(`删除 id 为 ${id} 的数据时出错:`, error);
    throw error;
  }
}

async function selectNumberTypeList() {
  const result = await db.number_type.toArray();
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

// 添加表数据
async function addNumberData(data) {
  delete data.id;
  const result = await db.number_data.add(data);
  console.log("添加成功")
  return result;
}
async function selectSerialNumberMax(type) {
  console.log(req)
  const numberData = await db.number_data.where('[type+serialNumber]')
    .between([type,Dexie.minKey],[type,Dexie.maxKey]).reverse().first();
  const serialNumber = numberData ? numberData.serialNumber : 0;
  console.log("查询到的数据是：",serialNumber);
  return serialNumber;
}

async function selectNumberDataList(type) {
  const result = await db.number_data.where('type').equals(type).toArray();
  console.log("查询到的数据是：",result);
  return result;
}


export default {
  addNumberType,
  deleteNumberTypeById,
  selectNumberTypeList,
  updateNumberDataById,
  addNumberData,
  selectNumberDataList,
  selectSerialNumberMax
}


