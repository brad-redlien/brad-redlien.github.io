---
layout: page
title: "Enterprise Network Security Monitoring Lab"
permalink: /projects/network-security-monitoring-lab/
---

*A Blue Team home lab for packet capture, intrusion detection, protocol analysis, and flow analytics.*

---

## Introduction

After earning the SANS GCIA (GIAC Certified Intrusion Analyst), I wanted to continue developing the network analysis skills covered in the course by building a home lab that resembles an enterprise network security monitoring (NSM) environment.

While I initially experimented with Security Onion (which is an excellent platform), I realized I wanted a better understanding of how the individual components work together. The lab I built provides full packet capture, intrusion detection, protocol analysis, and flow analytics using individual open-source components.

Rather than deploying a single appliance, I decided to build the monitoring pipeline myself. After several weekends of troubleshooting, rebuilding configurations, and validating data at each stage, I now have an open source NSM platform that I can use for incident response practice, malware analysis, threat hunting, and future Blue Team projects.

---

## Lab Specifications

<table class="table">
  <thead>
    <tr>
      <th>Component</th>
      <th>Technology</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Hypervisor</td><td>Proxmox VE 9.2</td></tr>
    <tr><td>Sensor OS</td><td>Ubuntu 26.04 LTS</td></tr>
    <tr><td>Packet Capture</td><td>Arkime</td></tr>
    <tr><td>IDS</td><td>Suricata</td></tr>
    <tr><td>Protocol Analysis</td><td>Zeek</td></tr>
    <tr><td>Flow Analytics</td><td>SiLK + YAF</td></tr>
    <tr><td>Traffic Mirroring</td><td>Open vSwitch</td></tr>
    <tr><td>Attacker VM</td><td>Kali Linux</td></tr>
    <tr><td>Target VM</td><td>Metasploitable 2</td></tr>
    <tr><td>Packet Storage</td><td>4 TB External SSD</td></tr>
  </tbody>
</table>

---

# Goals

My objectives for this lab were to:

- Capture 100% of network traffic
- Preserve packets for forensic analysis
- Generate IDS alerts
- Create protocol metadata
- Generate flow records
- Correlate alerts, packets, protocol metadata, and flow records during investigations
- Build a platform for future malware analysis and incident response exercises
- Gain practical experience with tools encountered in enterprise SOC environments

---

# Lab Architecture

I host the lab environment on a Proxmox virtualization server running on a repurposed System76 Pangolin 10 laptop upgraded with additional memory.

The lab consists of:

- Proxmox Virtual Environment
- Kali Linux (attacker)
- Metasploitable 2 (target)
- Ubuntu NSM sensor
- Open vSwitch traffic mirroring
- A 4 TB external drive for full packet capture

Traffic never passes through the sensor directly. Instead, the Open vSwitch creates a mirrored copy of traffic between the attacker and target systems. This mimics how production network taps and SPAN ports operate.

---

**Figure 1 – Proxmox Virtual Environment**

![Proxmox](/assets/img/network-security-monitoring-lab/proxmox-overview.png)

---

**Figure 2 – Network Architecture**

![Lab Network Topology](/assets/img/network-security-monitoring-lab/network-topology.png)

---

# Technology Stack

## Arkime

Arkime is the full packet capture platform.

It continuously captures network traffic while indexing packets for retrieval during investigations. Unlike traditional packet captures that can be difficult to search, Arkime allows me to locate and reconstruct individual sessions within seconds.

Arkime provides:

- Continuous packet capture
- Packet indexing
- Session reconstruction
- Packet retrieval
- Web investigation interface

Rather than relying solely on IDS alerts, I can retrieve the complete packet history for any connection and inspect exactly what occurred on the wire (something that GCIA emphasized).

---

**Figure 3 – Arkime Session**

![Arkime Session](/assets/img/network-security-monitoring-lab/arkime-session-list.png)

![Arkime Session](/assets/img/network-security-monitoring-lab/arkime-http-session.png)

---

## Suricata

Suricata provides intrusion detection using the Emerging Threats ruleset while also performing protocol identification and application layer analysis.

During deployment I validated:

- HTTP detection
- SMB detection
- Protocol anomaly detection
- IDS alert generation
- Eve JSON logging
- Fast log output

One interesting troubleshooting issue involved Ubuntu naming the mirrored interface `ens19`, while my original Suricata configuration referenced `eth19`. After correcting the interface configuration, Suricata, to my great relief, immediately began processing mirrored traffic and generating alerts.

One of my future goals is to begin writing custom Suricata detection rules as I continue expanding the lab.

---

**Figure 4 – Suricata Eve JSON Alerts**

![Suricata](/assets/img/network-security-monitoring-lab/suricata-eve-json.png)

---

## Zeek

Rather than running Zeek continuously, I chose to use it as an investigation platform.

