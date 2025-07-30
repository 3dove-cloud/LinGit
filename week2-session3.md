# Week 2 Session 3: System Services & Networking - Enhanced Edition
*Workshop Operations & External Connections Mastery*

## 🎯 Session Overview (2 Hours)
**Story Theme**: "Your workshop has become a connected hub of activity. Multiple services run simultaneously, external connections flow in and out, and you need to orchestrate everything like a master conductor. Today you become the operations manager of a sophisticated, networked workshop."

**Learning Objectives:**
- Master systemd service management and dependencies
- Understand network architecture and protocols
- Configure advanced networking and security
- Implement remote access and file transfer
- Practice network troubleshooting and monitoring
- Set up automated service monitoring

---

## ⚙️ Part 1: Understanding Workshop Operations (25 minutes)

### The Service Ecosystem

**Story**: System services are like specialized workers in your workshop, each with specific jobs that must coordinate perfectly.

#### Visual Service Architecture
```
Service Dependency Tree:
       ──────────────
      │   Network    │
      │   Manager    │
       ──────────────
            │
    ┌───────┴───────┐
    │               │
┌────────┐    ┌──────────┐
│  SSH   │    │   Web    │
│Service │    │ Server   │
└────────┘    └──────────┘
    │               │
┌────────┐    ┌──────────┐
│ Users  │    │Database  │
│System  │    │Service   │
└────────┘    └──────────┘
```

#### Advanced Service Discovery
```bash
# Comprehensive service analysis
systemctl list-units --type=service --all     # All services (active/inactive)
systemctl list-units --type=service --state=running  # Only running services
systemctl list-unit-files --type=service      # All available services

# Service dependency analysis
systemctl list-dependencies ssh.service       # What SSH depends on
systemctl list-dependencies --reverse ssh.service  # What depends on SSH
systemctl show ssh.service                    # Complete service configuration
```

#### Environment Variables in Service Context
```bash
# Service environment management
sudo systemd-run --setenv=WORKSHOP_MODE=production sleep 30
systemctl show-environment                     # System environment variables
sudo systemctl set-environment WORKSHOP_ENV=production
sudo systemctl unset-environment WORKSHOP_ENV

# Service-specific environment files
sudo mkdir -p /etc/systemd/system/workshop.service.d/
sudo tee /etc/systemd/system/workshop.service.d/environment.conf << 'EOF'
[Service]
Environment="WORKSHOP_HOME=/opt/workshop"
Environment="WORKSHOP_LOG_LEVEL=info"
EnvironmentFile=/etc/workshop/config
EOF
```

### Advanced Service Management

#### Service States and Transitions
```bash
# Understanding service states
systemctl is-active ssh      # active, inactive, failed
systemctl is-enabled ssh     # enabled, disabled, masked
systemctl is-failed ssh      # Check if service failed

# Service state transitions
sudo systemctl start ssh     # inactive → active
sudo systemctl stop ssh      # active → inactive  
sudo systemctl restart ssh   # active → inactive → active
sudo systemctl reload ssh    # active (reload config without restart)
sudo systemctl mask ssh      # Prevent service from starting
sudo systemctl unmask ssh    # Remove prevention
```

#### Service Logs and Monitoring
```bash
# Advanced log analysis
journalctl -u ssh.service --since "1 hour ago"     # Recent logs
journalctl -u ssh.service --follow                 # Real-time logs
journalctl -u ssh.service -p err                   # Error-level logs only
journalctl -u ssh.service --output=json-pretty     # Structured output

# Service resource usage
systemctl status ssh.service                       # Current status
systemd-cgtop                                      # Live resource usage
systemctl show ssh.service --property=CPUUsageNSec # CPU usage
```

---

## 🌐 Part 2: Network Architecture & Configuration (30 minutes)

### Understanding Network Fundamentals

**Story**: Your workshop's network is like a sophisticated communication system connecting all areas and external partners.

#### Visual Network Stack
```
Network Communication Stack:
┌─────────────────────────────┐
│     Applications            │ ← SSH, HTTP, FTP
│  (Workshop Services)        │
├─────────────────────────────┤
│     Transport Layer         │ ← TCP, UDP (Ports)
│   (Delivery Method)         │
├─────────────────────────────┤
│     Network Layer           │ ← IP Addresses
│   (Addressing System)       │
├─────────────────────────────┤
│     Physical Layer          │ ← Ethernet, WiFi
│  (Physical Connection)      │
└─────────────────────────────┘
```

