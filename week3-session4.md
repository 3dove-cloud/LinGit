# Main data recovery execution
echo "🎯 Starting emergency data recovery procedures..."

echo ""
echo "📋 DATA RECOVERY WORKFLOW"
echo "========================="
echo "1. Assess data loss situation"
echo "2. Create emergency backup of accessible data"
echo "3. Scan for recoverable data"
echo "4. Execute emergency recovery"
echo ""

read -p "Press Enter to start data loss assessment..."
assess_data_loss

read -p "Press Enter to create emergency backup..."
if create_emergency_backup; then
    echo "✅ Emergency backup completed successfully"
else
    echo "⚠️ Emergency backup had issues - continuing with recovery"
fi

read -p "Press Enter to scan for recoverable data..."
scan_recoverable_data

read -p "Press Enter to execute emergency data recovery..."
recover_data_emergency

echo ""
echo "🎉 EMERGENCY DATA RECOVERY COMPLETED"
echo "==================================="
echo "📁 All recovery data saved in: $CRISIS_DIR/data_recovery/"
echo "🔍 Review recovered files and verify integrity"
echo "📋 Document what was recovered in incident report"
```

### **B. Automated Backup Systems (15 minutes)**

#### **Professional Backup Infrastructure**

```bash
#!/bin/bash
# Professional Automated Backup System

echo "🔄 PROFESSIONAL AUTOMATED BACKUP SYSTEM"
echo "======================================="

mkdir -p "$CRISIS_DIR/backup_system"/{configs,schedules,logs,archives}

# Function to create backup configuration
create_backup_configuration() {
    echo "⚙️ CREATING BACKUP CONFIGURATION"
    echo "==============================="
    
    local config_file="$CRISIS_DIR/backup_system/configs/backup_config.conf"
    
    cat > "$config_file" << 'EOF'
# Professional Backup System Configuration
# ========================================

# Backup Destinations
BACKUP_ROOT="/home/$(whoami)/crisis_management/backup_system/archives"
REMOTE_BACKUP_HOST=""  # Optional: remote backup server
REMOTE_BACKUP_PATH=""  # Optional: remote backup path

# Backup Sources (add/remove as needed)
BACKUP_SOURCES=(
    "/home/$(whoami)/Documents"
    "/home/$(whoami)/Desktop"
    "/home/$(whoami)/.ssh"
    "/home/$(whoami)/.bashrc"
    "/home/$(whoami)/.gitconfig"
    "/home/$(whoami)/crisis_management"
    "/etc/hosts"
    "/etc/passwd"
    "/etc/group"
)

# Backup Types
INCREMENTAL_BACKUP=true
FULL_BACKUP_FREQUENCY=7  # Days between full backups
BACKUP_RETENTION=30      # Days to keep backups

# Backup Schedule
DAILY_BACKUP_TIME="02:00"
WEEKLY_BACKUP_DAY="Sunday"
MONTHLY_BACKUP_DATE=1

# Compression and Encryption
ENABLE_COMPRESSION=true
COMPRESSION_LEVEL=6
ENABLE_ENCRYPTION=false  # Set to true for production
ENCRYPTION_KEY_FILE=""   # Path to encryption key

# Logging
BACKUP_LOG_LEVEL="INFO"  # DEBUG, INFO, WARN, ERROR
BACKUP_LOG_RETENTION=90  # Days to keep logs

# Notifications
ENABLE_EMAIL_NOTIFICATIONS=false
NOTIFICATION_EMAIL=""
ENABLE_SUCCESS_NOTIFICATIONS=false
ENABLE_FAILURE_NOTIFICATIONS=true

# Performance Settings
BACKUP_NICE_LEVEL=10     # Lower priority (0-20)
MAX_BACKUP_PROCESSES=2   # Parallel backup jobs
BANDWIDTH_LIMIT=""       # Optional: limit bandwidth (e.g., "1000k")
EOF

    echo "✅ Backup configuration created: $config_file"
    
    # Make config secure
    chmod 600 "$config_file"
    
    echo ""
    echo "📋 CONFIGURATION SUMMARY:"
    echo "========================"
    echo "• Backup location: $CRISIS_DIR/backup_system/archives/"
    echo "• Incremental backups enabled"
    echo "• Retention: 30 days"
    echo "• Compression: Enabled"
    echo "• Schedule: Daily at 02:00"
}

# Function to create backup scripts
create_backup_scripts() {
    echo ""
    echo "📝 CREATING BACKUP SCRIPTS"
    echo "=========================="
    
    # Main backup script
    cat > "$CRISIS_DIR/backup_system/backup_manager.sh" << 'EOF'
#!/bin/bash
# Professional Backup Manager

SCRIPT_DIR="$(dirname "$0")"
CONFIG_FILE="$SCRIPT_DIR/configs/backup_config.conf"
LOG_DIR="$SCRIPT_DIR/logs"
LOCK_FILE="/tmp/backup_manager.lock"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
    else
        echo -e "${RED}Error: Configuration file not found: $CONFIG_FILE${NC}"
        exit 1
    fi
}

# Logging function
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_file="$LOG_DIR/backup_$(date +%Y%m%d).log"
    
    mkdir -p "$LOG_DIR"
    echo "[$timestamp] [$level] $message" >> "$log_file"
    
    case $level in
        "ERROR")
            echo -e "${RED}[$timestamp] [ERROR] $message${NC}" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}" >&2
            ;;
        "INFO")
            echo -e "${GREEN}[$timestamp] [INFO] $message${NC}"
            ;;
        "DEBUG")
            if [ "$BACKUP_LOG_LEVEL" = "DEBUG" ]; then
                echo -e "${BLUE}[$timestamp] [DEBUG] $message${NC}"
            fi
            ;;
    esac
}

# Check if backup is already running
check_lock() {
    if [ -f "$LOCK_FILE" ]; then
        local pid=$(cat "$LOCK_FILE" 2>/dev/null)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            log_message "WARN" "Backup already running (PID: $pid)"
            return 1
        else
            log_message "INFO" "Removing stale lock file"
            rm -f "$LOCK_FILE"
        fi
    fi
    
    echo $ > "$LOCK_FILE"
    return 0
}

# Remove lock file
remove_lock() {
    rm -f "$LOCK_FILE"
}

# Cleanup on exit
cleanup() {
    remove_lock
}
trap cleanup EXIT

