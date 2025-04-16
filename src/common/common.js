// 添加表数据
async function addNumberType(data) {
  try {
    const response = await $http.post('http://localhost:8080/metalPlate/save', data);
    console.log(response);
  } catch (err) {
    console.error('POST请求错误:', err);
  }
  console.log("添加成功")
  return result;
}

const numberType = {
  number: 8,
  name : "钣金图"
}

addNumberType(numberType);
