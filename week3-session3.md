# Week 3 Session 3: System Monitoring & Performance (Enhanced)
## "Workshop Performance Engineer" ⚡

### **Story Context**
*Your workshop empire now operates 24/7 with customers worldwide depending on your services. A single performance hiccup can cost thousands in revenue and customer trust. Today you become the Workshop Performance Engineer - the specialist who ensures peak performance, anticipates problems before they happen, and maintains optimal operations under any load.*

---

## **Visual Learning: System Performance Architecture**

```
🏭 WORKSHOP PERFORMANCE ECOSYSTEM
=================================

    👥 CUSTOMERS (Load Generators)
     ↕️ (Requests & Responses)
┌─────────────────────────────────┐
│  🖥️  YOUR WORKSHOP SYSTEM       │
│  ┌─────┐ ┌──────┐ ┌──────────┐ │
│  │ CPU │ │ RAM  │ │ STORAGE  │ │  📊 PERFORMANCE
│  │ ⚡  │ │ 🧠   │ │ 💾      │ │     DASHBOARD
│  └─────┘ └──────┘ └──────────┘ │
│           ↕️                    │
│      🌐 NETWORK                │  📈 Real-time Monitoring
└─────────────────────────────────┘  🚨 Alert System  
                                     📋 Performance Logs

🎯 PERFORMANCE PILLARS:
⚡ SPEED    - How fast operations complete
🧠 CAPACITY - How much work can be handled  
🔄 EFFICIENCY - Resource utilization optimization
🛡️ STABILITY - Consistent performance under load
```

---

## **Part 1: Performance Monitoring Dashboard (30 minutes)**

### **A. Real-Time System Dashboard Creation (15 minutes)**

#### **Interactive Performance Monitor**

```bash
#!/bin/bash
# Advanced Workshop Performance Dashboard

# Color codes for visual appeal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to create visual bars
create_bar() {
    local percentage=$1
    local width=20
    local filled=$((percentage * width / 100))
    local empty=$((width - filled))
    
    printf "["
    for ((i=1; i<=filled; i++)); do
        if [ $percentage -ge 90 ]; then
            printf "${RED}█${NC}"
        elif [ $percentage -ge 75 ]; then
            printf "${YELLOW}█${NC}"
        else
            printf "${GREEN}█${NC}"
        fi
    done
    for ((i=1; i<=empty; i++)); do
        printf "░"
    done
    printf "] %3d%%\n" $percentage
}

# Function to get CPU usage
get_cpu_usage() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo ${cpu_usage%.*} # Remove decimal part
}

# Function to get memory usage
get_memory_usage() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3*100/$2}')
    echo $mem_usage
}

# Function to get disk usage
get_disk_usage() {
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    echo $disk_usage
}

# Function to get network activity
get_network_activity() {
    local rx_bytes=$(cat /proc/net/dev | grep -E "eth0|ens|enp" | head -1 | awk '{print $2}')
    local tx_bytes=$(cat /proc/net/dev | grep -E "eth0|ens|enp" | head -1 | awk '{print $10}')
    echo "RX: $(numfmt --to=iec $rx_bytes 2>/dev/null || echo "N/A") TX: $(numfmt --to=iec $tx_bytes 2>/dev/null || echo "N/A")"
}

# Main dashboard function
show_dashboard() {
    clear
    
    echo -e "${CYAN}🏭 WORKSHOP PERFORMANCE DASHBOARD${NC}"
    echo -e "${CYAN}=================================${NC}"
    echo -e "📅 $(date '+%Y-%m-%d %H:%M:%S')     ⚡ Uptime: $(uptime -p)"
    echo ""
    
    # System Resources Section
    echo -e "${BLUE}📊 SYSTEM RESOURCES${NC}"
    echo -e "${BLUE}==================${NC}"
    
    # CPU Usage
    cpu_usage=$(get_cpu_usage)
    echo -n "🖥️  CPU Usage:  "
    create_bar $cpu_usage
    
    # Memory Usage
    mem_usage=$(get_memory_usage)
    echo -n "🧠 Memory:     "
    create_bar $mem_usage
    
    # Disk Usage
    disk_usage=$(get_disk_usage)
    echo -n "💾 Disk:       "
    create_bar $disk_usage
    
    echo ""
    
    # Detailed System Info
    echo -e "${PURPLE}🔍 DETAILED METRICS${NC}"
    echo -e "${PURPLE}==================${NC}"
    
    # Load Average
    load_avg=$(uptime | awk -F'load average:' '{print $2}')
    echo -e "⚖️  Load Average:$load_avg"
    
    # Memory Details
    echo -e "🧠 Memory Details:"
    free -h | grep -E "^Mem|^Swap" | while read line; do
        echo "   $line"
    done
    
    # Top Processes
    echo ""
    echo -e "${YELLOW}🏃 TOP PROCESSES (by CPU)${NC}"
    echo -e "${YELLOW}=========================${NC}"
    ps aux --sort=-%cpu | head -6 | awk '{printf "%-10s %-6s %-6s %s\n", $1, $3"%", $4"%", $11}' | column -t
    
    echo ""
    echo -e "${CYAN}🌐 Network: $(get_network_activity)${NC}"
    echo ""
    echo -e "${GREEN}Press Ctrl+C to exit, any key to refresh...${NC}"
}

# Interactive dashboard loop
echo "🚀 Starting Workshop Performance Dashboard..."
echo "⚡ Real-time monitoring beginning in 3 seconds..."
sleep 3

while true; do
    show_dashboard
    read -t 5 -n 1  # Wait 5 seconds or until key press
done
```

### **B. Performance Baseline Establishment (15 minutes)**

#### **System Performance Profiler**

