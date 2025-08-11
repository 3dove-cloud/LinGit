### **B. Remote System Administration (15 minutes)**

#### **Advanced Remote System Management**

```bash
#!/bin/bash
# Advanced Remote System Administration Toolkit

echo "👨‍💼 ADVANCED REMOTE SYSTEM ADMINISTRATION"
echo "=========================================="

# Create administration directory structure
mkdir -p ~/workshop_admin/{scripts,reports,maintenance,emergency}

# Function to create system health report
generate_system_report() {
    local server=$1
    local report_file="~/workshop_admin/reports/system_report_${server}_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "📊 GENERATING SYSTEM REPORT FOR $server"
    echo "======================================="
    
    # Create comprehensive system report
    cat > "$report_file" << EOF
WORKSHOP SYSTEM HEALTH REPORT
=============================
Server: $server
Generated: $(date)
Administrator: $(whoami)

SYSTEM INFORMATION:
EOF

    # Gather system information
    ssh "$server" "echo 'Hostname: \$(hostname)'" >> "$report_file"
    ssh "$server" "echo 'OS: \$(lsb_release -d 2>/dev/null | cut -f2 || uname -s)'" >> "$report_file"
    ssh "$server" "echo 'Kernel: \$(uname -r)'" >> "$report_file"
    ssh "$server" "echo 'Architecture: \$(uname -m)'" >> "$report_file"
    ssh "$server" "echo 'Uptime: \$(uptime -p)'" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "RESOURCE UTILIZATION:" >> "$report_file"
    ssh "$server" "echo 'CPU Usage: \$(top -bn1 | grep \"Cpu(s)\" | awk \"{print \\\$2}\")'" >> "$report_file"
    ssh "$server" "free -h" >> "$report_file"
    ssh "$server" "df -h" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "NETWORK INFORMATION:" >> "$report_file"
    ssh "$server" "ip addr show | grep -E '^[0-9]|inet '" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "RUNNING PROCESSES (Top 10):" >> "$report_file"
    ssh "$server" "ps aux --sort=-%cpu | head -11" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "SYSTEM SERVICES STATUS:" >> "$report_file"
    ssh "$server" "systemctl list-units --type=service --state=running --no-pager" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "DISK USAGE BY DIRECTORY:" >> "$report_file"
    ssh "$server" "du -sh /var/log /tmp /home 2>/dev/null" >> "$report_file"
    
    echo "" >> "$report_file"
    echo "RECENT SYSTEM ERRORS:" >> "$report_file"
    ssh "$server" "journalctl --since '1 day ago' -p err --no-pager | tail -10" >> "$report_file"
    
    echo "✅ System report generated: $report_file"
    echo "📄 Report saved locally and can be viewed with: less $report_file"
}

# Function for remote maintenance operations
perform_remote_maintenance() {
    local server=$1
    
    echo "🔧 REMOTE MAINTENANCE FOR $server"
    echo "================================="
    
    echo "📋 Maintenance checklist:"
    echo "1. Update system packages"
    echo "2. Clean temporary files"
    echo "3. Check disk space"
    echo "4. Review system logs"
    echo "5. Verify service status"
    echo ""
    
    read -p "Proceed with maintenance? (y/n): " proceed
    if [ "$proceed" != "y" ]; then
        echo "❌ Maintenance cancelled"
        return
    fi
    
    # Log maintenance start
    maintenance_log="~/workshop_admin/maintenance/maintenance_${server}_$(date +%Y%m%d_%H%M%S).log"
    echo "🔧 Starting maintenance for $server at $(date)" > "$maintenance_log"
    
    # 1. Update package lists
    echo "📦 Updating package lists..."
    if ssh "$server" "sudo apt update >/dev/null 2>&1"; then
        echo "✅ Package lists updated" | tee -a "$maintenance_log"
    else
        echo "❌ Failed to update package lists" | tee -a "$maintenance_log"
    fi
    
    # 2. Clean temporary files
    echo "🧹 Cleaning temporary files..."
    temp_cleaned=$(ssh "$server" "find /tmp -type f -atime +1 2>/dev/null | wc -l")
    ssh "$server" "find /tmp -type f -atime +1 -delete 2>/dev/null"
    echo "✅ Cleaned $temp_cleaned temporary files" | tee -a "$maintenance_log"
    
    # 3. Check available updates
    echo "🔄 Checking for available updates..."
    updates_available=$(ssh "$server" "apt list --upgradable 2>/dev/null | grep -c upgradable" || echo "0")
    echo "📊 $updates_available updates available" | tee -a "$maintenance_log"
    
    # 4. Check disk space
    echo "💽 Checking disk space..."
    ssh "$server" "df -h | grep -E '9[0-9]%|100%'" | while read line; do
        echo "⚠️ High disk usage: $line" | tee -a "$maintenance_log"
    done
    
    # 5. Check system load
    echo "⚖️ Checking system performance..."
    load_avg=$(ssh "$server" "uptime | awk -F'load average:' '{print \$2}'")
    echo "📊 Current load average:$load_avg" | tee -a "$maintenance_log"
    
    echo "🎉 Maintenance completed for $server"
    echo "📄 Maintenance log: $maintenance_log"
}

# Function for emergency system response
emergency_response() {
    local server=$1
    
    echo "🚨 EMERGENCY RESPONSE FOR $server"
    echo "================================="
    
    # Quick system stabilization
    echo "🩺 Performing emergency system check..."
    
    # Check if server is responsive
    if ! ssh -o ConnectTimeout=10 "$server" 'exit' 2>/dev/null; then
        echo "❌ CRITICAL: Cannot connect to $server"
        echo "🔧 Troubleshooting steps:"
        echo "   1. Check network connectivity: ping $server"
        echo "   2. Verify SSH service is running"
        echo "   3. Check firewall settings"
        echo "   4. Contact system administrator"
        return 1
    fi
    
    echo "✅ Server is responsive"
    
    # Check critical services
    echo "🔍 Checking critical services..."
    critical_services=("ssh" "networking")
    
    for service in "${critical_services[@]}"; do
        if ssh "$server" "systemctl is-active $service >/dev/null 2>&1"; then
            echo "✅ $service: Running"
        else
            echo "❌ $service: FAILED - Attempting restart..."
            ssh "$server" "sudo systemctl restart $service"
            
            if ssh "$server" "systemctl is-active $service >/dev/null 2>&1"; then
                echo "✅ $service: Restarted successfully"
            else
                echo "🚨 $service: RESTART FAILED - Manual intervention required"
            fi
        fi
    done
    
    # Check system resources
    echo "📊 Checking system resources..."
    
    # Memory check
    memory_usage=$(ssh "$server" "free | grep Mem | awk '{printf \"%.0f\", \$3/\$2 * 100}'")
    if [ "$memory_usage" -gt 90 ]; then
        echo "🚨 CRITICAL: Memory usage is ${memory_usage}%"
        echo "🔧 Emergency action: Clearing system caches..."
        ssh "$server" "sync && echo 3 | sudo tee /proc/sys/vm/drop_caches >/dev/null"
    else
        echo "✅ Memory usage: ${memory_usage}%"
    fi
    
    # Disk space check
    disk_usage=$(ssh "$server" "df / | tail -1 | awk '{print \$5}' | sed 's/%//'")
    if [ "$disk_usage" -gt 95 ]; then
        echo "🚨 CRITICAL: Disk usage is ${disk_usage}%"
        echo "🔧 Emergency action: Cleaning temporary files..."
        ssh "$server" "find /tmp -type f -atime +1 -delete 2>/dev/null"
        ssh "$server" "journalctl --vacuum-time=7d >/dev/null 2>&1"
    else
        echo "✅ Disk usage: ${disk_usage}%"
    fi
    
    # System load check
    load_avg=$(ssh "$server" "uptime | awk '{print \$(NF-2)}' | sed 's/,//'")
    cpu_cores=$(ssh "$server" "nproc")
    
    echo "📊 Load average: $load_avg (CPU cores: $cpu_cores)"
    
    echo "🎯 Emergency response completed for $server"
}

# Function for batch operations across multiple servers
batch_operations() {
    local servers=("oracle3dove")
    local operation=$1
    
    echo "🔄 BATCH OPERATION: $operation"
    echo "=============================="
    
    for server in "${servers[@]}"; do
        echo ""
        echo "🏭 Processing $server..."
        echo "────────────────────────────"
        
        case $operation in
            "status")
                ssh "$server" "echo '✅ $server is online'; uptime"
                ;;
            "update")
                echo "📦 Updating $server..."
                ssh "$server" "sudo apt update && sudo apt upgrade -y"
                ;;
            "cleanup")
                echo "🧹 Cleaning $server..."
                ssh "$server" "find /tmp -type f -atime +1 -delete 2>/dev/null; apt autoremove -y >/dev/null 2>&1"
                ;;
            "backup")
                echo "💾 Creating backup on $server..."
                ssh "$server" "tar -czf /tmp/system_backup_\$(date +%Y%m%d_%H%M%S).tar.gz /etc/passwd /etc/group /etc/hostname 2>/dev/null"
                ;;
            *)
                echo "❌ Unknown operation: $operation"
                ;;
        esac
    done
    
    echo ""
    echo "🎉 Batch operation '$operation' completed on all servers"
}

# Main administration menu
admin_menu() {
    echo ""
    echo "👨‍💼 REMOTE ADMINISTRATION MENU"
    echo "=============================="
    echo "1) Generate system health report"
    echo "2) Perform remote maintenance"
    echo "3) Emergency system response"
    echo "4) Batch operations"
    echo "5) View administration logs"
    echo "6) Exit"
    echo ""
}

# Main program loop
while true; do
    admin_menu
    read -p "Choose operation (1-6): " choice
    
    case $choice in
        1)
            read -p "Enter server name (e.g., oracle3dove): " server
            generate_system_report "$server"
            ;;
        2)
            read -p "Enter server name: " server
            perform_remote_maintenance "$server"
            ;;
        3)
            read -p "Enter server name for emergency response: " server
            emergency_response "$server"
            ;;
        4)
            echo "Available batch operations:"
            echo "  status  - Check status of all servers"
            echo "  update  - Update all servers"
            echo "  cleanup - Clean temporary files on all servers"
            echo "  backup  - Create system backups on all servers"
            read -p "Enter operation: " operation
            batch_operations "$operation"
            ;;
        5)
            echo "📋 Recent administration activity:"
            find ~/workshop_admin -name "*.log" -exec tail -5 {} \; 2>/dev/null || echo "No logs found"
            ;;
        6)
            echo "👋 Exiting Remote Administration"
            break
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    
    read -p "Press Enter to continue..."
done
```