#### Advanced Network Information
```bash
# Modern network tools
ip addr show                          # Network interfaces
ip route show                         # Routing table
ip neighbor show                      # ARP table (nearby devices)
ss -tuln                             # Active network connections
ss -tulpn                            # With process information

# Network interface management
sudo ip link set eth0 up            # Enable interface
sudo ip link set eth0 down          # Disable interface
sudo ip addr add 192.168.1.100/24 dev eth0  # Add IP address
sudo ip route add default via 192.168.1.1   # Add default route
```

#### Network Diagnostics and Troubleshooting
```bash
# Comprehensive network testing
ping -c 4 google.com                 # Basic connectivity
ping -c 4 -I eth0 google.com        # Ping from specific interface
traceroute google.com                # Path to destination
mtr google.com                       # Continuous traceroute
nslookup google.com                  # DNS lookup
dig google.com                       # Advanced DNS query
dig @8.8.8.8 google.com             # Query specific DNS server

# Network performance testing
iperf3 -s                           # Start server (on one machine)
iperf3 -c server_ip                 # Test to server (on another)
```

### Advanced Firewall Configuration

#### Visual Firewall Architecture
```
Firewall Rules Processing:
Input Traffic → Rules Check → Decision
     │              │           │
     ▼              ▼           ▼
┌─────────┐  ┌─────────────┐  ┌─────────┐
│External │  │   UFW/      │  │ Accept/ │
│Request  │  │ iptables    │  │ Reject/ │
│         │  │   Rules     │  │  Drop   │
└─────────┘  └─────────────┘  └─────────┘
```

#### Advanced UFW Configuration
```bash
# Detailed firewall management
sudo ufw --force reset              # Reset all rules
sudo ufw default deny incoming      # Block all incoming by default
sudo ufw default allow outgoing     # Allow all outgoing by default

# Service-specific rules
sudo ufw allow ssh                  # Allow SSH (port 22)
sudo ufw allow 'Apache Full'        # Allow Apache (ports 80, 443)
sudo ufw allow from 192.168.1.0/24  # Allow from specific network

# Advanced rules
sudo ufw allow from 192.168.1.100 to any port 3306    # Database access
sudo ufw allow out 53               # Allow DNS queries
sudo ufw deny from 10.0.0.0/8       # Block private network

# Rule management
sudo ufw status numbered            # List rules with numbers
sudo ufw delete 3                   # Delete rule number 3
sudo ufw insert 1 allow from 192.168.1.1  # Insert rule at position
```

#### Low-level Firewall (iptables)
```bash
# View current iptables rules
sudo iptables -L -n -v              # List all rules
sudo iptables -t nat -L -n -v       # NAT table rules

# Basic iptables rules (advanced users)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # Allow SSH
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables-save > /tmp/iptables.rules              # Save rules
```

---

## 🔐 Part 3: Remote Access & File Transfer Mastery (30 minutes)

### SSH Advanced Configuration

#### Professional SSH Setup
```bash
# Enhanced SSH server configuration
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo tee /etc/ssh/sshd_config.d/security.conf << 'EOF'
# Security hardening
Port 2222
PermitRootLogin no
MaxAuthTries 3
MaxSessions 5
PasswordAuthentication yes
PubkeyAuthentication yes
X11Forwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers alice bob
DenyUsers baduser
EOF

# Test configuration and restart
sudo sshd -t                        # Test configuration
sudo systemctl restart ssh
```

#### SSH Key Management
```bash
# Generate different types of SSH keys
ssh-keygen -t rsa -b 4096 -f ~/.ssh/workshop_rsa     # RSA key
ssh-keygen -t ed25519 -f ~/.ssh/workshop_ed25519     # Ed25519 key (modern)

# Key deployment and management
ssh-copy-id -i ~/.ssh/workshop_rsa.pub user@server
ssh-add ~/.ssh/workshop_rsa          # Add key to agent
ssh-add -l                          # List loaded keys

# SSH configuration file
tee ~/.ssh/config << 'EOF'
Host workshop-server
    HostName 192.168.1.100
    Port 2222
    User alice
    IdentityFile ~/.ssh/workshop_rsa
    ServerAliveInterval 60

Host *.internal
    User admin
    IdentityFile ~/.ssh/internal_key
    ProxyJump gateway-server
EOF
```