```bash
#!/bin/bash
# System Performance Baseline Creator

echo "📊 WORKSHOP PERFORMANCE BASELINE CREATOR"
echo "========================================"

BASELINE_FILE="$HOME/workshop_performance_baseline.txt"
BASELINE_DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "🎯 Creating performance baseline for your workshop..."
echo "📝 This will help you understand what's 'normal' for your system"
echo ""

# Function to run performance test
run_baseline_test() {
    echo "⏱️  Running baseline performance test..."
    echo "   This may take 2-3 minutes..."
    echo ""
    
    # Create baseline report
    cat > "$BASELINE_FILE" << EOF
# Workshop Performance Baseline Report
# Generated: $BASELINE_DATE
# ====================================

## SYSTEM INFORMATION
OS: $(lsb_release -d 2>/dev/null | cut -f2 || uname -s)
Kernel: $(uname -r)
Architecture: $(uname -m)
Hostname: $(hostname)

## HARDWARE SPECS
EOF
    
    # CPU Information
    echo "Collecting CPU information..."
    echo "" >> "$BASELINE_FILE"
    echo "## CPU SPECIFICATIONS" >> "$BASELINE_FILE"
    lscpu | grep -E "^CPU\(s\)|^Model name|^CPU MHz" >> "$BASELINE_FILE"
    
    # Memory Information
    echo "Collecting memory information..."
    echo "" >> "$BASELINE_FILE"
    echo "## MEMORY SPECIFICATIONS" >> "$BASELINE_FILE"
    free -h >> "$BASELINE_FILE"
    
    # Disk Information
    echo "Collecting storage information..."
    echo "" >> "$BASELINE_FILE"
    echo "## STORAGE SPECIFICATIONS" >> "$BASELINE_FILE"
    df -h >> "$BASELINE_FILE"
    
    # Network Information
    echo "Collecting network information..."
    echo "" >> "$BASELINE_FILE"
    echo "## NETWORK CONFIGURATION" >> "$BASELINE_FILE"
    ip addr show | grep -E "^[0-9]|inet " >> "$BASELINE_FILE"
    
    # Performance Baseline Tests
    echo "" >> "$BASELINE_FILE"
    echo "## PERFORMANCE BASELINE TESTS" >> "$BASELINE_FILE"
    echo "Test Date: $BASELINE_DATE" >> "$BASELINE_FILE"
    echo "" >> "$BASELINE_FILE"
    
    # CPU Performance Test
    echo "Testing CPU performance..."
    echo "### CPU Performance Test" >> "$BASELINE_FILE"
    echo "Command: time (for i in {1..1000}; do echo \$i > /dev/null; done)" >> "$BASELINE_FILE"
    cpu_test_result=$( (time (for i in {1..1000}; do echo $i > /dev/null; done)) 2>&1 | grep real )
    echo "Result: $cpu_test_result" >> "$BASELINE_FILE"
    echo "" >> "$BASELINE_FILE"
    
    # Memory Performance Test
    echo "Testing memory performance..."
    echo "### Memory Performance Test" >> "$BASELINE_FILE"
    echo "Available Memory at Test Time:" >> "$BASELINE_FILE"
    free -m | grep "^Mem" >> "$BASELINE_FILE"
    echo "" >> "$BASELINE_FILE"
    
    # Disk I/O Test
    echo "Testing disk performance..."
    echo "### Disk I/O Performance Test" >> "$BASELINE_FILE"
    echo "Write Test (1MB file):" >> "$BASELINE_FILE"
    disk_write_result=$( (time dd if=/dev/zero of=/tmp/test_file bs=1M count=1 2>/dev/null) 2>&1 | grep real )
    echo "Write Time: $disk_write_result" >> "$BASELINE_FILE"
    
    echo "Read Test (1MB file):" >> "$BASELINE_FILE"
    disk_read_result=$( (time dd if=/tmp/test_file of=/dev/null bs=1M 2>/dev/null) 2>&1 | grep real )
    echo "Read Time: $disk_read_result" >> "$BASELINE_FILE"
    rm -f /tmp/test_file
    echo "" >> "$BASELINE_FILE"
    
    # System Load Test
    echo "Recording current system load..."
    echo "### System Load at Baseline Time" >> "$BASELINE_FILE"
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')" >> "$BASELINE_FILE"
    echo "Running Processes: $(ps aux | wc -l)" >> "$BASELINE_FILE"
    echo "" >> "$BASELINE_FILE"
    
    # Network Connectivity Test
    echo "Testing network connectivity..."
    echo "### Network Performance Test" >> "$BASELINE_FILE"
    if ping -c 3 google.com >/dev/null 2>&1; then
        ping_result=$(ping -c 3 google.com | tail -1)
        echo "Ping to google.com: $ping_result" >> "$BASELINE_FILE"
    else
        echo "Ping to google.com: Failed" >> "$BASELINE_FILE"
    fi
    echo "" >> "$BASELINE_FILE"
    
    # Top Resource Consumers at Baseline
    echo "### Top Resource Consumers" >> "$BASELINE_FILE"
    echo "Top CPU Users:" >> "$BASELINE_FILE"
    ps aux --sort=-%cpu | head -6 >> "$BASELINE_FILE"
    echo "" >> "$BASELINE_FILE"
    echo "Top Memory Users:" >> "$BASELINE_FILE"
    ps aux --sort=-%mem | head -6 >> "$BASELINE_FILE"
    
    echo "✅ Baseline test completed!"
}

# Run the baseline test
run_baseline_test

echo ""
echo "📊 BASELINE REPORT SUMMARY"
echo "========================="
echo "📁 Report saved to: $BASELINE_FILE"
echo ""
echo "🎯 Key Baseline Metrics:"
echo "   📋 System specs documented"
echo "   ⚡ CPU performance benchmarked"  
echo "   🧠 Memory usage recorded"
echo "   💾 Disk I/O speed measured"
echo "   🌐 Network connectivity tested"
echo ""
echo "💡 Use this baseline to:"
echo "   • Compare future performance"
echo "   • Identify performance degradation"
echo "   • Plan capacity upgrades"
echo "   • Troubleshoot issues"
echo ""
read -p "Press Enter to view your baseline report..."
less "$BASELINE_FILE"
```

---

## **Part 2: Advanced Performance Analysis (40 minutes)**

### **A. Interactive Performance Investigation Lab (20 minutes)**

#### **Performance Detective Workshop**

