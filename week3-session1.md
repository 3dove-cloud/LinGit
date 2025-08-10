# Week 3 Session 1: Configuration Management (Enhanced)
## "Creating the Master Workshop Blueprint" 🏗️

### **Story Context** 
*Your workshop empire has grown so successful that business partners worldwide want to replicate it exactly. Today you'll learn to create the ultimate workshop blueprint - a master configuration that can recreate your perfect setup anywhere in the world. Think of yourself as the chief architect designing the standardized workshop that will become a global franchise.*

---

## **Visual Learning: Configuration Universe Map**

```
🏗️ LINUX CONFIGURATION UNIVERSE
================================

🏢 SYSTEM HEADQUARTERS (/etc/)
├── 🔐 Security Dept (/etc/ssh/)     │ "Who can enter?"
├── 🌐 Reception (/etc/apache2/)     │ "How we serve customers"  
├── 🗄️ Records Room (/etc/mysql/)    │ "Where we store data"
├── 👥 HR Files (/etc/passwd)        │ "Employee directory"
└── 📋 Policies (/etc/hosts)         │ "Company rules"

👤 PERSONAL WORKSPACES (~/.*)
├── 🏠 Office Setup (~/.bashrc)      │ "My desk preferences"
├── ⚙️ Tool Box (~/.vimrc)           │ "My tool settings"
├── 🔑 Key Ring (~/.ssh/)            │ "My access keys"
└── 📝 Project Notes (~/.gitconfig)   │ "My work style"

🏃 ACTIVE OPERATIONS (/var/, /tmp/)
├── 📊 Daily Reports (/var/log/)     │ "What happened today"
├── 🔄 Temp Storage (/var/cache/)    │ "Quick access files"
└── ⚡ Scratch Pad (/tmp/)          │ "Temporary work"

🎯 GOLDEN RULE: System files affect everyone, Personal files affect only you!
```

---

## **Part 1: Workshop Blueprint Fundamentals (30 minutes)**

### **A. Understanding Configuration Layers (15 minutes)**

#### **The Configuration Hierarchy**

**Story**: Think of configuration like a company org chart - decisions flow from top to bottom, but personal preferences can override general policies within limits.

```
👑 SYSTEM ADMINISTRATOR (Root Level)
├── 🏢 Company Policies (/etc/)        # Affects everyone
│   ├── Security rules for whole company
│   ├── Network settings for all departments  
│   └── Default software for all employees
│
├── 👥 DEPARTMENT MANAGERS (Group Level) 
│   ├── Team-specific settings
│   └── Shared group resources
│
└── 👤 INDIVIDUAL EMPLOYEES (User Level)
    ├── Personal workspace setup (~/.*)
    ├── Individual tool preferences
    └── Private settings and files
```

#### **Configuration Discovery Exercise**

```bash
# Let's explore your current workshop configuration
echo "🔍 DISCOVERING YOUR WORKSHOP CONFIGURATION"
echo "=========================================="

# Step 1: System-wide settings exploration
echo "🏢 SYSTEM HEADQUARTERS TOUR:"
ls -la /etc/ | head -10                # See the main office directories
echo ""

# Step 2: Personal workspace exploration  
echo "🏠 YOUR PERSONAL WORKSPACE:"
ls -la ~/.* 2>/dev/null | grep -E "bashrc|vimrc|ssh" # Your personal settings
echo ""

# Step 3: Find important configuration files
echo "📋 IMPORTANT CONFIG FILES IN YOUR WORKSHOP:"
find /etc -name "*.conf" 2>/dev/null | head -5     # System config files
echo ""

# Step 4: Check what configurations are active
echo "⚙️ ACTIVE CONFIGURATIONS:"
echo "Current shell: $SHELL"
echo "Home directory: $HOME"
echo "Default editor: ${EDITOR:-not set}"
echo "Current path: $PATH" | tr ':' '\n' | head -3
```

### **B. Creating Your Configuration Map (15 minutes)**

#### **Personal Configuration Inventory**