#### Advanced SSH Features
```bash
# SSH tunneling (port forwarding)
ssh -L 8080:localhost:80 user@server         # Local port forwarding
ssh -R 9090:localhost:22 user@server         # Remote port forwarding
ssh -D 1080 user@server                      # SOCKS proxy

# SSH multiplexing (connection sharing)
mkdir -p ~/.ssh/controlmasters
tee -a ~/.ssh/config << 'EOF'
Host *
    ControlMaster auto
    ControlPath ~/.ssh/controlmasters/%r@%h:%p
    ControlPersist 10m
EOF

# X11 forwarding for GUI applications
ssh -X user@server                           # Enable X11 forwarding
ssh -X user@server "firefox"                 # Run GUI app remotely
```

### Advanced File Transfer Methods

#### SCP with Advanced Options
```bash
# SCP with various options
scp -r -C -p project/ user@server:/backup/   # Recursive, compressed, preserve attrs
scp -o ProxyJump=gateway user@server:file .  # Transfer through jump host
scp -3 server1:file server2:/destination/    # Third-party copy
```

#### RSYNC - Professional File Synchronization
```bash
# Rsync advanced usage
rsync -avz --progress source/ user@server:/dest/     # Archive, verbose, compressed
rsync -avz --delete source/ dest/                    # Delete extra files
rsync -avz --exclude='*.tmp' source/ dest/           # Exclude patterns
rsync -avz --dry-run source/ dest/                   # Test run

# Rsync with SSH options
rsync -avz -e "ssh -p 2222" source/ user@server:/dest/
rsync -avz --rsync-path="sudo rsync" source/ user@server:/root/dest/
```

#### SFTP Interactive File Management
```bash
# SFTP session commands
sftp user@server
# Inside SFTP:
# pwd, lpwd          # Show remote/local directories
# ls, lls            # List remote/local files
# cd, lcd            # Change remote/local directories
# get file           # Download file
# put file           # Upload file
# mget *.txt         # Download multiple files
# mput *.log         # Upload multiple files
```

---

## 📊 Part 4: Network Monitoring & Performance (25 minutes)

### Real-time Network Monitoring

#### Network Traffic Analysis
```bash
# Install network monitoring tools
sudo apt install nethogs iftop nload vnstat

# Real-time network usage by process
sudo nethogs eth0                    # Network usage per process
sudo iftop -i eth0                   # Network bandwidth usage
nload eth0                          # Network load with graphs

# Long-term statistics
vnstat -i eth0                      # Network statistics
vnstat -i eth0 -d                   # Daily statistics
```

#### Advanced Network Diagnostics
```bash
# Create network diagnostics script
cat > ~/network_diagnostics.sh << 'EOF'
#!/bin/bash
# Comprehensive network diagnostics

echo "🌐 Network Diagnostics Report - $(date)"
echo "=========================================="

# Interface information
echo "📡 Network Interfaces:"
ip addr show | grep -E '^[0-9]+:|inet ' | sed 's/^/  /'
echo

# Routing information
echo "🗺️  Routing Table:"
ip route show | sed 's/^/  /'
echo

# DNS configuration
echo "🔍 DNS Configuration:"
cat /etc/resolv.conf | grep nameserver | sed 's/^/  /'
echo

# Connectivity tests
echo "📶 Connectivity Tests:"
for host in 8.8.8.8 google.com; do
    if ping -c 1 -W 2 $host >/dev/null 2>&1; then
        echo "  ✅ $host: Reachable"
    else
        echo "  ❌ $host: Unreachable"
    fi
done
echo

# Port scanning
echo "🔌 Open Ports:"
ss -tuln | grep LISTEN | sed 's/^/  /'
echo

# Network statistics
echo "📈 Network Statistics:"
cat /proc/net/dev | grep -E '(eth|wlan|enp)' | sed 's/^/  /'
echo

echo "✅ Diagnostics complete!"
EOF

chmod +x ~/network_diagnostics.sh
```

