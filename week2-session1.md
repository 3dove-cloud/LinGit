# Week 2 Session 1: Users & Permissions - Enhanced Edition
*Building Your Workshop Team & Understanding System Control*

## 🎯 Session Overview (2 Hours)
**Story Theme**: "Your digital workshop has become so successful that you need to hire assistants and specialists. Today you become not just a workshop owner, but a workshop manager leading a diverse team while learning the deeper mechanics of system control."

**Learning Objectives:**
- Master user and group management
- Understand file permissions and security
- Learn environment variables and system configuration
- Practice job control and process management
- Implement security best practices

---

## 📋 Part 1: Understanding Your Workshop Environment (30 minutes)

### The Workshop Hierarchy - Who's Who in Linux

**Story**: Linux users are like different roles in a workshop with specific environments and capabilities.

#### Environment Variables - Your Workshop Settings

Think of environment variables as the workshop's "settings board" - they control how everything operates.

```bash
# View your current workshop environment
env                    # See all environment settings
printenv USER          # Who you are
printenv HOME          # Your workspace location
printenv PATH          # Where the system looks for tools
echo $SHELL           # What command interface you're using
```

**Visual Concept:**
```
Workshop Settings Board:
┌─────────────────────────┐
│ USER = alice           │
│ HOME = /home/alice     │
│ PATH = /usr/bin:/bin   │
│ SHELL = /bin/bash      │
└─────────────────────────┘
```

#### Basic User Commands with Environment Context
```bash
# Find out who you are and your environment
whoami              # Shows your username
id                  # Shows your user number and groups
groups              # Shows what teams you belong to
echo $USER          # Environment variable for username
echo $HOME          # Your home directory path
pwd                 # Current working directory
```

**Quick Practice:**
```bash
# Create your first environment variable
MY_WORKSHOP="Digital_Linux_Lab"
echo $MY_WORKSHOP
export MY_WORKSHOP    # Make it available to other programs
```

### Understanding System Users

#### Visual User Hierarchy
```
Linux User Structure:
     ┌─────────────┐
     │    root     │ ← The Master Craftsman (UID 0)
     │ (Superuser) │
     └─────────────┘
           │
     ┌─────────────┐
     │ Regular     │ ← Workshop Workers (UID 1000+)
     │ Users       │   alice, bob, charlie
     └─────────────┘
           │
     ┌─────────────┐
     │ System      │ ← Background Helpers (UID < 1000)
     │ Users       │   www-data, mysql, ssh
     └─────────────┘
```

#### Getting Root Powers When Needed
```bash
su -                # Become root (need root password)
sudo whoami         # Run one command as root
sudo -i             # Interactive root session
exit                # Return to normal user
```

**Safety First**: Always use `sudo` for single commands rather than staying as root.

---

## 👥 Part 2: Creating and Managing Your Team (25 minutes)

### Adding People to Your Workshop

```bash
# Create a new user with proper setup
sudo useradd -m -s /bin/bash alice    # -m creates home, -s sets shell
sudo passwd alice                     # Set their password

# Better way: use adduser (more interactive)
sudo adduser bob                      # Asks questions, sets up properly

# Add user to a group
sudo usermod -aG developers alice     # Add Alice to developers group
sudo usermod -aG sudo bob            # Give Bob admin privileges
```

#### Checking User Information
```bash
# See user information in detail
cat /etc/passwd | tail -5             # See recent users
getent passwd alice                   # Get specific user info
cat /etc/group | grep developers      # Check who's in a group
groups alice                          # Check alice's groups
```

**File Structure Explanation**:
```
/etc/passwd format:
username:password:UID:GID:full_name:home_directory:shell
alice   : x      :1001:1001:Alice Smith:/home/alice   :/bin/bash
```

### Visual Practice: User Creation Workflow
```bash
# Complete user setup workflow
echo "=== Creating New Team Member ==="
sudo adduser charlie
echo "User created. Checking setup..."
getent passwd charlie
groups charlie
ls -la /home/charlie
echo "Setup complete!"
```

---

## 🔐 Part 3: Workshop Security System - File Permissions (35 minutes)

### Understanding File Permissions - The Advanced Lock System

**Story**: File permissions are like a sophisticated lock system with different keys for different people.

#### Visual Permission Matrix
```
Permission Matrix:
       │ READ (r) │ WRITE (w) │ EXECUTE (x) │
       │    4     │     2     │      1      │
───────┼──────────┼───────────┼─────────────┤
Owner  │    ✓     │     ✓     │      ✓      │ = 7
Group  │    ✓     │     -     │      ✓      │ = 5
Others │    ✓     │     -     │      -      │ = 4
                                        Total: 754
```

