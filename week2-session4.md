# Week 2 Session 4: Advanced System Monitoring & Environment Management
## The Digital Watchkeeper's Advanced Tools
*Duration: 2 hours*

---

## 🎯 Learning Objectives
By the end of this session, you will be able to:
- Master advanced system monitoring tools and techniques
- Configure and manipulate environment variables and PATH
- Implement input/output redirection and pipes effectively
- Control background processes and job management
- Create comprehensive system health monitoring strategies
- Troubleshoot performance issues using systematic approaches

---

## 📖 Session Story: The Master Watchkeeper's Arsenal

*Continuing our digital workshop journey...*

As our workshop has grown more sophisticated, Master Chen realizes that simple observation tools are no longer sufficient. "A true digital craftsperson," he explains, "must not only watch their workshop but understand its very breath and heartbeat. Today, we learn the advanced arts of the Master Watchkeeper."

He leads you to a control room overlooking the entire workshop - walls lined with intricate monitoring displays and control panels. "Here, we don't just see what's happening now, but predict what will happen next, and prepare our workshop to respond automatically."

---

## 🔧 Part 1: Advanced System Monitoring Mastery (45 minutes)

### The Watchkeeper's Enhanced Vision

"The basic `top` command is like looking through a keyhole," Master Chen begins. "But a master needs panoramic vision."

#### 1.1 Enhanced Process Monitoring with htop

```bash
# Install htop if not available (Ubuntu/Debian)
sudo apt update && sudo apt install htop

# Launch htop - the enhanced process viewer
htop
```

**Visual Guide: htop Interface Layout**
```
┌─ CPU Usage Bars ──┬─ Memory/Swap Bars ─┬─ Load Average ─┐
│ CPU[||||||||  82%] │ Mem[||||||||  3.2G/8.0G] │ Load: 1.23 1.45 1.67 │
│ CPU[||||||    65%] │ Swp[||        64M/2.0G] │ Tasks: 187, 432 thr │
└────────────────────┴─────────────────────────┴─────────────────────┘
┌─ Process List ─────────────────────────────────────────────────────┐
│ PID USER     PRI  NI  VIRT  RES  SHR S CPU% MEM%   TIME+  Command   │
│ 1234 workshop  20   0  156M  45M  32M R  18.0  0.6  0:23.45 python  │
│ 5678 workshop  20   0  89M   23M  18M S   5.2  0.3  1:45.23 firefox │
└────────────────────────────────────────────────────────────────────┘
```

**Master's htop Navigation Keys:**
- `F1`: Help menu
- `F2`: Setup (customize display)
- `F3`: Search processes
- `F4`: Filter processes
- `F5`: Tree view (show process hierarchy)
- `F6`: Sort by different columns
- `F9`: Kill process (safely)
- `F10`: Quit

#### 1.2 System Resource Deep Dive

**Memory Analysis Deep Dive:**
```bash
# Detailed memory usage
free -h

# Memory usage by process (sorted)
ps aux --sort=-%mem | head -10

# Show memory map of a process
cat /proc/[PID]/smaps
```

**CPU Performance Analysis:**
```bash
# CPU information and capabilities
lscpu

# Real-time CPU usage per core
watch -n 1 "cat /proc/stat | grep '^cpu[0-9]' | awk '{print \$1 \": \" (\$2+\$4)*100/(\$2+\$3+\$4+\$5) \"%\"}'"

# CPU usage history
sar -u 1 5                    # 5 samples, 1 second apart
```

#### 1.3 Advanced Process Tree Visualization

```bash
# Process tree with full command lines
pstree -p -a

# Process tree for specific user
pstree -p workshop

# Show process relationships
ps -eo pid,ppid,cmd --forest
```

**Visual Process Hierarchy:**
```
System Process Tree:
systemd(1)───┬─systemd-journal(543)
             ├─systemd-udevd(564)
             ├─NetworkManager(890)───2*[{NetworkManager}(892,893)]
             ├─ssh(1234)───bash(1235)───htop(1456)
             └─firefox(2345)───10*[{firefox}(2346-2355)]
```

### Advanced Disk and Storage Monitoring

#### 1.4 Comprehensive Disk Analysis

```bash
# Disk usage with visual representation
df -h
ncdu /                         # Interactive disk usage analyzer (if installed)

# Find large files and directories
du -ah /home | sort -hr | head -20
find /home -size +100M -type f 2>/dev/null

# Disk I/O monitoring
iostat -x 1 5                  # Extended statistics, 5 samples
iotop                          # Real-time I/O monitoring (if installed)
```

**Visual Disk Usage Display:**
```bash
# Create a visual disk usage script
cat > ~/disk_visual.sh << 'EOF'
#!/bin/bash
echo "📊 Disk Usage Visualization"
echo "========================="
df -h | grep -E '^(/dev/|Filesystem)' | while read line; do
    if [[ $line =~ ^/dev ]]; then
        usage=$(echo $line | awk '{print $5}' | tr -d '%')
        device=$(echo $line | awk '{print $1}')
        if [ $usage -gt 80 ]; then
            echo "🔴 $line"
        elif [ $usage -gt 60 ]; then
            echo "🟡 $line"
        else
            echo "🟢 $line"
        fi
    else
        echo "$line"
    fi
done
EOF

chmod +x ~/disk_visual.sh
```

---

## 🌍 Part 2: Environment Variables & PATH Management Mastery (35 minutes)

### Understanding the Workshop's Environmental Settings

"Every master craftsperson," Master Chen explains, "must understand their workshop's environment - the air quality, temperature, and available tools. In Linux, these are your environment variables."

#### 2.1 Environment Variables Deep Dive

**Current Environment Analysis:**
```bash
# View all environment variables
env | sort

# View specific important variables
echo "User: $USER"
echo "Home: $HOME"
echo "Shell: $SHELL"
echo "Path: $PATH"
echo "Working Directory: $PWD"
echo "Language: $LANG"
echo "Terminal: $TERM"
```

#### 2.2 PATH Variable Mastery

**Understanding PATH Structure:**
```bash
# Display PATH in readable format
echo $PATH | tr ':' '\n' | nl

# Check which version of a command is being used
which python3
which -a python3              # Show all versions in PATH

# See how PATH is searched
type -a ls
```