```bash
# Create your configuration inventory
mkdir -p ~/workshop_blueprint/{personal,system,templates}
cd ~/workshop_blueprint

echo "📋 CREATING YOUR CONFIGURATION INVENTORY"
echo "========================================"

# Document your current personal settings
cat > personal/current_setup.txt << EOF
# My Workshop Configuration Inventory - $(date)
# =============================================

SHELL ENVIRONMENT:
Default Shell: $SHELL
Home Directory: $HOME  
Current Editor: ${EDITOR:-none set}

PERSONAL FILES STATUS:
EOF

# Check which personal config files exist
for file in .bashrc .bash_aliases .vimrc .gitconfig .ssh/config; do
    if [ -f ~/$file ]; then
        echo "✅ $file exists" >> personal/current_setup.txt
    else
        echo "❌ $file missing" >> personal/current_setup.txt
    fi
done

echo ""
echo "📊 SYSTEM INFORMATION:"
echo "Operating System: $(lsb_release -d 2>/dev/null | cut -f2 || echo 'Unknown')"
echo "Kernel Version: $(uname -r)"
echo "Architecture: $(uname -m)"
echo ""

cat personal/current_setup.txt
```

---

## **Part 2: Building Your Master Configuration (40 minutes)**

### **A. Personal Environment Setup (20 minutes)**

#### **Interactive Environment Builder**

```bash
#!/bin/bash
# Interactive Personal Configuration Builder

echo "🎨 PERSONAL WORKSHOP CONFIGURATION BUILDER"
echo "=========================================="

# Get user preferences interactively
echo "Let's customize your perfect workshop environment!"
echo ""

# Editor preference
echo "🖊️ What's your preferred text editor?"
echo "1) nano (beginner-friendly)"
echo "2) vim (powerful, learning curve)"
echo "3) code (VS Code, if installed)"
read -p "Choice (1-3): " editor_choice

case $editor_choice in
    1) PREFERRED_EDITOR="nano" ;;
    2) PREFERRED_EDITOR="vim" ;;
    3) PREFERRED_EDITOR="code" ;;
    *) PREFERRED_EDITOR="nano" ;;
esac

# Theme preference
echo ""
echo "🎨 What's your preferred terminal theme?"
echo "1) Default (system standard)"
echo "2) Dark (easier on eyes)"
echo "3) Colorful (vibrant and fun)"
read -p "Choice (1-3): " theme_choice

# Create personalized configuration
cat > ~/.workshop_config << EOF
# Personal Workshop Configuration - Created $(date)
# =================================================

# Editor Settings
export EDITOR="$PREFERRED_EDITOR"
export VISUAL="\$EDITOR"

# Workshop Environment
export WORKSHOP_ROOT="\$HOME/workshop"
export BACKUP_DIR="\$HOME/backups"
export PROJECT_DIR="\$HOME/projects"

# Theme Setting
THEME_CHOICE=$theme_choice
EOF

# Create enhanced .bashrc additions
cat > ~/workshop_bashrc_additions << 'EOF'
# Workshop Custom Configuration
# ============================

# Load workshop settings
if [ -f ~/.workshop_config ]; then
    source ~/.workshop_config
fi

# Productivity Aliases
alias ll='ls -la --color=auto'
alias la='ls -A --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias home='cd ~'
alias workshop='cd $WORKSHOP_ROOT'
alias projects='cd $PROJECT_DIR'

# Safety Aliases (interactive mode)
alias cp='cp -i'
alias mv='mv -i'
alias rm='rm -i'

# Git Shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph'

# System Information Shortcuts
alias sysinfo='echo "=== System Info ==="; uname -a; echo; free -h; echo; df -h'
alias ports='netstat -tuln'
alias processes='ps aux --sort=-%cpu | head -10'

# Useful Functions
mkcd() { mkdir -p "$1" && cd "$1"; }
backup() { cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"; }
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.gz) tar -xzf "$1" ;;
            *.zip) unzip "$1" ;;
            *.tar) tar -xf "$1" ;;
            *) echo "Don't know how to extract '$1'" ;;
        esac
    else
        echo "File '$1' not found!"
    fi
}

# Enhanced Prompt (if theme choice was colorful)
if [ "${THEME_CHOICE:-1}" = "3" ]; then
    export PS1='\[\e[1;32m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ '
fi
EOF

# Apply the configuration safely
echo ""
echo "📝 Adding configuration to your .bashrc..."
echo "" >> ~/.bashrc
echo "# Workshop Configuration - Added $(date)" >> ~/.bashrc
cat ~/workshop_bashrc_additions >> ~/.bashrc

echo "✅ Personal configuration created!"
echo "🔄 To activate: source ~/.bashrc"
echo "📁 Configuration saved in: ~/.workshop_config"
```

