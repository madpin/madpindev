---
layout:      post 
draft:       false
title:      "VPS: My Oracle Cloud ARM Server Setup - It's Free Real Estate!"
subtitle:   "From 'Ubuntu' to 'MadPin': How I Secured My Free Oracle Cloud VPS and Lived to Tell the Tale"
description: "Join me, Thiago, on a humorous and insightful journey as I set up my free Oracle Cloud ARM instance. We'll tackle user management, security hardening, Docker, and more, all while keeping our sanity (mostly) intact. Plus, discover why Oracle's offering beats the pants off oversold VPS providers!"
image_description: "A humorous illustration of a computer server wearing a superhero cape, with the Oracle logo subtly embedded in the background, symbolizing a powerful and free VPS setup."
tags:       [VPS, Oracle Cloud, ARM, Linux, Security, Docker, SSH, Ubuntu, Server Setup, Cloud Computing, Free Tier, Fail2Ban, Zsh, Powerlevel10k]
author:     "Thiago MadPin"
date:        2024-12-19
URL:         "/2024/12/19-vps-first-setup/"
image:       "/img/posts/2024-12-19-vps-first-setup.jpg"
categories:  [ Tech ]
tags: [vps, linux, docker, ssh, ubuntu, vps setup, cloud, free]
---

So, I did it again. I set up another VPS. You know, that feeling when you get a new digital toy? It's like Christmas morning, except instead of unwrapping presents, you're staring at a blinking cursor, ready to type in commands that seem like ancient incantations. This time, it was an Oracle Cloud ARM-based instance, and the best part? It's free! That's right, Oracle's "Always Free" tier is like finding a twenty in your old jeans, except this twenty keeps giving. Let me walk you through how I turned this blank slate into a secure, Docker-ready playground, all from my cozy little corner in Dublin.

## 👤 Bye Bye 'Ubuntu', Hello 'MadPin'

First things first, we needed to do a little digital identity theft—but the good kind! The default `ubuntu` user on these instances is like that one generic key everyone seems to have. Not very secure, right? So, I created a new user, `madpin`, because let's face it, that's way cooler. I did all those changes after using SSH to connect to my VPS, then:

1. **Creating My Digital Alter Ego:**
    ```bash
    sudo adduser madpin
    sudo usermod -aG sudo madpin
    ```

2. **The Great SSH Key Heist (But Legal, I Promise):**
    Copied my SSH keys over to the `madpin` user. It's like giving myself a VIP pass to my own server. Notice, this step involves making another directory, copying the `authorized_keys` file, changing the ownership, and then changing the permissions.
    ```python
    sudo mkdir /home/madpin/.ssh
    sudo cp /home/ubuntu/.ssh/authorized_keys /home/madpin/.ssh
    sudo chown -R madpin:madpin /home/madpin/.ssh
    sudo chmod 700 /home/madpin/.ssh
    sudo chmod 600 /home/madpin/.ssh/authorized_keys
    ```

3. **Kicking 'Ubuntu' to the Curb:**
    With `madpin` safely set up, it was time to say "tchau" to `ubuntu`. We locked it out, just to be safe.
    ```bash
    sudo usermod -L ubuntu
    sudo passwd -l ubuntu
    ```

4. **Banishing the Password Demons:**
    In another measure to enhance our security, we disable the login with a password.
    ```bash
    sudo sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sudo sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sudo systemctl restart sshd
    ```

> [!TIP]
> Always double-check your SSH configuration before logging out. Locking yourself out is a rite of passage, but it's not fun.

## 🔄 Update Frenzy