**Visual PATH Explanation:**
```
PATH Search Order:
/usr/local/bin ──→ /usr/bin ──→ /bin ──→ /usr/local/sbin ──→ /usr/sbin ──→ /sbin
       ↓               ↓          ↓              ↓               ↓          ↓
  Local tools    System tools  Core    Local admin     System admin   Core admin
   (priority)                  tools                                    tools
```

#### 2.3 Advanced PATH Manipulation

```bash
# Add directory to beginning of PATH (highest priority)
export PATH="/home/$USER/bin:$PATH"

# Add directory to end of PATH (lowest priority)
export PATH="$PATH:/opt/custom/bin"

# Remove directory from PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v '/unwanted/path' | tr '\n' ':' | sed 's/:$//')

# Create a custom tools directory
mkdir -p ~/workshop-tools/bin
export PATH="$HOME/workshop-tools/bin:$PATH"
```

#### 2.4 Creating Custom Environment Variables

```bash
# Workshop-specific environment variables
export WORKSHOP_HOME="/opt/workshop"
export WORKSHOP_CONFIG="$WORKSHOP_HOME/config"
export WORKSHOP_LOGS="$WORKSHOP_HOME/logs"
export WORKSHOP_TOOLS="$WORKSHOP_HOME/tools"

# Development environment variables
export EDITOR="vim"
export BROWSER="firefox"
export PAGER="less"

# Create a workshop environment setup script
cat > ~/setup_workshop_env.sh << 'EOF'
#!/bin/bash
# Workshop Environment Setup

echo "🏗️ Setting up Workshop Environment"

# Workshop directories
export WORKSHOP_HOME="$HOME/workshop"
export WORKSHOP_PROJECTS="$WORKSHOP_HOME/projects"
export WORKSHOP_SCRIPTS="$WORKSHOP_HOME/scripts"
export WORKSHOP_LOGS="$WORKSHOP_HOME/logs"

# Create directories if they don't exist
mkdir -p "$WORKSHOP_PROJECTS" "$WORKSHOP_SCRIPTS" "$WORKSHOP_LOGS"

# Add workshop scripts to PATH
export PATH="$WORKSHOP_SCRIPTS:$PATH"

# Workshop-specific aliases
alias ws='cd $WORKSHOP_HOME'
alias wsp='cd $WORKSHOP_PROJECTS'
alias wss='cd $WORKSHOP_SCRIPTS'
alias wsl='cd $WORKSHOP_LOGS'

# Development tools
export EDITOR="vim"
export VISUAL="$EDITOR"
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

echo "✅ Workshop environment ready!"
echo "🏠 Workshop Home: $WORKSHOP_HOME"
echo "📁 Projects: $WORKSHOP_PROJECTS"
echo "🔧 Scripts: $WORKSHOP_SCRIPTS"
echo "📋 Logs: $WORKSHOP_LOGS"
EOF

chmod +x ~/setup_workshop_env.sh
source ~/setup_workshop_env.sh
```

#### 2.5 Persistent Environment Configuration

```bash
# Add to ~/.bashrc for permanent changes
cat >> ~/.bashrc << 'EOF'

# Workshop Environment Configuration
export WORKSHOP_HOME="$HOME/workshop"
export WORKSHOP_VERSION="2.0"
export PATH="$WORKSHOP_HOME/scripts:$PATH"

# Preferred tools
export EDITOR="vim"
export PAGER="less -R"
export HISTSIZE=10000
export HISTFILESIZE=20000

# Custom prompt with workshop info
PS1='\[\033[01;32m\]\u@workshop\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# Workshop aliases
alias workshop-status='echo "Workshop: $WORKSHOP_VERSION | Home: $WORKSHOP_HOME"'
alias env-check='env | grep WORKSHOP'
EOF

# Reload configuration
source ~/.bashrc
```

---

## 🔄 Part 3: Input/Output Redirection & Pipes Mastery (30 minutes)

### The Workshop's Communication System

"Information flows through our workshop like water through pipes," Master Chen demonstrates. "We must learn to direct, filter, and transform this flow."

#### 3.1 Advanced Redirection Techniques

**Standard File Descriptors:**
```
0 = stdin  (Standard Input)  - Where commands read input
1 = stdout (Standard Output) - Where commands write normal output  
2 = stderr (Standard Error)  - Where commands write error messages
```

**Basic Redirection Review:**
```bash
# Output redirection
ls -la > file_list.txt        # Write output to file (overwrite)
ls -la >> file_list.txt       # Append output to file
ls -la 2> errors.txt          # Redirect errors only
ls -la > output.txt 2>&1      # Redirect both output and errors
```

#### 3.2 Advanced Redirection Patterns

```bash
# Redirect output and errors to different files
command > output.txt 2> errors.txt

# Redirect errors to output stream
command 2>&1 | less

# Discard output but keep errors
command > /dev/null

# Discard errors but keep output  
command 2> /dev/null

# Discard everything
command > /dev/null 2>&1

# Save output and display it simultaneously
command | tee output.txt

# Append to file and display
command | tee -a logfile.txt
```

#### 3.3 Here Documents and Here Strings

```bash
# Here document - multiple line input
cat << 'EOF' > workshop_config.txt
Workshop Configuration
=====================
Version: 2.0
Location: /home/workshop
Tools: Advanced
Status: Active
EOF

# Here string - single line input
grep "workshop" <<< "This is a workshop environment"

# Here document with variable expansion
cat << EOF > status_report.txt
Workshop Status Report
Date: $(date)
User: $USER
Home: $HOME
Current Directory: $(pwd)
EOF
```

#### 3.4 Powerful Pipe Combinations

```bash
# System monitoring with pipes
ps aux | grep -v grep | sort -k3 -nr | head -10    # Top CPU processes
ps aux | awk '{sum+=$6} END {print "Total Memory: " sum/1024 " MB"}'

# Log analysis with pipes
cat /var/log/syslog | grep ERROR | wc -l           # Count errors
tail -f /var/log/syslog | grep --line-buffered "workshop"  # Live filtering

# File processing with pipes
find /home -name "*.txt" | xargs grep -l "workshop" | head -5
ls -la | awk '{print $9, $5}' | sort -k2 -nr      # Files by size

# Network monitoring with pipes
ss -tuln | grep LISTEN | awk '{print $5}' | cut -d: -f2 | sort -n | uniq
```

#### 3.5 Advanced Pipe Techniques