```bash
#!/bin/bash
# Performance Detective Training Scenarios

echo "🕵️ PERFORMANCE DETECTIVE WORKSHOP"
echo "================================="
echo ""
echo "🎯 Mission: Investigate different performance scenarios"
echo "📋 You'll analyze symptoms and identify root causes"
echo ""

# Function to create controlled performance scenarios
create_performance_scenarios() {
    echo "🎭 Creating training scenarios..."
    
    # Scenario 1: High CPU Usage
    cat > /tmp/cpu_stress.sh << 'EOF'
#!/bin/bash
# Controlled CPU stress for training
echo "🔥 CPU Stress Test - Will run for 30 seconds"
echo "Monitor with: htop or top"
echo "Press Ctrl+C to stop early"
timeout 30s yes > /dev/null &
CPU_PID=$!
echo "CPU stress PID: $CPU_PID"
wait $CPU_PID 2>/dev/null
echo "✅ CPU stress test completed"
EOF
    
    # Scenario 2: Memory Usage Simulation
    cat > /tmp/memory_test.sh << 'EOF'
#!/bin/bash
# Controlled memory usage for training
echo "🧠 Memory Usage Test - Will allocate 100MB for 30 seconds"
echo "Monitor with: free -h (in another terminal)"
python3 -c "
import time
data = bytearray(100 * 1024 * 1024)  # 100MB
print('Memory allocated. Check with: free -h')
print('Sleeping for 30 seconds...')
time.sleep(30)
print('Memory released')
" 2>/dev/null || {
    # Fallback if Python not available
    dd if=/dev/zero of=/tmp/memory_eater bs=1M count=100 2>/dev/null
    echo "Memory file created. Check with: free -h"
    sleep 30
    rm -f /tmp/memory_eater
    echo "Memory file removed"
}
EOF
    
    # Scenario 3: Disk I/O Test
    cat > /tmp/disk_test.sh << 'EOF'
#!/bin/bash
echo "💾 Disk I/O Test - Creating and processing files"
echo "Monitor with: iostat 1 (if available) or df -h"

# Create test files
for i in {1..5}; do
    echo "Creating test file $i..."
    dd if=/dev/zero of=/tmp/testfile_$i bs=1M count=10 2>/dev/null
    sync  # Force write to disk
done

echo "✅ Created 50MB of test files"
echo "🔍 Check disk usage: df -h /tmp"

# Clean up after 20 seconds
sleep 20
rm -f /tmp/testfile_*
echo "🧹 Cleaned up test files"
EOF
    
    chmod +x /tmp/{cpu_stress,memory_test,disk_test}.sh
    echo "✅ Training scenarios ready!"
}

# Interactive performance investigation
investigate_performance() {
    local scenario=$1
    
    echo ""
    echo "🔍 SCENARIO $scenario: PERFORMANCE INVESTIGATION"
    echo "=============================================="
    
    case $scenario in
        1)
            echo "📋 Scenario: Users report the system is running slowly"
            echo "🎯 Your task: Identify what's causing the slowdown"
            echo ""
            echo "💡 Investigation steps:"
            echo "1. Check overall system load"
            echo "2. Identify resource bottlenecks" 
            echo "3. Find the culprit process"
            echo ""
            echo "🛠️ Commands to try:"
            echo "   htop                    # Interactive process viewer"
            echo "   top                     # Classic process monitor"
            echo "   uptime                  # System load"
            echo "   ps aux --sort=-%cpu     # Top CPU consumers"
            echo ""
            read -p "Press Enter to start the CPU stress scenario..."
            /tmp/cpu_stress.sh &
            echo ""
            echo "🔥 CPU stress is now running! Open another terminal and investigate:"
            echo "   htop"
            echo "   top"
            echo "   ps aux --sort=-%cpu"
            wait
            ;;
            
        2)
            echo "📋 Scenario: System is running out of memory"
            echo "🎯 Your task: Monitor memory usage and identify memory hogs"
            echo ""
            echo "💡 Investigation steps:"
            echo "1. Check total memory usage"
            echo "2. Find processes using most memory"
            echo "3. Monitor memory in real-time"
            echo ""
            echo "🛠️ Commands to try:"
            echo "   free -h                 # Memory overview"
            echo "   ps aux --sort=-%mem     # Top memory consumers"
            echo "   watch free -h           # Real-time memory monitoring"
            echo ""
            read -p "Press Enter to start the memory test scenario..."
            /tmp/memory_test.sh &
            echo ""
            echo "🧠 Memory test running! Monitor with:"
            echo "   free -h"
            echo "   ps aux --sort=-%mem"
            wait
            ;;
            
        3)
            echo "📋 Scenario: Disk operations are very slow"
            echo "🎯 Your task: Monitor disk I/O and space usage"
            echo ""
            echo "💡 Investigation steps:"
            echo "1. Check disk space availability"
            echo "2. Monitor disk I/O activity"
            echo "3. Identify I/O intensive processes"
            echo ""
            echo "🛠️ Commands to try:"
            echo "   df -h                   # Disk space usage"
            echo "   du -sh /tmp/*           # Directory sizes"
            echo "   lsof | head -20         # Open files"
            echo ""
            read -p "Press Enter to start the disk I/O scenario..."
            /tmp/disk_test.sh &
            echo ""
            echo "💾 Disk test running! Monitor with:"
            echo "   df -h"
            echo "   du -sh /tmp/*"
            wait
            ;;
    esac
}

# Main workshop execution
create_performance_scenarios

echo "🎓 PERFORMANCE DETECTIVE TRAINING"
echo "================================="
echo ""
echo "We'll run 3 different performance scenarios."
echo "For each one, you'll practice identifying the issue."
echo ""

for scenario in 1 2 3; do
    investigate_performance $scenario
    echo ""
    echo "📊 Scenario $scenario completed!"
    echo ""
    if [ $scenario -lt 3 ]; then
        read -p "Ready for the next scenario? Press Enter to continue..."
        echo ""
    fi
done

# Cleanup
rm -f /tmp/{cpu_stress,memory_test,disk_test}.sh

echo "🎉 Performance Detective Workshop Complete!"
echo ""
echo "🏆 Skills Developed:"
echo "   ✅ System load analysis"
echo "   ✅ Resource bottleneck identification"
echo "   ✅ Process investigation techniques"
echo "   ✅ Real-time monitoring skills"
```

### **B. Automated Performance Monitoring (20 minutes)**

#### **Performance Alert System**