---

## **Part 4: Troubleshooting Remote Connections (20 minutes)**

### **A. Connection Problem Diagnosis (10 minutes)**

#### **SSH Connection Troubleshooter**

```bash
#!/bin/bash
# SSH Connection Troubleshooting Tool

echo "🔧 SSH CONNECTION TROUBLESHOOTER"
echo "==============================="

# Function to test basic connectivity
test_connectivity() {
    local host=$1
    local port=${2:-22}
    
    echo "🌐 Testing basic connectivity to $host:$port..."
    
    # Test ping
    if ping -c 3 -W 3 "$host" >/dev/null 2>&1; then
        echo "✅ Ping successful"
        ping_stats=$(ping -c 3 "$host" | tail -1)
        echo "📊 $ping_stats"
    else
        echo "❌ Ping failed - network connectivity issues"
        return 1
    fi
    
    # Test port connectivity
    echo "🔌 Testing SSH port accessibility..."
    if timeout 10 bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null; then
        echo "✅ Port $port is accessible"
    else
        echo "❌ Port $port is not accessible"
        echo "🔧 Possible causes:"
        echo "   • SSH service not running on remote server"
        echo "   • Firewall blocking connections"
        echo "   • Wrong port number"
        return 1
    fi
    
    return 0
}

# Function to test SSH authentication
test_ssh_authentication() {
    local connection=$1
    
    echo ""
    echo "🔐 Testing SSH authentication for $connection..."
    
    # Test SSH connection with timeout
    if timeout 15 ssh -o ConnectTimeout=10 -o BatchMode=yes "$connection" 'echo "SSH authentication successful"' 2>/dev/null; then
        echo "✅ SSH authentication successful"
        
        # Get remote system info
        echo "📊 Remote system information:"
        ssh "$connection" 'echo "  Hostname: $(hostname)"'
        ssh "$connection" 'echo "  User: $(whoami)"'
        ssh "$connection" 'echo "  Home: $(pwd)"'
        return 0
    else
        echo "❌ SSH authentication failed"
        
        # Detailed diagnosis
        echo "🔍 Running detailed diagnosis..."
        ssh -v -o ConnectTimeout=10 "$connection" 'exit' 2>/tmp/ssh_debug.log
        
        echo "🔧 Common authentication issues:"
        if grep -q "Permission denied" /tmp/ssh_debug.log; then
            echo "   • Wrong username or password"
            echo "   • SSH key not properly deployed"
            echo "   • SSH key permissions incorrect"
        fi
        
        if grep -q "Connection refused" /tmp/ssh_debug.log; then
            echo "   • SSH service not running"
            echo "   • Wrong port number"
        fi
        
        if grep -q "Host key verification failed" /tmp/ssh_debug.log; then
            echo "   • Host key has changed (possible security risk)"
            echo "   • Run: ssh-keygen -R $connection"
        fi
        
        return 1
    fi
}

# Function to test SSH configuration
test_ssh_config() {
    echo ""
    echo "⚙️ Testing SSH configuration..."
    
    # Check if SSH config exists
    if [ -f ~/.ssh/config ]; then
        echo "✅ SSH config file exists"
        
        # Show relevant configuration
        echo "📋 Current SSH configuration:"
        grep -A 10 "Host oracle3dove\|Host \*" ~/.ssh/config 2>/dev/null | head -15
    else
        echo "⚠️ No SSH config file found"
        echo "💡 Consider creating ~/.ssh/config for easier management"
    fi
    
    # Check SSH keys
    echo ""
    echo "🔑 SSH key status:"
    if [ -f ~/.ssh/id_rsa ]; then
        echo "✅ Private key exists: ~/.ssh/id_rsa"
        key_info=$(ssh-keygen -lf ~/.ssh/id_rsa 2>/dev/null)
        echo "📊 Key info: $key_info"
    else
        echo "❌ No private key found"
        echo "💡 Generate with: ssh-keygen -t rsa -b 4096"
    fi
    
    if [ -f ~/.ssh/id_rsa.pub ]; then
        echo "✅ Public key exists: ~/.ssh/id_rsa.pub"
    else
        echo "❌ No public key found"
    fi
    
    # Check SSH agent
    if ssh-add -l >/dev/null 2>&1; then
        echo "✅ SSH agent is running with loaded keys"
        ssh-add -l
    else
        echo "⚠️ SSH agent not running or no keys loaded"
        echo "💡 Start with: eval \$(ssh-agent -s) && ssh-add"
    fi
}

# Function to fix common SSH issues
fix_ssh_issues() {
    echo ""
    echo "🔧 SSH ISSUE REPAIR ASSISTANT"
    echo "============================="
    
    echo "🎯 Available fixes:"
    echo "1) Fix SSH key permissions"
    echo "2) Regenerate SSH keys"
    echo "3) Reset known hosts"
    echo "4) Restart SSH agent"
    echo "5) Create SSH config"
    echo "6) Deploy keys to server"
    echo ""
    
    read -p "Choose fix (1-6): " fix_choice
    
    case $fix_choice in
        1)
            echo "🔧 Fixing SSH key permissions..."
            chmod 700 ~/.ssh
            chmod 600 ~/.ssh/id_rsa* 2>/dev/null
            chmod 600 ~/.ssh/config 2>/dev/null
            chmod 644 ~/.ssh/*.pub 2>/dev/null
            echo "✅ SSH permissions fixed"
            ;;
        2)
            echo "🔧 Regenerating SSH keys..."
            read -p "This will overwrite existing keys. Continue? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
                echo "✅ New SSH keys generated"
            fi
            ;;
        3)
            echo "🔧 Resetting known hosts..."
            read -p "Enter hostname to remove: " hostname
            ssh-keygen -R "$hostname"
            echo "✅ Host removed from known hosts"
            ;;
        4)
            echo "🔧 Restarting SSH agent..."
            killall ssh-agent 2>/dev/null
            eval $(ssh-agent -s)
            ssh-add ~/.ssh/id_rsa 2>/dev/null
            echo "✅ SSH agent restarted"
            ;;
        5)
            echo "🔧 Creating basic SSH config..."
            mkdir -p ~/.ssh
            cat > ~/.ssh/config << 'EOF'
Host oracle3dove
    HostName 79.72.72.205
    User champion
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
EOF
            chmod 600 ~/.ssh/config
            echo "✅ Basic SSH config created"
            ;;
        6)
            echo "🔧 Deploying keys to server..."
            read -p "Enter connection (e.g., champion@79.72.72.205): " server
            ssh-copy-id "$server"
            echo "✅ Keys deployed to server"
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
}

# Main troubleshooting workflow
main_troubleshooting() {
    local target_host="79.72.72.205"
    local target_connection="oracle3dove"
    
    echo "🎯 Starting SSH troubleshooting for $target_connection..."
    echo ""
    
    # Step 1: Test basic connectivity
    if ! test_connectivity "$target_host"; then
        echo "🚨 Basic connectivity failed - check network and server status"
        return 1
    fi
    
    # Step 2: Test SSH authentication
    if ! test_ssh_authentication "$target_connection"; then
        echo "🚨 SSH authentication failed"
        
        # Step 3: Analyze SSH configuration
        test_ssh_config
        
        # Step 4: Offer fixes
        echo ""
        read -p "Would you like to try fixing SSH issues? (y/n): " fix_prompt
        if [ "$fix_prompt" = "y" ]; then
            fix_ssh_issues
        fi
        
        # Step 5: Retest after fixes
        echo ""
        echo "🔄 Retesting connection after fixes..."
        test_ssh_authentication "$target_connection"
    else
        echo "🎉 SSH connection is working properly!"
    fi
}

# Run main troubleshooting
main_troubleshooting

echo ""
echo "📋 TROUBLESHOOTING SUMMARY"
echo "========================="
echo "✅ SSH troubleshooting completed"
echo "📄 Debug logs saved to: /tmp/ssh_debug.log"
echo ""
echo "🔧 Additional troubleshooting commands:"
echo "   ssh -v oracle3dove           # Verbose connection test"
echo "   ssh-keygen -R hostname       # Remove host from known_hosts"
echo "   ssh-copy-id user@host        # Deploy SSH keys"
echo "   chmod 600 ~/.ssh/id_rsa     # Fix key permissions"
```

### **B. Performance Optimization (10 minutes)**

#### **SSH Performance Optimizer**

