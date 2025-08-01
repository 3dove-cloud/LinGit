# Week 2 Session 4: System Monitoring & Environment Basics
## The Digital Watchkeeper's Essential Tools
*Duration: 2 hours*

---

## 🎯 Learning Objectives
By the end of this session, you will be able to:
- Monitor your system using basic but powerful tools
- Understand and manage environment variables
- Use input/output redirection for everyday tasks
- Control background processes and jobs
- Check system health and performance
- Apply troubleshooting basics when things go wrong

---

## 📖 Session Story: Becoming the Workshop Watchkeeper

*Continuing our digital workshop journey...*

Master Chen notices you've mastered the basics of users, packages, and services. "Now," he says with a smile, "you're ready to become a Watchkeeper - someone who keeps an eye on the workshop's health and ensures everything runs smoothly."

He shows you a simple control panel with gauges and indicators. "A good craftsperson always knows how their workshop is performing. Today, you'll learn to watch, understand, and guide your digital workshop."

---

## 🔧 Part 1: Basic System Monitoring (30 minutes)

### Understanding Your Workshop's Health

"Every workshop needs a watchful eye," Master Chen explains. "Let's start with the basics."

#### 1.1 Checking System Resources

**CPU and Memory - The Workshop's Energy:**
```bash
# Check who's using the CPU
top
# Press 'q' to quit

# Better view with colors (if available)
htop
# Press F10 or 'q' to quit
```

**Simple Memory Check:**
```bash
# See memory usage in human-readable format
free -h

# What this means:
# total = Total RAM in your system
# used = Currently being used
# free = Completely unused
# available = Available for new programs
```

**Visual Memory Explanation:**
```
Memory Usage:
Total: 8GB RAM
├─ Used: 3GB    ┌──────────┐
├─ Free: 2GB    │ Used     │ ← Running programs
├─ Buffers: 1GB │ Free     │ ← Available space
└─ Cache: 2GB   │ Buffers  │ ← System efficiency
                │ Cache    │ ← Speed optimization
                └──────────┘
```

#### 1.2 Checking Disk Space

```bash
# Check disk usage
df -h

# What the columns mean:
# Filesystem = Storage device
# Size = Total space
# Used = Space taken
# Avail = Space available
# Use% = Percentage used
# Mounted on = Where it's accessible
```

**When to Worry:**
- 🟢 0-70% disk usage: Normal
- 🟡 70-85% disk usage: Watch closely
- 🔴 85%+ disk usage: Take action soon

#### 1.3 Basic Process Monitoring

```bash
# List all running processes
ps aux

# Find specific processes
ps aux | grep firefox
ps aux | grep ssh

# Count total processes
ps aux | wc -l
```

**Understanding Process Information:**
```
USER    PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
alice  1234   2.1  1.5 123456 12345 pts/0    S    10:30   0:05 firefox
  │     │     │    │      │     │     │       │      │      │      │
  │     │     │    │      │     │     │       │      │      │      └─ Program name
  │     │     │    │      │     │     │       │      │      └─ CPU time used
  │     │     │    │      │     │     │       │      └─ Start time
  │     │     │    │      │     │     │       └─ Status (S=Sleeping, R=Running)
  │     │     │    │      │     │     └─ Terminal
  │     │     │    │      │     └─ Physical memory used
  │     │     │    │      └─ Virtual memory size
  │     │     │    └─ Memory percentage
  │     │     └─ CPU percentage
  │     └─ Process ID
  └─ User who owns the process
```

---

## 🌍 Part 2: Environment Variables - Your Workshop Settings (25 minutes)

### Understanding Your Workshop Environment

"Think of environment variables as your workshop's settings panel," Master Chen explains. "They control how everything behaves."

#### 2.1 Viewing Environment Variables

```bash
# See all environment variables
env

# See specific important ones
echo "Your username: $USER"
echo "Your home directory: $HOME"
echo "Your current directory: $PWD"
echo "Your shell: $SHELL"
```

#### 2.2 The PATH Variable - Finding Your Tools

**Understanding PATH:**
```bash
# See your PATH
echo $PATH

# Make it readable
echo $PATH | tr ':' '\n'
```