```bash
# Process substitution
diff <(ls /tmp) <(ls /var/tmp)                     # Compare directory listings
grep "pattern" <(curl -s http://example.com)       # Search web content

# Named pipes (FIFOs)
mkfifo /tmp/workshop_pipe                          # Create named pipe
echo "data" > /tmp/workshop_pipe &                 # Write to pipe (background)
cat /tmp/workshop_pipe                             # Read from pipe

# Command substitution in pipes
echo "Current users: $(who | wc -l)" | tee user_count.txt
```

---

## ⚙️ Part 4: Advanced Job Control & Process Management (25 minutes)

### Managing Workshop Operations

"A master can juggle multiple tasks," Master Chen says, "starting some in the background, pausing others, and bringing priority work to the foreground."

#### 4.1 Advanced Job Control

**Job Control Basics Refresher:**
```bash
# Start job in background
sleep 300 &                   # & puts job in background immediately

# View active jobs
jobs                          # List all jobs
jobs -l                       # List with process IDs
jobs -r                       # Only running jobs
jobs -s                       # Only stopped jobs
```

#### 4.2 Advanced Job Management

```bash
# Job control with specific job numbers
bg %1                         # Send job 1 to background
fg %2                         # Bring job 2 to foreground
kill %3                       # Kill job 3
kill -STOP %1                 # Pause job 1
kill -CONT %1                 # Resume job 1

# Process groups and sessions
setsid command                # Start command in new session
nohup command &               # Run command immune to hangups
disown %1                     # Remove job from shell's job table
```

#### 4.3 Advanced Process Control

```bash
# Process priorities (nice values)
nice -n 10 cpu_intensive_task         # Start with lower priority
renice -n 5 -p 1234                   # Change priority of running process

# Process signals
kill -l                               # List all available signals
kill -TERM 1234                       # Terminate gracefully
kill -KILL 1234                       # Force kill (last resort)
kill -USR1 1234                       # Send user-defined signal

# Process monitoring and control
pgrep -f "script_name"                # Find processes by name
pkill -f "script_name"                # Kill processes by name
killall firefox                      # Kill all firefox processes
```

#### 4.4 Screen and Tmux for Session Management

```bash
# Screen session management
screen -S workshop                    # Start named screen session
screen -ls                           # List active sessions
screen -r workshop                   # Reattach to session
# Inside screen: Ctrl+A, then D to detach

# tmux session management (more modern)
tmux new-session -s workshop         # Create named session
tmux list-sessions                   # List sessions
tmux attach-session -t workshop      # Attach to session
# Inside tmux: Ctrl+B, then D to detach
```

#### 4.5 Automated Process Management Script

```bash
# Create a process management dashboard
cat > ~/process_manager.sh << 'EOF'
#!/bin/bash
# Advanced Process Manager

show_system_overview() {
    echo "🖥️ System Overview - $(date)"
    echo "================================"
    echo "Uptime: $(uptime -p)"
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    echo "Memory Usage: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
    echo "Running Processes: $(ps aux | wc -l)"
    echo "Active Jobs: $(jobs | wc -l)"
    echo
}

show_top_processes() {
    echo "🔥 Top CPU Processes:"
    ps aux --sort=-%cpu | head -6 | awk 'NR==1{print $0} NR>1{printf "  %s %s %s %s %s\n", $2, $3, $4, $11, $12}'
    echo
    echo "💾 Top Memory Processes:"  
    ps aux --sort=-%mem | head -6 | awk 'NR==1{print $0} NR>1{printf "  %s %s %s %s %s\n", $2, $3, $4, $11, $12}'
    echo
}

show_active_jobs() {
    echo "⚙️ Active Jobs:"
    if jobs | grep -q .; then
        jobs -l
    else
        echo "  No active jobs"
    fi
    echo
}

interactive_menu() {
    while true; do
        clear
        show_system_overview
        show_top_processes
        show_active_jobs
        
        echo "🎛️ Process Manager Menu:"
        echo "1) Kill process by PID"
        echo "2) Kill process by name"
        echo "3) Change process priority"
        echo "4) Start background job"
        echo "5) Show detailed process info"
        echo "6) Refresh display"
        echo "q) Quit"
        echo
        read -p "Select option: " choice
        
        case $choice in
            1)
                read -p "Enter PID to kill: " pid
                if [[ $pid =~ ^[0-9]+$ ]]; then
                    kill $pid 2>/dev/null && echo "✅ Process $pid killed" || echo "❌ Failed to kill process $pid"
                else
                    echo "❌ Invalid PID"
                fi
                read -p "Press Enter to continue..."
                ;;
            2)
                read -p "Enter process name to kill: " name
                pkill -f "$name" && echo "✅ Processes matching '$name' killed" || echo "❌ No processes found"
                read -p "Press Enter to continue..."
                ;;
            3)
                read -p "Enter PID: " pid
                read -p "Enter new priority (-20 to 19): " priority
                renice -n $priority -p $pid 2>/dev/null && echo "✅ Priority changed" || echo "❌ Failed to change priority"
                read -p "Press Enter to continue..."
                ;;
            4)
                read -p "Enter command to run in background: " cmd
                eval "$cmd &" && echo "✅ Job started in background" || echo "❌ Failed to start job"
                read -p "Press Enter to continue..."
                ;;
            5)
                read -p "Enter PID for detailed info: " pid
                if [[ $pid =~ ^[0-9]+$ ]]; then
                    ps -p $pid -o pid,ppid,cmd,cpu,mem,stat,start,time
                    echo
                    cat /proc/$pid/status 2>/dev/null | grep -E "(Name|State|VmSize|VmRSS)" || echo "Process not found"
                else
                    echo "❌ Invalid PID"
                fi
                read -p "Press Enter to continue..."
                ;;
            6)
                continue
                ;;
            q)
                break
                ;;
            *)
                echo "❌ Invalid option"
                read -p "Press Enter to continue..."
                ;;
        esac
    done
}

# Run interactive menu
interactive_menu
EOF

chmod +x ~/process_manager.sh
```

---

## 🎯 Part 5: Comprehensive System Monitoring Lab (30 minutes)

### Mission: Build a Master Watchkeeper's Control Center

#### 5.1 Advanced System Health Monitor