```bash
#!/bin/bash
# SSH Connection Performance Optimizer

echo "⚡ SSH PERFORMANCE OPTIMIZER"
echo "=========================="

# Function to test current connection performance
test_connection_performance() {
    local connection=$1
    
    echo "📊 Testing connection performance to $connection..."
    
    # Test 1: Command execution speed
    echo "🏃 Testing command execution speed..."
    local start_time=$(date +%s.%N)
    ssh "$connection" 'echo "Speed test"' >/dev/null 2>&1
    local end_time=$(date +%s.%N)
    local execution_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "1.0")
    
    echo "📈 Command execution time: ${execution_time}s"
    
    if (( $(echo "$execution_time < 2.0" | bc -l 2>/dev/null || echo "1") )); then
        echo "✅ Command execution speed: Good"
    else
        echo "⚠️ Command execution speed: Slow"
    fi
    
    # Test 2: File transfer speed
    echo ""
    echo "📁 Testing file transfer speed..."
    echo "test data for speed test" > /tmp/speed_test_file.txt
    
    local start_time=$(date +%s.%N)
    scp /tmp/speed_test_file.txt "$connection:/tmp/" >/dev/null 2>&1
    local end_time=$(date +%s.%N)
    local transfer_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "1.0")
    
    echo "📈 Small file transfer time: ${transfer_time}s"
    
    if (( $(echo "$transfer_time < 3.0" | bc -l 2>/dev/null || echo "1") )); then
        echo "✅ File transfer speed: Good"
    else
        echo "⚠️ File transfer speed: Slow"
    fi
    
    # Cleanup
    rm -f /tmp/speed_test_file.txt
    ssh "$connection" 'rm -f /tmp/speed_test_file.txt' 2>/dev/null
    
    # Test 3: Compression efficiency
    echo ""
    echo "🗜️ Testing connection compression..."
    
    # Create larger test file
    dd if=/dev/zero of=/tmp/large_test_file.txt bs=1024 count=100 >/dev/null 2>&1
    
    # Test without compression
    local start_time=$(date +%s.%N)
    scp -o Compression=no /tmp/large_test_file.txt "$connection:/tmp/large_test_no_compression.txt" >/dev/null 2>&1
    local end_time=$(date +%s.%N)
    local no_compression_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "5.0")
    
    # Test with compression
    local start_time=$(date +%s.%N)
    scp -o Compression=yes /tmp/large_test_file.txt "$connection:/tmp/large_test_with_compression.txt" >/dev/null 2>&1
    local end_time=$(date +%s.%N)
    local compression_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "5.0")
    
    echo "📊 Transfer without compression: ${no_compression_time}s"
    echo "📊 Transfer with compression: ${compression_time}s"
    
    if (( $(echo "$compression_time < $no_compression_time" | bc -l 2>/dev/null || echo "0") )); then
        echo "✅ Compression improves performance"
    else
        echo "⚠️ Compression may not help with this connection"
    fi
    
    # Cleanup
    rm -f /tmp/large_test_file.txt
    ssh "$connection" 'rm -f /tmp/large_test_*.txt' 2>/dev/null
}

# Function to optimize SSH configuration
optimize_ssh_config() {
    echo ""
    echo "⚙️ OPTIMIZING SSH CONFIGURATION"
    echo "==============================="
    
    # Backup current config
    if [ -f ~/.ssh/config ]; then
        cp ~/.ssh/config ~/.ssh/config.backup.$(date +%Y%m%d_%H%M%S)
        echo "💾 Current config backed up"
    fi
    
    # Create optimized SSH config
    cat > ~/.ssh/config << 'EOF'
# Optimized SSH Configuration for Workshop Empire
# ==============================================

# Global optimizations
Host *
    # Connection optimizations
    TCPKeepAlive yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    
    # Performance optimizations
    Compression yes
    CompressionLevel 6
    
    # Security optimizations
    IdentitiesOnly yes
    AddKeysToAgent yes
    
    # Connection multiplexing (reuse connections)
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600
    
    # Faster authentication
    GSSAPIAuthentication no
    UseDNS no

# Primary Workshop Server
Host oracle3dove workshop-main primary
    HostName 79.72.72.205
    User champion
    Port 22
    IdentityFile ~/.ssh/id_rsa
    
    # Performance tuning for this server
    Cipher aes128-ctr
    MACs hmac-sha2-256
    
    # Port forwarding for web services
    LocalForward 8080 localhost:80
    
    # Specific optimizations
    IPQoS lowdelay throughput

# Development environment with proxy
Host dev-workshop
    HostName 192.168.1.100
    User developer
    Port 22
    ProxyJump oracle3dove
    IdentityFile ~/.ssh/id_rsa
    
# Production with enhanced security
Host prod-workshop
    HostName 10.0.0.50
    User admin
    Port 2222
    IdentityFile ~/.ssh/id_rsa_prod
    StrictHostKeyChecking yes
    
# Emergency access configuration
Host emergency
    HostName 79.72.72.205
    User champion
    Port 22
    IdentityFile ~/.ssh/id_rsa_emergency
    ConnectTimeout 10
    ConnectionAttempts 3
EOF

    # Create socket directory for connection multiplexing
    mkdir -p ~/.ssh/sockets
    chmod 700 ~/.ssh/sockets
    
    # Set proper permissions
    chmod 600 ~/.ssh/config
    
    echo "✅ SSH configuration optimized!"
    echo ""
    echo "🎯 Optimizations applied:"
    echo "   • Connection multiplexing enabled"
    echo "   • Compression optimized"  
    echo "   • Keep-alive configured"
    echo "   • Fast ciphers selected"
    echo "   • Authentication streamlined"
}

# Function to optimize SSH keys
optimize_ssh_keys() {
    echo ""
    echo "🔑 SSH KEY OPTIMIZATION"
    echo "======================"
    
    # Check current key strength
    if [ -f ~/.ssh/id_rsa ]; then
        key_bits=$(ssh-keygen -lf ~/.ssh/id_rsa | awk '{print $1}')
        echo "📊 Current key strength: $key_bits bits"
        
        if [ "$key_bits" -lt 2048 ]; then
            echo "⚠️ Key strength is below recommended 2048 bits"
            read -p "Generate new 4096-bit key? (y/n): " generate_new
            
            if [ "$generate_new" = "y" ]; then
                # Backup old key
                mv ~/.ssh/id_rsa ~/.ssh/id_rsa.old
                mv ~/.ssh/id_rsa.pub ~/.ssh/id_rsa.pub.old
                
                # Generate new strong key
                ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-optimized" -f ~/.ssh/id_rsa -N ""
                echo "✅ New 4096-bit key generated"
                
                # Deploy to servers
                read -p "Deploy new key to oracle3dove? (y/n): " deploy_key
                if [ "$deploy_key" = "y" ]; then
                    ssh-copy-id -i ~/.ssh/id_rsa.pub oracle3dove
                    echo "✅ New key deployed"
                fi
            fi
        else
            echo "✅ Key strength is good"
        fi
    else
        echo "❌ No SSH key found"
        read -p "Generate optimized 4096-bit key? (y/n): " create_key
        
        if [ "$create_key" = "y" ]; then
            ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-optimized" -f ~/.ssh/id_rsa -N ""
            echo "✅ Optimized SSH key created"
        fi
    fi
    
    # Optimize SSH agent
    echo ""
    echo "🔄 Optimizing SSH agent..."
    
    # Kill existing agents
    pkill -u $(whoami) ssh-agent 2>/dev/null
    
    # Start optimized SSH agent
    eval $(ssh-agent -s)
    
    # Add keys with timeout
    ssh-add -t 3600 ~/.ssh/id_rsa 2>/dev/null  # 1 hour timeout
    
    echo "✅ SSH agent optimized with key timeout"
}

# Function to test and compare performance
performance_comparison() {
    local connection=$1
    
    echo ""
    echo "📊 PERFORMANCE COMPARISON"
    echo "========================"
    
    echo "🔄 Testing with current settings..."
    test_connection_performance "$connection"
    
    echo ""
    echo "⚡ Applying optimizations..."
    optimize_ssh_config
    
    echo ""
    echo "🔄 Testing with optimized settings..."
    test_connection_performance "$connection"
    
    echo ""
    echo "🎉 Performance optimization completed!"
}

# Function to create connection monitoring script
create_connection_monitor() {
    cat > ~/workshop_admin/scripts/connection_monitor.sh << 'EOF'
#!/bin/bash
# SSH Connection Performance Monitor

MONITOR_LOG="$HOME/workshop_admin/logs/connection_performance.log"
mkdir -p "$(dirname "$MONITOR_LOG")"

# Function to test connection and log performance
test_and_log() {
    local connection=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Test command execution time
    local start_time=$(date +%s.%N)
    if ssh -o ConnectTimeout=10 "$connection" 'echo "test"' >/dev/null 2>&1; then
        local end_time=$(date +%s.%N)
        local response_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "N/A")
        
        echo "[$timestamp] $connection: CONNECTED (${response_time}s)" >> "$MONITOR_LOG"
        echo "✅ $connection: Connected (${response_time}s)"
    else
        echo "[$timestamp] $connection: FAILED" >> "$MONITOR_LOG"
        echo "❌ $connection: Connection failed"
    fi
}

# Monitor multiple connections
connections=("oracle3dove")

echo "🔍 SSH Connection Monitor - $(date)"
echo "=================================="

for conn in "${connections[@]}"; do
    test_and_log "$conn"
done

echo ""
echo "📄 Recent performance log:"
tail -5 "$MONITOR_LOG" 2>/dev/null || echo "No previous logs"
EOF

    chmod +x ~/workshop_admin/scripts/connection_monitor.sh
    echo "📊 Connection monitor created: ~/workshop_admin/scripts/connection_monitor.sh"
}

# Main performance optimization workflow
main_optimization() {
    echo "🎯 Starting SSH performance optimization..."
    
    # Test current performance
    echo "📊 BASELINE PERFORMANCE TEST"
    echo "============================"
    test_connection_performance "oracle3dove"
    
    # Ask user what optimizations to apply
    echo ""
    echo "⚡ AVAILABLE OPTIMIZATIONS"
    echo "========================="
    echo "1) Optimize SSH configuration"
    echo "2) Optimize SSH keys"
    echo "3) Full optimization (config + keys)"
    echo "4) Create performance monitor"
    echo "5) Skip optimizations"
    echo ""
    
    read -p "Choose optimization (1-5): " opt_choice
    
    case $opt_choice in
        1)
            optimize_ssh_config
            echo ""
            echo "🔄 Testing optimized configuration..."
            test_connection_performance "oracle3dove"
            ;;
        2)
            optimize_ssh_keys
            ;;
        3)
            optimize_ssh_config
            optimize_ssh_keys
            echo ""
            echo "🔄 Testing fully optimized setup..."
            test_connection_performance "oracle3dove"
            ;;
        4)
            create_connection_monitor
            ~/workshop_admin/scripts/connection_monitor.sh
            ;;
        5)
            echo "⏭️ Skipping optimizations"
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    
    echo ""
    echo "📋 OPTIMIZATION SUMMARY"
    echo "======================"
    echo "✅ SSH performance optimization completed"
    echo ""
    echo "🔧 Additional performance tips:"
    echo "   • Use connection multiplexing for multiple sessions"
    echo "   • Enable compression for slow connections"
    echo "   • Use SSH keys instead of passwords"
    echo "   • Keep SSH agent running for key management"
    echo "   • Monitor connection performance regularly"
}

# Run main optimization
main_optimization
```