Packet captures stored by Arkime can be analyzed with Zeek whenever deeper protocol visibility is required. This approach reduces CPU utilization while still providing access to Zeek's rich protocol metadata during investigations.

Zeek generates logs such as:

- conn.log
- dns.log
- http.log
- ssl.log
- smb.log
- files.log

This allows me to examine protocol behavior without manually reviewing every packet in Wireshark.

---

## SiLK

SiLK provides another important layer by converting packet captures into searchable flow records.

While Arkime captures every packet, SiLK summarizes communication into flow records that I can quickly search.

I spent considerable time working with SiLK during GCIA, but assembling the entire toolchain proved more challenging than I expected.

After compiling Carnegie Mellon's latest release from source, I built the following pipeline:

```text
PCAP
   ↓
YAF
   ↓
IPFIX
   ↓
SiLK Flow Records
```

This enables high-speed analysis using tools like:

- rwcut
- rwfilter
- rwstats
- rwfileinfo

Flow data complements packet captures by allowing analysts to identify scanning behavior, lateral movement, and communication patterns without first examining individual packets.

---

**Figure 5 – SiLK Flow Records (rwcut)**

![SiLK](/assets/img/network-security-monitoring-lab/silk-rwcut.png)

---

**Figure 6 – SiLK Statistics (rwstats)**

![SiLK](/assets/img/network-security-monitoring-lab/silk-rwstats.png)

---

# Traffic Validation

After deploying the monitoring platform, I generated test traffic from Kali Linux including:

- ICMP
- Nmap SYN scans
- HTTP requests
- SMB traffic
- Various TCP protocol connections

Rather than assuming the platform was working correctly, I independently validated each stage of the monitoring pipeline:

- tcpdump confirmed mirrored traffic reached the sensor.
- Arkime reconstructed captured sessions.
- Suricata generated IDS alerts.
- SiLK produced searchable flow records.
- Wireshark decoded the captured traffic.

---

**Figure 7 – tcpdump Validating Mirrored Traffic**

![tcpdump](/assets/img/network-security-monitoring-lab/tcpdump-validation.png)

---

**Figure 8 – Wireshark Verification**

![Wireshark](/assets/img/network-security-monitoring-lab/wireshark-http-session.png)

---

# Challenges Encountered

One of the most valuable parts of this project was the troubleshooting process.

Some of the challenges included:

- Validating the open vSwitch mirror configuration
- Verifying packet capture with tcpdump before introducing additional tools
- Diagnosing incomplete packet captures
- Rebuilding portions of the Arkime configuration
- Resolving Suricata interface naming issues
- Compiling SiLK and YAF from source on Ubuntu 26.04
- Configuring SiLK site configuration files
- Understanding how YAF exports IPFIX and how SiLK converts those records into flow data
- Validating that every stage of the monitoring pipeline was functioning correctly

---

# Lessons Learned

One of the major lessons from GCIA is that no single tool provides complete visibility into network activity.

Each component provides a different perspective on the same network activity.

<table class="table">
  <thead>
    <tr>
      <th>Tool</th>
      <th>Primary Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Arkime</td><td>Full packet capture</td></tr>
    <tr><td>Suricata</td><td>Threat detection and IDS alerts</td></tr>
    <tr><td>Zeek</td><td>Protocol metadata</td></tr>
    <tr><td>SiLK</td><td>Network flow analytics</td></tr>
  </tbody>
</table>

Together, these tools provide multiple perspectives of the same network activity, enabling more effective investigations than any individual tool could provide alone.

---

# Example Investigation Workflow

A typical investigation in my lab follows this workflow:

```text
Nmap Scan

        │
        ▼

Arkime
(View full session)

        │
        ▼

Suricata
(Check IDS alerts)

        │
        ▼

Zeek
(Analyze protocol metadata)

        │
        ▼

SiLK
(Search large flow datasets)

        │
        ▼

Wireshark
(Deep packet analysis)
```


Each layer contributes context, allowing me to move from broad threat hunting to packet-level analysis.

---

# Future Work

My lab will serve as the foundation for future projects involving:

- Malware traffic analysis
- Command-and-control detection
- DNS tunneling detection
- Lateral movement analysis
- Credential theft investigations
- MITRE ATT&CK mapping
- Threat hunting exercises
- Zeek scripting
- Custom Suricata rule development

Each of these topics will become its own portfolio article as the lab continues to evolve.

---

# Conclusion

Building this platform reinforced that effective network investigations rely on multiple complementary sources of telemetry.

Packet captures, IDS alerts, protocol metadata, and flow records each reveal different aspects of the same network activity. Building, validating, and troubleshooting each stage of that pipeline gave me a much deeper understanding of enterprise network monitoring than simply deploying an all-in-one solution.

More importantly, the process reminded me that successful defenders don't just use security tools—they understand how the underlying telemetry is collected, validated, and correlated during an investigation.

This project has become the foundation for future Blue Team research, and I look forward to expanding it through additional investigations and detection engineering projects.
