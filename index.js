import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('/tmp'));

app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send('請輸入 YouTube 連結');

  // 取得影片標題
  exec(`yt-dlp --get-title "${url}"`, (err, stdout) => {
    if (err) {
      console.error(err);
      return res.status(500).send('無法取得影片標題');
    }

    let title = stdout.trim()
    .replace(/[^\w\s-]/g, '')  // 移除所有特殊字元，只保留字母、數字、空格、"-"
    .replace(/\s+/g, '_');      // 將空格轉換成 "_"

    const outputPath = `/tmp/${title}.mp3`;  // 改存到 /tmp

    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" "${url}"`;

    exec(command, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('下載失敗');
        }
    
        setTimeout(() => {
          if (fs.existsSync(outputPath)) {
            res.json({ downloadUrl: `${req.protocol}://${req.get('host')}/downloads/${encodeURIComponent(title)}.mp3` });
          } else {
            res.status(500).send('檔案尚未準備好，請稍後再試');
          }
        }, 2000);
      });
  });
});

app.use(express.static(path.resolve('public'))); // 確保 public 目錄不會影響 downloads

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