---

## **Part 5: Final Challenge - Remote Administration Master (15 minutes)**

### **Global Workshop Emergency Response Challenge**

```bash
#!/bin/bash
# Global Workshop Emergency Response Challenge

echo "🚨 GLOBAL WORKSHOP EMERGENCY RESPONSE CHALLENGE"
echo "=============================================="

CHALLENGE_DIR="$HOME/workshop_challenge_remote"
mkdir -p "$CHALLENGE_DIR"/{scenarios,logs,reports}

echo ""
echo "🎯 EMERGENCY SCENARIO:"
echo "Your London workshop (oracle3dove) has reported critical issues:"
echo "• System performance degraded significantly"
echo "• Some services are unresponsive"  
echo "• File synchronization has failed"
echo "• Staff cannot access shared resources"
echo ""
echo "⏰ TIME LIMIT: 15 minutes"
echo "🎖️ MISSION OBJECTIVES:"
echo "✅ 1. Establish secure connection to remote workshop"
echo "✅ 2. Diagnose system performance issues"
echo "✅ 3. Restore critical services"
echo "✅ 4. Repair file synchronization"
echo "✅ 5. Generate incident report"
echo "✅ 6. Implement preventive measures"

# Create challenge evaluation script
cat > "$CHALLENGE_DIR/evaluate_challenge.sh" << 'EOF'
#!/bin/bash
# Remote Administration Master Challenge Evaluation

echo "🏆 REMOTE ADMINISTRATION MASTER EVALUATION"
echo "=========================================="

score=0
total_possible=100

echo "📋 EVALUATING YOUR REMOTE ADMINISTRATION MASTERY..."
echo ""

# Check 1: SSH Configuration (15 points)
if [ -f ~/.ssh/config ] && grep -q "oracle3dove" ~/.ssh/config; then
    echo "✅ SSH configuration properly set up (+15 points)"
    score=$((score + 15))
else
    echo "❌ SSH configuration missing or incomplete (0 points)"
fi

# Check 2: SSH Keys (15 points)
if [ -f ~/.ssh/id_rsa ] && [ -f ~/.ssh/id_rsa.pub ]; then
    key_bits=$(ssh-keygen -lf ~/.ssh/id_rsa 2>/dev/null | awk '{print $1}')
    if [ "$key_bits" -ge 2048 ]; then
        echo "✅ Strong SSH keys configured (+15 points)"
        score=$((score + 15))
    else
        echo "⚠️ SSH keys exist but could be stronger (+10 points)"
        score=$((score + 10))
    fi
else
    echo "❌ SSH keys not properly configured (0 points)"
fi

# Check 3: Connection Testing (10 points)
if ssh -o ConnectTimeout=10 oracle3dove 'exit' 2>/dev/null; then
    echo "✅ Remote connection working (+10 points)"
    score=$((score + 10))
else
    echo "❌ Remote connection failed (0 points)"
fi

# Check 4: File Transfer Capability (15 points)
if command -v scp >/dev/null && command -v rsync >/dev/null; then
    echo "✅ File transfer tools available (+15 points)"
    score=$((score + 15))
else
    echo "⚠️ Some file transfer tools missing (+5 points)"
    score=$((score + 5))
fi

# Check 5: Service Management (15 points)
if [ -d ~/workshop_services ]; then
    echo "✅ Service management system created (+15 points)"
    score=$((score + 15))
else
    echo "❌ Service management system not found (0 points)"
fi

# Check 6: System Administration Tools (15 points)
if [ -d ~/workshop_admin ]; then
    echo "✅ Administration toolkit created (+15 points)"
    score=$((score + 15))
else
    echo "❌ Administration toolkit not found (0 points)"
fi

# Check 7: Troubleshooting Knowledge (10 points)
echo "✅ Troubleshooting procedures learned (+10 points)"
score=$((score + 10))

# Check 8: Performance Optimization (5 points)
if grep -q "ControlMaster\|Compression" ~/.ssh/config 2>/dev/null; then
    echo "✅ SSH performance optimizations applied (+5 points)"
    score=$((score + 5))
else
    echo "⚠️ Basic performance optimizations missing (+2 points)"
    score=$((score + 2))
fi

# Final evaluation
echo ""
echo "📊 FINAL EVALUATION"
echo "=================="
echo "Total Score: $score/$total_possible"
echo ""

if [ $score -ge 90 ]; then
    echo "🏆 CERTIFICATION LEVEL: EXPERT REMOTE ADMINISTRATOR"
    echo "🎉 Outstanding! You've mastered global workshop management"
    echo ""
    echo "🌟 Expert Capabilities Achieved:"
    echo "   • Secure multi-server remote access"
    echo "   • Advanced SSH configuration and optimization"
    echo "   • Professional file transfer and synchronization"
    echo "   • Comprehensive service management"
    echo "   • System administration and maintenance"
    echo "   • Emergency response procedures"
    
elif [ $score -ge 75 ]; then
    echo "🥈 CERTIFICATION LEVEL: ADVANCED REMOTE SPECIALIST"
    echo "👍 Great work! You have strong remote management skills"
    echo ""
    echo "🎯 Advanced Capabilities:"
    echo "   • Reliable remote server connectivity"
    echo "   • Effective file transfer operations"
    echo "   • Service monitoring and management"
    echo "   • Basic system administration"
    
elif [ $score -ge 60 ]; then
    echo "🥉 CERTIFICATION LEVEL: REMOTE TECHNICIAN"
    echo "👌 Good job! You understand remote administration basics"
    echo ""
    echo "📚 Areas for improvement:"
    echo "   • SSH configuration optimization"
    echo "   • Advanced troubleshooting techniques"
    echo "   • Performance tuning"
    
else
    echo "📚 CERTIFICATION LEVEL: REMOTE APPRENTICE"
    echo "🎯 Keep practicing! Review the areas you missed"
    echo ""
    echo "📖 Focus on:"
    echo "   • SSH setup and configuration"
    echo "   • Basic remote connection skills"
    echo "   • File transfer fundamentals"
fi

echo ""
echo "🚀 NEXT STEPS FOR CONTINUED MASTERY:"
echo "   • Practice with multiple remote servers"
echo "   • Learn advanced SSH tunneling techniques"
echo "   • Master automated deployment scripts"
echo "   • Study enterprise remote management tools"
EOF

chmod +x "$CHALLENGE_DIR/evaluate_challenge.sh"

# Create challenge tasks
cat > "$CHALLENGE_DIR/challenge_tasks.sh" << 'EOF'
#!/bin/bash
# Challenge Task Helper

echo "🎯 REMOTE ADMINISTRATION CHALLENGE TASKS"
echo "========================================"
echo ""
echo "📋 QUICK TASK CHECKLIST:"
echo "□ 1. Test SSH connection: ssh oracle3dove"
echo "□ 2. Check system performance: ssh oracle3dove 'top -bn1 | head -20'"
echo "□ 3. Check disk space: ssh oracle3dove 'df -h'"
echo "□ 4. Check services: ssh oracle3dove 'systemctl status ssh networking'"
echo "□ 5. Transfer test file: scp testfile.txt oracle3dove:~/"
echo "□ 6. Create system report: ssh oracle3dove 'uptime; free -h; df -h' > system_report.txt"
echo "□ 7. Fix any issues found"
echo "□ 8. Document actions taken"
echo ""
echo "⚡ SPEED COMMANDS:"
echo "ssh oracle3dove 'hostname; uptime; free -h | grep Mem; df -h /' # Quick health check"
echo "ssh oracle3dove 'systemctl is-active ssh networking systemd-resolved' # Service check"
echo "scp oracle3dove:/var/log/syslog ./syslog_backup.txt # Get logs"
echo ""
echo "🏁 When completed, run: $CHALLENGE_DIR/evaluate_challenge.sh"
EOF

chmod +x "$CHALLENGE_DIR/challenge_tasks.sh"

echo ""
echo "🚀 EMERGENCY RESPONSE CHALLENGE ACTIVATED!"
echo ""
echo "📋 Challenge Resources:"
echo "   🎯 Task checklist: $CHALLENGE_DIR/challenge_tasks.sh"
echo "   🏆 Evaluation: $CHALLENGE_DIR/evaluate_challenge.sh"
echo ""
echo "⏰ Timer starting now - you have 15 minutes!"
echo ""

# Display challenge tasks
$CHALLENGE_DIR/challenge_tasks.sh

echo ""
read -p "Press Enter when you've completed all tasks to run evaluation..."

# Run evaluation
$CHALLENGE_DIR/evaluate_challenge.sh
```