```bash
#!/bin/bash
# Automated Performance Monitoring System

echo "🚨 AUTOMATED PERFORMANCE MONITORING SETUP"
echo "=========================================="

MONITOR_DIR="$HOME/workshop_monitoring"
mkdir -p "$MONITOR_DIR"

# Create comprehensive monitoring script
cat > "$MONITOR_DIR/performance_monitor.sh" << 'EOF'
#!/bin/bash
# Continuous Performance Monitoring with Alerts

# Configuration
CPU_THRESHOLD=80
MEM_THRESHOLD=85
DISK_THRESHOLD=90
LOG_FILE="$HOME/workshop_monitoring/performance.log"
ALERT_FILE="$HOME/workshop_monitoring/alerts.log"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_FILE"
}

# Function to send alert
send_alert() {
    local alert_type=$1
    local message=$2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT: $alert_type - $message" >> "$ALERT_FILE"
    echo -e "${RED}🚨 ALERT: $alert_type${NC}" >&2
    echo -e "${RED}$message${NC}" >&2
}

# Function to check CPU usage
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    cpu_usage=${cpu_usage%.*}  # Remove decimal part
    
    log_message "INFO" "CPU usage: ${cpu_usage}%"
    
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        send_alert "HIGH CPU" "CPU usage is ${cpu_usage}% (threshold: ${CPU_THRESHOLD}%)"
        
        # Get top CPU consumers
        echo "Top CPU consumers:" >> "$ALERT_FILE"
        ps aux --sort=-%cpu | head -6 >> "$ALERT_FILE"
        return 1
    fi
    return 0
}

# Function to check memory usage
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3*100/$2}')
    
    log_message "INFO" "Memory usage: ${mem_usage}%"
    
    if [ "$mem_usage" -gt "$MEM_THRESHOLD" ]; then
        send_alert "HIGH MEMORY" "Memory usage is ${mem_usage}% (threshold: ${MEM_THRESHOLD}%)"
        
        # Get top memory consumers
        echo "Top memory consumers:" >> "$ALERT_FILE"
        ps aux --sort=-%mem | head -6 >> "$ALERT_FILE"
        return 1
    fi
    return 0
}

# Function to check disk usage
check_disk() {
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    log_message "INFO" "Disk usage: ${disk_usage}%"
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        send_alert "HIGH DISK" "Disk usage is ${disk_usage}% (threshold: ${DISK_THRESHOLD}%)"
        
        # Get largest directories
        echo "Largest directories:" >> "$ALERT_FILE"
        du -sh /home /var /tmp 2>/dev/null | sort -hr >> "$ALERT_FILE"
        return 1
    fi
    return 0
}

# Function to check system load
check_load() {
    local load_1min=$(uptime | awk '{print $(NF-2)}' | sed 's/,//')
    local cpu_cores=$(nproc)
    
    # Convert to integer for comparison (multiply by 100)
    local load_int=$(echo "$load_1min * 100" | bc 2>/dev/null || echo "0")
    local cores_int=$((cpu_cores * 100))
    
    log_message "INFO" "Load average (1min): $load_1min (cores: $cpu_cores)"
    
    if [ "$load_int" -gt "$cores_int" ]; then
        send_alert "HIGH LOAD" "Load average ($load_1min) exceeds CPU cores ($cpu_cores)"
        return 1
    fi
    return 0
}

# Function to perform comprehensive check
perform_check() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local status="OK"
    
    echo -e "${GREEN}🔍 Performance check at $timestamp${NC}"
    
    # Run all checks
    check_cpu || status="WARNING"
    check_memory || status="WARNING"  
    check_disk || status="WARNING"
    check_load || status="WARNING"
    
    # Log overall status
    log_message "STATUS" "System status: $status"
    
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ All systems normal${NC}"
    else
        echo -e "${YELLOW}⚠️  Performance issues detected - check alerts.log${NC}"
    fi
    
    echo "---" >> "$LOG_FILE"
    echo "---" >> "$ALERT_FILE"
}

# Main monitoring loop
echo "🚀 Starting performance monitoring..."
echo "📊 Thresholds: CPU: ${CPU_THRESHOLD}%, Memory: ${MEM_THRESHOLD}%, Disk: ${DISK_THRESHOLD}%"
echo "📝 Logs: $LOG_FILE"
echo "🚨 Alerts: $ALERT_FILE"
echo "⏰ Checking every 30 seconds. Press Ctrl+C to stop."
echo ""

# Initial check
perform_check

# Continuous monitoring
while true; do
    sleep 30
    perform_check
done
EOF

chmod +x "$MONITOR_DIR/performance_monitor.sh"

# Create performance report generator
cat > "$MONITOR_DIR/generate_report.sh" << 'EOF'
#!/bin/bash
# Performance Report Generator

REPORT_FILE="$HOME/workshop_monitoring/performance_report_$(date +%Y%m%d_%H%M).txt"
LOG_FILE="$HOME/workshop_monitoring/performance.log"
ALERT_FILE="$HOME/workshop_monitoring/alerts.log"

echo "📊 WORKSHOP PERFORMANCE REPORT" > "$REPORT_FILE"
echo "===============================" >> "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# System summary
echo "## SYSTEM SUMMARY" >> "$REPORT_FILE"
echo "Hostname: $(hostname)" >> "$REPORT_FILE"
echo "Uptime: $(uptime -p)" >> "$REPORT_FILE"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Current resource usage
echo "## CURRENT RESOURCE USAGE" >> "$REPORT_FILE"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')" >> "$REPORT_FILE"
echo "Memory Usage:" >> "$REPORT_FILE"
free -h >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "Disk Usage:" >> "$REPORT_FILE"
df -h >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Recent alerts summary
if [ -f "$ALERT_FILE" ]; then
    echo "## RECENT ALERTS (Last 24 hours)" >> "$REPORT_FILE"
    grep -A 5 "$(date -d '1 day ago' '+%Y-%m-%d')" "$ALERT_FILE" 2>/dev/null >> "$REPORT_FILE" || echo "No alerts in last 24 hours" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# Top processes
echo "## TOP RESOURCE CONSUMERS" >> "$REPORT_FILE"
echo "Top CPU:" >> "$REPORT_FILE"
ps aux --sort=-%cpu | head -6 >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "Top Memory:" >> "$REPORT_FILE"
ps aux --sort=-%mem | head -6 >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "✅ Performance report generated: $REPORT_FILE"
less "$REPORT_FILE"
EOF

chmod +x "$MONITOR_DIR/generate_report.sh"

# Create quick status checker
cat > "$MONITOR_DIR/quick_status.sh" << 'EOF'
#!/bin/bash
# Quick System Status Check

echo -e "\033[1;36m⚡ QUICK SYSTEM STATUS\033[0m"
echo -e "\033[1;36m====================\033[0m"

# CPU
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
cpu_usage=${cpu_usage%.*}
if [ "$cpu_usage" -lt 50 ]; then
    echo -e "🖥️  CPU: \033[0;32m${cpu_usage}% (Good)\033[0m"
elif [ "$cpu_usage" -lt 80 ]; then
    echo -e "🖥️  CPU: \033[1;33m${cpu_usage}% (Moderate)\033[0m"
else
    echo -e "🖥️  CPU: \033[0;31m${cpu_usage}% (High)\033[0m"
fi

# Memory
mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3*100/$2}')
if [ "$mem_usage" -lt 60 ]; then
    echo -e "🧠 Memory: \033[0;32m${mem_usage}% (Good)\033[0m"
elif [ "$mem_usage" -lt 85 ]; then
    echo -e "🧠 Memory: \033[1;33m${mem_usage}% (Moderate)\033[0m"
else
    echo -e "🧠 Memory: \033[0;31m${mem_usage}% (High)\033[0m"
fi

# Disk
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 70 ]; then
    echo -e "💾 Disk: \033[0;32m${disk_usage}% (Good)\033[0m"
elif [ "$disk_usage" -lt 90 ]; then
    echo -e "💾 Disk: \033[1;33m${disk_usage}% (Moderate)\033[0m"
else
    echo -e "💾 Disk: \033[0;31m${disk_usage}% (Critical)\033[0m"
fi

# Load average
load_avg=$(uptime | awk '{print $(NF-2)}' | sed 's/,//')
echo -e "⚖️  Load: $load_avg"

# Network test
if ping -c 1 google.com >/dev/null 2>&1; then
    echo -e "🌐 Network: \033[0;32mConnected\033[0m"
else
    echo -e "🌐 Network: \033[0;31mDisconnected\033[0m"
fi

echo ""
echo -e "\033[1;36m📊 For detailed monitoring, run: $HOME/workshop_monitoring/performance_monitor.sh\033[0m"
EOF

chmod +x "$MONITOR_DIR/quick_status.sh"

echo "✅ Automated monitoring system created!"
echo ""
echo "🛠️ Available Tools:"
echo "   📊 Quick Status:    $MONITOR_DIR/quick_status.sh"
echo "   🔄 Full Monitor:    $MONITOR_DIR/performance_monitor.sh"  
echo "   📋 Generate Report: $MONITOR_DIR/generate_report.sh"
echo ""
echo "🎯 Try the quick status check now:"
"$MONITOR_DIR/quick_status.sh"
```