### Service Dependencies and Orchestration

#### Understanding Service Dependencies
```bash
# Analyze service dependency chains
systemctl list-dependencies --all network-online.target
systemctl list-dependencies --reverse multi-user.target

# Create custom service with dependencies
sudo tee /etc/systemd/system/workshop-monitor.service << 'EOF'
[Unit]
Description=Workshop Monitoring Service
After=network-online.target
Wants=network-online.target
Requires=systemd-resolved.service

[Service]
Type=simple
ExecStart=/usr/local/bin/workshop-monitor
Restart=always
RestartSec=10
User=workshop
Group=workshop
Environment=WORKSHOP_CONFIG=/etc/workshop/monitor.conf

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
```

#### Service Monitoring and Alerting
```bash
# Create service monitoring script
cat > ~/service_monitor.sh << 'EOF'
#!/bin/bash
# Service monitoring and alerting system

SERVICES=("ssh" "systemd-resolved" "NetworkManager")
LOG_FILE="/var/log/service_monitor.log"

echo "🔍 Service Monitor - $(date)" | sudo tee -a $LOG_FILE

for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "✅ $service: Running" | sudo tee -a $LOG_FILE
    else
        echo "🚨 $service: FAILED" | sudo tee -a $LOG_FILE
        # Attempt to restart failed service
        echo "🔄 Attempting to restart $service" | sudo tee -a $LOG_FILE
        sudo systemctl restart $service
        
        # Check if restart was successful
        sleep 2
        if systemctl is-active --quiet $service; then
            echo "✅ $service: Restart successful" | sudo tee -a $LOG_FILE
        else
            echo "❌ $service: Restart failed" | sudo tee -a $LOG_FILE
        fi
    fi
done

# Check system load and network
echo "📊 System Load: $(uptime | cut -d',' -f3-)" | sudo tee -a $LOG_FILE
echo "🌐 Network Status: $(ping -c 1 8.8.8.8 >/dev/null 2>&1 && echo "Online" || echo "Offline")" | sudo tee -a $LOG_FILE
EOF

chmod +x ~/service_monitor.sh
```

---

## 🧪 Part 5: Comprehensive Network Workshop Lab (35 minutes)

### Mission: Build a Secure Network Operations Center

#### Phase 1: Service Infrastructure Setup
```bash
#!/bin/bash
# Network Operations Center Setup

echo "🏗️  Setting up Network Operations Center..."

# Install required services and tools
sudo apt update
sudo apt install -y openssh-server apache2 ufw fail2ban \
                    nethogs iftop nload vnstat \
                    curl wget telnet nmap

# Configure SSH security
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.original
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config

# Configure Apache
sudo systemctl enable apache2
echo "<h1>Workshop Operations Center</h1>" | sudo tee /var/www/html/index.html

# Configure firewall
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable

echo "✅ Infrastructure setup complete!"
```

#### Phase 2: Advanced Network Configuration
```bash
# Create advanced network configuration
cat > ~/network_config.sh << 'EOF'
#!/bin/bash
# Advanced network configuration script

echo "⚙️  Configuring advanced network settings..."

# Configure network interfaces (example for static IP)
sudo tee /etc/netplan/99-workshop-config.yaml << 'NETPLAN'
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
        search:
          - workshop.local
NETPLAN

# Apply network configuration (commented for safety)
# sudo netplan apply

# Configure hostname and hosts
echo "workshop-center" | sudo tee /etc/hostname
sudo tee -a /etc/hosts << 'HOSTS'
192.168.1.100  workshop-center.local workshop-center
192.168.1.101  workshop-node1.local workshop-node1
192.168.1.102  workshop-node2.local workshop-node2
HOSTS

# Configure DNS resolution
sudo tee /etc/systemd/resolved.conf << 'RESOLVED'
[Resolve]
DNS=8.8.8.8 8.8.4.4
FallbackDNS=1.1.1.1 1.0.0.1
Domains=workshop.local
LLMNR=yes
MulticastDNS=yes
RESOLVED

echo "✅ Network configuration complete!"
EOF

chmod +x ~/network_config.sh
```

