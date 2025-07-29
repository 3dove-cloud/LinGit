# Week 1 Session 3: System Monitoring & Process Management
*Becoming the Digital Workshop Supervisor*

---

## Session Overview (2 Hours)
### **Story Theme: "The Workshop Supervisor's Dashboard"**

**Learning Objectives:**
- Master system monitoring and resource analysis
- Understand process lifecycle and job control
- Learn background process management
- Practice systematic troubleshooting workflows

---

## **Opening Narrative (10 minutes)**
*"Congratulations! You've been promoted to Workshop Supervisor. Your eccentric inventor mentor has installed a sophisticated monitoring system in the workshop, but it's your job to learn how to read the dashboard, manage the various automated processes, and ensure everything runs smoothly. Today, you'll learn to see the invisible activities happening in your digital workshop and control them like a master craftsperson."*

---

## **Part 1: Understanding Your Workshop Dashboard (35 minutes)**

### **A. System Identity & Status (15 minutes)**

#### **The Workshop Information Panel**
```
┌─────────────────────── WORKSHOP STATUS PANEL ───────────────────────┐
│ Workshop Name: [hostname]     Supervisor: [whoami]                   │
│ Running Since: [uptime]       Current Time: [date]                   │
│ Security Badge: [id]          Location: [pwd]                        │
└───────────────────────────────────────────────────────────────────────┘
```

**Essential Identity Commands:**
```bash
# Complete workshop identification
whoami                          # Your supervisor identity
hostname                        # Workshop designation
id                             # Your security credentials and permissions
pwd                            # Current workshop section
date                           # Workshop timestamp
uptime                         # How long workshop has been operational
```

**Practice Challenge:**
```bash
# Create your supervisor status check
echo "=== SUPERVISOR STATUS CHECK ==="
echo "Supervisor: $(whoami)"
echo "Workshop: $(hostname)"
echo "Current Location: $(pwd)"
echo "Credentials: $(id -u -n) ($(id -g -n) department)"
echo "Workshop Operational: $(uptime -p)"
echo "Current Time: $(date '+%Y-%m-%d %H:%M:%S')"
```

### **B. Active Workshop Personnel (10 minutes)**

#### **Who's Working in Your Workshop?**
```bash
# Simple personnel check
who                            # Basic attendance
w                              # Detailed activity report
users                          # Quick name list
last | head -5                 # Recent workshop entries
```

#### **Personnel Activity Dashboard**
```
WORKSHOP PERSONNEL STATUS
┌─────────────────────────────────────────────────────┐
│ USER     LOCATION    LOGIN_TIME    ACTIVITY         │
│ alice    console     09:30         file_editing     │
│ bob      remote      10:15         system_admin     │
│ you      terminal    11:00         learning_linux   │
└─────────────────────────────────────────────────────┘
```

### **C. Workshop Resource Monitoring (10 minutes)**

#### **The Resource Gauge Visual**
```
WORKSHOP RESOURCES
┌─ Memory Usage ─┐  ┌─ Storage Space ─┐  ┌─ Processing Power ─┐
│ ████████░░ 80% │  │ ██████░░░░ 60% │  │ ███░░░░░░░ 30%    │
│ 6.4G/8.0G Used │  │ 12G/20G Used   │  │ Low Load          │
└────────────────┘  └────────────────┘  └───────────────────┘
```

**Resource Monitoring Commands:**
```bash
# Memory status
free -h                        # Memory usage in human-readable format
cat /proc/meminfo | head -3    # Detailed memory information

# Storage analysis
df -h                          # Disk space usage
du -sh * 2>/dev/null | head -5 # Directory sizes (top 5)

# Processing power
cat /proc/loadavg              # System load average
nproc                          # Number of available processors
```

---

## **Part 2: Process Management & Job Control (45 minutes)**

### **A. Understanding Workshop Activities (20 minutes)**

#### **Process Lifecycle Visual**
```
PROCESS LIFECYCLE IN YOUR WORKSHOP
    ┌─────────────┐
    │   START     │ ← command execution
    └─────┬───────┘
          │
    ┌─────▼───────┐     ┌──────────────┐
    │   RUNNING   │────▶│ BACKGROUND   │ ← Ctrl+Z, &
    └─────┬───────┘     └──────┬───────┘
          │                    │
    ┌─────▼───────┐           │
    │   STOPPED   │◄──────────┘
    └─────┬───────┘
          │
    ┌─────▼───────┐
    │  TERMINATED │ ← kill, Ctrl+C
    └─────────────┘
```