---

## **Part 3: Performance Optimization Workshop (35 minutes)**

### **A. System Optimization Techniques (20 minutes)**

#### **Performance Tuning Laboratory**

```bash
#!/bin/bash
# Performance Optimization Workshop

echo "🔧 PERFORMANCE OPTIMIZATION LABORATORY"
echo "====================================="

OPTIMIZATION_LOG="$HOME/workshop_monitoring/optimization.log"

# Function to log optimization actions
log_optimization() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$OPTIMIZATION_LOG"
}

echo "🎯 We'll explore safe performance optimizations you can apply"
echo "⚠️  All changes are reversible and documented"
echo ""

# Create system optimization script
cat > ~/workshop_monitoring/optimize_system.sh << 'EOF'
#!/bin/bash
# Safe System Optimization Script

echo "🚀 SYSTEM OPTIMIZATION TOOLKIT"
echo "=============================="

# Create backup of current settings
BACKUP_DIR="$HOME/optimization_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup of current settings in $BACKUP_DIR"

# Optimization 1: System Cache Management
echo ""
echo "🧹 OPTIMIZATION 1: System Cache Management"
echo "----------------------------------------"
echo "Current memory usage:"
free -h

echo ""
echo "🤔 Would you like to clear system caches? (This frees up RAM)"
echo "   This is safe and can improve performance if memory is low"
read -p "Clear caches? (y/n): " clear_caches

if [ "$clear_caches" = "y" ]; then
    echo "Clearing page cache, dentries, and inodes..."
    sync  # Ensure all data is written to disk first
    echo 3 | sudo tee /proc/sys/vm/drop_caches >/dev/null 2>&1
    echo "✅ System caches cleared"
    echo "New memory usage:"
    free -h
else
    echo "⏭️  Skipping cache clear"
fi

# Optimization 2: Temporary File Cleanup
echo ""
echo "🧽 OPTIMIZATION 2: Temporary File Cleanup"
echo "----------------------------------------"
echo "Checking temporary files..."

temp_size=$(du -sh /tmp 2>/dev/null | cut -f1)
echo "Current /tmp size: $temp_size"

# Show what's in temp
echo "Large files in /tmp:"
find /tmp -size +10M -type f 2>/dev/null | head -5 || echo "No large files found"

echo ""
echo "🤔 Clean old temporary files (older than 3 days)?"
read -p "Clean temp files? (y/n): " clean_temp

if [ "$clean_temp" = "y" ]; then
    # Backup list of what will be removed
    find /tmp -type f -atime +3 2>/dev/null > "$BACKUP_DIR/removed_temp_files.txt"
    
    # Clean old temporary files safely
    find /tmp -type f -atime +3 -delete 2>/dev/null
    echo "✅ Old temporary files cleaned"
    
    new_temp_size=$(du -sh /tmp 2>/dev/null | cut -f1)
    echo "New /tmp size: $new_temp_size"
else
    echo "⏭️  Skipping temp cleanup"
fi

# Optimization 3: Log File Management
echo ""
echo "📋 OPTIMIZATION 3: Log File Management"
echo "------------------------------------"
echo "Checking system logs size..."

if [ -d /var/log ]; then
    log_size=$(sudo du -sh /var/log 2>/dev/null | cut -f1 || echo "Unknown")
    echo "Total log size: $log_size"
    
    echo "Largest log files:"
    sudo find /var/log -type f -size +10M 2>/dev/null | head -5 || echo "No large log files"
    
    echo ""
    echo "🤔 Clean old log files? (This is generally safe)"
    echo "   We'll clean logs older than 30 days"
    read -p "Clean old logs? (y/n): " clean_logs
    
    if [ "$clean_logs" = "y" ]; then
        echo "Cleaning old log files..."
        sudo find /var/log -name "*.log.*" -mtime +30 -delete 2>/dev/null
        sudo find /var/log -name "*.gz" -mtime +30 -delete 2>/dev/null
        echo "✅ Old log files cleaned"
    else
        echo "⏭️  Skipping log cleanup"
    fi
else
    echo "📝 /var/log not accessible or not found"
fi

# Optimization 4: Package Cache Cleanup
echo ""
echo "📦 OPTIMIZATION 4: Package Cache Cleanup"
echo "---------------------------------------"
cache_size=$(du -sh /var/cache/apt/archives 2>/dev/null | cut -f1 || echo "Unknown")
echo "Package cache size: $cache_size"

echo ""
echo "🤔 Clean package cache? (Removes downloaded .deb files)"
echo "   This is safe and frees disk space"
read -p "Clean package cache? (y/n): " clean_cache

if [ "$clean_cache" = "y" ]; then
    echo "Cleaning package cache..."
    sudo apt clean >/dev/null 2>&1
    sudo apt autoremove -y >/dev/null 2>&1
    echo "✅ Package cache cleaned"
    
    new_cache_size=$(du -sh /var/cache/apt/archives 2>/dev/null | cut -f1 || echo "Unknown")
    echo "New cache size: $new_cache_size"
else
    echo "⏭️  Skipping package cache cleanup"
fi

# Optimization 5: Process Optimization Check
echo ""
echo "🏃 OPTIMIZATION 5: Process Analysis"
echo "==================================="
echo "Analyzing running processes..."

echo "Top CPU consumers:"
ps aux --sort=-%cpu | head -6

echo ""
echo "Processes running for a long time:"
ps -eo pid,ppid,cmd,etime --sort=etime | tail -6

echo ""
echo "💡 RECOMMENDATIONS:"
echo "   • Check if any processes are consuming too much CPU"
echo "   • Consider if any long-running processes are necessary"
echo "   • Use 'kill PID' to stop unnecessary processes"

# Summary report
echo ""
echo "📊 OPTIMIZATION SUMMARY"
echo "======================"
echo "✅ Optimization completed at $(date)"
echo "📁 Settings backup saved to: $BACKUP_DIR"
echo ""
echo "📈 Performance improvements applied:"
[ "$clear_caches" = "y" ] && echo "   • System caches cleared"
[ "$clean_temp" = "y" ] && echo "   • Temporary files cleaned"
[ "$clean_logs" = "y" ] && echo "   • Old log files removed"
[ "$clean_cache" = "y" ] && echo "   • Package cache cleaned"
echo ""
echo "🔄 To undo changes: Check backup directory for restore information"
echo "📊 Monitor performance: ~/workshop_monitoring/quick_status.sh"
EOF

chmod +x ~/workshop_monitoring/optimize_system.sh

echo "🛠️ Performance optimization toolkit ready!"
echo ""
echo "🎯 Optimization Tools Created:"
echo "   🚀 System Optimizer: ~/workshop_monitoring/optimize_system.sh"
echo "   📊 Quick Status: ~/workshop_monitoring/quick_status.sh"
echo "   🔍 Performance Monitor: ~/workshop_monitoring/performance_monitor.sh"
echo ""
echo "⚠️ IMPORTANT: Always backup before optimizing!"
echo ""
read -p "Would you like to run the system optimizer now? (y/n): " run_optimizer

if [ "$run_optimizer" = "y" ]; then
    ~/workshop_monitoring/optimize_system.sh
else
    echo "💡 You can run it later with: ~/workshop_monitoring/optimize_system.sh"
fi
```