### **B. Configuration Templates System (20 minutes)**

#### **Template Creation Workshop**

```bash
# Configuration Templates Builder
mkdir -p ~/workshop_blueprint/templates
cd ~/workshop_blueprint/templates

echo "🏗️ CONFIGURATION TEMPLATES WORKSHOP"
echo "==================================="

# Template 1: SSH Configuration Template
cat > ssh_config_template << 'EOF'
# SSH Configuration Template
# =========================

Host HOSTNAME_PLACEHOLDER
    HostName IP_ADDRESS_PLACEHOLDER
    User USERNAME_PLACEHOLDER
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ForwardAgent yes

# Usage Instructions:
# Replace HOSTNAME_PLACEHOLDER with friendly name
# Replace IP_ADDRESS_PLACEHOLDER with server IP
# Replace USERNAME_PLACEHOLDER with your username
EOF

# Template 2: Git Configuration Template
cat > git_config_template << 'EOF'
# Git Configuration Template
# ==========================

[user]
    name = YOUR_NAME_HERE
    email = YOUR_EMAIL_HERE

[core]
    editor = EDITOR_PLACEHOLDER
    autocrlf = input

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk

[push]
    default = simple

[pull]
    rebase = false
EOF

# Template 3: Nginx Virtual Host Template
cat > nginx_vhost_template << 'EOF'
# Nginx Virtual Host Template
# ===========================

server {
    listen 80;
    server_name DOMAIN_NAME_PLACEHOLDER;
    root /var/www/SITE_NAME_PLACEHOLDER;
    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optional: PHP support
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }

    access_log /var/log/nginx/SITE_NAME_PLACEHOLDER.access.log;
    error_log /var/log/nginx/SITE_NAME_PLACEHOLDER.error.log;
}
EOF

# Template Usage Script
cat > use_template.sh << 'EOF'
#!/bin/bash
# Template Application Helper

echo "🎨 CONFIGURATION TEMPLATE HELPER"
echo "==============================="

if [ $# -ne 1 ]; then
    echo "Available templates:"
    ls -1 *_template
    echo ""
    echo "Usage: $0 template_name"
    exit 1
fi

template_file="$1"
if [ ! -f "$template_file" ]; then
    echo "❌ Template '$template_file' not found!"
    exit 1
fi

echo "📝 Using template: $template_file"
echo "Please provide values for the following placeholders:"

# Find all placeholders in template
placeholders=$(grep -o '[A-Z_]*_PLACEHOLDER' "$template_file" | sort -u)

# Create temporary file for substitution
output_file="${template_file%_template}.configured"
cp "$template_file" "$output_file"

# Replace each placeholder
for placeholder in $placeholders; do
    read -p "Enter value for $placeholder: " value
    sed -i "s/$placeholder/$value/g" "$output_file"
done

echo "✅ Configuration created: $output_file"
echo "📁 Review and copy to appropriate location"
EOF

chmod +x use_template.sh

echo "✅ Configuration templates created!"
echo "🎯 To use a template: ./use_template.sh template_name"
echo "📁 Templates location: ~/workshop_blueprint/templates/"
```

---

## **Part 3: Automated Configuration Deployment (35 minutes)**

### **A. Configuration Automation Script (20 minutes)**

