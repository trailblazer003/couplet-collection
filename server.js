// 导入依赖
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 初始化Express应用
const app = express();
// 端口号（本地用3000，公网部署可改）
const PORT = process.env.PORT || 3000;

// 数据文件路径（存储投稿的JSON文件）
const DATA_FILE = path.join(__dirname, 'data', 'couplet_submissions.json');

// **************** 初始化目录和文件 ****************
// 确保data文件夹存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
// 确保JSON数据文件存在，不存在则创建空数组
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  console.log('初始化数据文件：', DATA_FILE);
}

// **************** 中间件配置 ****************
// 允许跨域请求（公网部署必备）
app.use(cors());
// 解析JSON格式的请求体
app.use(express.json());
// 托管public文件夹（前端页面）
app.use(express.static(path.join(__dirname, 'public')));

// **************** 核心接口：接收投稿数据 ****************
app.post('/submit', (req, res) => {
  try {
    // 1. 读取现有数据
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const submissions = JSON.parse(rawData);

    // 2. 添加新投稿数据
    submissions.push(req.body);

    // 3. 写入JSON文件（格式化，方便阅读）
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf8');

    // 4. 返回成功响应
    res.json({
      success: true,
      message: '投稿数据保存成功'
    });
  } catch (error) {
    // 错误处理
    console.error('保存数据失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误，数据保存失败'
    });
  }
});

// **************** 可选接口：查看所有投稿数据（管理用） ****************
app.get('/submissions', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const submissions = JSON.parse(rawData);
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '读取数据失败'
    });
  }
});

// **************** 启动服务器 ****************
app.listen(PORT, () => {
  console.log(`✅ 服务器启动成功！`);
  console.log(`🔗 本地访问地址：http://localhost:${PORT}`);
  console.log(`📂 数据存储路径：${DATA_FILE}`);
});