### **B. Performance Troubleshooting Scenarios (15 minutes)**

#### **Real-World Problem Solving Workshop**

```bash
#!/bin/bash
# Performance Troubleshooting Scenarios

echo "🚨 PERFORMANCE TROUBLESHOOTING SCENARIOS"
echo "========================================"

# Create troubleshooting guide
cat > ~/workshop_monitoring/troubleshooting_guide.sh << 'EOF'
#!/bin/bash
# Interactive Performance Troubleshooting Guide

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 PERFORMANCE TROUBLESHOOTING GUIDE${NC}"
echo -e "${BLUE}====================================${NC}"

# Function to show troubleshooting flowchart
show_flowchart() {
    echo ""
    echo -e "${YELLOW}🗺️ PERFORMANCE TROUBLESHOOTING FLOWCHART${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo "System Running Slowly?"
    echo "         ↓"
    echo "    Check Overall Load"
    echo "    (uptime, htop)"
    echo "         ↓"
    echo "┌────────────────────┐"
    echo "│ High CPU Usage?    │ → Find process: ps aux --sort=-%cpu"
    echo "│ High Memory Usage? │ → Find process: ps aux --sort=-%mem"  
    echo "│ High Disk Usage?   │ → Check space: df -h, du -sh /*"
    echo "│ Network Issues?    │ → Test: ping, nslookup"
    echo "└────────────────────┘"
    echo "         ↓"
    echo "  Apply Appropriate Fix"
    echo ""
}

# Scenario-based troubleshooting
troubleshoot_scenario() {
    local scenario=$1
    
    case $scenario in
        1)
            echo -e "${RED}🚨 SCENARIO 1: System Extremely Slow${NC}"
            echo "=================================="
            echo "Problem: Users report everything takes forever to load"
            echo ""
            echo -e "${BLUE}🔍 Investigation Steps:${NC}"
            echo "1. Check system load:"
            echo "   uptime"
            uptime
            echo ""
            echo "2. Check CPU usage:"
            echo "   top -bn1 | head -10"
            top -bn1 | head -10
            echo ""
            echo "3. Find CPU-intensive processes:"
            echo "   ps aux --sort=-%cpu | head -6"
            ps aux --sort=-%cpu | head -6
            echo ""
            echo -e "${GREEN}💡 Solution Approaches:${NC}"
            echo "• If load > CPU cores: Kill unnecessary processes"
            echo "• If specific process high CPU: Investigate/restart it"
            echo "• If all processes normal: Check for I/O wait issues"
            ;;
            
        2)
            echo -e "${RED}🚨 SCENARIO 2: Out of Memory Errors${NC}"
            echo "================================="
            echo "Problem: Applications crashing with 'out of memory' errors"
            echo ""
            echo -e "${BLUE}🔍 Investigation Steps:${NC}"
            echo "1. Check memory usage:"
            echo "   free -h"
            free -h
            echo ""
            echo "2. Find memory-hungry processes:"
            echo "   ps aux --sort=-%mem | head -6"
            ps aux --sort=-%mem | head -6
            echo ""
            echo "3. Check for memory leaks:"
            echo "   Monitor same process over time with: watch 'ps aux | grep processname'"
            echo ""
            echo -e "${GREEN}💡 Solution Approaches:${NC}"
            echo "• Close unnecessary applications"
            echo "• Restart memory-leaking processes"
            echo "• Clear system caches: echo 3 > /proc/sys/vm/drop_caches"
            echo "• Add swap space if needed"
            ;;
            
        3)
            echo -e "${RED}🚨 SCENARIO 3: Disk Space Full${NC}"
            echo "============================="
            echo "Problem: System reports 'No space left on device'"
            echo ""
            echo -e "${BLUE}🔍 Investigation Steps:${NC}"
            echo "1. Check disk usage by filesystem:"
            echo "   df -h"
            df -h
            echo ""
            echo "2. Find largest directories:"
            echo "   du -sh /* 2>/dev/null | sort -hr | head -10"
            echo "   (This may take a moment...)"
            timeout 10s sudo du -sh /* 2>/dev/null | sort -hr | head -10 || echo "   (Command timed out - run manually for full results)"
            echo ""
            echo "3. Find large files:"
            echo "   find / -size +100M -type f 2>/dev/null | head -10"
            timeout 10s find /home -size +50M -type f 2>/dev/null | head -5 || echo "   (Limited search in /home - expand as needed)"
            echo ""
            echo -e "${GREEN}💡 Solution Approaches:${NC}"
            echo "• Clean temporary files: rm -rf /tmp/*"
            echo "• Clean package cache: sudo apt clean"
            echo "• Remove old log files: sudo find /var/log -name '*.log.*' -mtime +30 -delete"
            echo "• Archive or delete large unnecessary files"
            ;;
            
        4)
            echo -e "${RED}🚨 SCENARIO 4: Network Performance Issues${NC}"
            echo "========================================"
            echo "Problem: Slow internet, timeouts, connection drops"
            echo ""
            echo -e "${BLUE}🔍 Investigation Steps:${NC}"
            echo "1. Test basic connectivity:"
            echo "   ping -c 5 google.com"
            if ping -c 3 google.com >/dev/null 2>&1; then
                echo "   ✅ Basic connectivity: OK"
                ping_time=$(ping -c 3 google.com | tail -1 | awk -F'/' '{print $5}')
                echo "   Average response time: ${ping_time}ms"
            else
                echo "   ❌ Basic connectivity: FAILED"
            fi
            echo ""
            echo "2. Test DNS resolution:"
            echo "   nslookup google.com"
            nslookup google.com | head -5
            echo ""
            echo "3. Check network interfaces:"
            echo "   ip addr show"
            ip addr show | grep -E "^[0-9]|inet "
            echo ""
            echo -e "${GREEN}💡 Solution Approaches:${NC}"
            echo "• If ping fails: Check network cables, WiFi connection"
            echo "• If DNS fails: Change DNS servers (8.8.8.8, 1.1.1.1)"
            echo "• If interface down: sudo ip link set interface up"
            echo "• Restart networking: sudo systemctl restart networking"
            ;;
    esac
    
    echo ""
    echo "═══════════════════════════════════════════════"
    echo ""
}

# Main interactive menu
show_menu() {
    echo -e "${GREEN}🎯 Choose a troubleshooting scenario to practice:${NC}"
    echo ""
    echo "1) System Extremely Slow (High CPU/Load)"
    echo "2) Out of Memory Errors"  
    echo "3) Disk Space Full"
    echo "4) Network Performance Issues"
    echo "5) Show Troubleshooting Flowchart"
    echo "6) Exit"
    echo ""
}

# Main program loop
while true; do
    show_menu
    read -p "Enter your choice (1-6): " choice
    echo ""
    
    case $choice in
        1|2|3|4)
            troubleshoot_scenario $choice
            read -p "Press Enter to continue..."
            clear
            ;;
        5)
            show_flowchart
            read -p "Press Enter to continue..."
            clear
            ;;
        6)
            echo -e "${GREEN}🎉 Troubleshooting practice complete!${NC}"
            echo "💡 Remember: Always investigate before acting!"
            break
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
            sleep 2
            clear
            ;;
    esac
done
EOF

chmod +x ~/workshop_monitoring/troubleshooting_guide.sh

echo "🔧 Performance troubleshooting guide created!"
echo ""
echo "🎯 Launch interactive troubleshooting practice:"
echo "   ~/workshop_monitoring/troubleshooting_guide.sh"
echo ""
read -p "Would you like to start troubleshooting practice now? (y/n): " start_practice

if [ "$start_practice" = "y" ]; then
    ~/workshop_monitoring/troubleshooting_guide.sh
else
    echo "💡 You can start practice anytime with:"
    echo "   ~/workshop_monitoring/troubleshooting_guide.sh"
fi
```

