const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// 确保data目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// 确保数据文件存在
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 提交数据接口
app.post('/submit', (req, res) => {
  try {
    // 读取现有数据
    const existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // 添加新数据
    existingData.push(req.body);
    
    // 写入文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2), 'utf8');
    
    res.json({ success: true, message: '提交成功' });
  } catch (error) {
    console.error('保存数据出错:', error);
    res.status(500).json({ success: false, message: '保存数据失败' });
  }
});

// 获取所有提交数据（可选，用于管理查看）
app.get('/submissions', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('读取数据出错:', error);
    res.status(500).json({ success: false, message: '读取数据失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`数据存储在 ${DATA_FILE}`);
});