# Create backup
create_backup() {
    local backup_type=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="${backup_type}_backup_${timestamp}"
    local backup_path="$BACKUP_ROOT/$backup_name"
    
    log_message "INFO" "Starting $backup_type backup: $backup_name"
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    # Create backup manifest
    echo "# Backup Manifest" > "$backup_path/MANIFEST.txt"
    echo "Backup Type: $backup_type" >> "$backup_path/MANIFEST.txt"
    echo "Created: $(date)" >> "$backup_path/MANIFEST.txt"
    echo "Hostname: $(hostname)" >> "$backup_path/MANIFEST.txt"
    echo "User: $(whoami)" >> "$backup_path/MANIFEST.txt"
    echo "Sources:" >> "$backup_path/MANIFEST.txt"
    
    local backup_success=true
    local total_size=0
    
    # Backup each source
    for source in "${BACKUP_SOURCES[@]}"; do
        # Expand variables in source path
        eval "expanded_source=\"$source\""
        
        if [ -e "$expanded_source" ]; then
            log_message "INFO" "Backing up: $expanded_source"
            echo "  - $expanded_source" >> "$backup_path/MANIFEST.txt"
            
            # Determine backup method
            if [ -d "$expanded_source" ]; then
                # Directory backup
                cp -r "$expanded_source" "$backup_path/" 2>/dev/null
            else
                # File backup
                cp "$expanded_source" "$backup_path/" 2>/dev/null
            fi
            
            if [ $? -eq 0 ]; then
                log_message "DEBUG" "Successfully backed up: $expanded_source"
            else
                log_message "ERROR" "Failed to backup: $expanded_source"
                backup_success=false
            fi
        else
            log_message "WARN" "Source not found, skipping: $expanded_source"
        fi
    done
    
    # Calculate backup size
    if [ -d "$backup_path" ]; then
        total_size=$(du -sh "$backup_path" 2>/dev/null | cut -f1)
        echo "Total Size: $total_size" >> "$backup_path/MANIFEST.txt"
    fi
    
    # Compress backup if enabled
    if [ "$ENABLE_COMPRESSION" = true ]; then
        log_message "INFO" "Compressing backup..."
        tar -czf "$backup_path.tar.gz" -C "$(dirname "$backup_path")" "$(basename "$backup_path")" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            rm -rf "$backup_path"
            backup_path="$backup_path.tar.gz"
            compressed_size=$(du -sh "$backup_path" 2>/dev/null | cut -f1)
            log_message "INFO" "Backup compressed from $total_size to $compressed_size"
        else
            log_message "ERROR" "Compression failed"
            backup_success=false
        fi
    fi
    
    # Log backup completion
    if [ "$backup_success" = true ]; then
        log_message "INFO" "$backup_type backup completed successfully: $backup_path"
    else
        log_message "ERROR" "$backup_type backup completed with errors"
    fi
    
    return $([ "$backup_success" = true ] && echo 0 || echo 1)
}

# Cleanup old backups
cleanup_old_backups() {
    log_message "INFO" "Cleaning up old backups (retention: $BACKUP_RETENTION days)"
    
    if [ -d "$BACKUP_ROOT" ]; then
        find "$BACKUP_ROOT" -name "*backup*" -mtime +$BACKUP_RETENTION -delete 2>/dev/null
        local cleaned_count=$(find "$BACKUP_ROOT" -name "*backup*" -mtime +$BACKUP_RETENTION 2>/dev/null | wc -l)
        log_message "INFO" "Cleaned up old backups"
    fi
}

# Main backup function
run_backup() {
    local backup_type=${1:-"incremental"}
    
    load_config
    
    if ! check_lock; then
        exit 1
    fi
    
    log_message "INFO" "Starting backup manager (type: $backup_type)"
    
    # Set process priority
    if [ -n "$BACKUP_NICE_LEVEL" ]; then
        renice "$BACKUP_NICE_LEVEL" $ >/dev/null 2>&1
    fi
    
    # Create backup
    if create_backup "$backup_type"; then
        log_message "INFO" "Backup completed successfully"
    else
        log_message "ERROR" "Backup completed with errors"
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Cleanup old logs
    find "$LOG_DIR" -name "backup_*.log" -mtime +$BACKUP_LOG_RETENTION -delete 2>/dev/null
    
    log_message "INFO" "Backup manager completed"
}

# Command line interface
case "${1:-run}" in
    "run")
        run_backup "incremental"
        ;;
    "full")
        run_backup "full"
        ;;
    "test")
        load_config
        echo "✅ Configuration loaded successfully"
        echo "📁 Backup root: $BACKUP_ROOT"
        echo "📊 Sources: ${#BACKUP_SOURCES[@]}"
        echo "🔧 Compression: $ENABLE_COMPRESSION"
        ;;
    "status")
        if [ -f "$LOCK_FILE" ]; then
            echo "🔄 Backup is currently running"
        else
            echo "⏸️ No backup currently running"
        fi
        
        if [ -d "$LOG_DIR" ]; then
            echo "📄 Recent backup activity:"
            tail -5 "$LOG_DIR"/backup_*.log 2>/dev/null | grep -E "INFO|ERROR|WARN"
        fi
        ;;
    *)
        echo "Usage: $0 {run|full|test|status}"
        echo "  run    - Run incremental backup"
        echo "  full   - Run full backup"
        echo "  test   - Test configuration"
        echo "  status - Show backup status"
        ;;
esac
EOF

    chmod +x "$CRISIS_DIR/backup_system/backup_manager.sh"
    
    # Create backup scheduler
    cat > "$CRISIS_DIR/backup_system/backup_scheduler.sh" << 'EOF'
#!/bin/bash
# Backup Scheduler

BACKUP_SCRIPT="$(dirname "$0")/backup_manager.sh"

# Function to install crontab entries
install_schedule() {
    echo "📅 Installing backup schedule..."
    
    # Create temporary crontab file
    crontab -l 2>/dev/null > /tmp/current_crontab
    
    # Add backup schedules (if not already present)
    if ! grep -q "backup_manager.sh" /tmp/current_crontab 2>/dev/null; then
        echo "# Automated backup system" >> /tmp/current_crontab
        echo "0 2 * * * $BACKUP_SCRIPT run >/dev/null 2>&1" >> /tmp/current_crontab
        echo "0 3 * * 0 $BACKUP_SCRIPT full >/dev/null 2>&1" >> /tmp/current_crontab
        
        # Install new crontab
        crontab /tmp/current_crontab
        echo "✅ Backup schedule installed"
        echo "   • Daily incremental backup at 02:00"
        echo "   • Weekly full backup on Sunday at 03:00"
    else
        echo "⚠️ Backup schedule already installed"
    fi
    
    rm -f /tmp/current_crontab
}

# Function to remove crontab entries
remove_schedule() {
    echo "🗑️ Removing backup schedule..."
    
    crontab -l 2>/dev/null | grep -v "backup_manager.sh" > /tmp/new_crontab
    crontab /tmp/new_crontab
    rm -f /tmp/new_crontab
    
    echo "✅ Backup schedule removed"
}

# Function to show current schedule
show_schedule() {
    echo "📅 Current backup schedule:"
    crontab -l 2>/dev/null | grep -E "backup_manager.sh|#.*backup"
}

case "${1:-help}" in
    "install")
        install_schedule
        ;;
    "remove")
        remove_schedule
        ;;
    "show")
        show_schedule
        ;;
    *)
        echo "Usage: $0 {install|remove|show}"
        echo "  install - Install automated backup schedule"
        echo "  remove  - Remove backup schedule"
        echo "  show    - Show current schedule"
        ;;
esac
EOF

    chmod +x "$CRISIS_DIR/backup_system/backup_scheduler.sh"
    
    echo "✅ Backup scripts created"
    echo "   • Backup Manager: backup_manager.sh"
    echo "   • Backup Scheduler: backup_scheduler.sh"
}

# Function to create restore scripts
create_restore_scripts() {
    echo ""
    echo "🔄 CREATING RESTORE SCRIPTS"
    echo "=========================="
    
    cat > "$CRISIS_DIR/backup_system/restore_manager.sh" << 'EOF'
#!/bin/bash
# Professional Restore Manager

SCRIPT_DIR="$(dirname "$0")"
BACKUP_ROOT="$SCRIPT_DIR/archives"
LOG_DIR="$SCRIPT_DIR/logs"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log_restore() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_file="$LOG_DIR/restore_$(date +%Y%m%d).log"
    
    mkdir -p "$LOG_DIR"
    echo "[$timestamp] [$level] $message" >> "$log_file"
    
    case $level in
        "ERROR")
            echo -e "${RED}[$level] $message${NC}" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}[$level] $message${NC}"
            ;;
        *)
            echo -e "${GREEN}[$level] $message${NC}"
            ;;
    esac
}

