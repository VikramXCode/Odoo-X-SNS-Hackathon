# 🚀 Quick Start Install

Install **Global Router** in seconds using our automated script.

## 🧪 One-Liner Install

```bash
curl -sSL https://get.globalrouter.app | bash
```

This will:

- Check dependencies (Docker, Docker Compose)
- Set up project directory
- Download required files
- Prompt for basic configuration (like domain name)
- Start Global Router with Docker Compose

## ✅ Requirements

- Docker + Docker Compose
- Linux server or VPS
- Optional: Domain name for HTTPS

## 🔍 What It Does

The script automatically:

1. Verifies Docker is installed and running
2. Downloads `docker-compose.yml` and `.env`
3. Prompts you for domain and port settings
4. Waits for services to start
5. Prints success info with next steps

## 🧼 Uninstall

To remove everything:

```bash
cd globalrouter
docker compose down -v
rm -rf globalrouter
```

Need more control? Explore other [install options](getting_started.md) like Docker, Proxmox, Synology NAS, and more.
