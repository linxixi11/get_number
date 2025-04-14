const mysql = require('mysql2');

class DB {
  /**
   * 数据库连接池工具类
   * @param {Object} config 数据库配置
   * @param {string} config.host 主机地址
   * @param {string} config.user 用户名
   * @param {string} config.password 密码
   * @param {string} config.database 数据库名
   * @param {number} [config.port=3306] 端口号
   * @param {number} [config.waitForConnections=true] 是否等待连接
   * @param {number} [config.connectionLimit=10] 连接池最大连接数
   * @param {number} [config.queueLimit=0] 查询队列限制
   */
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      waitForConnections: config.waitForConnections || true,
      connectionLimit: config.connectionLimit || 10,
      queueLimit: config.queueLimit || 0
    });
  }

  /**
   * 执行SQL查询
   * @param {string} sql SQL语句
   * @param {Array} params 参数数组
   * @returns {Promise<Array>} 查询结果
   */
  async query(sql, params = []) {
    let connection;
    try {
      connection = await new Promise((resolve, reject) => {
        this.pool.getConnection((err, conn) => {
          if (err) {
            console.error('获取数据库连接时出错:', err);
            reject(err);
          } else {
            resolve(conn);
          }
        });
      });
      const [results] = await connection.promise().query(sql, params);
      return results;
    } catch (err) {
      console.error('执行SQL查询时出错:', err);
      throw new Error(`SQL Error: ${err.message}`);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * 查询单条数据
   * @param {string} sql SQL语句
   * @param {Array} params 参数数组
   * @returns {Promise<Object|null>} 查询结果
   */
  async get(sql, params = []) {
    const results = await this.query(sql, params);
    return results[0] || null;
  }

  /**
   * 插入数据
   * @param {string} table 表名
   * @param {Object} data 插入数据对象
   * @returns {Promise<number>} 插入ID
   */
  async insert(table, data) {
    const sql = `INSERT INTO ${table} SET ?`;
    const result = await this.query(sql, data);
    return result.insertId;
  }

  /**
   * 更新数据
   * @param {string} table 表名
   * @param {Object} data 更新数据对象
   * @param {string} where 条件语句
   * @param {Array} whereParams 条件参数
   * @returns {Promise<number>} 影响行数
   */
  async update(table, data, where, whereParams = []) {
    const sql = `UPDATE ${table} SET ? WHERE ${where}`;
    const result = await this.query(sql, [data, ...whereParams]);
    return result.affectedRows;
  }

  /**
   * 删除数据
   * @param {string} table 表名
   * @param {string} where 条件语句
   * @param {Array} whereParams 条件参数
   * @returns {Promise<number>} 影响行数
   */
  async delete(table, where, whereParams = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const result = await this.query(sql, whereParams);
    return result.affectedRows;
  }

  /**
   * 关闭连接池
   */
  async close() {
    await this.pool.end();
  }
}

// 使用示例
// 创建数据库实例
const db = new DB({
  host: '198.176.59.235',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'cad_number',
  connectionLimit: 20
});

// 处理异步操作
db.get('SELECT * FROM number_type')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });

module.exports = db;