**Visual PATH Explanation:**
```
How Linux Finds Commands:
You type: firefox
         ↓
Linux searches in order:
1. /usr/local/bin  ← Local programs
2. /usr/bin        ← System programs  
3. /bin            ← Essential programs
4. /usr/local/sbin ← Local admin tools
5. /usr/sbin       ← System admin tools
6. /sbin           ← Essential admin tools
         ↓
Found! /usr/bin/firefox
```

**Checking Where Commands Are:**
```bash
# Find where a command is located
which ls
which firefox
which python3

# What if a command isn't found?
which nonexistent_command
# Result: command not found
```

#### 2.3 Creating Simple Environment Variables

```bash
# Create your own environment variable
MY_NAME="Workshop Student"
echo $MY_NAME

# Make it available to other programs
export MY_NAME="Workshop Student"
echo $MY_NAME

# Create workshop-related variables
export WORKSHOP_HOME="$HOME/workshop"
export WORKSHOP_STUDENT="$USER"

# Check they're set
echo "Workshop home: $WORKSHOP_HOME"
echo "Student name: $WORKSHOP_STUDENT"
```

#### 2.4 Adding to PATH (Simple Method)

```bash
# Create a personal bin directory
mkdir -p ~/bin

# Add it to PATH for this session
export PATH="$HOME/bin:$PATH"

# Verify it's added
echo $PATH | tr ':' '\n' | head -3
```

**Making Changes Permanent:**
```bash
# Add to your .bashrc file (runs every time you log in)
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc

# Reload your environment
source ~/.bashrc
```

---

## 🔄 Part 3: Input/Output Redirection - Directing Information Flow (30 minutes)

### Controlling Information in Your Workshop

"Information flows through your workshop like materials," Master Chen demonstrates. "You need to direct where it goes."

#### 3.1 Basic Output Redirection

**Saving Command Output:**
```bash
# Save file listing to a file
ls -la > file_list.txt

# Look at what was saved
cat file_list.txt

# Add more information to the same file
date >> file_list.txt
echo "Workshop inventory complete" >> file_list.txt

# Check the updated file
cat file_list.txt
```

**Understanding the Symbols:**
- `>` = Save output to file (replaces existing content)
- `>>` = Add output to file (keeps existing content)

#### 3.2 Input Redirection

```bash
# Count lines in a file
wc -l < file_list.txt

# Sort contents of a file
sort < file_list.txt

# This is the same as:
sort file_list.txt
```

#### 3.3 Basic Pipes - Connecting Commands

**Simple Pipe Examples:**
```bash
# Count total files in directory
ls -la | wc -l

# Find specific processes
ps aux | grep firefox

# Look at first few lines of a long output
ps aux | head -10

# Look at last few lines
ps aux | tail -5

# Search through command output
ls -la | grep ".txt"
```

**Visual Pipe Explanation:**
```
Command Pipeline:
ps aux → grep firefox → wc -l
   │         │           │
   │         │           └─ Count the lines
   │         └─ Filter for firefox
   └─ List all processes

Result: Number of firefox processes
```

#### 3.4 Practical Redirection Examples

```bash
# Save system information
echo "=== System Report ===" > system_report.txt
date >> system_report.txt
echo "User: $USER" >> system_report.txt
echo "Home: $HOME" >> system_report.txt
echo "Current directory: $(pwd)" >> system_report.txt
echo "Disk usage:" >> system_report.txt
df -h >> system_report.txt

# View the report
cat system_report.txt
```

```bash
# Find and save large files
find $HOME -size +10M 2>/dev/null > large_files.txt

# Explain this command:
# find $HOME = Search in home directory
# -size +10M = Files larger than 10 megabytes  
# 2>/dev/null = Hide error messages
# > large_files.txt = Save results to file
```

---

## ⚙️ Part 4: Job Control - Managing Workshop Tasks (25 minutes)

### Running Multiple Tasks

"Sometimes you need to do several things at once in your workshop," Master Chen explains. "Let's learn to manage multiple tasks."

#### 4.1 Background Jobs

```bash
# Start a long task in the background
sleep 60 &

# The & symbol means "run in background"
# You get your prompt back immediately

# See what jobs are running
jobs

# Start another background task
sleep 120 &

# Check jobs again
jobs
```