---

## **Session Wrap-Up & Global Operations Mastery (10 minutes)**

### **Visual Achievement Map**

```
🌍 YOUR GLOBAL WORKSHOP EMPIRE MASTERY
======================================

🎯 REMOTE ADMINISTRATION SKILLS MASTERED:
├── 🔐 Advanced SSH Configuration
│   ├── Key-based authentication setup
│   ├── Connection multiplexing optimization
│   ├── Performance tuning and compression
│   └── Professional configuration management
│
├── 📁 Professional File Operations
│   ├── Secure file transfer protocols
│   ├── Automated synchronization systems
│   ├── Integrity verification methods
│   └── Backup and recovery procedures
│
├── 🛠️ Remote Service Management
│   ├── Multi-server monitoring dashboards
│   ├── Automated service health checking
│   ├── Remote maintenance procedures
│   └── Emergency response protocols
│
├── 🔧 System Administration
│   ├── Remote performance monitoring
│   ├── Batch operations across servers
│   ├── System health reporting
│   └── Maintenance automation
│
└── 🚨 Troubleshooting & Recovery
    ├── Connection diagnostic procedures
    ├── Performance optimization techniques
    ├── Issue resolution workflows
    └── Preventive maintenance planning

🌟 PROFESSIONAL CAPABILITIES ACHIEVED:
✅ Manage multiple remote workshops simultaneously
✅ Secure and optimize remote connections
✅ Automate file synchronization across locations
✅ Monitor and maintain remote services
✅ Respond to emergencies from anywhere
✅ Generate professional system reports
✅ Implement preventive maintenance schedules
✅ Troubleshoot complex connectivity issues
```

### **Daily Remote Administrator Toolkit**

```bash
# Your new daily commands as Global Operations Director:
ssh oracle3dove                                    # Connect to primary workshop
~/workshop_services/scripts/service_monitor.sh     # Check all services
~/workshop_transfers/sync_monitor.sh status        # Check synchronization
~/workshop_admin/scripts/connection_monitor.sh     # Test all connections

# Emergency response commands:
ssh oracle3dove 'uptime; free -h; df -h'          # Quick health check
ssh oracle3dove 'systemctl status nginx mysql'     # Critical services
~/workshop_admin/scripts/emergency_response.sh     # Emergency procedures

# File operations:
scp important_file.txt oracle3dove:~/backup/       # Secure file transfer
rsync -avz ./local_folder/ oracle3dove:~/remote/   # Directory sync
```

### **Key Takeaways for Global Workshop Directors**

1. **Security First**: Always use key-based authentication and encrypted connections
2. **Automate Everything**: Create scripts for routine tasks and monitoring
3. **Monitor Proactively**: Set up automated alerts for issues
4. **Document Procedures**: Keep detailed logs and incident reports
5. **Optimize Performance**: Fine-tune connections for efficiency
6. **Plan for Emergencies**: Have response procedures ready
7. **Regular Maintenance**: Schedule preventive maintenance tasks

### **Next Session Preview**
*"Tomorrow we tackle the ultimate challenge - complete system troubleshooting and disaster recovery. You'll learn to handle catastrophic failures, data corruption, security breaches, and how to restore operations when everything goes wrong. Your remote administration skills become crisis management expertise!"*

---

## **Homework Assignment**

**Mission**: Set up a complete remote administration system for managing distributed workshops

**Deliverables**:
1. **SSH Infrastructure** - Optimized configuration with key-based authentication
2. **Monitoring Dashboard** - Automated service and performance monitoring  
3. **File Synchronization** - Automated backup and sync between locations
4. **Emergency Procedures** - Documented response plans for common issues
5. **Administration Scripts** - Custom tools for routine management tasks

**Success Criteria**: Can diagnose and resolve remote system issues within 10 minutes from anywhere in the world!

🎉 **Congratulations! You're now a certified Global Workshop Operations Director!** # Week 3 Session 2: Remote Administration (Enhanced)
## "Managing Your Global Workshop Empire" 🌍

### **Story Context**
*Your workshop empire has expanded globally! You now have facilities in London, Tokyo, New York, and Sydney - all operating 24/7. Flying between locations isn't practical, so today you'll master the art of remote workshop management. Think of yourself as the Global Operations Director, capable of managing any workshop anywhere in the world from your command center.*

---

## **Visual Learning: Global Workshop Network Architecture**

```
🌍 GLOBAL WORKSHOP EMPIRE NETWORK
=================================

    📱 YOUR COMMAND CENTER (Local Machine)
            ↕️ SSH Tunnels (Encrypted)
    ┌──────────────────────────────────────┐
    │  🏭 REMOTE WORKSHOPS WORLDWIDE       │
    │  ┌──────────┐  ┌──────────┐         │
    │  │ LONDON   │  │ TOKYO    │         │
    │  │ 🇬🇧 WS-1  │  │ 🇯🇵 WS-2  │         │
    │  └──────────┘  └──────────┘         │
    │  ┌──────────┐  ┌──────────┐         │
    │  │ NEW YORK │  │ SYDNEY   │         │
    │  │ 🇺🇸 WS-3  │  │ 🇦🇺 WS-4  │         │
    │  └──────────┘  └──────────┘         │
    └──────────────────────────────────────┘

🔐 SECURE CONNECTION TYPES:
├── 🔑 Password Authentication (Basic)
├── 🎫 Key-Based Authentication (Advanced)
├── 📋 Config-Based Access (Professional)
└── 🛡️ Certificate Authentication (Enterprise)

🎯 MANAGEMENT CAPABILITIES:
✅ Real-time monitoring of all locations
✅ File synchronization between workshops  
✅ Remote service management
✅ Emergency response coordination
✅ Performance optimization across regions
```

---

## **Part 1: Advanced SSH Mastery (35 minutes)**

### **A. SSH Connection Optimization (20 minutes)**

#### **Professional SSH Configuration System**

```bash
#!/bin/bash
# Advanced SSH Configuration Builder

echo "🔧 PROFESSIONAL SSH CONFIGURATION SETUP"
echo "========================================"

SSH_DIR="$HOME/.ssh"
mkdir -p "$SSH_DIR"

# Create advanced SSH configuration
cat > "$SSH_DIR/config" << 'EOF'
# Global Workshop Empire SSH Configuration
# ========================================

# Default settings for all connections
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ForwardAgent yes
    AddKeysToAgent yes
    IdentitiesOnly yes

# Primary Workshop Server (Oracle3dove)
Host oracle3dove workshop-main primary
    HostName 79.72.72.205
    User champion
    Port 22
    IdentityFile ~/.ssh/id_rsa
    LocalForward 8080 localhost:80
    RemoteForward 9090 localhost:9090
    RequestTTY yes
    
# Development Environment
Host dev-workshop
    HostName 192.168.1.100
    User developer  
    Port 22
    IdentityFile ~/.ssh/id_rsa_dev
    ProxyJump oracle3dove
    
# Production Environment  
Host prod-workshop
    HostName 10.0.0.50
    User admin
    Port 2222
    IdentityFile ~/.ssh/id_rsa_prod
    StrictHostKeyChecking yes
    UserKnownHostsFile ~/.ssh/known_hosts_prod

# Emergency Access (Different Key)
Host emergency
    HostName 79.72.72.205
    User champion
    Port 22
    IdentityFile ~/.ssh/id_rsa_emergency
    ConnectTimeout 10
EOF

chmod 600 "$SSH_DIR/config"

echo "✅ Professional SSH configuration created!"
echo ""
echo "🎯 Available Connection Shortcuts:"
echo "   ssh oracle3dove     # Primary workshop"
echo "   ssh workshop-main   # Same as above (alias)"
echo "   ssh primary         # Another alias"
echo "   ssh dev-workshop    # Development environment"
echo "   ssh prod-workshop   # Production environment"
echo "   ssh emergency       # Emergency access"
```

#### **SSH Key Management System**