```bash
# Create comprehensive system health monitor
cat > ~/system_health_monitor.sh << 'EOF'
#!/bin/bash
# Master Watchkeeper's System Health Monitor

LOG_FILE="/tmp/system_health.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEM=85
ALERT_THRESHOLD_DISK=90

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

check_cpu_usage() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    local cpu_int=${cpu_usage%.*}
    
    if [ $cpu_int -gt $ALERT_THRESHOLD_CPU ]; then
        echo -e "${RED}🔴 CPU: ${cpu_usage}% (HIGH)${NC}"
        log_message "ALERT: High CPU usage: ${cpu_usage}%"
    elif [ $cpu_int -gt 60 ]; then
        echo -e "${YELLOW}🟡 CPU: ${cpu_usage}% (MODERATE)${NC}"
    else
        echo -e "${GREEN}🟢 CPU: ${cpu_usage}% (NORMAL)${NC}"
    fi
}

check_memory_usage() {
    local mem_info=$(free | awk 'NR==2{printf "%.0f %.0f %.1f", $3,$2,$3*100/$2}')
    local mem_used=$(echo $mem_info | awk '{print $1}')
    local mem_total=$(echo $mem_info | awk '{print $2}')
    local mem_percent=$(echo $mem_info | awk '{print $3}')
    local mem_int=${mem_percent%.*}
    
    if [ $mem_int -gt $ALERT_THRESHOLD_MEM ]; then
        echo -e "${RED}🔴 Memory: ${mem_percent}% ($(numfmt --to=iec --from=K $mem_used)/$(numfmt --to=iec --from=K $mem_total)) HIGH${NC}"
        log_message "ALERT: High memory usage: ${mem_percent}%"
    elif [ $mem_int -gt 70 ]; then
        echo -e "${YELLOW}🟡 Memory: ${mem_percent}% ($(numfmt --to=iec --from=K $mem_used)/$(numfmt --to=iec --from=K $mem_total)) MODERATE${NC}"
    else
        echo -e "${GREEN}🟢 Memory: ${mem_percent}% ($(numfmt --to=iec --from=K $mem_used)/$(numfmt --to=iec --from=K $mem_total)) NORMAL${NC}"
    fi
}

check_disk_usage() {
    echo "💾 Disk Usage:"
    df -h | grep -E '^/dev/' | while read line; do
        local usage=$(echo $line | awk '{print $5}' | sed 's/%//')
        local device=$(echo $line | awk '{print $1}')
        local mount=$(echo $line | awk '{print $6}')
        
        if [ $usage -gt $ALERT_THRESHOLD_DISK ]; then
            echo -e "  ${RED}🔴 $device ($mount): ${usage}% CRITICAL${NC}"
            log_message "ALERT: Critical disk usage on $device: ${usage}%"
        elif [ $usage -gt 75 ]; then
            echo -e "  ${YELLOW}🟡 $device ($mount): ${usage}% HIGH${NC}"
        else
            echo -e "  ${GREEN}🟢 $device ($mount): ${usage}% NORMAL${NC}"
        fi
    done
}

check_load_average() {
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    local load_int=${load_avg%.*}
    local cpu_cores=$(nproc)
    
    echo "⚖️ Load Average: $load_avg (${cpu_cores} cores available)"
    
    if (( $(echo "$load_avg > $cpu_cores" | bc -l) )); then
        echo -e "  ${RED}🔴 System overloaded${NC}"
        log_message "ALERT: System overloaded, load: $load_avg"
    elif (( $(echo "$load_avg > $(echo "$cpu_cores * 0.7" | bc)" | bc -l) )); then
        echo -e "  ${YELLOW}🟡 High load${NC}"
    else
        echo -e "  ${GREEN}🟢 Normal load${NC}"
    fi
}

check_running_services() {
    echo "🔧 Critical Services:"
    local critical_services=("ssh" "NetworkManager" "systemd-resolved")
    
    for service in "${critical_services[@]}"; do
        if systemctl is-active --quiet $service; then
            echo -e "  ${GREEN}✅ $service: Running${NC}"
        else
            echo -e "  ${RED}❌ $service: Not running${NC}"
            log_message "ALERT: Service $service is not running"
        fi
    done
}

show_top_processes() {
    echo "🏃 Top Processes (CPU):"
    ps aux --sort=-%cpu | head -4 | tail -3 | awk '{printf "  %s: %s%% CPU, %s%% MEM\n", $11, $3, $4}'
    
    echo "🐘 Top Processes (Memory):"
    ps aux --sort=-%mem | head -4 | tail -3 | awk '{printf "  %s: %s%% MEM, %s%% CPU\n", $11, $4, $3}'
}

main_health_check() {
    clear
    echo "🏥 System Health Report - $(date)"
    echo "=================================================="
    echo
    
    check_cpu_usage
    check_memory_usage
    echo
    check_disk_usage
    echo
    check_load_average
    echo
    check_running_services
    echo
    show_top_processes
    echo
    
    echo "📋 System Info:"
    echo "  Uptime: $(uptime -p)"
    echo "  Users: $(who | wc -l) logged in"
    echo "  Processes: $(ps aux | wc -l) total"
    echo
    
    if [ -f $LOG_FILE ]; then
        local alert_count=$(grep "ALERT" $LOG_FILE | wc -l)
        echo "🚨 Total Alerts Today: $alert_count"
        if [ $alert_count -gt 0 ]; then
            echo "   Recent alerts:"
            tail -3 $LOG_FILE | grep "ALERT" | sed 's/^/   /'
        fi
    fi
    
    echo
    echo "💡 Tip: Run with 'watch -n 5 ~/system_health_monitor.sh' for continuous monitoring"
}

# Run the health check
main_health_check
EOF

chmod +x ~/system_health_monitor.sh
```

#### 5.2 Environment Management Suite