#### Reading Permission Information
```bash
ls -la workshop_files/
# Example output: -rwxr-x--- 1 alice developers 1024 Jan 1 12:00 file.txt
```

**Breaking Down the Permission String**:
```
-rwxr-x---
│││││││└└└─ Others permissions (---)
││││││└─── Group permissions (r-x)
│││└└└─── Owner permissions (rwx)
││└─────── Number of hard links
│└──────── File type (- = file, d = directory)
└───────── Permission string start
```

#### Common Permission Patterns Explained
```bash
# Setting permissions with numbers (octal notation)
chmod 755 public_tools/      # Owner: full, Others: read+execute
chmod 700 private_office/    # Owner only, nobody else
chmod 644 document.txt       # Owner: read+write, Others: read only
chmod 600 secret.txt         # Owner: read+write only
chmod 777 shared_space/      # Everyone: full access (DANGEROUS!)
```

**Number System Deep Dive**:
- **4** = read permission
- **2** = write permission  
- **1** = execute permission
- **Add them up**: 7=rwx, 6=rw-, 5=r-x, 4=r--, 3=-wx, 2=-w-, 1=--x, 0=---

#### Advanced Permission Management
```bash
# Using letters (symbolic method)
chmod u+w file.txt          # Give owner write permission
chmod g-x file.txt          # Remove execute from group
chmod o+r file.txt          # Give others read permission
chmod a+x script.sh         # Give everyone execute permission
chmod ug+rw shared.txt      # Give owner and group read+write

# Special permissions
chmod +t /tmp               # Sticky bit (only owner can delete)
chmod g+s shared_folder/    # Set group ID (new files inherit group)
```

### Changing File Ownership
```bash
# Change ownership
sudo chown alice file.txt              # Make alice the owner
sudo chgrp developers file.txt         # Change group to developers
sudo chown alice:developers file.txt   # Change both at once
sudo chown -R alice:developers folder/ # Recursive change

# Verify changes
ls -la file.txt
stat file.txt               # Detailed file information
```

---

## ⚙️ Part 4: Job Control & Process Management (20 minutes)

### Managing Workshop Tasks (Processes)

**Story**: Sometimes you need to run multiple tasks in your workshop simultaneously or manage long-running jobs.

#### Basic Job Control
```bash
# Start a long-running task in background
sleep 300 &                 # Sleep for 5 minutes in background
echo "Task started in background"

# See active jobs
jobs                        # List current jobs
ps aux | grep sleep         # Find the process

# Bring job to foreground
fg %1                       # Bring job 1 to foreground (Ctrl+Z to pause)

# Send job to background
bg %1                       # Resume job 1 in background

# Kill a job
kill %1                     # Kill job 1
kill -9 PID                 # Force kill by process ID
```

#### Practical Process Management
```bash
# Monitor system processes
top                         # Interactive process monitor
htop                        # Better process monitor (if installed)
ps -ef                      # All processes with full details

# Find specific processes
pgrep -l bash              # Find bash processes
pkill -f firefox           # Kill processes with 'firefox' in command
```

#### Input/Output Redirection Basics
```bash
# Redirect output to files
ls -la > file_list.txt      # Write output to file (overwrites)
ls -la >> file_list.txt     # Append output to file
echo "Workshop Log: $(date)" >> workshop.log

# Redirect input from files  
sort < unsorted_list.txt    # Read input from file
wc -l < file_list.txt      # Count lines from file

# Pipe output between commands
ps aux | grep bash          # Find bash processes
ls -la | sort | head -5     # List, sort, show first 5
```

---

## 🔧 Part 5: Hands-On Workshop Team Setup (25 minutes)

### Complete Team Environment Lab

#### Mission: Create a Collaborative Workshop Environment

```bash
#!/bin/bash
# Workshop Team Setup Script

echo "=== Setting up Workshop Team Environment ==="

# Step 1: Create users with proper environments
echo "Creating team members..."
sudo adduser --quiet alice
sudo adduser --quiet bob  
sudo adduser --quiet charlie

# Step 2: Create specialized groups
echo "Creating workshop groups..."
sudo groupadd workshop_managers
sudo groupadd workshop_workers
sudo groupadd workshop_guests

# Step 3: Assign team roles
echo "Assigning roles..."
sudo usermod -aG workshop_managers,sudo alice
sudo usermod -aG workshop_workers bob
sudo usermod -aG workshop_workers charlie
sudo usermod -aG workshop_guests bob

# Step 4: Create shared workspaces
echo "Setting up shared spaces..."
sudo mkdir -p /workshop/{management,projects,public}
sudo chown root:workshop_managers /workshop/management
sudo chown root:workshop_workers /workshop/projects  
sudo chown root:workshop_guests /workshop/public

# Step 5: Set appropriate permissions
sudo chmod 750 /workshop/management    # Managers only
sudo chmod 775 /workshop/projects      # Workers collaborate
sudo chmod 755 /workshop/public        # Everyone can read

# Step 6: Create environment setup for users
echo "Configuring user environments..."
for user in alice bob charlie; do
    sudo -u $user bash -c 'echo "export WORKSHOP_HOME=/workshop" >> ~/.bashrc'
    sudo -u $user bash -c 'echo "export WORKSHOP_ROLE=$(groups | cut -d\" \" -f1)" >> ~/.bashrc'
done

echo "Workshop setup complete!"
echo "Team structure:"
getent group workshop_managers
getent group workshop_workers  
getent group workshop_guests
```