---

## **Part 4: Final Challenge - Performance Master Certification (15 minutes)**

### **Comprehensive Performance Challenge**

```bash
#!/bin/bash
# Performance Master Certification Challenge

echo "🏆 PERFORMANCE MASTER CERTIFICATION CHALLENGE"
echo "=============================================="

CHALLENGE_DIR="$HOME/performance_challenge"
mkdir -p "$CHALLENGE_DIR"

echo ""
echo "🎯 CHALLENGE MISSION:"
echo "Your workshop is experiencing performance issues during peak hours."
echo "You have 15 minutes to:"
echo ""
echo "✅ 1. Establish current performance baseline"
echo "✅ 2. Set up automated monitoring with alerts"
echo "✅ 3. Identify and resolve 3 simulated issues"
echo "✅ 4. Create a performance optimization plan"
echo "✅ 5. Document your findings and solutions"
echo ""
echo "🏁 SUCCESS CRITERIA:"
echo "   • Monitoring system running with proper thresholds"
echo "   • All simulated issues identified and resolved"
echo "   • Optimization recommendations documented"
echo "   • Performance baseline established"
echo ""

# Create challenge evaluation script
cat > "$CHALLENGE_DIR/evaluate_challenge.sh" << 'EOF'
#!/bin/bash
# Challenge Evaluation Script

echo "🏆 PERFORMANCE MASTER CERTIFICATION EVALUATION"
echo "=============================================="

score=0
total_checks=8

echo "📋 EVALUATING YOUR PERFORMANCE MASTERY..."
echo ""

# Check 1: Baseline established
if [ -f "$HOME/workshop_performance_baseline.txt" ]; then
    echo "✅ Performance baseline established (+10 points)"
    score=$((score + 10))
else
    echo "❌ Performance baseline missing (0 points)"
fi

# Check 2: Monitoring system
if [ -f "$HOME/workshop_monitoring/performance_monitor.sh" ]; then
    echo "✅ Monitoring system created (+15 points)"
    score=$((score + 15))
else
    echo "❌ Monitoring system missing (0 points)"
fi

# Check 3: Quick status tool
if [ -f "$HOME/workshop_monitoring/quick_status.sh" ]; then
    echo "✅ Quick status tool available (+10 points)"
    score=$((score + 10))
else
    echo "❌ Quick status tool missing (0 points)"
fi

# Check 4: Optimization tools
if [ -f "$HOME/workshop_monitoring/optimize_system.sh" ]; then
    echo "✅ System optimization tools created (+15 points)"
    score=$((score + 15))
else
    echo "❌ Optimization tools missing (0 points)"
fi

# Check 5: Troubleshooting guide
if [ -f "$HOME/workshop_monitoring/troubleshooting_guide.sh" ]; then
    echo "✅ Troubleshooting guide available (+10 points)"
    score=$((score + 10))
else
    echo "❌ Troubleshooting guide missing (0 points)"
fi

# Check 6: Log files exist (monitoring was run)
if [ -f "$HOME/workshop_monitoring/performance.log" ]; then
    echo "✅ Performance monitoring logs found (+10 points)"
    score=$((score + 10))
else
    echo "❌ No monitoring logs found (0 points)"
fi

# Check 7: Can demonstrate system status
echo ""
echo "🔍 LIVE SYSTEM CHECK:"
if command -v htop >/dev/null 2>&1; then
    echo "✅ Advanced monitoring tools available (+10 points)"
    score=$((score + 10))
else
    echo "⚠️ Basic monitoring only (5 points)"
    score=$((score + 5))
fi

# Check 8: Performance knowledge demonstration
echo "✅ Successfully completed training scenarios (+10 points)"
score=$((score + 10))

# Final evaluation
echo ""
echo "📊 FINAL EVALUATION"
echo "=================="
echo "Total Score: $score/100"
echo ""

if [ $score -ge 90 ]; then
    echo "🏆 CERTIFICATION LEVEL: EXPERT PERFORMANCE ENGINEER"
    echo "🎉 Outstanding! You've mastered all aspects of performance monitoring"
elif [ $score -ge 75 ]; then
    echo "🥈 CERTIFICATION LEVEL: ADVANCED PERFORMANCE SPECIALIST" 
    echo "👍 Great work! You have strong performance management skills"
elif [ $score -ge 60 ]; then
    echo "🥉 CERTIFICATION LEVEL: PERFORMANCE TECHNICIAN"
    echo "👌 Good job! You understand performance basics well"
else
    echo "📚 CERTIFICATION LEVEL: PERFORMANCE APPRENTICE"
    echo "🎯 Keep practicing! Review the areas you missed"
fi

echo ""
echo "📋 PERFORMANCE MASTER SKILLS ACHIEVED:"
[ -f "$HOME/workshop_performance_baseline.txt" ] && echo "   • System baseline analysis"
[ -f "$HOME/workshop_monitoring/performance_monitor.sh" ] && echo "   • Automated monitoring setup"  
[ -f "$HOME/workshop_monitoring/optimize_system.sh" ] && echo "   • System optimization techniques"
[ -f "$HOME/workshop_monitoring/troubleshooting_guide.sh" ] && echo "   • Systematic troubleshooting"
echo "   • Real-time performance analysis"
echo "   • Resource bottleneck identification"
echo "   • Performance alert configuration"
echo "   • System health assessment"

echo ""
echo "🚀 NEXT STEPS FOR CONTINUED MASTERY:"
echo "   • Practice with real-world performance issues"
echo "   • Learn advanced monitoring tools (Prometheus, Grafana)"
echo "   • Study system tuning for specific applications"
echo "   • Explore capacity planning techniques"
EOF

chmod +x "$CHALLENGE_DIR/evaluate_challenge.sh"

echo "⏰ CHALLENGE TIMER STARTING..."
echo "You have 15 minutes to complete all tasks!"
echo ""
echo "🎯 QUICK TASK CHECKLIST:"
echo "1. Run baseline: ~/workshop_monitoring/performance_monitor.sh (background)"
echo "2. Test monitoring: ~/workshop_monitoring/quick_status.sh" 
echo "3. Practice scenarios: ~/workshop_monitoring/troubleshooting_guide.sh"
echo "4. Run optimization: ~/workshop_monitoring/optimize_system.sh"
echo "5. Generate report: ~/workshop_monitoring/generate_report.sh"
echo ""
echo "🏁 When finished, evaluate with:"
echo "   $CHALLENGE_DIR/evaluate_challenge.sh"
echo ""

read -p "Ready to start the challenge? Press Enter to begin..."

# Challenge timer
{
    sleep 900  # 15 minutes
    echo ""
    echo "⏰ TIME'S UP! Challenge period completed."
    echo "🎯 Run evaluation: $CHALLENGE_DIR/evaluate_challenge.sh"
} &

echo "🚀 Challenge started! Good luck, Performance Master!"
echo ""
echo "💡 TIP: Use multiple terminals to monitor while working"
echo "📊 All your tools are in: ~/workshop_monitoring/"
```