#### Phase 3: Monitoring and Automation Setup
```bash
# Create comprehensive monitoring system
cat > ~/setup_monitoring.sh << 'EOF'
#!/bin/bash
# Network monitoring setup

echo "📊 Setting up monitoring systems..."

# Create monitoring directories
sudo mkdir -p /var/log/workshop /etc/workshop
sudo chown $USER:$USER /var/log/workshop

# Create network health check script
tee ~/network_health.sh << 'HEALTH'
#!/bin/bash
# Network health monitoring

LOG_FILE="/var/log/workshop/network_health.log"
STATUS_FILE="/tmp/network_status"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check network interfaces
check_interfaces() {
    for interface in $(ip link show | grep -E '^[0-9]+:' | cut -d: -f2 | tr -d ' '); do
        if ip link show $interface | grep -q "state UP"; then
            log_message "✅ Interface $interface: UP"
        else
            log_message "❌ Interface $interface: DOWN"
        fi
    done
}

# Check connectivity
check_connectivity() {
    targets=("8.8.8.8" "google.com" "192.168.1.1")
    for target in "${targets[@]}"; do
        if ping -c 1 -W 2 $target >/dev/null 2>&1; then
            log_message "✅ Connectivity to $target: OK"
        else
            log_message "❌ Connectivity to $target: FAILED"
        fi
    done
}

# Check services
check_services() {
    services=("ssh" "apache2" "systemd-resolved" "NetworkManager")
    for service in "${services[@]}"; do
        if systemctl is-active --quiet $service; then
            log_message "✅ Service $service: Running"
        else
            log_message "❌ Service $service: Not running"
        fi
    done
}

# Main execution
log_message "=== Network Health Check Started ==="
check_interfaces
check_connectivity
check_services
log_message "=== Network Health Check Completed ==="

# Create status summary
{
    echo "Last Check: $(date)"
    echo "Network Status: $(ping -c 1 8.8.8.8 >/dev/null 2>&1 && echo "Online" || echo "Offline")"
    echo "Active Interfaces: $(ip link show | grep -c "state UP")"
    echo "Running Services: $(systemctl list-units --type=service --state=running | grep -c ".service")"
} > $STATUS_FILE
HEALTH

chmod +x ~/network_health.sh

# Create service monitoring dashboard
tee ~/monitoring_dashboard.sh << 'DASHBOARD'
#!/bin/bash
# Real-time monitoring dashboard

clear
echo "🖥️  Workshop Network Operations Center"
echo "======================================"

while true; do
    # Move cursor to top
    tput cup 2 0
    
    # System information
    echo "📊 System Status - $(date)"
    echo "----------------------------------------"
    echo "Uptime: $(uptime -p)"
    echo "Load: $(uptime | awk -F'load average:' '{print $2}')"
    echo "Memory: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
    echo "Disk: $(df -h / | awk 'NR==2{printf "%s (%s used)", $5, $3}')"
    echo
    
    # Network status
    echo "🌐 Network Status"
    echo "----------------------------------------"
    if [ -f /tmp/network_status ]; then
        cat /tmp/network_status
    fi
    echo
    
    # Active connections
    echo "🔗 Active Connections (Top 5)"
    echo "----------------------------------------"
    ss -tuln | head -6
    echo
    
    # Service status
    echo "⚙️  Critical Services"
    echo "----------------------------------------"
    for service in ssh apache2 ufw; do
        status=$(systemctl is-active $service 2>/dev/null)
        if [ "$status" = "active" ]; then
            echo "✅ $service: $status"
        else
            echo "❌ $service: $status"
        fi
    done
    
    echo
    echo "Press Ctrl+C to exit | Refreshing every 5 seconds..."
    sleep 5
done
DASHBOARD

chmod +x ~/monitoring_dashboard.sh

echo "✅ Monitoring setup complete!"
echo "Run ~/network_health.sh for health checks"
echo "Run ~/monitoring_dashboard.sh for real-time monitoring"
EOF

chmod +x ~/setup_monitoring.sh
```