**Understanding Job Output:**
```
[1]  Running    sleep 60 &
[2]  Running    sleep 120 &
 │       │          │
 │       │          └─ The command
 │       └─ Status
 └─ Job number
```

#### 4.2 Controlling Jobs

```bash
# Bring a job to the front (foreground)
fg %1

# Send it back to background (press Ctrl+Z first, then:)
bg %1

# Kill a specific job
kill %1

# Kill all jobs
jobs -p | xargs kill
```

#### 4.3 Practical Job Control

**Example: Monitoring System While Working:**
```bash
# Start a simple monitor in background
watch -n 5 "date; free -h" &

# Continue your normal work
ls -la
ps aux

# Check your background job
jobs

# Stop the monitor when done
kill %1
```

#### 4.4 Using nohup for Persistent Tasks

```bash
# Run something that won't stop when you log out
nohup sleep 600 &

# Check it's running
jobs

# The output goes to nohup.out
cat nohup.out
```

---

## 🏃‍♂️ Part 5: Hands-On Workshop Practice (30 minutes)

### Practical Exercise: Workshop Health Check

Let's combine everything you've learned into practical exercises.

#### Exercise 1: System Health Report

```bash
# Create a workshop directory
mkdir -p ~/workshop/reports
cd ~/workshop/reports

# Create a basic health check
echo "=== Workshop Health Report ===" > health_report.txt
echo "Generated on: $(date)" >> health_report.txt
echo "By user: $USER" >> health_report.txt
echo "" >> health_report.txt

echo "=== System Resources ===" >> health_report.txt
echo "Memory usage:" >> health_report.txt
free -h >> health_report.txt
echo "" >> health_report.txt

echo "Disk usage:" >> health_report.txt
df -h >> health_report.txt
echo "" >> health_report.txt

echo "=== Running Processes ===" >> health_report.txt
echo "Total processes: $(ps aux | wc -l)" >> health_report.txt
echo "Top 5 memory users:" >> health_report.txt
ps aux --sort=-%mem | head -6 >> health_report.txt

# View your report
less health_report.txt
```

#### Exercise 2: Environment Setup

```bash
# Set up your workshop environment
export WORKSHOP_NAME="My Digital Workshop"
export WORKSHOP_LOCATION="$HOME/workshop"
export WORKSHOP_REPORTS="$WORKSHOP_LOCATION/reports"

# Create directory structure
mkdir -p "$WORKSHOP_LOCATION"/{reports,projects,tools}

# Verify setup
echo "Workshop name: $WORKSHOP_NAME"
echo "Workshop location: $WORKSHOP_LOCATION" 
ls -la "$WORKSHOP_LOCATION"
```

#### Exercise 3: Process Management Practice

```bash
# Start some background monitoring
echo "Starting workshop monitoring..."

# Monitor disk space every 30 seconds
(while true; do
    echo "$(date): $(df -h / | tail -1 | awk '{print $5}')" >> "$WORKSHOP_REPORTS/disk_monitor.log"
    sleep 30
done) &

# Note the process ID
MONITOR_PID=$!
echo "Monitor started with PID: $MONITOR_PID"

# Do some other work
ls -la
ps aux | grep sleep

# Check the monitor log
tail "$WORKSHOP_REPORTS/disk_monitor.log"

# Stop the monitor when done
kill $MONITOR_PID
```

#### Exercise 4: Information Processing

```bash
# Process system information with pipes
echo "=== Process Analysis ===" > "$WORKSHOP_REPORTS/process_analysis.txt"

# Find processes using most CPU
echo "Top CPU users:" >> "$WORKSHOP_REPORTS/process_analysis.txt"
ps aux --sort=-%cpu | head -6 >> "$WORKSHOP_REPORTS/process_analysis.txt"

# Find processes using most memory
echo "" >> "$WORKSHOP_REPORTS/process_analysis.txt"
echo "Top Memory users:" >> "$WORKSHOP_REPORTS/process_analysis.txt"
ps aux --sort=-%mem | head -6 >> "$WORKSHOP_REPORTS/process_analysis.txt"

# Count processes by user
echo "" >> "$WORKSHOP_REPORTS/process_analysis.txt"
echo "Processes by user:" >> "$WORKSHOP_REPORTS/process_analysis.txt"
ps aux | awk '{print $1}' | sort | uniq -c | sort -nr >> "$WORKSHOP_REPORTS/process_analysis.txt"

# View results
cat "$WORKSHOP_REPORTS/process_analysis.txt"
```