```bash
# Master Workshop Setup Automation
cat > ~/workshop_blueprint/deploy_workshop.sh << 'EOF'
#!/bin/bash
# Master Workshop Deployment Script

set -e  # Exit on any error

echo "🚀 MASTER WORKSHOP DEPLOYMENT"
echo "============================="

# Function to log actions
log_action() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a ~/.workshop_deployment.log
}

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        log_action "✅ $1 - SUCCESS"
    else
        log_action "❌ $1 - FAILED"
        exit 1
    fi
}

# Function to backup existing configuration
backup_existing() {
    log_action "📦 Creating backup of existing configuration..."
    BACKUP_DIR="$HOME/config_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup key configuration files
    for file in .bashrc .bash_aliases .vimrc .gitconfig .ssh/config; do
        if [ -f "$HOME/$file" ]; then
            cp "$HOME/$file" "$BACKUP_DIR/"
            log_action "📁 Backed up $file"
        fi
    done
    
    echo "💾 Backup created in: $BACKUP_DIR"
}

# Main deployment process
log_action "🎬 Starting workshop deployment..."

# Step 1: System updates
log_action "📦 Updating system packages..."
sudo apt update >/dev/null 2>&1
check_success "Package list update"

# Step 2: Install essential tools
log_action "🔧 Installing essential workshop tools..."
sudo apt install -y git vim curl wget tree htop screen >/dev/null 2>&1
check_success "Essential tools installation"

# Step 3: Backup existing configuration
backup_existing

# Step 4: Create workshop directory structure
log_action "🏗️ Creating workshop directory structure..."
mkdir -p ~/workshop/{projects,tools,docs,backup,scripts}
mkdir -p ~/projects
mkdir -p ~/backups
check_success "Directory structure creation"

# Step 5: Apply personal configuration
log_action "⚙️ Applying personal configuration..."
if [ -f ~/.workshop_config ]; then
    source ~/.workshop_config
    log_action "📋 Loaded personal configuration"
fi

# Step 6: Git configuration (if not already set)
if [ -z "$(git config --global user.name 2>/dev/null)" ]; then
    echo ""
    echo "🔧 Git Configuration Setup"
    read -p "Enter your full name for Git: " git_name
    read -p "Enter your email for Git: " git_email
    
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    git config --global init.defaultBranch main
    git config --global core.editor "${EDITOR:-nano}"
    
    check_success "Git configuration"
fi

# Step 7: SSH key setup (if not exists)
log_action "🔐 Setting up SSH keys..."
if [ ! -f ~/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""
    check_success "SSH key generation"
else
    log_action "📋 SSH key already exists"
fi

# Step 8: Apply enhanced bash configuration
log_action "🎨 Applying enhanced bash configuration..."
if [ -f ~/workshop_bashrc_additions ]; then
    if ! grep -q "Workshop Configuration" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Workshop Configuration - Added $(date)" >> ~/.bashrc
        cat ~/workshop_bashrc_additions >> ~/.bashrc
        check_success "Bash configuration update"
    else
        log_action "📋 Bash configuration already applied"
    fi
fi

# Step 9: Create useful scripts
log_action "📝 Creating utility scripts..."
cat > ~/workshop/scripts/system_health.sh << 'HEALTH_EOF'
#!/bin/bash
# System Health Check Script

echo "🏥 WORKSHOP HEALTH CHECK - $(date)"
echo "=================================="

echo "⚡ System Uptime:"
uptime

echo -e "\n💾 Memory Usage:"
free -h

echo -e "\n💽 Disk Usage:"
df -h | grep -E "/$|/home"

echo -e "\n🔥 CPU Temperature (if available):"
sensors 2>/dev/null | grep -i temp | head -3 || echo "Temperature sensors not available"

echo -e "\n🌐 Network Status:"
ping -c 1 google.com >/dev/null && echo "✅ Internet: Connected" || echo "❌ Internet: Disconnected"

echo -e "\n🔧 System Load:"
cat /proc/loadavg

echo "=================================="
echo "Health check complete!"
HEALTH_EOF

chmod +x ~/workshop/scripts/system_health.sh

# Step 10: Create backup script
cat > ~/workshop/scripts/backup_workshop.sh << 'BACKUP_EOF'
#!/bin/bash
# Workshop Backup Script

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$HOME/backups/workshop_backup_$BACKUP_DATE.tar.gz"

echo "📦 Creating workshop backup..."
echo "Backup file: $BACKUP_FILE"

tar -czf "$BACKUP_FILE" \
    --exclude="$HOME/backups" \
    "$HOME/workshop" \
    "$HOME/.bashrc" \
    "$HOME/.gitconfig" \
    "$HOME/.ssh/config" \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
    echo "📁 Size: $(du -sh "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed!"
fi
BACKUP_EOF

chmod +x ~/workshop/scripts/backup_workshop.sh

# Step 11: Final verification
log_action "✅ Running final verification..."
echo ""
echo "🎯 DEPLOYMENT VERIFICATION"
echo "========================="

# Check essential directories
for dir in workshop projects backups; do
    if [ -d "$HOME/$dir" ]; then
        echo "✅ Directory $dir exists"
    else
        echo "❌ Directory $dir missing"
    fi
done

# Check essential files
if [ -f ~/.ssh/id_rsa ]; then
    echo "✅ SSH key exists"
else
    echo "❌ SSH key missing"
fi

if git config --global user.name >/dev/null 2>&1; then
    echo "✅ Git configured"
else
    echo "❌ Git not configured"
fi

# Final message
echo ""
log_action "🎉 Workshop deployment completed!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Restart your terminal or run: source ~/.bashrc"
echo "2. Test your setup with: ~/workshop/scripts/system_health.sh"
echo "3. Create your first backup: ~/workshop/scripts/backup_workshop.sh"
echo ""
echo "📁 Deployment log saved to: ~/.workshop_deployment.log"
echo "💾 Configuration backup saved to: $BACKUP_DIR"
EOF

chmod +x ~/workshop_blueprint/deploy_workshop.sh

echo "🎉 Master deployment script created!"
echo "🚀 To deploy: ~/workshop_blueprint/deploy_workshop.sh"
```

