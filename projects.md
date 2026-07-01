---
layout: page
title: Projects
permalink: /projects/
---

## Featured Projects

Security engineering, detection engineering, incident response, and malware analysis projects completed as part of my cybersecurity education and home lab.

<!-- Project preview: Network Security Monitoring Lab -->
<article class="post-preview">
  <h2 class="post-title">
    <a href="{{ '/projects/network-security-monitoring-lab/' | relative_url }}">
      Building a Network Security Monitoring Lab with Proxmox, Arkime, Suricata, Zeek, and SiLK
    </a>
  </h2>

  <p class="post-meta">Posted on June 30, 2026</p>

  <p>
    Designed and built an enterprise-style Network Security Monitoring (NSM) home lab from the ground up using Proxmox,
    Arkime, Suricata, Zeek, SiLK, YAF, Open vSwitch, and Metasploitable 2. The project documents the complete monitoring
    pipeline from full packet capture and IDS alerting to protocol metadata and flow analytics, along with the
    troubleshooting required to validate each stage of the telemetry pipeline.
  </p>

  <p><a href="{{ '/projects/network-security-monitoring-lab/' | relative_url }}"><strong>Read More →</strong></a></p>
</article>

<hr>

<!-- Project preview: Metasploit PsExec -->
<article class="post-preview">
  <h2 class="post-title">
    <a href="{{ '/projects/metasploit-psexec/' | relative_url }}">
      Blue Team Investigation of a Simulated Metasploit PsExec Attack
    </a>
  </h2>
  <p class="post-meta">Posted on August 11, 2025</p>
  <p>
    Simulated a Metasploit PsExec-based intrusion on a Windows 10 machine and performed end-to-end blue team investigation using
    PowerShell and Sysmon to detect service execution, process chains, and C2 connections (including a Netcat backdoor).
  </p>
  <p><a href="{{ '/projects/metasploit-psexec/' | relative_url }}"><strong>Read More →</strong></a></p>
</article>

<hr>

<!-- Project preview: Netcat named pipes -->
<article class="post-preview">
  <h2 class="post-title">
    <a href="{{ '/projects/netcat-named-pipes/' | relative_url }}">
      Creating and Defending Against Netcat Backdoor Shells with Named Pipes
    </a>
  </h2>
  <p class="post-meta">Posted on July 17, 2025</p>
  <p>
    Built a lab to practice Netcat backdoor techniques and defender countermeasures. Covers creating login and reverse
    shells using named pipes (<code>mkfifo</code>) on Linux and documents detection and mitigation steps for blue teams.
  </p>
  <p><a href="{{ '/projects/netcat-named-pipes/' | relative_url }}"><strong>Read More →</strong></a></p>
</article>