#### Phase 4: Security Hardening and Testing
```bash
# Create security hardening script
cat > ~/security_hardening.sh << 'EOF'
#!/bin/bash
# Network security hardening

echo "🔒 Implementing security hardening..."

# Install and configure fail2ban
sudo apt install -y fail2ban

# Configure fail2ban for SSH
sudo tee /etc/fail2ban/jail.local << 'FAIL2BAN'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
FAIL2BAN

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban

# Configure UFW logging
sudo ufw logging on

# Set up intrusion detection
sudo tee /etc/systemd/system/intrusion-monitor.service << 'INTRUSION'
[Unit]
Description=Intrusion Detection Monitor
After=network.target

[Service]
Type=simple
ExecStart=/home/$USER/intrusion_monitor.sh
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
INTRUSION

# Create intrusion monitoring script
tee ~/intrusion_monitor.sh << 'MONITOR'
#!/bin/bash
# Basic intrusion detection

LOGFILE="/var/log/workshop/intrusion.log"

while true; do
    # Monitor failed SSH attempts
    if tail -n 10 /var/log/auth.log | grep -q "Failed password"; then
        echo "$(date): SSH attack detected" >> $LOGFILE
    fi
    
    # Monitor unusual network activity
    CONNECTIONS=$(ss -tuln | wc -l)
    if [ $CONNECTIONS -gt 50 ]; then
        echo "$(date): High connection count: $CONNECTIONS" >> $LOGFILE
    fi
    
    sleep 30
done
MONITOR

chmod +x ~/intrusion_monitor.sh

echo "✅ Security hardening complete!"
EOF

chmod +x ~/security_hardening.sh
```

#### Phase 5: Network Testing and Validation
```bash
# Create comprehensive network testing suite
cat > ~/network_testing.sh << 'EOF'
#!/bin/bash
# Comprehensive network testing suite

echo "🧪 Network Testing Suite - $(date)"
echo "=================================="

# Test 1: Local network connectivity
echo "Test 1: Local Network Connectivity"
echo "-----------------------------------"
ping -c 3 127.0.0.1 && echo "✅ Localhost: OK" || echo "❌ Localhost: Failed"
ping -c 3 $(ip route | grep default | awk '{print $3}') && echo "✅ Gateway: OK" || echo "❌ Gateway: Failed"

# Test 2: DNS resolution
echo
echo "Test 2: DNS Resolution"
echo "----------------------"
nslookup google.com >/dev/null 2>&1 && echo "✅ DNS: OK" || echo "❌ DNS: Failed"
dig google.com >/dev/null 2>&1 && echo "✅ DNS (dig): OK" || echo "❌ DNS (dig): Failed"

# Test 3: Service accessibility
echo
echo "Test 3: Service Accessibility"
echo "------------------------------"
curl -s -o /dev/null http://localhost && echo "✅ Web server: OK" || echo "❌ Web server: Failed"
nc -z localhost 2222 && echo "✅ SSH: OK" || echo "❌ SSH: Failed"

# Test 4: Firewall status
echo
echo "Test 4: Security Status"
echo "-----------------------"
sudo ufw status | grep -q "Status: active" && echo "✅ Firewall: Active" || echo "❌ Firewall: Inactive"
systemctl is-active --quiet fail2ban && echo "✅ Fail2ban: Running" || echo "❌ Fail2ban: Not running"

# Test 5: Performance metrics
echo
echo "Test 5: Performance Metrics"
echo "----------------------------"
echo "Network interfaces:"
ip -br addr show | grep UP
echo
echo "Active connections: $(ss -tuln | wc -l)"
echo "System load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Available memory: $(free -h | awk 'NR==2{print $7}')"

# Test 6: Security scan (basic)
echo
echo "Test 6: Security Scan"
echo "---------------------"
if command -v nmap >/dev/null; then
    echo "Open ports on localhost:"
    nmap -p 1-1000 localhost 2>/dev/null | grep open
else
    echo "nmap not installed, using ss:"
    ss -tuln | grep LISTEN | head -5
fi

echo
echo "🎉 Network testing complete!"
EOF

chmod +x ~/network_testing.sh
```

---

## 🔧 Part 6: Advanced Troubleshooting & Recovery (15 minutes)

### Network Troubleshooting Methodology