# List available backups
list_backups() {
    echo "📦 Available Backups:"
    echo "===================="
    
    if [ -d "$BACKUP_ROOT" ]; then
        local backup_count=0
        for backup in "$BACKUP_ROOT"/*backup*; do
            if [ -e "$backup" ]; then
                backup_name=$(basename "$backup")
                backup_size=$(du -sh "$backup" 2>/dev/null | cut -f1)
                backup_date=$(stat -c %y "$backup" 2>/dev/null | cut -d' ' -f1)
                
                echo "📁 $backup_name"
                echo "   Size: $backup_size"
                echo "   Date: $backup_date"
                echo ""
                
                backup_count=$((backup_count + 1))
            fi
        done
        
        if [ $backup_count -eq 0 ]; then
            echo "⚠️ No backups found in $BACKUP_ROOT"
        fi
    else
        echo "❌ Backup directory not found: $BACKUP_ROOT"
    fi
}

# Restore from backup
restore_backup() {
    local backup_name=$1
    local restore_location=${2:-"$HOME/restored_$(date +%Y%m%d_%H%M%S)"}
    
    if [ -z "$backup_name" ]; then
        echo "❌ Backup name required"
        return 1
    fi
    
    local backup_path="$BACKUP_ROOT/$backup_name"
    
    # Check if backup exists
    if [ ! -e "$backup_path" ]; then
        log_restore "ERROR" "Backup not found: $backup_path"
        return 1
    fi
    
    log_restore "INFO" "Starting restore: $backup_name to $restore_location"
    
    # Create restore directory
    mkdir -p "$restore_location"
    
    # Restore based on file type
    if [[ "$backup_path" == *.tar.gz ]]; then
        # Compressed backup
        log_restore "INFO" "Extracting compressed backup..."
        tar -xzf "$backup_path" -C "$restore_location" 2>/dev/null
    elif [ -d "$backup_path" ]; then
        # Directory backup
        log_restore "INFO" "Copying directory backup..."
        cp -r "$backup_path"/* "$restore_location/" 2>/dev/null
    else
        log_restore "ERROR" "Unknown backup format: $backup_path"
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        log_restore "INFO" "Restore completed successfully"
        log_restore "INFO" "Restored to: $restore_location"
        
        # Show restore summary
        if [ -d "$restore_location" ]; then
            restored_size=$(du -sh "$restore_location" 2>/dev/null | cut -f1)
            restored_files=$(find "$restore_location" -type f 2>/dev/null | wc -l)
            
            echo ""
            echo "✅ RESTORE SUMMARY"
            echo "=================="
            echo "📁 Location: $restore_location"
            echo "📊 Size: $restored_size"  
            echo "📄 Files: $restored_files"
            
            # Show manifest if available
            if [ -f "$restore_location/MANIFEST.txt" ]; then
                echo ""
                echo "📋 Backup Manifest:"
                cat "$restore_location/MANIFEST.txt"
            fi
        fi
        
        return 0
    else
        log_restore "ERROR" "Restore failed"
        return 1
    fi
}

# Interactive restore
interactive_restore() {
    echo "🔄 INTERACTIVE RESTORE WIZARD"
    echo "============================="
    
    list_backups
    
    echo ""
    read -p "Enter backup name to restore: " backup_name
    
    if [ -z "$backup_name" ]; then
        echo "❌ No backup name provided"
        return 1
    fi
    
    echo ""
    echo "📁 Restore location options:"
    echo "1) Default location (~/restored_TIMESTAMP)"
    echo "2) Specify custom location"
    echo "3) Restore to original locations (CAREFUL!)"
    echo ""
    
    read -p "Choose option (1-3): " location_option
    
    case $location_option in
        1)
            restore_location="$HOME/restored_$(date +%Y%m%d_%H%M%S)"
            ;;
        2)
            read -p "Enter custom restore location: " restore_location
            ;;
        3)
            echo "⚠️ WARNING: This will overwrite existing files!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                echo "❌ Restore cancelled"
                return 1
            fi
            restore_location="/"
            ;;
        *)
            echo "❌ Invalid option"
            return 1
            ;;
    esac
    
    echo ""
    echo "🎯 RESTORE CONFIRMATION"
    echo "======================"
    echo "Backup: $backup_name"
    echo "Destination: $restore_location"
    echo ""
    
    read -p "Proceed with restore? (yes/no): " final_confirm
    
    if [ "$final_confirm" = "yes" ]; then
        restore_backup "$backup_name" "$restore_location"
    else
        echo "❌ Restore cancelled"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_name=$1
    
    if [ -z "$backup_name" ]; then
        echo "❌ Backup name required"
        return 1
    fi
    
    local backup_path="$BACKUP_ROOT/$backup_name"
    
    if [ ! -e "$backup_path" ]; then
        echo "❌ Backup not found: $backup_path"
        return 1
    fi
    
    echo "🔍 Verifying backup integrity: $backup_name"
    
    if [[ "$backup_path" == *.tar.gz ]]; then
        # Test compressed archive
        if tar -tzf "$backup_path" >/dev/null 2>&1; then
            echo "✅ Backup archive is valid"
            
            # Show archive contents
            echo ""
            echo "📋 Archive Contents:"
            tar -tzf "$backup_path" | head -20
            
            local total_files=$(tar -tzf "$backup_path" 2>/dev/null | wc -l)
            echo "... and $((total_files - 20)) more files" 
            
        else
            echo "❌ Backup archive is corrupted"
            return 1
        fi
    elif [ -d "$backup_path" ]; then
        # Verify directory
        if [ -r "$backup_path" ]; then
            echo "✅ Backup directory is accessible"
            
            # Show directory contents
            echo ""
            echo "📋 Directory Contents:"
            ls -la "$backup_path" | head -20
        else
            echo "❌ Cannot access backup directory"
            return 1
        fi
    else
        echo "❌ Unknown backup format"
        return 1
    fi
}

# Command line interface
case "${1:-interactive}" in
    "list")
        list_backups
        ;;
    "restore")
        restore_backup "$2" "$3"
        ;;
    "verify")
        verify_backup "$2"
        ;;
    "interactive")
        interactive_restore
        ;;
    *)
        echo "Professional Restore Manager"
        echo "Usage: $0 {list|restore|verify|interactive}"
        echo ""
        echo "Commands:"
        echo "  list                    - List available backups"
        echo "  restore <name> [dest]   - Restore specific backup"
        echo "  verify <name>           - Verify backup integrity"
        echo "  interactive             - Interactive restore wizard"
        ;;
esac
EOF

    chmod +x "$CRISIS_DIR/backup_system/restore_manager.sh"
    
    echo "✅ Restore manager created"
}

# Function to test backup system
test_backup_system() {
    echo ""
    echo "🧪 TESTING BACKUP SYSTEM"
    echo "========================"
    
    echo "📋 Running system tests..."
    
    # Test configuration
    echo "1. Testing configuration..."
    if "$CRISIS_DIR/backup_system/backup_manager.sh" test; then
        echo "   ✅ Configuration test passed"
    else
        echo "   ❌ Configuration test failed"
    fi
    
    # Test backup creation
    echo ""
    echo "2. Testing backup creation..."
    if "$CRISIS_DIR/backup_system/backup_manager.sh" run; then
        echo "   ✅ Test backup created successfully"
    else
        echo "   ❌ Test backup failed"
    fi
    
    # Test backup listing
    echo ""
    echo "3. Testing backup listing..."
    "$CRISIS_DIR/backup_system/restore_manager.sh" list
    
    echo ""
    echo "🎯 BACKUP SYSTEM STATUS"
    echo "======================"
    "$CRISIS_DIR/backup_system/backup_manager.sh" status
}

# Main backup system setup
create_backup_configuration
create_backup_scripts
create_restore_scripts

echo ""
echo "🎉 AUTOMATED BACKUP SYSTEM COMPLETED"
echo "==================================="
echo "✅ Professional backup infrastructure ready"
echo ""
echo "🔧 Available Tools:"
echo "   • Backup Manager: ~/crisis_management/backup_system/backup_manager.sh"
echo "   • Restore Manager: ~/crisis_management/backup_system/restore_manager.sh"
echo "   • Backup Scheduler: ~/crisis_management/backup_system/backup_scheduler.sh"
echo ""

read -p "Would you like to test the backup system now? (y/n): " test_system

if [ "$test_system" = "y" ]; then
    test_backup_system
else
    echo "💡 Test the system anytime with the backup manager test command"
fi

read -p "Would you like to install automated backup schedule? (y/n): " install_schedule

if [ "$install_schedule" = "y" ]; then
    "$CRISIS_DIR/backup_system/backup_scheduler.sh" install
else
    echo "💡 Install schedule later with: backup_scheduler.sh install"
fi
```

---

## **Part 3: Final Challenge - Crisis Management Master (20 minutes)**

### **Ultimate Crisis Simulation Challenge**

```bash
#!/bin/bash
# Crisis Management Master Challenge

echo "🚨 CRISIS MANAGEMENT MASTER CHALLENGE"
echo "===================================="

CHALLENGE_DIR="$HOME/crisis_challenge_master"
mkdir -p "$CHALLENGE_DIR"/{scenarios,responses,evaluation}

echo ""
echo "🎯 ULTIMATE CRISIS SCENARIO:"
echo "Your entire workshop empire is under siege:"
echo ""
echo "🔴 CRITICAL ALERTS:"
echo "   • Multiple server failures reported"
echo "   • Data corruption on primary systems"
echo "   • Network connectivity intermittent"
echo "   • Backup systems showing errors"
echo "   • Customer complaints flooding in"
echo "   • Management demanding immediate answers"
echo ""
echo "⏰ CHALLENGE TIME LIMIT: 20 minutes"
echo ""
echo "🏆 MASTER-LEVEL OBJECTIVES:"
echo "✅ Execute complete STARFISH crisis response"
echo "✅ Implement emergency data recovery procedures"  
echo "✅ Establish backup systems and verification"
echo "✅ Create comprehensive incident documentation"
echo "✅ Deploy preventive monitoring systems"
echo "✅ Deliver executive crisis briefing"

# Create master challenge evaluation
cat > "$CHALLENGE_DIR/evaluate_master_challenge.sh" << 'EOF'
#!/bin/bash
# Crisis Management Master Evaluation

echo "🏆 CRISIS MANAGEMENT MASTER EVALUATION"
echo "======================================"

score=0
max_score=120

echo "📊 EVALUATING CRISIS MANAGEMENT MASTERY..."
echo ""

# Category 1: Crisis Response Framework (25 points)
echo "1. 🌟 CRISIS RESPONSE FRAMEWORK"
echo "==============================="

if [ -d "$HOME/crisis_management" ]; then
    echo "✅ Crisis management system established (+10 points)"
    score=$((score + 10))
    
    if [ -f "$HOME/crisis_management/incidents"/*.txt ]; then
        echo "✅ Incident documentation created (+10 points)"
        score=$((score + 10))
    fi
    
    if [ -f "$HOME/crisis_management/tools/intelligent_diagnostics.sh" ]; then
        echo "✅ Diagnostic tools deployed (+5 points)"
        score=$((score + 5))
    fi
else
    echo "❌ Crisis management system not found (0 points)"
fi

# Category 2: Data Recovery Capabilities (25 points)
echo ""
echo "2. 💾 DATA RECOVERY CAPABILITIES"
echo "==============================="

if [ -d "$HOME/crisis_management/data_recovery" ]; then
    echo "✅ Data recovery system established (+10 points)"
    score=$((score + 10))
    
    # Check for recovery logs
    if ls "$HOME/crisis_management/data_recovery/logs"/*.txt >/dev/null 2>&1; then
        echo "✅ Recovery procedures documented (+10 points)"
        score=$((score + 10))
    fi
    
    # Check for recovered data
    if ls "$HOME/crisis_management/data_recovery"/*backup* >/dev/null 2>&1; then
        echo "✅ Emergency backups created (+5 points)"
        score=$((score + 5))
    fi
else
    echo "❌ Data recovery system not found (0 points)"
fi

# Category 3: Backup Infrastructure (25 points)  
echo ""
echo "3. 🔄 BACKUP INFRASTRUCTURE"
echo "==========================="

if [ -d "$HOME/crisis_management/backup_system" ]; then
    echo "✅ Professional backup system created (+15 points)"
    score=$((score + 15))Next Review: $(date -d '+1 week' 2>/dev/null || date)
EOF

    echo "✅ Comprehensive incident report created: $final_report"
    
    # Create handover summary
    echo ""
    echo "🤝 CRISIS HANDOVER SUMMARY"
    echo "=========================="
    echo "📊 Current System Status:"
    ~/crisis_management/tools/health_check.sh | tail -10
    
    echo ""
    echo "📋 Critical Information for Next Administrator:"
    echo "   • Incident Documentation: $final_report"
    echo "   • Monitoring Tools: $CRISIS_DIR/tools/"
    echo "   • Crisis Response Framework: STARFISH method"
    echo "   • Emergency Contacts: [Update as needed]"
    echo "   • Recovery Procedures: Documented in incident logs"
    
    echo ""
    echo "🎯 POST-INCIDENT ACTIONS REQUIRED:"
    echo "   1. Schedule post-mortem meeting"
    echo "   2. Update crisis response procedures"  
    echo "   3. Conduct team training if needed"
    echo "   4. Review and test backup systems"
    echo "   5. Update monitoring thresholds"
    
    echo ""
    echo "🎉 CRISIS RESPONSE COMPLETED SUCCESSFULLY!"
    echo "All documentation and tools ready for handover."
}

# Main STARFISH execution
execute_starfish_framework() {
    echo "🌟 EXECUTING STARFISH CRISIS MANAGEMENT"
    echo "======================================"
    
    start_incident_response
    
    echo ""
    echo "🎯 STARFISH Crisis Response Framework"
    echo "Each step builds on the previous to ensure systematic recovery"
    echo ""
    
    read -p "Press Enter to begin STEP 1 - STOP and Assess..."
    crisis_stop_assess
    
    read -p "Press Enter to continue to STEP 2 - TRIAGE..."
    crisis_triage
    
    read -p "Press Enter to continue to STEP 3 - ANALYZE..."
    crisis_analyze
    
    read -p "Press Enter to continue to STEP 4 - RESEARCH..."
    crisis_research
    
    read -p "Press Enter to continue to STEP 5 - FIX..."
    crisis_fix
    
    read -p "Press Enter to continue to STEP 6 - IMPLEMENT Recovery..."
    crisis_implement_recovery
    
    read -p "Press Enter to continue to STEP 7 - SECURE and Prevent..."
    crisis_secure_prevent
    
    read -p "Press Enter to complete STEP 8 - HANDOVER and Document..."
    crisis_handover_document
    
    echo ""
    echo "🏆 STARFISH CRISIS MANAGEMENT COMPLETED!"
    echo "======================================="
    echo "✅ All 8 steps of crisis response executed successfully"
    echo "📁 All documentation saved in: $CRISIS_DIR"
    echo "🛡️ Prevention measures implemented and active"
}

# Initialize and run STARFISH framework
execute_starfish_framework
```

### **B. Advanced Error Pattern Recognition (15 minutes)**

#### **Intelligent Problem Classification System**

```bash
#!/bin/bash
# Advanced Error Pattern Recognition System

echo "🧠 INTELLIGENT PROBLEM CLASSIFICATION SYSTEM"
echo "============================================"

# Create pattern recognition database
mkdir -p "$CRISIS_DIR/patterns"

# Function to analyze error patterns
analyze_error_patterns() {
    echo "🔍 ANALYZING SYSTEM ERROR PATTERNS"
    echo "=================================="
    
    local pattern_log="$CRISIS_DIR/patterns/error_analysis_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "🧬 ERROR PATTERN ANALYSIS REPORT" > "$pattern_log"
    echo "Generated: $(date)" >> "$pattern_log"
    echo "=========================================" >> "$pattern_log"
    
    # Pattern 1: Memory-related errors
    echo ""
    echo "🧠 MEMORY ERROR PATTERN ANALYSIS" | tee -a "$pattern_log"
    
    memory_errors=$(dmesg 2>/dev/null | grep -i "out of memory\|oom\|killed process" | wc -l)
    if [ "$memory_errors" -gt 0 ]; then
        echo "⚠️ Memory-related errors detected: $memory_errors occurrences" | tee -a "$pattern_log"
        echo "Recent memory errors:" >> "$pattern_log"
        dmesg 2>/dev/null | grep -i "out of memory\|oom\|killed process" | tail -5 >> "$pattern_log"
    else
        echo "✅ No memory-related errors found" | tee -a "$pattern_log"
    fi
    
    # Pattern 2: Disk I/O errors
    echo ""
    echo "💾 DISK I/O ERROR PATTERN ANALYSIS" | tee -a "$pattern_log"
    
    io_errors=$(dmesg 2>/dev/null | grep -i "i/o error\|disk\|sector" | grep -i error | wc -l)
    if [ "$io_errors" -gt 0 ]; then
        echo "⚠️ Disk I/O errors detected: $io_errors occurrences" | tee -a "$pattern_log"
        echo "Recent I/O errors:" >> "$pattern_log"
        dmesg 2>/dev/null | grep -i "i/o error\|disk\|sector" | grep -i error | tail -5 >> "$pattern_log"
    else
        echo "✅ No disk I/O errors found" | tee -a "$pattern_log"
    fi
    
    # Pattern 3: Network connectivity patterns
    echo ""
    echo "🌐 NETWORK ERROR PATTERN ANALYSIS" | tee -a "$pattern_log"
    
    network_errors=$(journalctl --since "1 day ago" 2>/dev/null | grep -i "network\|connection\|timeout" | grep -i error | wc -l)
    if [ "$network_errors" -gt 0 ]; then
        echo "⚠️ Network errors detected: $network_errors occurrences" | tee -a "$pattern_log"
        echo "Recent network errors:" >> "$pattern_log"
        journalctl --since "1 day ago" --no-pager 2>/dev/null | grep -i "network\|connection\|timeout" | grep -i error | tail -5 >> "$pattern_log"
    else
        echo "✅ No network errors found" | tee -a "$pattern_log"
    fi
    
    # Pattern 4: Service failure patterns
    echo ""
    echo "🔧 SERVICE FAILURE PATTERN ANALYSIS" | tee -a "$pattern_log"
    
    # Check systemd service failures
    failed_services=$(systemctl --failed --no-legend 2>/dev/null | wc -l)
    if [ "$failed_services" -gt 0 ]; then
        echo "⚠️ Failed services detected: $failed_services services" | tee -a "$pattern_log"
        echo "Failed services list:" >> "$pattern_log"
        systemctl --failed --no-pager 2>/dev/null >> "$pattern_log"
    else
        echo "✅ No failed services found" | tee -a "$pattern_log"
    fi
    
    # Pattern 5: Performance degradation patterns
    echo ""
    echo "📊 PERFORMANCE PATTERN ANALYSIS" | tee -a "$pattern_log"
    
    # Check system load history
    current_load=$(uptime | awk '{print $(NF-2)}' | sed 's/,//')
    cpu_cores=$(nproc)
    
    echo "Current load: $current_load (CPU cores: $cpu_cores)" | tee -a "$pattern_log"
    
    # Use bc for floating point comparison if available
    if command -v bc >/dev/null; then
        load_ratio=$(echo "scale=2; $current_load / $cpu_cores" | bc)
        if (( $(echo "$load_ratio > 1.5" | bc -l) )); then
            echo "⚠️ High load detected (Load/Core ratio: $load_ratio)" | tee -a "$pattern_log"
        else
            echo "✅ Load within normal range (Load/Core ratio: $load_ratio)" | tee -a "$pattern_log"
        fi
    else
        echo "Load analysis: $current_load average on $cpu_cores cores" | tee -a "$pattern_log"
    fi
    
    echo ""
    echo "✅ Error pattern analysis completed"
    echo "📄 Detailed report saved to: $pattern_log"
    
    # Generate pattern-based recommendations
    generate_pattern_recommendations "$pattern_log"
}

# Function to generate recommendations based on patterns
generate_pattern_recommendations() {
    local analysis_file=$1
    local recommendations_file="$CRISIS_DIR/patterns/recommendations_$(date +%Y%m%d_%H%M%S).txt"
    
    echo ""
    echo "💡 GENERATING PATTERN-BASED RECOMMENDATIONS"
    echo "==========================================="
    
    cat > "$recommendations_file" << 'EOF'
INTELLIGENT CRISIS RECOMMENDATIONS
=================================
Based on Error Pattern Analysis

MEMORY ISSUES - If detected:
---------------------------
Immediate Actions:
• Clear system caches: sync && echo 3 > /proc/sys/vm/drop_caches
• Kill memory-intensive processes: kill -9 <PID>
• Add swap space if none exists: fallocate -l 2G /swapfile

Long-term Solutions:
• Increase RAM capacity
• Optimize application memory usage
• Implement memory monitoring alerts
• Configure swap space properly

DISK I/O ISSUES - If detected:
-----------------------------
Immediate Actions:
• Check filesystem integrity: fsck -f /dev/<device>
• Monitor disk health: smartctl -a /dev/<device>
• Free up disk space: clean logs, temp files
• Remount filesystem: umount && mount

Long-term Solutions:
• Replace failing hardware
• Implement disk monitoring
• Set up RAID for redundancy
• Regular filesystem checks

NETWORK ISSUES - If detected:
----------------------------
Immediate Actions:
• Restart networking: systemctl restart networking
• Check DNS resolution: nslookup google.com
• Verify network interfaces: ip addr show
• Test connectivity: ping -c 5 google.com

Long-term Solutions:
• Configure redundant network paths
• Implement network monitoring
• Update network drivers
• Review firewall configurations

SERVICE FAILURES - If detected:
-------------------------------
Immediate Actions:
• Restart failed services: systemctl restart <service>
• Check service logs: journalctl -u <service>
• Verify service configuration files
• Check service dependencies

Long-term Solutions:
• Implement service health monitoring
• Configure automatic service restart
• Review service configurations
• Set up proper logging

PERFORMANCE ISSUES - If detected:
--------------------------------
Immediate Actions:
• Identify resource-heavy processes: top, htop
• Kill unnecessary processes
• Clear system caches
• Check for resource limits

Long-term Solutions:
• Capacity planning and scaling
• Performance monitoring implementation
• Resource optimization
• Hardware upgrades if needed

GENERAL RECOMMENDATIONS:
=======================
• Implement comprehensive monitoring
• Regular system health checks
• Automated backup procedures
• Documentation of all procedures
• Regular training and drills
• Maintain updated crisis response procedures
EOF

    echo "✅ Pattern-based recommendations generated"
    echo "📄 Recommendations saved to: $recommendations_file"
    
    # Display key recommendations
    echo ""
    echo "🎯 KEY RECOMMENDATIONS SUMMARY:"
    echo "==============================="
    
    # Check what patterns were found and show relevant recommendations
    if grep -q "Memory-related errors detected" "$analysis_file"; then
        echo "🧠 Memory Issues: Clear caches, monitor usage, consider RAM upgrade"
    fi
    
    if grep -q "Disk I/O errors detected" "$analysis_file"; then
        echo "💾 Disk Issues: Check filesystem, monitor disk health, consider replacement"
    fi
    
    if grep -q "Network errors detected" "$analysis_file"; then
        echo "🌐 Network Issues: Restart networking, check DNS, verify connectivity"
    fi
    
    if grep -q "Failed services detected" "$analysis_file"; then
        echo "🔧 Service Issues: Restart services, check logs, verify configurations"
    fi
    
    if grep -q "High load detected" "$analysis_file"; then
        echo "📊 Performance Issues: Identify heavy processes, optimize resources"
    fi
}

# Function to create intelligent diagnostic script
create_intelligent_diagnostics() {
    cat > "$CRISIS_DIR/tools/intelligent_diagnostics.sh" << 'EOF'
#!/bin/bash
# Intelligent Crisis Diagnostics

echo "🧠 INTELLIGENT CRISIS DIAGNOSTICS"
echo "================================="

# Function to classify problem severity
classify_severity() {
    local score=0
    
    # Check critical indicators
    # Memory usage
    memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3*100/$2}')
    if [ "$memory_usage" -gt 95 ]; then
        score=$((score + 40))
    elif [ "$memory_usage" -gt 85 ]; then
        score=$((score + 20))
    fi
    
    # Disk usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 98 ]; then
        score=$((score + 40))
    elif [ "$disk_usage" -gt 90 ]; then
        score=$((score + 20))
    fi
    
    # Service failures
    failed_services=$(systemctl --failed --no-legend 2>/dev/null | wc -l)
    if [ "$failed_services" -gt 5 ]; then
        score=$((score + 30))
    elif [ "$failed_services" -gt 0 ]; then
        score=$((score + 15))
    fi
    
    # Network connectivity
    if ! ping -c 3 google.com >/dev/null 2>&1; then
        score=$((score + 25))
    fi
    
    # Classify based on score
    if [ "$score" -ge 80 ]; then
        echo "🔴 CRITICAL"
    elif [ "$score" -ge 50 ]; then
        echo "🟠 HIGH"
    elif [ "$score" -ge 25 ]; then
        echo "🟡 MEDIUM"
    else
        echo "🟢 LOW"
    fi
}

# Function to suggest immediate actions
suggest_actions() {
    local severity=$1
    
    echo ""
    echo "💡 RECOMMENDED IMMEDIATE ACTIONS:"
    echo "================================"
    
    case $severity in
        "🔴 CRITICAL")
            echo "1. 🚨 EXECUTE EMERGENCY STABILIZATION"
            echo "   • Clear system caches immediately"
            echo "   • Kill non-essential processes"
            echo "   • Free up disk space urgently"
            echo "   • Restart critical services"
            echo ""
            echo "2. 📞 NOTIFY STAKEHOLDERS"
            echo "   • Alert management immediately"
            echo "   • Prepare emergency communication"
            echo "   • Consider activating backup systems"
            ;;
        "🟠 HIGH")
            echo "1. 🔧 IMMEDIATE SYSTEM OPTIMIZATION"
            echo "   • Restart problematic services"
            echo "   • Clean temporary files"
            echo "   • Monitor resource usage closely"
            echo ""
            echo "2. 📋 PREPARE FOR ESCALATION"
            echo "   • Document current status"
            echo "   • Prepare stakeholder communication"
            ;;
        "🟡 MEDIUM")
            echo "1. 📊 PERFORMANCE TUNING"
            echo "   • Investigate resource usage"
            echo "   • Optimize running processes"
            echo "   • Schedule maintenance if needed"
            echo ""
            echo "2. 👥 STANDARD COMMUNICATION"
            echo "   • Update monitoring dashboards"
            echo "   • Schedule team review"
            ;;
        "🟢 LOW")
            echo "1. 🔍 CONTINUED MONITORING"
            echo "   • Maintain standard monitoring"
            echo "   • Document any anomalies"
            echo "   • No immediate action required"
            ;;
    esac
}

# Main diagnostic execution
echo "🎯 Running intelligent system diagnostics..."

severity=$(classify_severity)
echo "Detected Severity Level: $severity"

suggest_actions "$severity"

echo ""
echo "🏥 Quick Health Summary:"
echo "======================="
echo "Memory: $(free | grep Mem | awk '{printf "%.0f", $3*100/$2}')% used"
echo "Disk: $(df / | tail -1 | awk '{print $5}') used"
echo "Services: $(systemctl --failed --no-legend 2>/dev/null | wc -l) failed"
echo "Load: $(uptime | awk '{print $(NF-2)}' | sed 's/,//')"

# Network test
if ping -c 3 google.com >/dev/null 2>&1; then
    echo "Network: ✅ Connected"
else
    echo "Network: ❌ Issues detected"
fi

echo ""
echo "🎯 For detailed analysis, run the STARFISH framework"
EOF

    chmod +x "$CRISIS_DIR/tools/intelligent_diagnostics.sh"
    echo "🧠 Intelligent diagnostics system created"
}

# Execute pattern analysis
analyze_error_patterns
create_intelligent_diagnostics

echo ""
echo "🎉 ADVANCED DIAGNOSTIC FRAMEWORK COMPLETED"
echo "=========================================="
echo "✅ STARFISH crisis management framework ready"
echo "✅ Error pattern recognition system active"
echo "✅ Intelligent diagnostics available"
echo ""
echo "🔧 Available Tools:"
echo "   • STARFISH Framework: Complete crisis response system"
echo "   • Pattern Analysis: ~/crisis_management/patterns/"
echo "   • Intelligent Diagnostics: ~/crisis_management/tools/intelligent_diagnostics.sh"
```

---

## **Part 2: Data Recovery and Backup Systems (30 minutes)**

### **A. Emergency Data Recovery (15 minutes)**

#### **Professional Data Recovery Toolkit**

```bash
#!/bin/bash
# Professional Emergency Data Recovery System

echo "💾 EMERGENCY DATA RECOVERY SYSTEM"
echo "================================="

mkdir -p "$CRISIS_DIR/data_recovery"/{scans,recovered,logs,tools}

# Function to assess data loss situation
assess_data_loss() {
    echo "🔍 DATA LOSS SITUATION ASSESSMENT"
    echo "================================="
    
    local assessment_log="$CRISIS_DIR/data_recovery/logs/assessment_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "📊 DATA RECOVERY ASSESSMENT REPORT" > "$assessment_log"
    echo "Started: $(date)" >> "$assessment_log"
    echo "=======================================" >> "$assessment_log"
    
    # Check filesystem integrity
    echo ""
    echo "🔍 FILESYSTEM INTEGRITY CHECK" | tee -a "$assessment_log"
    
    for fs in $(df -h | awk 'NR>1 {print $1}' | grep -E '^/dev/'); do
        echo "Checking filesystem: $fs" | tee -a "$assessment_log"
        
        # Check if filesystem is mounted and accessible
        mount_point=$(df -h | grep "$fs" | awk '{print $6}')
        if [ -n "$mount_point" ] && [ -d "$mount_point" ]; then
            # Test read access
            if ls "$mount_point" >/dev/null 2>&1; then
                echo "✅ $fs ($mount_point): Accessible" | tee -a "$assessment_log"
            else
                echo "❌ $fs ($mount_point): Access denied" | tee -a "$assessment_log"
            fi
        else
            echo "⚠️ $fs: Not mounted or inaccessible" | tee -a "$assessment_log"
        fi
    done
    
    # Check for recent file modifications
    echo ""
    echo "📅 RECENT FILE ACTIVITY ANALYSIS" | tee -a "$assessment_log"
    
    # Check home directory for recent changes
    if [ -d "$HOME" ]; then
        recent_changes=$(find "$HOME" -mtime -1 -type f 2>/dev/null | wc -l)
        echo "Files modified in last 24 hours: $recent_changes" | tee -a "$assessment_log"
        
        if [ "$recent_changes" -gt 0 ]; then
            echo "Recent file changes detected in:" >> "$assessment_log"
            find "$HOME" -mtime -1 -type f 2>/dev/null | head -10 >> "$assessment_log"
        fi
    fi
    
    # Check system logs for data-related errors
    echo ""
    echo "📋 DATA-RELATED ERROR ANALYSIS" | tee -a "$assessment_log"
    
    data_errors=$(journalctl --since "24 hours ago" 2>/dev/null | grep -i "corrupt\|lost\|error.*data\|filesystem" | wc -l)
    if [ "$data_errors" -gt 0 ]; then
        echo "⚠️ Data-related errors found: $data_errors occurrences" | tee -a "$assessment_log"
        echo "Recent data errors:" >> "$assessment_log"
        journalctl --since "24 hours ago" --no-pager 2>/dev/null | grep -i "corrupt\|lost\|error.*data\|filesystem" | head -5 >> "$assessment_log"
    else
        echo "✅ No data-related errors found" | tee -a "$assessment_log"
    fi
    
    echo ""
    echo "✅ Data loss assessment completed"
    echo "📄 Assessment report: $assessment_log"
}

# Function to create emergency backup
create_emergency_backup() {
    echo ""
    echo "💾 CREATING EMERGENCY BACKUP"
    echo "============================"
    
    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$CRISIS_DIR/data_recovery/emergency_backup_$backup_timestamp"
    
    mkdir -p "$backup_dir"
    
    echo "📦 Emergency backup location: $backup_dir"
    
    # Backup critical user data
    echo "🏠 Backing up user data..."
    
    # Documents
    if [ -d "$HOME/Documents" ]; then
        cp -r "$HOME/Documents" "$backup_dir/" 2>/dev/null
        echo "✅ Documents backed up"
    fi
    
    # Desktop files
    if [ -d "$HOME/Desktop" ]; then
        cp -r "$HOME/Desktop" "$backup_dir/" 2>/dev/null
        echo "✅ Desktop backed up"
    fi
    
    # Configuration files
    echo "⚙️ Backing up configuration files..."
    mkdir -p "$backup_dir/configs"
    
    for config in .bashrc .bash_aliases .gitconfig .ssh/config; do
        if [ -f "$HOME/$config" ]; then
            cp "$HOME/$config" "$backup_dir/configs/" 2>/dev/null
            echo "✅ $config backed up"
        fi
    done
    
    # SSH keys (public keys only for security)
    if [ -d "$HOME/.ssh" ]; then
        mkdir -p "$backup_dir/ssh"
        cp "$HOME/.ssh/"*.pub "$backup_dir/ssh/" 2>/dev/null
        echo "✅ SSH public keys backed up"
    fi
    
    # Crisis management data
    if [ -d "$CRISIS_DIR" ]; then
        cp -r "$CRISIS_DIR" "$backup_dir/" 2>/dev/null
        echo "✅ Crisis management data backed up"
    fi
    
    # Create backup archive
    echo ""
    echo "📦 Creating backup archive..."
    tar -czf "$CRISIS_DIR/data_recovery/emergency_backup_$backup_timestamp.tar.gz" -C "$backup_dir" . 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Emergency backup archive created successfully"
        backup_size=$(du -sh "$CRISIS_DIR/data_recovery/emergency_backup_$backup_timestamp.tar.gz" | cut -f1)
        echo "📊 Backup size: $backup_size"
        
        # Clean up temporary directory
        rm -rf "$backup_dir"
        
        return 0
    else
        echo "❌ Emergency backup failed"
        return 1
    fi
}

# Function to scan for recoverable data
scan_recoverable_data() {
    echo ""
    echo "🔍 SCANNING FOR RECOVERABLE DATA"
    echo "==============================="
    
    local scan_log="$CRISIS_DIR/data_recovery/logs/scan_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "📊 DATA RECOVERY SCAN REPORT" > "$scan_log"
    echo "Started: $(date)" >> "$scan_log"
    
    # Look for backup files
    echo "🔍 Searching for backup files..." | tee -a "$scan_log"
    
    backup_files=$(find "$HOME" -name "*.bak" -o -name "*.backup" -o -name "*~" 2>/dev/null)
    if [ -n "$backup_files" ]; then
        echo "📁 Backup files found:" | tee -a "$scan_log"
        echo "$backup_files" | head -10 | tee -a "$scan_log"
        backup_count=$(echo "$backup_files" | wc -l)
        echo "Total backup files: $backup_count" | tee -a "$scan_log"
    else
        echo "⚠️ No backup files found" | tee -a "$scan_log"
    fi
    
    # Look for version control repositories
    echo ""
    echo "📚 Searching for version control repositories..." | tee -a "$scan_log"
    
    git_repos=$(find "$HOME" -name ".git" -type d 2>/dev/null)
    if [ -n "$git_repos" ]; then
        echo "📁 Git repositories found:" | tee -a "$scan_log"
        echo "$git_repos" | head -10 | tee -a "$scan_log"
    else
        echo "⚠️ No Git repositories found" | tee -a "$scan_log"
    fi
    
    # Look for temporary files that might contain data
    echo ""
    echo "🗂️ Searching for recoverable temporary files..." | tee -a "$scan_log"
    
    temp_files=$(find /tmp "$HOME" -name "*.tmp" -o -name "*.temp" -o -name ".#*" 2>/dev/null | head -20)
    if [ -n "$temp_files" ]; then
        echo "📁 Temporary files found:" | tee -a "$scan_log"
        echo "$temp_files" | tee -a "$scan_log"
    else
        echo "ℹ️ No recoverable temporary files found" | tee -a "$scan_log"
    fi
    
    # Check trash/recycle bin
    echo ""
    echo "🗑️ Checking trash locations..." | tee -a "$scan_log"
    
    trash_locations=(
        "$HOME/.local/share/Trash/files"
        "$HOME/.Trash"
        "/tmp/.Trash-$(id -u)"
    )
    
    for trash_dir in "${trash_locations[@]}"; do
        if [ -d "$trash_dir" ]; then
            trash_count=$(ls -la "$trash_dir" 2>/dev/null | wc -l)
            if [ "$trash_count" -gt 2 ]; then  # More than . and ..
                echo "🗑️ Trash found: $trash_dir ($((trash_count - 2)) items)" | tee -a "$scan_log"
            fi
        fi
    done
    
    echo ""
    echo "✅ Data recovery scan completed"
    echo "📄 Scan results: $scan_log"
}

# Function to recover data from common locations
recover_data_emergency() {
    echo ""
    echo "🚑 EMERGENCY DATA RECOVERY PROCEDURE"
    echo "==================================="
    
    local recovery_dir="$CRISIS_DIR/data_recovery/recovered_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$recovery_dir"
    
    echo "💾 Recovery destination: $recovery_dir"
    
    # Recovery from trash
    echo ""
    echo "🗑️ RECOVERING FROM TRASH LOCATIONS"
    
    trash_locations=(
        "$HOME/.local/share/Trash/files"
        "$HOME/.Trash"
    )
    
    for trash_dir in "${trash_locations[@]}"; do
        if [ -d "$trash_dir" ] && [ "$(ls -A "$trash_dir" 2>/dev/null)" ]; then
            echo "📁 Recovering from: $trash_dir"
            cp -r "$trash_dir"/* "$recovery_dir/" 2>/dev/null
            recovered_items=$(ls -1 "$trash_dir" 2>/dev/null | wc -l)
            echo "✅ Recovered $recovered_items items from trash"
        fi
    done
    
    # Recovery from backup files
    echo ""
    echo "💾 RECOVERING FROM BACKUP FILES"
    
    backup_files=$(find "$HOME" -name "*.bak" -o -name "*.backup" 2>/dev/null | head -10)
    if [ -n "$backup_files" ]; then
        mkdir -p "$recovery_dir/backup_files"
        echo "$backup_files" | while read -r backup_file; do
            if [ -f "$backup_file" ]; then
                cp "$backup_file" "$recovery_dir/backup_files/" 2>/dev/null
                echo "✅ Recovered: $(basename "$backup_file")"
            fi
        done
    fi
    
    # Recovery from git repositories
    echo ""
    echo "📚 RECOVERING FROM GIT REPOSITORIES"
    
    git_repos=$(find "$HOME" -name ".git" -type d 2>/dev/null | head -5)
    if [ -n "$git_repos" ]; then
        mkdir -p "$recovery_dir/git_repos"
        echo "$git_repos" | while read -r git_dir; do
            repo_dir=$(dirname "$git_dir")
            repo_name=$(basename "$repo_dir")
            cp -r "$repo_dir" "$recovery_dir/git_repos/$repo_name" 2>/dev/null
            echo "✅ Recovered Git repo: $repo_name"
        done
    fi
    
    # Create recovery summary
    echo ""
    echo "📋 RECOVERY SUMMARY"
    echo "=================="
    
    if [ -d "$recovery_dir" ]; then
        recovery_size=$(du -sh "$recovery_dir" 2>/dev/null | cut -f1)
        recovery_count=$(find "$recovery_dir" -type f 2>/dev/null | wc -l)
        
        echo "✅ Recovery completed successfully"
        echo "📁 Location: $recovery_dir"
        echo "📊 Total size: $recovery_size"
        echo "📄 Files recovered: $recovery_count"
        
        # Create recovery archive
        echo "📦 Creating recovery archive..."
        tar -czf "$recovery_dir.tar.gz" -C "$(dirname "$recovery_dir")" "$(basename "$recovery_dir")" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Recovery archive created: $recovery_dir.tar.gz"
        fi
    else
        echo "⚠️ No data recovered"
    fi
}

# Main data recovery execution
echo "🎯 Starting emergency data recovery procedures..."

echo# Week 3 Session 4: Troubleshooting & Recovery (Enhanced)
## "Crisis Management Command Center" 🚨

### **Story Context**
*Your global workshop empire faces its ultimate test. Multiple critical systems have failed simultaneously across different locations, data corruption threatens years of work, and customers are demanding answers. Today you transform from a workshop administrator into a Crisis Management Commander - the specialist who stays calm under pressure, systematically diagnoses complex problems, and orchestrates complete system recovery when everything goes wrong.*

---

## **Visual Learning: Crisis Management Architecture**

```
🚨 CRISIS MANAGEMENT COMMAND CENTER
===================================

    📱 COMMAND CENTER (Your Response Hub)
            ↕️ Crisis Communication Channels
    ┌──────────────────────────────────────┐
    │  🏭 AFFECTED WORKSHOP SYSTEMS        │
    │  ┌──────────┐  ┌──────────┐         │
    │  │ CRITICAL │  │ WARNING  │         │
    │  │ 🔴 FAILED│  │ 🟡 SLOW  │         │
    │  └──────────┘  └──────────┘         │
    │  ┌──────────┐  ┌──────────┐         │
    │  │ RECOVERY │  │ HEALTHY  │         │
    │  │ 🟠 ACTIVE│  │ 🟢 NORMAL│         │
    │  └──────────┘  └──────────┘         │
    └──────────────────────────────────────┘

🎯 CRISIS RESPONSE FRAMEWORK:
├── 🔍 DETECT    - Identify problem scope and impact
├── 🎯 DIAGNOSE  - Systematic root cause analysis
├── 🛠️ DECIDE    - Choose optimal recovery strategy
├── 🚀 DEPLOY    - Execute recovery procedures
├── 📊 DOCUMENT  - Record all actions and lessons
└── 🔄 IMPROVE   - Strengthen defenses for future

⚡ EMERGENCY SEVERITY LEVELS:
🔴 CRITICAL  - Total system failure, data at risk
🟠 HIGH      - Major functionality compromised  
🟡 MEDIUM    - Performance degraded, users affected
🟢 LOW       - Minor issues, monitoring required
```

---

## **Part 1: Advanced Diagnostic Framework (35 minutes)**

### **A. The STARFISH Method - Professional Problem Solving (20 minutes)**

#### **Systematic Troubleshooting Framework**

```bash
#!/bin/bash
# STARFISH Crisis Management System

echo "🌟 STARFISH CRISIS MANAGEMENT SYSTEM"
echo "==================================="

CRISIS_DIR="$HOME/crisis_management"
mkdir -p "$CRISIS_DIR"/{incidents,diagnostics,recovery,reports,tools}

# STARFISH Framework:
# S - STOP and Assess
# T - TRIAGE the situation  
# A - ANALYZE systematically
# R - RESEARCH solutions
# F - FIX with precision
# I - IMPLEMENT recovery
# S - SECURE and prevent
# H - HANDOVER and document

# Function to start incident response
start_incident_response() {
    local incident_id="CRISIS_$(date +%Y%m%d_%H%M%S)"
    local incident_file="$CRISIS_DIR/incidents/$incident_id.txt"
    
    echo "🚨 STARTING INCIDENT RESPONSE: $incident_id"
    echo "========================================="
    
    # Create incident documentation
    cat > "$incident_file" << EOF
CRISIS INCIDENT REPORT
=====================
Incident ID: $incident_id
Start Time: $(date)
Response Commander: $(whoami)

STARFISH FRAMEWORK CHECKLIST:
□ S - STOP and Assess situation
□ T - TRIAGE severity and scope  
□ A - ANALYZE root causes
□ R - RESEARCH viable solutions
□ F - FIX critical issues
□ I - IMPLEMENT recovery procedures
□ S - SECURE systems and data
□ H - HANDOVER with documentation

INITIAL ASSESSMENT:
================
Problem Description: 
__________________________________________________

Affected Systems:
__________________________________________________

Business Impact:
__________________________________________________

Timeline:
- Incident Detected: $(date)
- Response Started: $(date)
- Initial Assessment: ________________
- Root Cause Found: _________________
- Fix Implemented: __________________
- Recovery Complete: ________________
- Post-Incident Review: _____________

EOF

    echo "📋 Incident response initiated"
    echo "📁 Incident file: $incident_file"
    export CURRENT_INCIDENT="$incident_id"
    export INCIDENT_FILE="$incident_file"
}

# STEP 1: STOP and Assess
crisis_stop_assess() {
    echo ""
    echo "🛑 STEP 1: STOP AND ASSESS"
    echo "=========================="
    echo "⏰ Take a deep breath. Crisis response requires calm, systematic thinking."
    
    echo ""
    echo "📊