```bash
#!/bin/bash
# Professional SSH Key Management

echo "🔑 SSH KEY MANAGEMENT SYSTEM"
echo "============================"

# Function to create specialized SSH keys
create_specialized_keys() {
    echo "Creating specialized SSH key pairs..."
    
    # Main production key
    if [ ! -f ~/.ssh/id_rsa ]; then
        ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-main" -f ~/.ssh/id_rsa -N ""
        echo "✅ Main production key created"
    fi
    
    # Development key
    if [ ! -f ~/.ssh/id_rsa_dev ]; then
        ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-dev" -f ~/.ssh/id_rsa_dev -N ""
        echo "✅ Development key created"
    fi
    
    # Emergency key
    if [ ! -f ~/.ssh/id_rsa_emergency ]; then
        ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)-emergency" -f ~/.ssh/id_rsa_emergency -N ""
        echo "✅ Emergency key created"
    fi
}

# Function to deploy keys to servers
deploy_keys() {
    echo ""
    echo "🚀 KEY DEPLOYMENT TO SERVERS"
    echo "============================"
    
    read -p "Deploy main key to oracle3dove? (y/n): " deploy_main
    if [ "$deploy_main" = "y" ]; then
        echo "Deploying main key..."
        ssh-copy-id -i ~/.ssh/id_rsa.pub champion@79.72.72.205
        echo "✅ Main key deployed to oracle3dove"
    fi
    
    echo ""
    echo "📊 KEY DEPLOYMENT STATUS:"
    echo "========================="
    for key in ~/.ssh/id_rsa*.pub; do
        if [ -f "$key" ]; then
            keyname=$(basename "$key" .pub)
            fingerprint=$(ssh-keygen -lf "$key" | awk '{print $2}')
            echo "🔑 $keyname: $fingerprint"
        fi
    done
}

# Function to test all connections
test_connections() {
    echo ""
    echo "🔍 TESTING ALL SSH CONNECTIONS"
    echo "=============================="
    
    # Test primary connection
    echo "Testing primary connection..."
    if ssh -o ConnectTimeout=10 oracle3dove 'echo "✅ Primary connection successful"' 2>/dev/null; then
        echo "✅ oracle3dove: CONNECTED"
    else
        echo "❌ oracle3dove: FAILED"
    fi
    
    # Test with different aliases
    for alias in workshop-main primary; do
        echo "Testing $alias..."
        if ssh -o ConnectTimeout=10 "$alias" 'exit' 2>/dev/null; then
            echo "✅ $alias: CONNECTED"
        else
            echo "❌ $alias: FAILED"
        fi
    done
}

# Execute key management
create_specialized_keys
deploy_keys
test_connections

echo ""
echo "🎉 SSH KEY MANAGEMENT COMPLETE!"
echo ""
echo "🔧 Key Management Commands:"
echo "   ssh-add -l                    # List loaded keys"
echo "   ssh-add ~/.ssh/id_rsa         # Load specific key"
echo "   ssh-keygen -lf keyfile        # Show key fingerprint"
echo "   ssh-copy-id user@server       # Deploy key to server"
```

### **B. Connection Testing and Diagnostics (15 minutes)**

#### **Advanced Connection Diagnostics**

```bash
#!/bin/bash
# SSH Connection Diagnostic Suite

echo "🔍 SSH CONNECTION DIAGNOSTIC SUITE"
echo "=================================="

# Function to test basic connectivity
test_basic_connectivity() {
    local host=$1
    echo "🌐 Testing basic connectivity to $host..."
    
    if ping -c 3 "$host" >/dev/null 2>&1; then
        echo "✅ Ping successful"
        ping_time=$(ping -c 3 "$host" | tail -1 | awk -F'/' '{print $5}')
        echo "📊 Average response time: ${ping_time}ms"
    else
        echo "❌ Ping failed - server may be down or blocking ICMP"
    fi
}

# Function to test SSH port accessibility
test_ssh_port() {
    local host=$1
    local port=${2:-22}
    echo ""
    echo "🔌 Testing SSH port accessibility..."
    
    if timeout 10 bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null; then
        echo "✅ Port $port is open on $host"
    else
        echo "❌ Port $port is not accessible on $host"
    fi
}

# Function to test SSH authentication
test_ssh_auth() {
    local connection=$1
    echo ""
    echo "🔐 Testing SSH authentication..."
    
    # Test with verbose output
    ssh -v -o ConnectTimeout=10 -o BatchMode=yes "$connection" 'echo "Authentication successful"' 2>/tmp/ssh_debug.log
    
    if [ $? -eq 0 ]; then
        echo "✅ SSH authentication successful"
        
        # Get connection details
        ssh "$connection" 'echo "🏠 Remote hostname: $(hostname)"'
        ssh "$connection" 'echo "👤 Remote user: $(whoami)"'
        ssh "$connection" 'echo "📅 Remote time: $(date)"'
        ssh "$connection" 'echo "⏱️  Remote uptime: $(uptime -p)"'
    else
        echo "❌ SSH authentication failed"
        echo "🔍 Debug information:"
        grep -E "debug1|Permission denied|Connection refused" /tmp/ssh_debug.log | tail -5
    fi
}

# Function to test connection performance
test_connection_performance() {
    local connection=$1
    echo ""
    echo "⚡ Testing connection performance..."
    
    # Test command execution speed
    echo "Testing command execution speed..."
    start_time=$(date +%s.%N)
    ssh "$connection" 'uname -a' >/dev/null 2>&1
    end_time=$(date +%s.%N)
    
    execution_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "N/A")
    echo "📊 Command execution time: ${execution_time}s"
    
    # Test data transfer speed
    echo "Testing small data transfer..."
    start_time=$(date +%s.%N)
    echo "test data" | ssh "$connection" 'cat > /tmp/speed_test.txt'
    end_time=$(date +%s.%N)
    
    transfer_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "N/A")
    echo "📊 Small data transfer time: ${transfer_time}s"
    
    # Clean up test file
    ssh "$connection" 'rm -f /tmp/speed_test.txt' 2>/dev/null
}

# Main diagnostic execution
echo "Starting comprehensive SSH diagnostics..."
echo ""

# Test the primary connection
HOST="79.72.72.205"
CONNECTION="oracle3dove"

test_basic_connectivity "$HOST"
test_ssh_port "$HOST" 22
test_ssh_auth "$CONNECTION"
test_connection_performance "$CONNECTION"

echo ""
echo "🎯 DIAGNOSTIC SUMMARY"
echo "===================="
echo "✅ Comprehensive SSH diagnostics completed"
echo "📁 Debug logs saved to: /tmp/ssh_debug.log"
echo "🔧 If issues found, check:"
echo "   • Network connectivity (ping)"
echo "   • SSH service status on remote server"
echo "   • SSH key deployment and permissions"
echo "   • Firewall settings on both ends"
```

---

## **Part 2: Professional File Transfer Operations (30 minutes)**

### **A. Advanced SCP Operations (15 minutes)**

#### **Professional File Transfer Suite**

```bash
#!/bin/bash
# Professional File Transfer Management System

echo "📁 PROFESSIONAL FILE TRANSFER SUITE"
echo "==================================="

# Create directories for organized file operations
mkdir -p ~/workshop_transfers/{incoming,outgoing,backups,logs}

# Function to log all transfer operations
log_transfer() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> ~/workshop_transfers/logs/transfer.log
}

# Function for secure file upload
secure_upload() {
    local source_file="$1"
    local destination="$2"
    local remote_path="$3"
    
    echo "📤 SECURE FILE UPLOAD"
    echo "===================="
    echo "Source: $source_file"
    echo "Destination: $destination"
    echo "Remote path: $remote_path"
    
    if [ ! -f "$source_file" ]; then
        echo "❌ Source file not found: $source_file"
        return 1
    fi
    
    # Create backup before transfer
    backup_name="$(basename "$source_file").backup.$(date +%Y%m%d_%H%M%S)"
    cp "$source_file" ~/workshop_transfers/backups/"$backup_name"
    log_transfer "BACKUP: Created backup of $source_file as $backup_name"
    
    # Calculate file checksum for verification
    local_checksum=$(sha256sum "$source_file" | awk '{print $1}')
    echo "📊 Local file checksum: $local_checksum"
    
    # Perform the transfer
    echo "🚀 Starting secure transfer..."
    if scp -p "$source_file" "$destination:$remote_path"; then
        echo "✅ Upload successful"
        
        # Verify checksum on remote side
        remote_checksum=$(ssh "$destination" "sha256sum '$remote_path/$(basename "$source_file")'" | awk '{print $1}')
        echo "📊 Remote file checksum: $remote_checksum"
        
        if [ "$local_checksum" = "$remote_checksum" ]; then
            echo "✅ File integrity verified"
            log_transfer "UPLOAD SUCCESS: $source_file to $destination:$remote_path (checksum verified)"
        else
            echo "⚠️ Checksum mismatch - file may be corrupted"
            log_transfer "UPLOAD WARNING: Checksum mismatch for $source_file"
        fi
    else
        echo "❌ Upload failed"
        log_transfer "UPLOAD FAILED: $source_file to $destination:$remote_path"
        return 1
    fi
}

# Function for secure file download
secure_download() {
    local remote_connection="$1"
    local remote_file="$2"
    local local_path="$3"
    
    echo "📥 SECURE FILE DOWNLOAD"
    echo "======================"
    echo "Remote: $remote_connection:$remote_file"
    echo "Local path: $local_path"
    
    # Check if remote file exists
    if ! ssh "$remote_connection" "test -f '$remote_file'"; then
        echo "❌ Remote file not found: $remote_file"
        return 1
    fi
    
    # Get remote file info
    remote_size=$(ssh "$remote_connection" "stat -c%s '$remote_file'")
    remote_checksum=$(ssh "$remote_connection" "sha256sum '$remote_file'" | awk '{print $1}')
    
    echo "📊 Remote file size: $(numfmt --to=iec $remote_size)"
    echo "📊 Remote file checksum: $remote_checksum"
    
    # Perform the download
    echo "🚀 Starting secure download..."
    if scp -p "$remote_connection:$remote_file" "$local_path"; then
        echo "✅ Download successful"
        
        # Verify local file
        local_checksum=$(sha256sum "$local_path/$(basename "$remote_file")" | awk '{print $1}')
        echo "📊 Local file checksum: $local_checksum"
        
        if [ "$remote_checksum" = "$local_checksum" ]; then
            echo "✅ File integrity verified"
            log_transfer "DOWNLOAD SUCCESS: $remote_connection:$remote_file to $local_path (checksum verified)"
        else
            echo "⚠️ Checksum mismatch - file may be corrupted"
            log_transfer "DOWNLOAD WARNING: Checksum mismatch for $remote_file"
        fi
    else
        echo "❌ Download failed"
        log_transfer "DOWNLOAD FAILED: $remote_connection:$remote_file to $local_path"
        return 1
    fi
}

# Function for directory synchronization
sync_directories() {
    local local_dir="$1"
    local remote_connection="$2"
    local remote_dir="$3"
    local direction="$4"  # "upload" or "download"
    
    echo "🔄 DIRECTORY SYNCHRONIZATION"
    echo "=========================="
    
    case $direction in
        "upload")
            echo "📤 Syncing $local_dir to $remote_connection:$remote_dir"
            rsync -avz --progress "$local_dir/" "$remote_connection:$remote_dir/"
            ;;
        "download")
            echo "📥 Syncing $remote_connection:$remote_dir to $local_dir"
            rsync -avz --progress "$remote_connection:$remote_dir/" "$local_dir/"
            ;;
        *)
            echo "❌ Invalid direction. Use 'upload' or 'download'"
            return 1
            ;;
    esac
    
    log_transfer "SYNC: $direction between $local_dir and $remote_connection:$remote_dir"
}

echo "🎯 File Transfer Functions Loaded!"
echo ""
echo "📋 Available Commands:"
echo "   secure_upload 'file.txt' 'oracle3dove' '/home/champion/'"
echo "   secure_download 'oracle3dove' '/home/champion/file.txt' './'"
echo "   sync_directories './local_folder' 'oracle3dove' '/home/champion/remote_folder' 'upload'"
echo ""

# Interactive transfer menu
transfer_menu() {
    echo "🎯 TRANSFER OPERATIONS MENU"
    echo "=========================="
    echo "1) Upload file to remote server"
    echo "2) Download file from remote server"
    echo "3) Sync directory to remote server"
    echo "4) Sync directory from remote server"
    echo "5) View transfer logs"
    echo "6) Exit"
    echo ""
}

while true; do
    transfer_menu
    read -p "Choose operation (1-6): " choice
    
    case $choice in
        1)
            read -p "Local file path: " local_file
            read -p "Remote connection (e.g., oracle3dove): " remote_conn
            read -p "Remote directory: " remote_dir
            secure_upload "$local_file" "$remote_conn" "$remote_dir"
            ;;
        2)
            read -p "Remote connection: " remote_conn
            read -p "Remote file path: " remote_file
            read -p "Local directory: " local_dir
            secure_download "$remote_conn" "$remote_file" "$local_dir"
            ;;
        3)
            read -p "Local directory: " local_dir
            read -p "Remote connection: " remote_conn
            read -p "Remote directory: " remote_dir
            sync_directories "$local_dir" "$remote_conn" "$remote_dir" "upload"
            ;;
        4)
            read -p "Remote connection: " remote_conn
            read -p "Remote directory: " remote_dir
            read -p "Local directory: " local_dir
            sync_directories "$local_dir" "$remote_conn" "$remote_dir" "download"
            ;;
        5)
            echo "📋 Recent Transfer Logs:"
            tail -20 ~/workshop_transfers/logs/transfer.log 2>/dev/null || echo "No logs found"
            ;;
        6)
            echo "👋 Exiting transfer operations"
            break
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    echo ""
    read -p "Press Enter to continue..."
done
```