**Process Viewing Commands:**
```bash
# Current session processes
ps                             # Your processes only
ps -f                          # Full format display

# All workshop processes
ps aux                         # All processes with details
ps aux | head -10              # First 10 processes
ps aux | grep [your_username]  # Your processes only

# Process tree visualization
pstree                         # Show process relationships
pstree -p                      # Include process IDs
```

**Understanding Process Information:**
```bash
# Example ps aux output explanation
USER  PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root    1  0.0  0.1  77616  8964 ?        Ss   10:30   0:01 /sbin/init
alice 1234  2.5  5.3 245620 85680 pts/0   Sl   14:20   0:15 firefox
bob   5678  0.0  0.1  21520  2964 pts/1    R+   14:25   0:00 ps aux
```

**What Each Column Means:**
- **PID**: Process ID (unique identifier)
- **%CPU**: CPU usage percentage
- **%MEM**: Memory usage percentage
- **STAT**: Process state (R=Running, S=Sleeping, Z=Zombie)
- **TTY**: Terminal associated with process

### **B. Job Control Mastery (25 minutes)**

#### **Background Process Management**
```bash
# Starting background processes
sleep 100 &                    # Start process in background
echo "Process started with PID: $!"

# Job control commands
jobs                           # List active jobs
jobs -l                        # List jobs with PIDs
bg %1                          # Resume job 1 in background
fg %1                          # Bring job 1 to foreground
```

#### **Interactive Job Control Practice**
```bash
# Practice scenario: Managing multiple tasks

# 1. Start a long-running task
sleep 300                      # Press Ctrl+Z to pause

# 2. Check job status
jobs                           # Should show [1]+ Stopped

# 3. Resume in background
bg %1                          # Now running in background

# 4. Start another task
sleep 200 &                    # Directly in background

# 5. Monitor all jobs
jobs -l                        # List all jobs with details

# 6. Bring specific job to foreground
fg %2                          # Bring job 2 to foreground
```

#### **Process Control Visual**
```
JOB CONTROL WORKFLOW
┌─────────────┐   Ctrl+Z   ┌─────────────┐   bg %n   ┌─────────────┐
│  Foreground │ ────────▶  │   Stopped   │ ────────▶ │ Background  │
│   Process   │            │   Process   │           │   Process   │
└─────────────┘            └─────────────┘           └─────────────┘
       ▲                           │                         │
       │                         fg %n                    Ctrl+C
       └─────────────────────────────┘                   (kill)
                                                           │
                                                          ▼
                                                 ┌─────────────┐
                                                 │ Terminated  │
                                                 │   Process   │
                                                 └─────────────┘
```

**Advanced Process Management:**
```bash
# Process termination (gentle to forceful)
kill PID                       # Gentle termination (SIGTERM)
kill -15 PID                   # Same as above (explicit SIGTERM)
kill -9 PID                    # Force kill (SIGKILL) - last resort
killall process_name           # Kill all processes by name

# Process priority management
nice -n 10 command             # Start with lower priority
renice 5 PID                   # Change priority of running process
```

---

## **Part 3: Advanced System Monitoring (35 minutes)**

### **A. Real-Time Workshop Monitoring (20 minutes)**

#### **The Live Dashboard (top command)**
```bash
# Launch real-time monitor
top                            # Interactive process monitor

# Key commands while in top:
# h - Help screen
# P - Sort by CPU usage
# M - Sort by memory usage
# k - Kill a process
# r - Renice (change priority)
# q - Quit top
```

#### **Top Display Breakdown**
```
WORKSHOP LIVE MONITOR (TOP)
┌─────────────────────────────────────────────────────────────┐
│ top - 14:30:15 up 2 days,  3:42,  2 users,  load: 0.15    │ ← System summary
├─────────────────────────────────────────────────────────────┤
│ Tasks: 245 total,   1 running, 244 sleeping,   0 stopped   │ ← Task summary  
│ %Cpu(s):  3.2 us,  1.1 sy,  0.0 ni, 95.7 id,  0.0 wa     │ ← CPU usage
│ MiB Mem :   7956.2 total,   2341.5 free,   3456.2 used    │ ← Memory usage
├─────────────────────────────────────────────────────────────┤
│   PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM  │ ← Process list
│  1234 alice     20   0  245620  85680  45320 S   5.3  5.1  │
│  5678 bob       20   0   89456  23450  15670 R   2.1  1.4  │
└─────────────────────────────────────────────────────────────┘
```

