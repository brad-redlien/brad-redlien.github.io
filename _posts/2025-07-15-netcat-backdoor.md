---
layout: post
title: "Creating and Defending Against Netcat Backdoor Login Shells & Reverse Shell Backdoors Using Named Pipes Named Pipes Exploit"
date: 2024-08-01
categories: [Cybersecurity]
tags: [Netcat, Named Pipes, Reverse Shell]
---

**I. Overview**

During the SANS SEC504 (Hacker Tools, Techniques, and Incident Handling) I learned how attackers use Netcat to create backdoor login shells, reverse shell backdoors, transfer files, and cause other mischief.

I created several VMs in Proxmox to learn more about how RITA () detects C2 beaconing traffic, but I first wanted to practice using Netcat to create a backdoor login shell and a reverse shell backdoor. However, I found that I couldn’t use the -e switch in Ubuntu to create a reverse shell because `-e` was removed for security reasons. To overcome this I created a named pipe using the `mkfifo` command, which I explain below.

Lastly, I discuss steps defenders can take to prevent, detect, and mitigate attackers’ use of Netcat with named pipes to create reverse shells.

[Read the full write-up here](../projects/#netcat-named-pipes-exploit)