#### Systematic Network Problem Resolution
```bash
# Create network troubleshooting toolkit
cat > ~/network_troubleshoot.sh << 'EOF'
#!/bin/bash
# Network troubleshooting toolkit

echo "🔧 Network Troubleshooting Toolkit"
echo "==================================="

# Step 1: Check physical/link layer
echo "Step 1: Physical/Link Layer Check"
echo "---------------------------------"
ip link show | grep -E "(UP|DOWN)" | while read line; do
    echo "  $line"
done

# Step 2: Check IP configuration
echo
echo "Step 2: IP Configuration Check"
echo "-------------------------------"
ip addr show | grep -E "(inet|UP)" | while read line; do
    echo "  $line"
done

# Step 3: Check routing
echo
echo "Step 3: Routing Table Check"
echo "---------------------------"
ip route show | while read line; do
    echo "  $line"
done

# Step 4: Check DNS
echo
echo "Step 4: DNS Configuration Check"
echo "--------------------------------"
cat /etc/resolv.conf | grep nameserver | while read line; do
    echo "  $line"
done

# Step 5: Test connectivity layers
echo
echo "Step 5: Connectivity Layer Tests"
echo "---------------------------------"
test_targets=("127.0.0.1" "$(ip route | grep default | awk '{print $3}')" "8.8.8.8" "google.com")
for target in "${test_targets[@]}"; do
    if [ -n "$target" ]; then
        ping -c 1 -W 2 $target >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "  ✅ $target: Reachable"
        else
            echo "  ❌ $target: Unreachable"
        fi
    fi
done

# Step 6: Service status
echo
echo "Step 6: Network Services Status"
echo "--------------------------------"
critical_services=("NetworkManager" "systemd-resolved" "ssh")
for service in "${critical_services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "  ✅ $service: Running"
    else
        echo "  ❌ $service: Not running"
    fi
done

# Step 7: Port accessibility
echo
echo "Step 7: Port Accessibility Check"
echo "---------------------------------"
critical_ports=("22" "2222" "80" "443")
for port in "${critical_ports[@]}"; do
    if ss -tuln | grep -q ":$port "; then
        echo "  ✅ Port $port: Listening"
    else
        echo "  ❌ Port $port: Not listening"
    fi
done

echo
echo "🔍 Use specific commands for detailed investigation:"
echo "  - ip addr show         (interface details)"
echo "  - journalctl -u NetworkManager  (service logs)"
echo "  - sudo ufw status     (firewall rules)"
echo "  - ss -tuln            (listening ports)"
EOF

chmod +x ~/network_troubleshoot.sh
```

#### Emergency Network Recovery
```bash
# Create network recovery procedures
cat > ~/network_recovery.sh << 'EOF'
#!/bin/bash
# Network emergency recovery procedures

echo "🚨 Network Emergency Recovery"
echo "============================="

# Function to restart network services
restart_network_services() {
    echo "🔄 Restarting network services..."
    sudo systemctl restart NetworkManager
    sudo systemctl restart systemd-resolved
    sleep 5
    echo "✅ Network services restarted"
}

# Function to reset firewall
reset_firewall() {
    echo "🔄 Resetting firewall to safe defaults..."
    sudo ufw --force reset
    sudo ufw default allow outgoing
    sudo ufw default deny incoming
    sudo ufw allow ssh
    sudo ufw --force enable
    echo "✅ Firewall reset complete"
}

# Function to flush DNS cache
flush_dns() {
    echo "🔄 Flushing DNS cache..."
    sudo systemd-resolve --flush-caches
    sudo systemctl restart systemd-resolved
    echo "✅ DNS cache flushed"
}

# Function to reset network interfaces
reset_interfaces() {
    echo "🔄 Resetting network interfaces..."
    for interface in $(ip link show | grep -E '^[0-9]+:' | cut -d: -f2 | tr -d ' ' | grep -v lo); do
        sudo ip link set $interface down
        sleep 1
        sudo ip link set $interface up
        echo "  Cycled $interface"
    done
    echo "✅ Interfaces reset"
}

# Main recovery menu
echo "Select recovery action:"
echo "1) Restart network services"
echo "2) Reset firewall to defaults"
echo "3) Flush DNS cache"
echo "4) Reset network interfaces"
echo "5) Full network reset (all above)"
echo "6) Show current network status"
read -p "Enter choice (1-6): " choice

case $choice in
    1) restart_network_services ;;
    2) reset_firewall ;;
    3) flush_dns ;;
    4) reset_interfaces ;;
    5) 
        restart_network_services
        reset_firewall
        flush_dns
        reset_interfaces
        ;;
    6)
        echo "Current network status:"
        ip addr show
        ip route show
        systemctl status NetworkManager --no-pager
        ;;
    *) echo "Invalid choice" ;;
esac

echo "🏁 Recovery procedure complete"
EOF

chmod +x ~/network_recovery.sh
```