```bash
# Create environment management tools
cat > ~/env_manager.sh << 'EOF'
#!/bin/bash
# Environment Management Suite

show_current_env() {
    echo "🌍 Current Environment Variables"
    echo "==============================="
    echo "User & System:"
    echo "  USER: $USER"
    echo "  HOME: $HOME"
    echo "  SHELL: $SHELL"
    echo "  PWD: $PWD"
    echo "  LANG: $LANG"
    echo
    echo "Workshop Variables:"
    env | grep WORKSHOP | sort | sed 's/^/  /'
    echo
    echo "PATH Components:"
    echo $PATH | tr ':' '\n' | nl -v0 | sed 's/^/  /'
}

backup_environment() {
    local backup_file="$HOME/env_backup_$(date +%Y%m%d_%H%M%S).txt"
    echo "💾 Backing up environment to: $backup_file"
    env | sort > "$backup_file"
    echo "✅ Environment backed up"
}

add_to_path() {
    local new_path="$1"
    if [ -z "$new_path" ]; then
        read -p "Enter directory to add to PATH: " new_path
    fi
    
    if [ -d "$new_path" ]; then
        export PATH="$new_path:$PATH"
        echo "✅ Added $new_path to PATH"
        echo "💡 To make permanent, add to ~/.bashrc: export PATH=\"$new_path:\$PATH\""
    else
        echo "❌ Directory $new_path does not exist"
    fi
}

remove_from_path() {
    local remove_path="$1"
    if [ -z "$remove_path" ]; then
        echo "Current PATH components:"
        echo $PATH | tr ':' '\n' | nl
        read -p "Enter directory to remove from PATH: " remove_path
    fi
    
    export PATH=$(echo $PATH | tr ':' '\n' | grep -v "^$remove_path$" | tr '\n' ':' | sed 's/:$//')
    echo "✅ Removed $remove_path from PATH"
}

test_command_access() {
    local command="$1"
    if [ -z "$command" ]; then
        read -p "Enter command to test: " command
    fi
    
    echo "🔍 Testing command access: $command"
    if which "$command" >/dev/null 2>&1; then
        echo "✅ Found: $(which $command)"
        echo "   Type: $(type $command)"
        if [ -x "$(which $command)" ]; then
            echo "   Permissions: Executable"
        else
            echo "   Permissions: Not executable"
        fi
    else
        echo "❌ Command not found in PATH"
        echo "   Searching system..."
        find /usr /opt -name "$command" -type f 2>/dev/null | head -5 | sed 's/^/   Found: /'
    fi
}

interactive_menu() {
    while true; do
        echo
        echo "🎛️ Environment Manager Menu:"
        echo "1) Show current environment"
        echo "2) Backup environment"
        echo "3) Add directory to PATH"
        echo "4) Remove directory from PATH"
        echo "5) Test command access"
        echo "6) Show PATH visualization"
        echo "7) Create custom environment script"
        echo "q) Quit"
        echo
        read -p "Select option: " choice
        
        case $choice in
            1) show_current_env ;;
            2) backup_environment ;;
            3) add_to_path ;;
            4) remove_from_path ;;
            5) test_command_access ;;
            6) echo $PATH | tr ':' '\n' | nl -v0 | awk '{printf "%2d: %s\n", $1, $2}' ;;
            7) create_custom_env_script ;;
            q) break ;;
            *) echo "❌ Invalid option" ;;
        esac
    done
}

create_custom_env_script() {
    read -p "Enter script name: " script_name
    if [ -z "$script_name" ]; then
        script_name="custom_env"
    fi
    
    cat > "$HOME/${script_name}.sh" << 'ENVSCRIPT'
#!/bin/bash
# Custom Environment Setup Script

echo "🔧 Setting up custom environment..."

# Custom environment variables
export CUSTOM_WORKSPACE="$HOME/workspace"
export CUSTOM_TOOLS="$HOME/tools"
export CUSTOM_CONFIG="$HOME/.config/custom"

# Create directories
mkdir -p "$CUSTOM_WORKSPACE" "$CUSTOM_TOOLS" "$CUSTOM_CONFIG"

# Add to PATH
export PATH="$CUSTOM_TOOLS/bin:$PATH"

# Custom aliases
alias workspace='cd $CUSTOM_WORKSPACE'
alias tools='cd $CUSTOM_TOOLS'
alias config='cd $CUSTOM_CONFIG'

echo "✅ Custom environment loaded"
echo "📁 Workspace: $CUSTOM_WORKSPACE"
echo "🔧 Tools: $CUSTOM_TOOLS"
echo "⚙️ Config: $CUSTOM_CONFIG"
ENVSCRIPT

    chmod +x "$HOME/${script_name}.sh"
    echo "✅ Created custom environment script: $HOME/${script_name}.sh"
    echo "💡 Run with: source ~/${script_name}.sh"
}

# Run interactive menu
interactive_menu
EOF

chmod +x ~/env_manager.sh
```

#### 5.3 Advanced I/O Redirection Laboratory