Next up, updates. It's not as exciting as a new episode of your favorite *série*, but it's crucial.
I'm talking about making sure your server is up-to-date. Updated packages mean fewer vulnerabilities, and nobody wants a server full of holes, do they? So:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nano vim htop glances build-essential -y
sudo apt install -y wget curl net-tools lsof
sudo apt install inetutils-ping
```

> [!IDEA] Summary
> These commands update the package list, upgrade all upgradable packages, and install some essential tools. `nano` and `vim` are text editors (choose your fighter!), `htop` and `glances` are for monitoring your server's vital signs, `build-essential` is needed to compile stuff, and well, `wget`, `curl`, `net-tools`, `lsof` and `inetutils-ping` are some useful tools!

After setting up those packages, I've setup my `timedatectl` to automatically setup the timezone to be the same as mine:

```bash
sudo timedatectl set-timezone Europe/Dublin
```

## 🔒 Fort Knox-ing the SSH

SSH is our gateway to the server, so we need to protect it. We're going to change the default port, disable root login, and generally make it harder for the bad guys (or bots) to get in. This also included:

1. **Backup, Backup, Backup!** : Before we start messing with the configurations, we made a backup, just in case.

    ```bash
    sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
    ```

    > [!NOTE]
    > Always backup important configuration files. It's the "save game" button of server management.

2. **Locking Down SSH:** Changed the port, disabled root login, and only allowed our `madpin` user.

    ```bash
    sudo sed -i 's/^#Port 22/Port 2234/' /etc/ssh/sshd_config
    sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
    sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
    echo 'AllowUsers madpin' | sudo tee -a /etc/ssh/sshd_config
    sudo systemctl restart sshd
    ```

> [!IMPORTANT]
> Remember the new SSH port (2234 in this case). Write it down, tattoo it on your arm, do whatever it takes.

## 🛡️ Enter Fail2Ban: The Bouncer

Think of Fail2Ban as the bouncer at the club door, but for your server. It's there to kick out anyone who tries to guess your password too many times.

```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

We edited `jail.local` to make sure Fail2Ban was watching our new SSH port:

```ini
[sshd]
enabled = true
port = 2234
```

And then, like any good bouncer, we made sure it was on duty:

```bash
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

> [!WARNING]
> Fail2Ban is powerful, but it can lock you out too. Make sure you understand how it works before tweaking the settings.

## ⏰ Time is of the Essence: Setting up NTP

Keeping your server's clock in sync is important. It's not just about being punctual; it affects logs, security, and overall system health.
NTP, short for Network Time Protocol, will make sure your server's clock is always on time by using a pool of `ntp` servers available on the internet.

```bash
sudo apt install ntp -y
sudo systemctl status ntp
```

## 🔄 Unattended Upgrades: Because We're Lazy

Let's be honest, manually updating your server is about as fun as watching paint dry. So, we set up unattended upgrades to do the job for us.

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

> [!INFO]
> Unattended upgrades can be a lifesaver, but they can also break things. It's like giving your server a surprise party every day - usually fun, but occasionally disastrous.

## 🐳 Docker: Because Containers are Cool

Now for the fun part: Docker! Everything's better in containers, right? It's like putting your apps in neat little lunchboxes. First, we install some requisites packages:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

> [!TIP]
> Think of Docker containers as the *feijoada* of the software world: everything you need, all mixed together in one delicious package.

Then, we add the docker repository in our list of Linux repositories, so then we can install `docker` using `apt-get install`:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

To check if everything went well, we run the `hello-world` image, which basically just shows a message confirming that your installation appears to be working correctly.

```bash
sudo docker run hello-world
```

## 📦 Git: For Version Control and Sanity

I'm a big fan of Git. It's saved my bacon more times than I can count. Plus, it's essential for any developer, whether you're working on a weekend project or the next big thing.

```bash
sudo apt install git -y
git --version
```

> [!EXAMPLE]
> Using Git is like having a time machine for your code. Mess something up? Just go back in time to when it worked!

## 🐚 Zsh and Powerlevel10k: Shell Envy

Last but not least, we're going to pimp our shell. Why settle for the default bash when you can have a shell that looks like it was designed by Tony Stark?
First, let's install `zsh`

```bash
sudo apt install zsh -y
```

Then, we install `oh-my-zsh` framework using `curl`

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Finally, let's install the `powerlevel10k` theme for `zsh`:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

> [!QUOTE]
>  "With a great shell comes great productivity." -  Uncle Ben (if he were a programmer)

## Wrapping Up: From Zero to Hero

And there you have it! We've taken a brand-new Oracle Cloud VPS and turned it into a secure, updated, Docker-ready machine with a shell that's the envy of all your techie friends. It wasn't always smooth sailing - there were moments of head-scratching and Googling error messages - but that's all part of the fun, right?

Remember, setting up a VPS is a journey, not a destination. There's always more to learn, more to tweak, and more to optimize. But with this setup, you've got a solid foundation to build on. So go forth, experiment, and most importantly, have fun! And if you ever find yourself in Dublin, hit me up. We can grab a pint and talk about all things tech - or maybe just debate the merits of `vim` versus `nano`. Cheers!