**Understanding Load Average:**
```bash
# Load average interpretation
uptime
# Output: 14:30:15 up 2 days, 3:42, 2 users, load average: 0.15, 0.10, 0.08

# What load averages mean:
# 0.15 = last 1 minute average
# 0.10 = last 5 minute average  
# 0.08 = last 15 minute average

# Load interpretation:
# < 1.0 = System underutilized
# = 1.0 = System fully utilized
# > 1.0 = System overloaded
```

### **B. Network & Service Monitoring (15 minutes)**

#### **Workshop Network Status**
```bash
# Network interface information
ip addr show                   # All network interfaces
ip route show                  # Network routing table
hostname -I                    # Workshop IP addresses

# Network connectivity testing
ping -c 4 google.com          # Test internet connectivity
ping -c 3 $(ip route | grep default | awk '{print $3}')  # Test router
```

#### **Basic Service Health Checks**
```bash
# Service status checking
systemctl is-active ssh        # Check if SSH is running
systemctl is-enabled ssh       # Check if SSH starts at boot
systemctl status ssh           # Detailed service information

# Quick service overview
systemctl list-units --type=service --state=active | head -10
```

#### **Network Troubleshooting Workflow**
```
NETWORK TROUBLESHOOTING STEPS
┌─────────────────────────────────────┐
│ 1. Check Interface Status           │ → ip addr show
├─────────────────────────────────────┤
│ 2. Test Local Connectivity         │ → ping router_ip
├─────────────────────────────────────┤
│ 3. Test DNS Resolution             │ → nslookup google.com
├─────────────────────────────────────┤
│ 4. Test Internet Connectivity      │ → ping google.com
└─────────────────────────────────────┘
```

---

## **Part 4: Systematic Troubleshooting (25 minutes)**

### **A. Error Recognition & Recovery (15 minutes)**

#### **Common Workshop Problems & Solutions**

**Problem 1: Command Not Found**
```bash
# Scenario
$ htop
bash: htop: command not found

# Troubleshooting steps:
which htop                     # Check if command exists
echo $PATH                     # Verify PATH variable
apt list --installed | grep htop  # Check if package installed
```

**Problem 2: Permission Denied**
```bash
# Scenario  
$ cat /etc/shadow
cat: /etc/shadow: Permission denied

# Troubleshooting steps:
ls -la /etc/shadow            # Check file permissions
id                            # Check your privileges
groups                        # Check your group memberships
```

**Problem 3: Process Won't Terminate**
```bash
# Scenario: Process stuck and won't respond to Ctrl+C

# Troubleshooting steps:
ps aux | grep process_name     # Find process PID
kill PID                      # Try gentle termination
kill -15 PID                  # Explicit SIGTERM
kill -9 PID                   # Force kill (last resort)
```

#### **Systematic Troubleshooting Process**
```
THE SUPERVISOR'S TROUBLESHOOTING METHOD
┌─────────────────────────────────────────┐
│ 1. OBSERVE                              │ → Read error message carefully
├─────────────────────────────────────────┤
│ 2. VERIFY STATE                         │ → whoami, pwd, ls -la
├─────────────────────────────────────────┤
│ 3. CHECK BASICS                         │ → Spelling, permissions, PATH
├─────────────────────────────────────────┤
│ 4. TEST INCREMENTALLY                   │ → Try simpler versions
├─────────────────────────────────────────┤
│ 5. CONSULT RESOURCES                    │ → man pages, --help
├─────────────────────────────────────────┤
│ 6. DOCUMENT SOLUTION                    │ → Record what worked
└─────────────────────────────────────────┘
```

### **B. Workshop Emergency Procedures (10 minutes)**

#### **Emergency Command Toolkit**
```bash
# Process control emergencies
Ctrl+C                        # Interrupt current process
Ctrl+Z                        # Suspend current process
Ctrl+D                        # End input stream
kill -9 PID                   # Force terminate process

# Terminal restoration
reset                         # Reset terminal to default state
stty sane                     # Fix terminal settings
clear                         # Clear screen

# Quick system recovery
cd ~                          # Return to safe home directory
logout                        # Log out and start fresh
```

#### **Creating Emergency Scripts**
```bash
# Create an emergency status script
cat > ~/emergency_check.sh << 'EOF'
#!/bin/bash
echo "=== EMERGENCY SYSTEM CHECK ==="
echo "Time: $(date)"
echo "User: $(whoami) at $(pwd)"
echo "System Load: $(cat /proc/loadavg | cut -d' ' -f1-3)"
echo "Available Memory: $(free -h | grep Mem | awk '{print $7}')"
echo "Disk Space: $(df -h / | tail -1 | awk '{print $4}') available"
echo "Active Processes: $(ps aux | wc -l)"
echo "=== CHECK COMPLETE ==="
EOF

chmod +x ~/emergency_check.sh
```