### **B. Configuration Validation System (15 minutes)**

#### **Configuration Health Check**

```bash
# Configuration Health Checker
cat > ~/workshop_blueprint/validate_config.sh << 'EOF'
#!/bin/bash
# Workshop Configuration Validator

echo "🔍 WORKSHOP CONFIGURATION VALIDATOR"
echo "=================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check and report status
check_status() {
    local item="$1"
    local status="$2"
    
    if [ "$status" = "pass" ]; then
        echo -e "✅ ${GREEN}$item${NC}"
        return 0
    elif [ "$status" = "warn" ]; then
        echo -e "⚠️  ${YELLOW}$item${NC}"
        return 1
    else
        echo -e "❌ ${RED}$item${NC}"
        return 2
    fi
}

total_checks=0
passed_checks=0
warning_checks=0
failed_checks=0

# Check 1: Essential directories
echo "📁 DIRECTORY STRUCTURE CHECK"
echo "----------------------------"
for dir in workshop projects backups; do
    total_checks=$((total_checks + 1))
    if [ -d "$HOME/$dir" ]; then
        check_status "$dir directory exists" "pass"
        passed_checks=$((passed_checks + 1))
    else
        check_status "$dir directory missing" "fail"
        failed_checks=$((failed_checks + 1))
    fi
done
echo ""

# Check 2: Configuration files
echo "⚙️ CONFIGURATION FILES CHECK"
echo "----------------------------"
for file in .bashrc .gitconfig; do
    total_checks=$((total_checks + 1))
    if [ -f "$HOME/$file" ]; then
        check_status "$file exists" "pass"
        passed_checks=$((passed_checks + 1))
    else
        check_status "$file missing" "fail"
        failed_checks=$((failed_checks + 1))
    fi
done

# Check workshop-specific config
total_checks=$((total_checks + 1))
if [ -f "$HOME/.workshop_config" ]; then
    check_status "workshop configuration exists" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "workshop configuration missing" "warn"
    warning_checks=$((warning_checks + 1))
fi
echo ""

# Check 3: Git configuration
echo "🔧 GIT CONFIGURATION CHECK"
echo "--------------------------"
total_checks=$((total_checks + 1))
if git config --global user.name >/dev/null 2>&1; then
    git_name=$(git config --global user.name)
    check_status "Git user name set: $git_name" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "Git user name not set" "fail"
    failed_checks=$((failed_checks + 1))
fi

total_checks=$((total_checks + 1))
if git config --global user.email >/dev/null 2>&1; then
    git_email=$(git config --global user.email)
    check_status "Git email set: $git_email" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "Git email not set" "fail"
    failed_checks=$((failed_checks + 1))
fi
echo ""

# Check 4: SSH setup
echo "🔐 SSH CONFIGURATION CHECK"
echo "-------------------------"
total_checks=$((total_checks + 1))
if [ -f "$HOME/.ssh/id_rsa" ]; then
    check_status "SSH private key exists" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "SSH private key missing" "warn"
    warning_checks=$((warning_checks + 1))
fi

total_checks=$((total_checks + 1))
if [ -f "$HOME/.ssh/id_rsa.pub" ]; then
    check_status "SSH public key exists" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "SSH public key missing" "warn"
    warning_checks=$((warning_checks + 1))
fi
echo ""

# Check 5: Essential tools
echo "🛠️ ESSENTIAL TOOLS CHECK"
echo "------------------------"
for tool in git vim curl wget tree; do
    total_checks=$((total_checks + 1))
    if command -v $tool >/dev/null 2>&1; then
        check_status "$tool installed" "pass"
        passed_checks=$((passed_checks + 1))
    else
        check_status "$tool not installed" "fail"
        failed_checks=$((failed_checks + 1))
    fi
done
echo ""

# Check 6: Custom aliases
echo "🎯 CUSTOM ALIASES CHECK"
echo "----------------------"
total_checks=$((total_checks + 1))
if alias ll >/dev/null 2>&1; then
    check_status "Custom aliases loaded" "pass"
    passed_checks=$((passed_checks + 1))
else
    check_status "Custom aliases not loaded" "warn"
    warning_checks=$((warning_checks + 1))
fi
echo ""

# Summary report
echo "📊 VALIDATION SUMMARY"
echo "===================="
echo "Total Checks: $total_checks"
echo -e "✅ Passed: ${GREEN}$passed_checks${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$warning_checks${NC}"
echo -e "❌ Failed: ${RED}$failed_checks${NC}"
echo ""

# Overall status
if [ $failed_checks -eq 0 ]; then
    if [ $warning_checks -eq 0 ]; then
        echo -e "🎉 ${GREEN}Configuration Status: EXCELLENT${NC}"
    else
        echo -e "👍 ${YELLOW}Configuration Status: GOOD (with warnings)${NC}"
    fi
else
    echo -e "⚠️  ${RED}Configuration Status: NEEDS ATTENTION${NC}"
    echo ""
    echo "💡 RECOMMENDED ACTIONS:"
    echo "1. Run the deployment script: ~/workshop_blueprint/deploy_workshop.sh"
    echo "2. Restart your terminal session"
    echo "3. Re-run this validator"
fi
EOF

chmod +x ~/workshop_blueprint/validate_config.sh

echo "✅ Configuration validator created!"
echo "🔍 To validate: ~/workshop_blueprint/validate_config.sh"
```