```bash
# Create I/O redirection testing lab
cat > ~/io_redirection_lab.sh << 'EOF'
#!/bin/bash
# I/O Redirection Laboratory

LAB_DIR="$HOME/io_lab"
mkdir -p "$LAB_DIR"
cd "$LAB_DIR"

demo_basic_redirection() {
    echo "📝 Basic Redirection Demo"
    echo "========================"
    
    # Create test files
    echo "Creating test environment..."
    echo -e "apple\nbanana\ncherry\ndate" > fruits.txt
    echo -e "error: file not found\nwarning: disk space low" > errors.txt
    
    echo "1. Output redirection:"
    ls -la > file_list.txt
    echo "   Output saved to file_list.txt"
    
    echo "2. Append redirection:"
    echo "=== Additional Info ===" >> file_list.txt
    echo "   Additional content appended"
    
    echo "3. Error redirection:"
    ls nonexistent_file 2> error_log.txt
    echo "   Errors saved to error_log.txt"
    
    echo "4. Combined redirection:"
    ls file_list.txt nonexistent_file > output.txt 2>&1
    echo "   Both output and errors saved to output.txt"
    
    echo "✅ Basic redirection complete. Check the created files."
}

demo_advanced_pipes() {
    echo
    echo "🔄 Advanced Pipes Demo"
    echo "====================="
    
    echo "1. Chain of pipes:"
    ps aux | grep -v grep | sort -k3 -nr | head -5 | awk '{print $2, $3, $11}' > top_processes.txt
    echo "   Top CPU processes saved"
    
    echo "2. Tee command (split output):"
    echo -e "line1\nline2\nline3" | tee original.txt | wc -l > line_count.txt
    echo "   Content saved to original.txt and line count to line_count.txt"
    
    echo "3. Process substitution:"
    diff <(sort fruits.txt) <(sort -r fruits.txt) > sort_diff.txt 2>&1 || true
    echo "   Comparison of sorted files saved"
    
    echo "4. Here document:"
    cat << 'HEREDOC' > here_doc_example.txt
This is a here document example.
It can contain multiple lines.
Variables like $HOME are: $HOME
Current date: $(date)
HEREDOC
    echo "   Here document example created"
    
    echo "✅ Advanced pipes complete."
}

demo_named_pipes() {
    echo
    echo "🚰 Named Pipes (FIFO) Demo"
    echo "=========================="
    
    echo "Creating named pipe..."
    mkfifo workshop_pipe
    
    echo "Starting background writer..."
    (
        for i in {1..5}; do
            echo "Message $i from background process" 
            sleep 1
        done
        echo "Background writer finished"
    ) > workshop_pipe &
    
    echo "Reading from named pipe..."
    cat workshop_pipe
    
    echo "Cleaning up named pipe..."
    rm workshop_pipe
    
    echo "✅ Named pipes demo complete."
}

demo_file_descriptors() {
    echo
    echo "🔢 File Descriptors Demo"
    echo "========================"
    
    echo "1. Using custom file descriptors:"
    exec 3> custom_fd.txt
    echo "This goes to file descriptor 3" >&3
    echo "This goes to stdout normally"
    exec 3>&-  # Close file descriptor 3
    
    echo "2. Reading with custom file descriptor:"
    exec 4< fruits.txt
    read line <&4
    echo "First line from FD 4: $line"
    exec 4<&-  # Close file descriptor 4
    
    echo "3. Duplicating file descriptors:"
    exec 5>&1  # Save stdout
    exec 1> fd_output.txt  # Redirect stdout to file
    echo "This goes to the file"
    exec 1>&5  # Restore stdout
    exec 5>&-  # Close saved descriptor
    echo "This goes to terminal again"
    
    echo "✅ File descriptors demo complete."
}

interactive_lab() {
    echo "🧪 I/O Redirection Interactive Lab"
    echo "=================================="
    
    while true; do
        echo
        echo "Lab Exercises:"
        echo "1) Basic redirection demo"
        echo "2) Advanced pipes demo"
        echo "3) Named pipes demo"
        echo "4) File descriptors demo"
        echo "5) View created files"
        echo "6) Clean up lab directory"
        echo "7) Custom redirection challenge"
        echo "q) Quit lab"
        
        read -p "Select exercise: " choice
        
        case $choice in
            1) demo_basic_redirection ;;
            2) demo_advanced_pipes ;;
            3) demo_named_pipes ;;
            4) demo_file_descriptors ;;
            5) 
                echo "📁 Files in lab directory:"
                ls -la | sed 's/^/   /'
                echo
                read -p "Enter filename to view (or press Enter to skip): " filename
                if [ -n "$filename" ] && [ -f "$filename" ]; then
                    echo "📄 Contents of $filename:"
                    cat "$filename" | sed 's/^/   /'
                fi
                ;;
            6)
                read -p "Clean up all lab files? (y/N): " confirm
                if [[ $confirm =~ ^[Yy]$ ]]; then
                    rm -f *.txt workshop_pipe 2>/dev/null
                    echo "✅ Lab directory cleaned"
                fi
                ;;
            7)
                echo "🎯 Custom Challenge:"
                echo "Create a command that:"
                echo "1. Lists all .txt files"
                echo "2. Counts total lines in all .txt files"
                echo "3. Saves both results to summary.txt"
                echo "4. Displays the summary on screen"
                echo
                read -p "Try it! Enter your command: " user_command
                echo "Executing: $user_command"
                eval "$user_command" 2>&1 || echo "Command failed - try again!"
                ;;
            q) break ;;
            *) echo "❌ Invalid option" ;;
        esac
    done
}

# Start the interactive lab
interactive_lab
EOF

chmod +x ~/io_redirection_lab.sh
```

---

## 🎯 Part 6: Comprehensive Troubleshooting & Performance Analysis (15 minutes)

### The Master Troubleshooter's Toolkit

#### 6.1 Systematic Performance Troubleshooting

