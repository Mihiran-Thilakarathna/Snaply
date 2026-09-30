<div align="center">
  <img src="frontend/public/favicon.svg" alt="Snaply Logo" width="120" height="120">
  
  # ⚡ Snaply
  **The ultimate, lightning-fast media downloader**

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
    <a href="https://github.com/yt-dlp/yt-dlp"><img src="https://img.shields.io/badge/yt--dlp-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="yt-dlp" /></a>
  </p>
</div>

## 📖 About

**Snaply** is a sleek, modern web application designed for fast and effortless media downloading. Powered by the incredible `yt-dlp` in the backend, it supports extracting video and audio from hundreds of platforms.

Whether you're looking to save a quick video or download high-quality audio, Snaply provides a clean, user-friendly interface to get the job done smoothly without the clutter of traditional downloaders.

## ✨ Features

- 🚀 **Lightning Fast:** Built with a highly optimized FastAPI backend and asynchronous processing using Celery.
- 🎨 **Modern UI/UX:** A stunning, responsive React frontend styled with Tailwind CSS, featuring a beautiful dark mode.
- 🌍 **Universal Support:** Download from YouTube, Vimeo, Twitter, TikTok, and hundreds of other websites supported by yt-dlp.
- 📊 **Real-time Progress:** Track your download status and progress in real-time.
- 🛠️ **Format Selection:** Choose your desired video resolution and audio format before downloading.

## 💻 Tech Stack

**Frontend:**
- React (TypeScript)
- Vite
- Tailwind CSS

**Backend:**
- Python & FastAPI
- Celery (Task Queue)
- Redis (Message Broker)
- yt-dlp (Media Extraction Core)

## 🚀 Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v16+)
- **[Python](https://www.python.org/)** (3.9+)
- **[FFmpeg](https://ffmpeg.org/download.html)** - Crucial for media processing with `yt-dlp`. (Make sure it is added to your system's PATH variable).
- **Redis Server** - Required for the Celery background task queue.
  - *Windows Users:* We highly recommend **[Memurai](https://www.memurai.com/)** (a native Redis-compatible datastore for Windows). Download and install the free Developer edition.
  - *Linux/macOS Users:* Install native **[Redis](https://redis.io/docs/install/)**.

### Installation & Running (Windows)

The easiest way to get started on Windows is by using the provided PowerShell script. It automatically sets up the Python virtual environment, installs all Node/Python dependencies, and starts both the frontend and backend servers.

1. **Install Memurai** (using the link above) and ensure the Memurai service is running.
2. **Clone the repository:**
   ```bash
   git clone https://github.com/Mihiran-Thilakarathna/Snaply.git
   cd Snaply
   ```
3. **Run the startup script:**
   Open PowerShell (you may need to bypass the execution policy if scripts are disabled) and execute:
   ```powershell
   .\run.ps1
   ```
   
   *(If you are on Linux/macOS or prefer Docker, you can use the provided `docker-compose.yml` file)*:
   ```bash
   docker-compose up --build
   ```

3. **Open Snaply:**
   Navigate to `http://localhost:5173` in your web browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/Mihiran-Thilakarathna/Snaply/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