### Testing Your Workshop Setup

```bash
# Verification commands
echo "=== Workshop Environment Test ==="

# Test 1: Check users exist
echo "Users created:"
getent passwd alice bob charlie

# Test 2: Check group memberships
echo "Group memberships:"
groups alice
groups bob
groups charlie

# Test 3: Test directory permissions
echo "Testing access permissions..."
sudo ls -la /workshop/

# Test 4: Test file creation in shared spaces
sudo -u alice touch /workshop/management/manager_file.txt
sudo -u bob touch /workshop/projects/worker_file.txt
sudo -u charlie touch /workshop/public/public_file.txt 2>/dev/null || echo "Charlie cannot write to public (correct!)"

echo "Test complete!"
```

---

## 🔍 Part 6: Advanced Troubleshooting & Security (15 minutes)

### Permission Troubleshooting

#### Common Permission Problems and Solutions

```bash
# Problem: Can't access a file
ls -la problem_file.txt
# Solution: Check ownership and permissions
sudo chown $USER:$USER problem_file.txt
chmod 644 problem_file.txt

# Problem: Script won't execute
ls -la my_script.sh
# Solution: Add execute permission
chmod +x my_script.sh

# Problem: Can't write to directory
ls -ld shared_directory/
# Solution: Check directory permissions
chmod 755 shared_directory/
```

#### Security Best Practices Checklist

```bash
# Security audit commands
echo "=== Security Audit ==="

# Check for users with shell access
grep -E '/bin/(bash|sh)$' /etc/passwd

# Check for users with sudo privileges  
getent group sudo

# Check for files with dangerous permissions
find /home -perm 777 -type f 2>/dev/null

# Check for large files (potential security risk)
find /home -size +100M -type f 2>/dev/null

# Check login history
last -10

echo "Audit complete!"
```

---

## 📚 Key Concepts Summary

### Essential Commands Mastered
```bash
# Environment & User Management
env, printenv, export          # Environment variables
whoami, id, groups            # User identification
sudo adduser, usermod         # User management

# File Permissions
ls -la, chmod, chown, chgrp   # Permission management
stat                          # File details

# Process Control
jobs, fg, bg, kill           # Job control
ps, top, pgrep, pkill        # Process management

# I/O Redirection
>, >>, <, |                  # Input/output redirection
```

### Permission Number Reference
```
7 = rwx (read, write, execute)
6 = rw- (read, write)
5 = r-x (read, execute)  
4 = r-- (read only)
3 = -wx (write, execute)
2 = -w- (write only)
1 = --x (execute only)
0 = --- (no permissions)
```

### Security Best Practices
1. **Never work as root** for daily tasks
2. **Use sudo** for administrative commands
3. **Set minimal permissions** needed for functionality
4. **Regular security audits** of users and permissions
5. **Monitor system logs** for suspicious activity

---

## 🎯 Session Wrap-up & Next Session Preview

**What You've Mastered:**
- User and group management
- File permission system
- Environment variables
- Basic job control
- Security fundamentals

**Next Session**: Package Management - "Managing the Workshop Supply Chain"
- Installing and managing software
- Repository management
- Dependency resolution
- Security updates and maintenance

**Homework Challenge**: Create a multi-user project environment with proper permissions and shared resources for a simulated team project.

---

## 🆘 Quick Reference Card

### Most Used Commands
```bash
# User Management
sudo adduser username         # Create user
sudo usermod -aG group user   # Add to group
groups username              # Check user groups

# Permissions  
chmod 755 file               # Set permissions
chown user:group file        # Change ownership
ls -la                       # View permissions

# Environment
echo $VARIABLE               # Show variable
export VAR=value             # Set variable
env                          # Show all variables

# Process Control
command &                    # Run in background
jobs                         # List active jobs
kill %1                      # Kill job 1
```

*Remember: Your Linux system is like a workshop - proper organization, security, and management lead to productive and safe operation!*