```bash
# Create comprehensive troubleshooting script
cat > ~/performance_troubleshooter.sh << 'EOF'
#!/bin/bash
# Master Troubleshooter's Performance Analysis Tool

REPORT_FILE="/tmp/performance_report_$(date +%Y%m%d_%H%M%S).txt"

generate_performance_report() {
    echo "🔍 Performance Troubleshooting Report" | tee $REPORT_FILE
    echo "Generated: $(date)" | tee -a $REPORT_FILE
    echo "======================================" | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # System Overview
    echo "📊 SYSTEM OVERVIEW" | tee -a $REPORT_FILE
    echo "Hostname: $(hostname)" | tee -a $REPORT_FILE
    echo "Uptime: $(uptime -p)" | tee -a $REPORT_FILE
    echo "Kernel: $(uname -r)" | tee -a $REPORT_FILE
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')" | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # CPU Analysis
    echo "🖥️ CPU ANALYSIS" | tee -a $REPORT_FILE
    lscpu | grep -E "(Model name|CPU\(s\)|Thread|Core)" | tee -a $REPORT_FILE
    echo "Current CPU Usage:" | tee -a $REPORT_FILE
    top -bn1 | grep "Cpu(s)" | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # Memory Analysis
    echo "💾 MEMORY ANALYSIS" | tee -a $REPORT_FILE
    free -h | tee -a $REPORT_FILE
    echo "Top Memory Consumers:" | tee -a $REPORT_FILE
    ps aux --sort=-%mem | head -6 | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # Disk Analysis
    echo "💿 DISK ANALYSIS" | tee -a $REPORT_FILE
    df -h | tee -a $REPORT_FILE
    echo "Disk I/O:" | tee -a $REPORT_FILE
    if command -v iostat >/dev/null; then
        iostat -x 1 1 | tee -a $REPORT_FILE
    else
        echo "iostat not available (install sysstat package)" | tee -a $REPORT_FILE
    fi
    echo | tee -a $REPORT_FILE
    
    # Network Analysis
    echo "🌐 NETWORK ANALYSIS" | tee -a $REPORT_FILE
    echo "Network Interfaces:" | tee -a $REPORT_FILE
    ip -br addr show | tee -a $REPORT_FILE
    echo "Network Connections:" | tee -a $REPORT_FILE
    ss -tuln | head -10 | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # Process Analysis
    echo "🔄 PROCESS ANALYSIS" | tee -a $REPORT_FILE
    echo "Total Processes: $(ps aux | wc -l)" | tee -a $REPORT_FILE
    echo "Running Processes: $(ps aux | grep -c ' R ')" | tee -a $REPORT_FILE
    echo "Sleeping Processes: $(ps aux | grep -c ' S ')" | tee -a $REPORT_FILE
    echo "Zombie Processes: $(ps aux | grep -c ' Z ')" | tee -a $REPORT_FILE
    echo "Top CPU Processes:" | tee -a $REPORT_FILE
    ps aux --sort=-%cpu | head -6 | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # Environment Analysis
    echo "🌍 ENVIRONMENT ANALYSIS" | tee -a $REPORT_FILE
    echo "User: $USER" | tee -a $REPORT_FILE
    echo "Shell: $SHELL" | tee -a $REPORT_FILE
    echo "PATH components: $(echo $PATH | tr ':' '\n' | wc -l)" | tee -a $REPORT_FILE
    echo "Environment variables: $(env | wc -l)" | tee -a $REPORT_FILE
    echo | tee -a $REPORT_FILE
    
    # Recommendations
    echo "💡 PERFORMANCE RECOMMENDATIONS" | tee -a $REPORT_FILE
    
    # CPU recommendations
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    local cpu_int=${cpu_usage%.*}
    if [ $cpu_int -gt 80 ]; then
        echo "⚠️ High CPU usage detected. Consider:" | tee -a $REPORT_FILE
        echo "   - Identify CPU-intensive processes" | tee -a $REPORT_FILE
        echo "   - Use 'nice' to lower process priority" | tee -a $REPORT_FILE
        echo "   - Check for runaway processes" | tee -a $REPORT_FILE
    fi
    
    # Memory recommendations
    local mem_percent=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $mem_percent -gt 85 ]; then
        echo "⚠️ High memory usage detected. Consider:" | tee -a $REPORT_FILE
        echo "   - Close unnecessary applications" | tee -a $REPORT_FILE
        echo "   - Clear system caches" | tee -a $REPORT_FILE
        echo "   - Check for memory leaks" | tee -a $REPORT_FILE
    fi
    
    # Disk recommendations
    df -h | grep -E '^/dev/' | while read line; do
        local usage=$(echo $line | awk '{print $5}' | sed 's/%//')
        if [ $usage -gt 85 ]; then
            local device=$(echo $line | awk '{print $6}')
            echo "⚠️ High disk usage on $device. Consider:" | tee -a $REPORT_FILE
            echo "   - Clean temporary files" | tee -a $REPORT_FILE
            echo "   - Remove old log files" | tee -a $REPORT_FILE
            echo "   - Move large files to external storage" | tee -a $REPORT_FILE
        fi
    done
    
    echo | tee -a $REPORT_FILE
    echo "📋 Full report saved to: $REPORT_FILE" | tee -a $REPORT_FILE
}

interactive_troubleshooter() {
    while true; do
        echo "🔧 Performance Troubleshooter Menu:"
        echo "1) Generate full performance report"
        echo "2) Quick CPU check"
        echo "3) Quick memory check"
        echo "4) Quick disk check"
        echo "5) Process investigation"
        echo "6) Environment check"
        echo "7) Real-time monitoring"
        echo "q) Quit"
        
        read -p "Select option: " choice
        
        case $choice in
            1) generate_performance_report ;;
            2) 
                echo "🖥️ CPU Status:"
                top -bn1 | head -5
                ;;
            3)
                echo "💾 Memory Status:"
                free -h
                echo "Top memory users:"
                ps aux --sort=-%mem | head -6
                ;;
            4)
                echo "💿 Disk Status:"
                df -h
                ;;
            5)
                read -p "Enter process name or PID to investigate: " process
                if [[ $process =~ ^[0-9]+$ ]]; then
                    echo "Process details for PID $process:"
                    ps -p $process -o pid,ppid,cmd,cpu,mem,stat,start,time 2>/dev/null || echo "Process not found"
                else
                    echo "Processes matching '$process':"
                    ps aux | grep -i "$process" | grep -v grep
                fi
                ;;
            6)
                echo "🌍 Environment Status:"
                echo "PATH components: $(echo $PATH | tr ':' '\n' | wc -l)"
                echo "Environment vars: $(env | wc -l)"
                echo "Current directory: $(pwd)"
                echo "Disk space in current dir: $(df -h . | tail -1 | awk '{print $4}') available"
                ;;
            7)
                echo "🔄 Starting real-time monitoring (Ctrl+C to stop)..."
                echo "Press any key to start..."
                read
                watch -n 2 "echo 'CPU:'; top -bn1 | head -5; echo; echo 'Memory:'; free -h; echo; echo 'Disk:'; df -h | head -5"
                ;;
            q) break ;;
            *) echo "❌ Invalid option" ;;
        esac
        echo
    done
}

# Start the troubleshooter
interactive_troubleshooter
EOF

chmod +x ~/performance_troubleshooter.sh
```

---

## 🎓 Part 7: Session Wrap-up & Mastery Assessment (10 minutes)

### Knowledge Integration Challenge