### **B. Automated File Operations (15 minutes)**

#### **Workshop File Synchronization System**

```bash
#!/bin/bash
# Automated Workshop File Synchronization

echo "🔄 WORKSHOP FILE SYNCHRONIZATION SYSTEM"
echo "======================================="

SYNC_CONFIG="$HOME/.workshop_sync_config"
SYNC_LOG="$HOME/workshop_transfers/logs/sync.log"

# Function to create synchronization configuration
create_sync_config() {
    cat > "$SYNC_CONFIG" << 'EOF'
# Workshop Synchronization Configuration
# =====================================

# Primary workshop connection
PRIMARY_WORKSHOP="oracle3dove"

# Directories to synchronize
SYNC_DIRS=(
    "Documents::/home/champion/Documents"
    "Projects::/home/champion/Projects"
    "Scripts::/home/champion/Scripts"
    "Backups::/home/champion/Backups"
)

# Synchronization settings
SYNC_INTERVAL=3600  # Sync every hour
BACKUP_BEFORE_SYNC=true
VERIFY_CHECKSUMS=true
COMPRESS_TRANSFER=true
EOF

    echo "✅ Synchronization configuration created: $SYNC_CONFIG"
}

# Function to perform automated sync
perform_auto_sync() {
    source "$SYNC_CONFIG" 2>/dev/null || {
        echo "❌ Configuration file not found. Creating default config..."
        create_sync_config
        source "$SYNC_CONFIG"
    }
    
    echo "🔄 Starting automated synchronization..."
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] AUTO-SYNC: Starting synchronization" >> "$SYNC_LOG"
    
    for sync_pair in "${SYNC_DIRS[@]}"; do
        local_name=$(echo "$sync_pair" | cut -d':' -f1)
        remote_path=$(echo "$sync_pair" | cut -d':' -f3)
        local_path="$HOME/$local_name"
        
        echo ""
        echo "📁 Syncing $local_name..."
        
        # Check if local directory exists
        if [ ! -d "$local_path" ]; then
            echo "📂 Creating local directory: $local_path"
            mkdir -p "$local_path"
        fi
        
        # Backup before sync if enabled
        if [ "$BACKUP_BEFORE_SYNC" = "true" ]; then
            backup_name="${local_name}_backup_$(date +%Y%m%d_%H%M%S)"
            echo "💾 Creating backup: $backup_name"
            tar -czf "$HOME/workshop_transfers/backups/$backup_name.tar.gz" -C "$local_path" . 2>/dev/null
        fi
        
        # Perform synchronization
        sync_options="-av"
        [ "$COMPRESS_TRANSFER" = "true" ] && sync_options="${sync_options}z"
        
        if rsync $sync_options --progress "$local_path/" "$PRIMARY_WORKSHOP:$remote_path/"; then
            echo "✅ $local_name synchronized successfully"
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] SYNC SUCCESS: $local_name" >> "$SYNC_LOG"
        else
            echo "❌ $local_name synchronization failed"
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] SYNC FAILED: $local_name" >> "$SYNC_LOG"
        fi
    done
    
    echo ""
    echo "🎉 Automated synchronization completed!"
}

# Function to create sync monitoring script
create_sync_monitor() {
    cat > ~/workshop_transfers/sync_monitor.sh << 'EOF'
#!/bin/bash
# Workshop Synchronization Monitor

SYNC_SCRIPT="$0"
LOCK_FILE="/tmp/workshop_sync.lock"
PID_FILE="/tmp/workshop_sync.pid"

# Function to check if sync is already running
check_sync_running() {
    if [ -f "$LOCK_FILE" ]; then
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                echo "⚠️ Synchronization already running (PID: $pid)"
                return 0
            else
                echo "🧹 Cleaning up stale lock files"
                rm -f "$LOCK_FILE" "$PID_FILE"
            fi
        fi
    fi
    return 1
}

# Function to start sync daemon
start_sync_daemon() {
    if check_sync_running; then
        return 1
    fi
    
    echo "🚀 Starting synchronization daemon..."
    echo $$ > "$PID_FILE"
    touch "$LOCK_FILE"
    
    # Load configuration
    source "$HOME/.workshop_sync_config" 2>/dev/null || {
        echo "❌ Configuration not found"
        exit 1
    }
    
    while [ -f "$LOCK_FILE" ]; do
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Running scheduled sync..."
        bash -c "$(dirname "$0")/auto_sync.sh"
        
        echo "😴 Waiting $SYNC_INTERVAL seconds until next sync..."
        sleep "$SYNC_INTERVAL"
    done
    
    rm -f "$PID_FILE"
    echo "🛑 Synchronization daemon stopped"
}

# Function to stop sync daemon
stop_sync_daemon() {
    if [ -f "$LOCK_FILE" ]; then
        rm -f "$LOCK_FILE"
        echo "🛑 Stopping synchronization daemon..."
        
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat "$PID_FILE")
            kill "$pid" 2>/dev/null
            rm -f "$PID_FILE"
            echo "✅ Daemon stopped"
        fi
    else
        echo "ℹ️ No synchronization daemon running"
    fi
}

# Function to show sync status
show_sync_status() {
    echo "📊 SYNCHRONIZATION STATUS"
    echo "========================"
    
    if check_sync_running; then
        local pid=$(cat "$PID_FILE" 2>/dev/null)
        echo "✅ Status: Running (PID: $pid)"
        echo "📅 Started: $(stat -c %y "$LOCK_FILE" 2>/dev/null)"
    else
        echo "❌ Status: Stopped"
    fi
    
    echo ""
    echo "📋 Recent Sync Activity:"
    tail -10 "$HOME/workshop_transfers/logs/sync.log" 2>/dev/null || echo "No logs found"
}

# Main menu
case "${1:-menu}" in
    "start")
        start_sync_daemon
        ;;
    "stop")
        stop_sync_daemon
        ;;
    "status")
        show_sync_status
        ;;
    "menu"|*)
        echo "🎯 WORKSHOP SYNC MONITOR"
        echo "======================="
        echo "Usage: $0 {start|stop|status}"
        echo ""
        show_sync_status
        ;;
esac
EOF

    chmod +x ~/workshop_transfers/sync_monitor.sh
    echo "✅ Sync monitor created: ~/workshop_transfers/sync_monitor.sh"
}

# Initialize the synchronization system
create_sync_config
create_sync_monitor

echo ""
echo "🎯 SYNCHRONIZATION SYSTEM READY!"
echo "==============================="
echo ""
echo "📋 Available Commands:"
echo "   ~/workshop_transfers/sync_monitor.sh start    # Start auto-sync daemon"
echo "   ~/workshop_transfers/sync_monitor.sh stop     # Stop auto-sync daemon"
echo "   ~/workshop_transfers/sync_monitor.sh status   # Check sync status"
echo ""
echo "⚙️ Configuration file: $SYNC_CONFIG"
echo "📄 Sync logs: $SYNC_LOG"
echo ""
read -p "Would you like to run a test synchronization now? (y/n): " run_test

if [ "$run_test" = "y" ]; then
    perform_auto_sync
else
    echo "💡 You can run manual sync anytime with the sync monitor script"
fi
```

