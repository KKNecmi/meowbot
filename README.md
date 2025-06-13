# meowbot — Multi-Instance Mineflayer CLI

[![License](https://img.shields.io/badge/license-MIT-blue)](#-license)
[![issues - meowbot](https://img.shields.io/github/issues/KKNecmi/meowbot?color=darkgreen)](https://github.com/KKNecmi/meowbot/issues)

A tiny command-line tool that can spin up **one or hundreds of Minecraft bots** in seconds using  
[Mineflayer](https://github.com/PrismarineJS/mineflayer).

> ⚠️ **For educational & testing purposes only.**  
> Do **not** use to disrupt servers you do not own or have permission to test on.

---

## ✨ Why?

- **Rapid testing** – spawn a bunch of clients to load-test your plugin or server.
- **Demo / showcase** – have multiple accounts online for a video or screenshot.

---

## 🚀 Features

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `botname <name>`       | Set the **base username** (default: `meowbot`). |
| `botsize <n>`          | How many bots to create (1-100).                |
| `version <ver>`        | Minecraft protocol version (default: `1.21.4`). |
| `server <ip:port>`     | Target server, e.g. `127.0.0.1:25565`.          |
| `start` / `stop`       | Connect or disconnect all bots.                 |
| `spam "<msg>" <count>` | Broadcast a message _n_ times with every bot.   |
| `botstatus`            | Print current settings.                         |
| `help` / `exit`        | Self-explanatory.                               |

- **Auto-installer** – missing dependencies (`mineflayer`, `mineflayer-pathfinder`) are installed on first run.
- **Colourful CLI** – ANSI colours for better readability on any terminal.

---

## 📦 Installation

```bash
git clone https://github.com/KKNecmi/meowbot.git
cd meowbot
npm install             # installs commander + locks deps
```