```bash
# Create a master challenge that combines all concepts
cat > ~/master_challenge.sh << 'EOF'
#!/bin/bash
# Master Watchkeeper Challenge - Integration Test

CHALLENGE_DIR="$HOME/master_challenge"
mkdir -p "$CHALLENGE_DIR"
cd "$CHALLENGE_DIR"

echo "🏆 Master Watchkeeper Integration Challenge"
echo "=========================================="
echo
echo "You must demonstrate mastery of:"
echo "✅ Advanced system monitoring"
echo "✅ Environment variables management"
echo "✅ I/O redirection and pipes"
echo "✅ Job control and process management"
echo

echo "🎯 CHALLENGE TASKS:"
echo "1. Create a custom environment with WORKSHOP_MASTER variable"
echo "2. Set up monitoring that runs in background"
echo "3. Use pipes to filter and save system information"
echo "4. Demonstrate job control with multiple processes"
echo

read -p "Ready to start? (y/N): " ready
if [[ ! $ready =~ ^[Yy]$ ]]; then
    echo "Come back when you're ready to prove your mastery!"
    exit 0
fi

echo
echo "🚀 Challenge Started!"
echo

# Task 1: Environment Setup
echo "📋 Task 1: Environment Mastery"
echo "Create your workshop environment..."
export WORKSHOP_MASTER="$USER"
export WORKSHOP_CHALLENGE_DIR="$CHALLENGE_DIR"
export PATH="$CHALLENGE_DIR/bin:$PATH"
mkdir -p bin logs output

echo "✅ Task 1 Complete!"
echo "   WORKSHOP_MASTER: $WORKSHOP_MASTER"
echo "   Challenge directory: $WORKSHOP_CHALLENGE_DIR"

# Task 2: Background Monitoring
echo
echo "📋 Task 2: Background Process Management"
echo "Starting system monitor in background..."

# Create simple monitoring script
cat > monitor.sh << 'MONITOR'
#!/bin/bash
while true; do
    echo "$(date): CPU: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}'), MEM: $(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')" >> logs/system_monitor.log
    sleep 5
done
MONITOR

chmod +x monitor.sh
./monitor.sh &
MONITOR_PID=$!

echo "✅ Task 2 Complete!"
echo "   Monitor PID: $MONITOR_PID"
echo "   Check with: jobs"

# Task 3: Advanced I/O and Pipes
echo
echo "📋 Task 3: I/O Redirection and Pipes Mastery"
echo "Processing system information with pipes..."

# Complex pipe chain
ps aux | grep -v grep | sort -k3 -nr | head -10 | \
awk '{print $2, $3, $4, $11}' | \
tee output/top_processes.txt | \
(echo "PID CPU% MEM% COMMAND"; cat) > output/formatted_processes.txt

# Redirect with multiple streams
(echo "=== System Report ===" 
 date
 echo "User: $WORKSHOP_MASTER"
 echo "Directory: $WORKSHOP_CHALLENGE_DIR"
 echo "Top Processes:"
 cat output/formatted_processes.txt) > output/system_report.txt 2>&1

echo "✅ Task 3 Complete!"
echo "   Reports saved to output/ directory"

# Task 4: Job Control Demonstration
echo
echo "📋 Task 4: Job Control Mastery"
echo "Demonstrating job control..."

# Start multiple background jobs
sleep 30 &
JOB1_PID=$!
sleep 45 &
JOB2_PID=$!

echo "Started background jobs:"
jobs -l

echo "✅ Task 4 Complete!"
echo "   Background jobs: $(jobs | wc -l)"

# Challenge Summary
echo
echo "🎉 CHALLENGE SUMMARY"
echo "==================="
echo "Environment Variables Set: $(env | grep WORKSHOP | wc -l)"
echo "Background Processes: $(jobs | wc -l)"
echo "Output Files Created: $(ls -1 output/ | wc -l)"
echo "Monitor Log Size: $(wc -l < logs/system_monitor.log) lines"

echo
echo "🔍 VERIFICATION COMMANDS:"
echo "Check environment: env | grep WORKSHOP"
echo "Check jobs: jobs -l"
echo "Check outputs: ls -la output/"
echo "Check monitor: tail logs/system_monitor.log"
echo "Stop monitor: kill $MONITOR_PID"
echo "Cleanup: kill $JOB1_PID $JOB2_PID"

echo
echo "🏆 Congratulations! You've demonstrated master-level skills!"
echo "You are now a qualified Digital Workshop Master Watchkeeper!"
EOF

chmod +x ~/master_challenge.sh
```

---

## 📚 Session Summary & Key Concepts

### Essential Commands Mastered
```bash
# Advanced Monitoring
htop                           # Enhanced process viewer
free -h                        # Memory usage analysis
df -h                         # Disk usage analysis
iostat -x                     # I/O statistics
lscpu                         # CPU information

# Environment Management
export VARIABLE=value          # Set environment variable
echo $PATH | tr ':' '\n'      # Display PATH components
which command                 # Find command location
type command                  # Command type analysis

# I/O Redirection Advanced
command > file 2>&1           # Redirect both stdout and stderr
command | tee file.txt        # Split output to file and terminal
cat << 'EOF' > file           # Here document
mkfifo named_pipe             # Create named pipe

# Job Control Advanced
jobs -l                       # List jobs with PIDs
bg %1                         # Send job to background
fg %2                         # Bring job to foreground
nohup command &               # Run immune to hangups
disown %1                     # Remove from job table
```

### Advanced Concepts Mastered
- **System Resource Monitoring**: CPU, memory, disk, and I/O analysis
- **Environment Variable Management**: PATH manipulation and custom environments
- **Advanced I/O Redirection**: File descriptors, named pipes, here documents
- **Process Lifecycle Management**: Job control, priorities, and signals
- **Performance Troubleshooting**: Systematic analysis and optimization
- **Automated Monitoring**: Background processes and alerting systems

### Professional Skills Developed
1. **Proactive Monitoring**: Implementing comprehensive system health checks
2. **Environment Optimization**: Customizing shell environments for efficiency
3. **Data Pipeline Creation**: Using pipes and redirection for complex workflows
4. **Process Orchestration**: Managing multiple concurrent tasks
5. **Performance Analysis**: Identifying and resolving system bottlenecks
6. **Automation Implementation**: Creating self-managing systems

---

## 🎯 Final Session Wrap-up & Course Conclusion

**What You've Mastered in Week 2 Session 4:**
- Advanced system monitoring with visual feedback
- Complete environment variable and PATH management
- Professional-grade I/O redirection and pipe techniques
- Sophisticated job control and process management
- Comprehensive troubleshooting methodologies
- Integrated system health monitoring solutions

**Complete Week 2 Journey:**
- **Session 1**: Users, Permissions, and Basic Environment
- **Session 2**: Package Management and System Configuration
- **Session 3**: System Services and Network Operations
- **Session 4**: Advanced Monitoring and Environment Mastery

**Your Linux Foundation is Now Complete!**
You've progressed from basic workshop apprentice to Master Watchkeeper, capable of managing sophisticated Linux systems with confidence, efficiency, and professional expertise.

---

## 🆘 Master Reference Card

### Emergency System Analysis
```bash
# Quick system overview
htop                          # Interactive process monitor
~/system_health_monitor.sh    # Comprehensive health check
~/performance_troubleshooter.sh  # Performance analysis

# Environment troubleshooting
env | grep WORKSHOP           # Check workshop variables
echo $PATH | tr ':' '\n' | nl # Analyze PATH
which command                 # Verify command access

# Process emergency control
jobs -l                       # List all jobs with PIDs
kill %1                       # Kill job by number
killall process_name          # Kill all instances
ps aux | grep process         # Find specific processes
```

### Master's Toolkit Scripts
- `~/system_health_monitor.sh` - Comprehensive system monitoring
- `~/env_manager.sh` - Environment variable management
- `~/io_redirection_lab.sh` - I/O redirection practice lab
- `~/performance_troubleshooter.sh` - Performance analysis tool
- `~/master_challenge.sh` - Integration skills test

**Congratulations, Master Watchkeeper! Your digital workshop awaits your expert management.** 🏆

*Remember: With great power comes great responsibility. Use your Linux mastery wisely to build, protect, and optimize the digital workshops of tomorrow!*