---

## **Session Wrap-Up & Mastery Summary (10 minutes)**

### **Visual Achievement Map**

```
🏆 YOUR PERFORMANCE ENGINEERING MASTERY
=======================================

🔧 SKILLS MASTERED TODAY:
├── 📊 Real-time Performance Monitoring
│   ├── Interactive dashboard creation
│   ├── System resource analysis  
│   └── Performance baseline establishment
│
├── 🚨 Automated Alert Systems
│   ├── Threshold-based monitoring
│   ├── Alert notification setup
│   └── Performance log analysis
│
├── 🔍 Performance Investigation
│   ├── Bottleneck identification
│   ├── Root cause analysis
│   └── Systematic troubleshooting
│
├── ⚡ System Optimization
│   ├── Resource cleanup techniques
│   ├── Performance tuning methods
│   └── Capacity planning basics
│
└── 📋 Professional Documentation
    ├── Performance report generation
    ├── Troubleshooting guides
    └── Optimization documentation

🎯 PROFESSIONAL CAPABILITIES GAINED:
✅ Monitor system performance proactively
✅ Set up automated alerting systems
✅ Identify performance bottlenecks quickly
✅ Apply systematic troubleshooting methods
✅ Optimize system resources effectively
✅ Document performance issues professionally
✅ Plan capacity and predict scaling needs
✅ Respond to performance emergencies
```

### **Daily Performance Engineer Toolkit**

```bash
# Your new daily commands as Performance Engineer:
~/workshop_monitoring/quick_status.sh           # Morning system check
~/workshop_monitoring/performance_monitor.sh    # Continuous monitoring  
~/workshop_monitoring/generate_report.sh        # Weekly performance report
~/workshop_monitoring/optimize_system.sh        # Monthly optimization
~/workshop_monitoring/troubleshooting_guide.sh  # Emergency response guide

# Performance investigation commands:
htop                    # Interactive system monitor
free -h                 # Memory usage check
df -h                   # Disk space monitoring
uptime                  # System load analysis
ps aux --sort=-%cpu     # Find CPU-intensive processes
ps aux --sort=-%mem     # Find memory-hungry processes
```

### **Key Takeaways for Workshop Performance Engineers**

1. **Proactive Monitoring**: Prevention is better than crisis response
2. **Baseline Understanding**: Know what "normal" looks like for your systems
3. **Systematic Investigation**: Follow logical troubleshooting procedures  
4. **Documentation Discipline**: Record findings and solutions for future reference
5. **Continuous Optimization**: Regular maintenance keeps systems running efficiently
6. **Alert Configuration**: Set appropriate thresholds to catch issues early
7. **Resource Planning**: Monitor trends to predict capacity needs

### **Next Session Preview**
*"Tomorrow we face the ultimate challenge - system emergencies and disaster recovery. You'll learn to handle the worst-case scenarios: complete system failures, data corruption, security breaches, and how to restore operations when everything goes wrong. Your performance engineering skills become crisis management expertise!"*

---

## **Homework Assignment**

**Mission**: Set up a complete performance monitoring system on your personal/practice environment

**Deliverables**:
1. **Performance Baseline Report** - Document your system's normal performance
2. **Monitoring Dashboard** - Running automated monitoring with alerts
3. **Optimization Plan** - Specific improvements for your system
4. **Emergency Playbook** - Step-by-step procedures for common performance issues

**Success Criteria**: Can identify and resolve performance issues within 5 minutes of detection!

🎉 **Congratulations! You're now a certified Workshop Performance Engineer!**
echo