---

## 🔍 Part 6: Basic Troubleshooting (15 minutes)

### When Things Go Wrong

"Every workshop has problems sometimes," Master Chen says. "Here's how to figure out what's happening."

#### 6.1 Common System Checks

**Is the system responsive?**
```bash
# Check system load
uptime

# If load is high, find what's using CPU
top
# Press 'q' to quit
```

**Is there enough space?**
```bash
# Check disk space
df -h

# If space is low, find large files in home directory
du -h ~ | sort -hr | head -10
```

**Are important services running?**
```bash
# Check SSH service
systemctl status ssh

# Check network
ping -c 3 google.com
```

#### 6.2 Basic Process Troubleshooting

**Find runaway processes:**
```bash
# Processes using most CPU
ps aux --sort=-%cpu | head -10

# Processes using most memory
ps aux --sort=-%mem | head -10

# If you need to stop a process
kill [PID]
# Replace [PID] with the actual process ID
```

#### 6.3 Environment Troubleshooting

**Command not found?**
```bash
# Check if it's in PATH
which command_name

# Check your PATH
echo $PATH | tr ':' '\n'

# If PATH looks wrong, reset it
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin"
```

**Environment variable missing?**
```bash
# Check specific variable
echo $VARIABLE_NAME

# See all environment variables
env | grep VARIABLE_NAME

# Reset if needed
export VARIABLE_NAME="correct_value"
```

---

## 🎯 Part 7: Quick Reference & Wrap-up (5 minutes)

### Essential Commands Summary

**System Monitoring:**
```bash
top                    # Interactive process monitor
free -h               # Memory usage
df -h                 # Disk usage
ps aux                # List all processes
uptime                # System load and uptime
```

**Environment Variables:**
```bash
env                   # Show all environment variables
echo $VARIABLE        # Show specific variable
export VAR=value      # Set environment variable
which command         # Find command location
echo $PATH            # Show command search path
```

**Input/Output Redirection:**
```bash
command > file        # Save output to file
command >> file       # Add output to file
command < file        # Read input from file
command1 | command2   # Pipe output between commands
```

**Job Control:**
```bash
command &             # Run in background
jobs                  # List active jobs
fg %1                 # Bring job to foreground
bg %1                 # Send job to background
kill %1               # Stop a job
```

### Workshop Health Checklist

**Daily Checks:**
- ✅ Check disk space: `df -h`
- ✅ Check memory usage: `free -h`
- ✅ Check system load: `uptime`
- ✅ Verify important services: `systemctl status ssh`

**When Problems Occur:**
- 🔍 Check what's using resources: `top`
- 🔍 Look for full disks: `df -h`
- 🔍 Find large files: `du -h ~ | sort -hr | head -10`
- 🔍 Check network: `ping google.com`

---

## 📚 Session Wrap-up

**What You've Learned:**
- How to monitor your system's health using basic tools
- Understanding and managing environment variables
- Redirecting input and output for practical tasks
- Controlling background jobs and processes
- Basic troubleshooting when issues arise

**Key Skills Gained:**
- System awareness and monitoring
- Environment customization
- Information processing with pipes and redirection
- Multi-tasking with job control
- Problem-solving basics

**Next Steps:**
Practice these commands regularly! The more you use them, the more natural they become. Your digital workshop now has a dedicated watchkeeper - you!

---

## 🆘 Emergency Quick Reference

```bash
# System emergency checks
top                           # What's using CPU?
free -h                       # Memory problems?
df -h                         # Disk full?
ps aux | grep process_name    # Find specific process
kill [PID]                    # Stop problematic process

# Environment problems
echo $PATH                    # PATH missing directories?
which command                 # Command not found?
export PATH="/usr/bin:/bin"   # Reset basic PATH

# Job control emergencies
jobs                          # What's running in background?
kill %1                       # Stop background job 1
killall process_name          # Stop all instances of program
```

*Remember: You're now the watchkeeper of your digital workshop. Keep an eye on things, but don't worry - with practice, this all becomes second nature!*
