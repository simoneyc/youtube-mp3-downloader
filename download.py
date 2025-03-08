import yt_dlp
import sys

def download_video(url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'extractaudio': True,  # 只下載音頻
        'audioformat': 'mp3',  # 轉換成 mp3
        'outtmpl': output_path,  # 儲存路徑
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

if __name__ == "__main__":
    url = sys.argv[1]  # 從命令行獲取 URL
    output_path = sys.argv[2]  # 從命令行獲取輸出路徑
    download_video(url, output_path)