---

## **Part 4: Version Control for Configurations (20 minutes)**

### **Configuration Version Control Workshop**

```bash
# Configuration Version Control Setup
cd ~/workshop_blueprint
git init

echo "📚 CONFIGURATION VERSION CONTROL"
echo "================================"

# Create .gitignore for sensitive data
cat > .gitignore << 'EOF'
# Sensitive files - never commit these!
**/id_rsa
**/id_rsa.*
**/*password*
**/*secret*
**/*key*
**/backup_*

# Temporary files
*.tmp
*.log
*~

# System specific files
.DS_Store
Thumbs.db
EOF

# Create README for the configuration repository
cat > README.md << 'EOF'
# Workshop Master Configuration

This repository contains the master blueprint for deploying standardized workshop environments.

## Contents

- `personal/` - Personal environment configurations
- `system/` - System-wide configuration templates  
- `templates/` - Reusable configuration templates
- `deploy_workshop.sh` - Master deployment script
- `validate_config.sh` - Configuration validator

## Quick Start

1. Clone this repository to a new system
2. Run `./deploy_workshop.sh` to deploy the complete environment
3. Run `./validate_config.sh` to verify the deployment
4. Customize personal settings as needed

## Template Usage

Use the template helper script:
```bash
./templates/use_template.sh template_name
```

## Maintenance

- Run health checks regularly with the generated scripts
- Create backups before making major changes
- Document any customizations in this README

## Version History

- v1.0: Initial master configuration
- Add your changes here...
EOF

# Create version tracking
echo "v1.0.0" > VERSION

# Commit the initial configuration
git add .
git commit -m "Initial workshop master configuration v1.0.0

- Complete personal environment setup
- Configuration templates for SSH, Git, Nginx
- Automated deployment and validation scripts
- Documentation and version control setup"

echo "✅ Configuration repository initialized!"
echo "📚 Repository location: ~/workshop_blueprint/"
echo "🔍 To see status: cd ~/workshop_blueprint && git status"
```