---

## **Part 3: Remote Service Management (30 minutes)**

### **A. Service Monitoring Dashboard (15 minutes)**

#### **Workshop Service Control Center**

```bash
#!/bin/bash
# Workshop Service Management Control Center

echo "🎛️ WORKSHOP SERVICE CONTROL CENTER"
echo "=================================="

# Create service management directory
mkdir -p ~/workshop_services/{scripts,logs,configs}

# Function to check service status across multiple servers
check_all_services() {
    local servers=("oracle3dove")
    local services=("ssh" "networking" "systemd-resolved")
    
    echo "🔍 MULTI-SERVER SERVICE STATUS CHECK"
    echo "===================================="
    
    for server in "${servers[@]}"; do
        echo ""
        echo "🏭 Checking services on $server..."
        echo "────────────────────────────────────"
        
        # Test connection first
        if ! ssh -o ConnectTimeout=5 "$server" 'exit' 2>/dev/null; then
            echo "❌ $server: CONNECTION FAILED"
            continue
        fi
        
        echo "✅ $server: Connected"
        
        # Check each service
        for service in "${services[@]}"; do
            status=$(ssh "$server" "systemctl is-active $service 2>/dev/null" || echo "unknown")
            case $status in
                "active")
                    echo "  ✅ $service: Running"
                    ;;
                "inactive"|"failed")
                    echo "  ❌ $service: Stopped/Failed"
                    ;;
                "unknown")
                    echo "  ❓ $service: Unknown/Not installed"
                    ;;
                *)
                    echo "  ⚠️  $service: $status"
                    ;;
            esac
        done
        
        # Check system resources
        echo ""
        echo "📊 System Resources:"
        ssh "$server" "echo '  💾 Memory: \$(free -h | grep Mem | awk \"{print \\\$3\"/\"\\\$2}\")'"
        ssh "$server" "echo '  💽 Disk: \$(df -h / | tail -1 | awk \"{print \\\$5}\")'"
        ssh "$server" "echo '  ⚡ Load: \$(uptime | awk -F\"load average:\" \"{print \\\$2}\")'"
    done
}

# Interactive service management
manage_services() {
    echo ""
    echo "🎛️ SERVICE MANAGEMENT MENU"
    echo "========================="
    echo "1) Start a service"
    echo "2) Stop a service"
    echo "3) Restart a service"
    echo "4) Check service status"
    echo "5) View service logs"
    echo "6) Enable service (auto-start)"
    echo "7) Disable service"
    echo "8) Back to main menu"
    echo ""
    
    read -p "Choose operation (1-8): " choice
    
    case $choice in
        1|2|3|4|5|6|7)
            read -p "Enter server name (e.g., oracle3dove): " server
            read -p "Enter service name (e.g., nginx): " service
            
            case $choice in
                1)
                    echo "🚀 Starting $service on $server..."
                    ssh "$server" "sudo systemctl start $service"
                    ;;
                2)
                    echo "🛑 Stopping $service on $server..."
                    ssh "$server" "sudo systemctl stop $service"
                    ;;
                3)
                    echo "🔄 Restarting $service on $server..."
                    ssh "$server" "sudo systemctl restart $service"
                    ;;
                4)
                    echo "🔍 Checking $service status on $server..."
                    ssh "$server" "systemctl status $service"
                    ;;
                5)
                    echo "📋 Viewing $service logs on $server..."
                    ssh "$server" "journalctl -u $service --no-pager -n 20"
                    ;;
                6)
                    echo "⚡ Enabling $service on $server..."
                    ssh "$server" "sudo systemctl enable $service"
                    ;;
                7)
                    echo "❌ Disabling $service on $server..."
                    ssh "$server" "sudo systemctl disable $service"
                    ;;
            esac
            
            # Show updated status
            echo ""
            echo "📊 Updated status:"
            ssh "$server" "systemctl is-active $service"
            ;;
        8)
            return
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
}

# Function to create service monitoring script
create_service_monitor() {
    cat > ~/workshop_services/scripts/service_monitor.sh << 'EOF'
#!/bin/bash
# Automated Service Monitoring

MONITOR_CONFIG="$HOME/workshop_services/configs/monitor.conf"
MONITOR_LOG="$HOME/workshop_services/logs/monitor.log"

# Default monitoring configuration
create_default_config() {
    cat > "$MONITOR_CONFIG" << 'CONF_EOF'
# Service Monitoring Configuration
# ================================

# Servers to monitor
SERVERS=(
    "oracle3dove"
)

# Critical services to monitor
CRITICAL_SERVICES=(
    "ssh"
    "networking"
)

# Warning services (non-critical)
WARNING_SERVICES=(
    "systemd-resolved"
    "cron"
)

# Monitoring interval (seconds)
MONITOR_INTERVAL=300

# Alert settings
ENABLE_ALERTS=true
ALERT_EMAIL=""
CONF_EOF
}

# Load configuration
load_config() {
    if [ ! -f "$MONITOR_CONFIG" ]; then
        echo "Creating default monitoring configuration..."
        create_default_config
    fi
    source "$MONITOR_CONFIG"
}

# Function to log monitoring events
log_event() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Function to send alerts (placeholder for email integration)
send_alert() {
    local severity=$1
    local message=$2
    
    log_event "ALERT [$severity]: $message"
    echo "🚨 ALERT [$severity]: $message"
    
    # Future: Email integration
    if [ "$ENABLE_ALERTS" = "true" ] && [ -n "$ALERT_EMAIL" ]; then
        # echo "$message" | mail -s "Workshop Alert [$severity]" "$ALERT_EMAIL"
        echo "📧 Alert would be sent to: $ALERT_EMAIL"
    fi
}

# Function to check individual service
check_service() {
    local server=$1
    local service=$2
    local severity=$3
    
    if ssh -o ConnectTimeout=10 "$server" "systemctl is-active $service >/dev/null 2>&1"; then
        log_event "OK: $service on $server is running"
        return 0
    else
        send_alert "$severity" "$service on $server is not running"
        return 1
    fi
}

# Main monitoring loop
run_monitoring() {
    load_config
    
    echo "🔍 Starting service monitoring..."
    log_event "MONITOR: Service monitoring started"
    
    while true; do
        echo "⏰ Running monitoring check at $(date '+%H:%M:%S')..."
        
        for server in "${SERVERS[@]}"; do
            # Test server connectivity
            if ! ssh -o ConnectTimeout=10 "$server" 'exit' 2>/dev/null; then
                send_alert "CRITICAL" "Cannot connect to server: $server"
                continue
            fi
            
            # Check critical services
            for service in "${CRITICAL_SERVICES[@]}"; do
                check_service "$server" "$service" "CRITICAL"
            done
            
            # Check warning services
            for service in "${WARNING_SERVICES[@]}"; do
                check_service "$server" "$service" "WARNING"
            done
        done
        
        echo "✅ Monitoring check completed"
        sleep "$MONITOR_INTERVAL"
    done
}

# Command line interface
case "${1:-help}" in
    "start")
        run_monitoring
        ;;
    "config")
        nano "$MONITOR_CONFIG"
        ;;
    "logs")
        tail -f "$MONITOR_LOG"
        ;;
    "status")
        if pgrep -f "service_monitor.sh start" >/dev/null; then
            echo "✅ Service monitor is running"
        else
            echo "❌ Service monitor is stopped"
        fi
        ;;
    *)
        echo "🎯 SERVICE MONITOR USAGE"
        echo "======================="
        echo "$0 start    # Start monitoring"
        echo "$0 config   # Edit configuration"
        echo "$0 logs     # View logs"
        echo "$0 status   # Check monitor status"
        ;;
esac
EOF

    chmod +x ~/workshop_services/scripts/service_monitor.sh
    echo "✅ Service monitor created: ~/workshop_services/scripts/service_monitor.sh"
}

# Execute service management setup
check_all_services
create_service_monitor

echo ""
echo "🎯 SERVICE MANAGEMENT READY!"
echo "==========================="
echo ""
echo "📋 Available Commands:"
echo "   ~/workshop_services/scripts/service_monitor.sh start    # Start monitoring"
echo "   ~/workshop_services/scripts/service_monitor.sh status   # Check status"
echo "   ~/workshop_services/scripts/service_monitor.sh logs     # View logs"
echo ""

# Interactive menu
while true; do
    echo ""
    echo "🎛️ SERVICE CONTROL CENTER MENU"
    echo "=============================="
    echo "1) Check all services status"
    echo "2) Manage individual services"
    echo "3) Start service monitoring"
    echo "4) View monitoring logs"
    echo "5) Exit"
    echo ""
    
    read -p "Choose option (1-5): " main_choice
    
    case $main_choice in
        1)
            check_all_services
            ;;
        2)
            manage_services
            ;;
        3)
            echo "🚀 Starting service monitoring in background..."
            nohup ~/workshop_services/scripts/service_monitor.sh start > /dev/null 2>&1 &
            echo "✅ Monitor started. Check status with: ~/workshop_services/scripts/service_monitor.sh status"
            ;;
        4)
            echo "📋 Recent monitoring logs:"
            tail -20 ~/workshop_services/logs/monitor.log 2>/dev/null || echo "No logs found"
            ;;
        5)
            echo "👋 Exiting Service Control Center"
            break
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    
    read -p "Press Enter to continue..."
done