---

## **Part 5: Hands-On Integration Lab (20 minutes)**

### **Comprehensive Workshop Management Challenge**
*"You're now the senior workshop supervisor for the weekend shift. Demonstrate your skills by creating a complete monitoring and management system."*

#### **Challenge Tasks:**
```bash
# Task 1: Create a comprehensive status report
cat > workshop_report.sh << 'EOF'
#!/bin/bash
echo "======================================="
echo "WEEKEND WORKSHOP SUPERVISORY REPORT"
echo "======================================="
echo "Report Generated: $(date)"
echo "Supervisor: $(whoami)"
echo "Workshop: $(hostname)"
echo ""

echo "--- OPERATIONAL STATUS ---"
echo "Workshop Runtime: $(uptime -p)"
echo "Current Load: $(cat /proc/loadavg | cut -d' ' -f1)"
echo "Active Personnel: $(who | wc -l)"
echo ""

echo "--- RESOURCE STATUS ---"
echo "Memory Available: $(free -h | grep Mem | awk '{print $7}')"
echo "Storage Available: $(df -h / | tail -1 | awk '{print $4}')"
echo ""

echo "--- PROCESS STATUS ---"
echo "Total Processes: $(ps aux | wc -l)"
echo "Running Processes: $(ps aux | grep -v grep | grep ' R ' | wc -l)"
echo "My Background Jobs: $(jobs | wc -l)"
echo ""

echo "--- NETWORK STATUS ---"
if ping -c 1 google.com > /dev/null 2>&1; then
    echo "Internet Connectivity: OPERATIONAL"
else
    echo "Internet Connectivity: ISSUE DETECTED"
fi
echo ""

echo "=== REPORT COMPLETE ==="
EOF

chmod +x workshop_report.sh
./workshop_report.sh
```

#### **Challenge Extension:**
```bash
# Task 2: Process management demonstration
echo "Starting process management demo..."

# Start background monitoring task
sleep 300 & 
MONITOR_PID=$!
echo "Started background monitor (PID: $MONITOR_PID)"

# Start and control a foreground task
echo "Starting foreground task (press Ctrl+Z when instructed)..."
sleep 60                      # Student should press Ctrl+Z here

# Show job control
jobs -l
echo "Background job status shown above"

# Demonstrate process cleanup
kill $MONITOR_PID
echo "Cleaned up background process"
```

---

## **Session Summary & Skills Mastered**

### **Core Competencies Achieved**
```bash
# System Monitoring
whoami, hostname, id, uptime, date, who, w, users, last
free -h, df -h, du -sh, cat /proc/loadavg, nproc

# Process Management  
ps, ps aux, pstree, top, jobs, bg, fg, kill, killall, nice, renice

# Job Control
& (background), Ctrl+Z (suspend), Ctrl+C (interrupt), jobs -l

# Network Basics
ip addr show, ping, hostname -I, systemctl status

# Troubleshooting
which, echo $PATH, reset, clear, stty sane
```

### **Problem-Solving Skills Developed**
- Systematic error analysis and recovery
- Process lifecycle understanding and control
- Resource monitoring and interpretation
- Network connectivity troubleshooting
- Emergency response procedures

### **Key Conceptual Understanding**
- Process states and transitions
- Job control mechanisms
- System resource interpretation
- Load average meaning and implications
- Service health monitoring basics

---

## **Take-Home Practice & Preparation**

### **Daily Monitoring Routine**
```bash
# Create your daily monitoring script
cat > ~/daily_monitor.sh << 'EOF'
#!/bin/bash
echo "=== DAILY WORKSHOP MONITORING ==="
date
echo "Load: $(cat /proc/loadavg | cut -d' ' -f1-3)"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2" ("$5" available)"}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5" used)"}')"
echo "Processes: $(ps aux | wc -l) total"
echo "Jobs: $(jobs | wc -l) background"
echo "=== MONITORING COMPLETE ==="
EOF

chmod +x ~/daily_monitor.sh
```

### **Practice Exercises for Next Session**
1. **Process Management**: Practice starting, stopping, and controlling background jobs
2. **Monitoring**: Run `top` daily and interpret the load averages
3. **Troubleshooting**: Intentionally create simple problems and practice recovery
4. **Documentation**: Keep a log of problems encountered and solutions found

**Next Session Preview**: "Advanced File Operations & Text Processing" - Master file manipulation, pattern matching, and data processing techniques that every Linux professional needs to know.