---

## 📚 Session Summary & Advanced Concepts

### Essential Commands Mastered
```bash
# Service Management
systemctl status/start/stop/restart service    # Service control
systemctl enable/disable service               # Boot behavior
journalctl -u service                          # Service logs
systemctl list-dependencies                    # Service relationships

# Network Configuration
ip addr show                                   # Interface information
ip route show                                  # Routing table
ss -tuln                                       # Network connections
ping/traceroute/mtr                           # Connectivity testing

# Firewall Management
sudo ufw allow/deny                           # Basic rules
sudo ufw status numbered                       # Rule management
sudo iptables -L                              # Advanced firewall

# Remote Access
ssh -p port user@host                         # Secure connection
scp/rsync                                     # File transfer
ssh-keygen/ssh-copy-id                        # Key management
```

### Advanced Concepts Learned
- **Service dependency management** and systemd unit files
- **Network stack understanding** from physical to application layer
- **Advanced SSH configuration** with tunneling and multiplexing
- **Firewall architecture** and multi-layer security
- **Network monitoring** and performance analysis
- **Automated service monitoring** and recovery procedures
- **Troubleshooting methodology** for systematic problem resolution

### Professional Best Practices
1. **Layered security approach** - multiple defense mechanisms
2. **Systematic troubleshooting** - work from bottom to top of network stack
3. **Monitoring and alerting** - proactive problem detection
4. **Documentation and logging** - maintain operational records
5. **Change management** - test configurations before production
6. **Backup configurations** - always have rollback procedures
7. **Regular security audits** - continuous security assessment

---

## 🎯 Session Wrap-up & Next Session Preview

**What You've Mastered:**
- Complete systemd service management with dependencies
- Advanced network configuration and troubleshooting
- Professional SSH setup with security hardening
- Automated monitoring and alerting systems
- Emergency recovery procedures

**Next Session**: System Maintenance & Security - "Workshop Guardian & Maintenance Chief"
- Advanced system monitoring and log analysis
- Automated backup and recovery strategies
- Security hardening and vulnerability management
- Performance optimization and resource management

**Homework Challenge**:
1. Set up a complete network operations center with monitoring
2. Configure secure remote access for a team
3. Create automated service monitoring and recovery scripts
4. Document your network troubleshooting procedures

---

## 🆘 Quick Reference Emergency Card

### Network Emergency Commands
```bash
# Immediate connectivity check
ping -c 1 8.8.8.8                             # Test internet
ip addr show                                   # Check interfaces
systemctl status NetworkManager                # Check network service

# Service emergency restart
sudo systemctl restart NetworkManager          # Restart networking
sudo systemctl restart ssh                     # Restart SSH
sudo ufw --force enable                        # Enable firewall

# Quick diagnostics
ss -tuln | grep :22                           # Check SSH port
journalctl -u ssh --since "10 minutes ago"    # Recent SSH logs
~/network_troubleshoot.sh                     # Run diagnostics

# Recovery procedures
~/network_recovery.sh                         # Emergency recovery
sudo /etc/init.d/networking restart           # Last resort restart
```

### Security Emergency Checklist
- ✅ Firewall is active and configured
- ✅ SSH is using non-default port
- ✅ Fail2ban is running and configured
- ✅ Services are running with minimal permissions
- ✅ Logs are being monitored for intrusions
- ✅ Network connections are documented
- ✅ Recovery procedures are tested

*Remember: Your network is the nervous system of your digital workshop - keep it healthy, secure, and well-monitored for optimal operations!*