### **Configuration Backup Strategy**

```bash
# Automated Configuration Backup System
cat > ~/workshop_blueprint/backup_configs.sh << 'EOF'
#!/bin/bash
# Configuration Backup System

BACKUP_DIR="$HOME/config_backups"
DATE_STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="config_backup_$DATE_STAMP"

echo "💾 CONFIGURATION BACKUP SYSTEM"
echo "=============================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📦 Creating configuration backup: $BACKUP_NAME"

# Create structured backup
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"/{personal,system,logs}

# Backup personal configurations
echo "📁 Backing up personal configurations..."
for file in .bashrc .bash_aliases .vimrc .gitconfig .workshop_config; do
    if [ -f "$HOME/$file" ]; then
        cp "$HOME/$file" "$BACKUP_DIR/$BACKUP_NAME/personal/"
        echo "  ✅ $file"
    fi
done

# Backup SSH configuration (safely)
if [ -d "$HOME/.ssh" ]; then
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME/personal/ssh"
    cp "$HOME/.ssh/config" "$BACKUP_DIR/$BACKUP_NAME/personal/ssh/" 2>/dev/null || true
    cp "$HOME/.ssh/*.pub" "$BACKUP_DIR/$BACKUP_NAME/personal/ssh/" 2>/dev/null || true
    echo "  ✅ SSH public configuration"
fi

# Backup system information (read-only)
echo "📋 Backing up system information..."
uname -a > "$BACKUP_DIR/$BACKUP_NAME/system/system_info.txt"
lsb_release -a > "$BACKUP_DIR/$BACKUP_NAME/system/os_info.txt" 2>/dev/null || true
dpkg -l > "$BACKUP_DIR/$BACKUP_NAME/system/installed_packages.txt" 2>/dev/null || true

# Create restoration script
cat > "$BACKUP_DIR/$BACKUP_NAME/restore.sh" << 'RESTORE_EOF'
#!/bin/bash
# Configuration Restoration Script

echo "🔄 RESTORING WORKSHOP CONFIGURATION"
echo "=================================="

BACKUP_PATH="$(dirname "$0")"

# Restore personal files
for file in "$BACKUP_PATH/personal"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$HOME/.$filename"
        echo "✅ Restored $filename"
    fi
done

# Restore SSH config
if [ -d "$BACKUP_PATH/personal/ssh" ]; then
    mkdir -p "$HOME/.ssh"
    cp "$BACKUP_PATH/personal/ssh"/* "$HOME/.ssh/" 2>/dev/null || true
    chmod 700 "$HOME/.ssh"
    chmod 600 "$HOME/.ssh"/* 2>/dev/null || true
    echo "✅ Restored SSH configuration"
fi

echo "🎉 Configuration restored! Please restart your terminal."
RESTORE_EOF

chmod +x "$BACKUP_DIR/$BACKUP_NAME/restore.sh"

# Create archive
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

echo "✅ Backup completed!"
echo "📁 Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
echo "🔄 To restore: extract archive and run restore.sh"

# Keep only last 5 backups
echo "🧹 Cleaning old backups (keeping last 5)..."
ls -t "$BACKUP_DIR"/config_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
echo "✅ Cleanup complete!"
EOF

chmod +x ~/workshop_blueprint/backup_configs.sh

echo "💾 Configuration backup system ready!"
echo "📦 To backup: ~/workshop_blueprint/backup_configs.sh"
```

---

## **Part 5: Hands-On Lab Challenge (15 minutes)**

### **Configuration Master Challenge**

```bash
echo "🎯 CONFIGURATION MASTER CHALLENGE"
echo "================================="
echo ""
echo "🏆 Your Mission:"
echo "Create a complete workshop configuration package that can be deployed"
echo "on any new system to instantly recreate your perfect environment."
echo ""
echo "📋 Challenge Requirements:"
echo "1. ✅ Personal environment configured with your preferences"
echo "2. ✅ Essential tools installed and configured"  
echo "3. ✅ Git properly set up with your information"
echo "4. ✅ SSH keys generated and configured"
echo "5. ✅ Custom aliases and functions working"
echo "6. ✅ Configuration backed up and version controlled"
echo "7. ✅ Deployment script that works on clean systems"
echo "8. ✅ Validation script to verify everything works"
echo ""
echo "🚀 Challenge Steps:"
echo "1. Run your deployment script: ~/workshop_blueprint/deploy_workshop.sh"
echo "2. Validate with: ~/workshop_blueprint/validate_config.sh"
echo "3. Create a backup: ~/workshop_blueprint/backup_configs.sh"
echo "4. Test one template: cd ~/workshop_blueprint/templates && ./use_template.sh ssh_config_template"
echo "5. Commit changes: cd ~/workshop_blueprint && git add . && git commit -m 'Challenge completed'"
echo ""
echo "⏰ Time Limit: 15 minutes"
echo "🎉 Success Criteria: All validation checks pass!"
echo ""
read -p "Press Enter to start the challenge..."

# Start the challenge timer
echo "⏰ Challenge started at: $(date)"
echo "🏁 You have 15 minutes. Good luck!"
```

---

## **Session Wrap-up & Key Takeaways (10 minutes)**

### **Visual Summary: What You've Built**

```
🏗️ YOUR WORKSHOP MASTER BLUEPRINT
=================================

📦 COMPLETE PACKAGE CONTENTS:
├── 🎨 Personal Environment Setup
│   ├── Custom bash configuration
│   ├── Productivity aliases & functions
│   └── Theme and editor preferences
│
├── 🏗️ Configuration Templates
│   ├── SSH connection templates
│   ├── Git configuration templates  
│   └── Service configuration templates
│
├── 🚀 Deployment Automation
│   ├── Master deployment script
│   ├── Configuration validator
│   └── Health check tools
│
├── 💾 Backup & Recovery
│   ├── Automated backup system
│   ├── Version control integration
│   └── Restoration procedures
│
└── 📚 Documentation
    ├── Usage instructions
    ├── Template guidelines
    └── Troubleshooting guide

🎯 RESULT: Any new system can be transformed into your 
perfect workshop environment in minutes!
```

### **Professional Skills Mastered**
- **Configuration Management**: Systematic approach to system setup
- **Automation Scripting**: Reducing manual work through scripts
- **Template Systems**: Reusable configuration patterns
- **Version Control**: Tracking and managing configuration changes
- **Backup Strategies**: Protecting configuration investments
- **Validation Testing**: Ensuring deployments work correctly

### **Daily Workflow Integration**
```bash
# Your new daily commands:
~/workshop_blueprint/validate_config.sh     # Check system health
~/workshop_blueprint/backup_configs.sh      # Backup configurations
~/workshop/scripts/system_health.sh         # System monitoring
source ~/.bashrc                           # Reload configuration
```

### **Next Session Preview**
*"Tomorrow we venture beyond your local workshop into the world of remote administration. You'll learn to manage workshop locations across the globe, connecting securely, transferring files, and maintaining consistent operations anywhere in the world. Your local mastery becomes global expertise!"*

---

## **Homework Assignment**
1. **Deploy** your master configuration on a virtual machine or different user account
2. **Customize** at least one configuration template for a real use case
3. **Document** any issues you encounter and how you solved them
4. **Share** your configuration repository with a classmate for feedback

**Success Metrics**: Can recreate your perfect development environment on any Linux system in under 10 minutes!
