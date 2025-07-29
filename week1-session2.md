# Week 1 Session 2: Command Line Essentials
*Mastering Your Workshop Tools*

---

## Session Overview (2 Hours)
### **Story Theme: "Becoming a Workshop Craftsperson"**

**Learning Objectives:**
- Master advanced navigation and file operations
- Learn input/output redirection and pipes
- Understand PATH manipulation and environment variables
- Practice efficient information gathering techniques

---

## **Opening Scene (10 minutes)**
*"The workshop assistant has arrived! She's impressed that you found the terminal but now wants to teach you the essential tools every workshop master must know. 'These tools,' she says, 'will be your daily companions in every project you undertake.'"*

---

## **Part 1: Advanced Navigation Mastery (35 minutes)**

### **A. The Workshop Map Deep Dive (15 minutes)**

#### **Complete Filesystem Hierarchy Visual**
```
                         / (Root - Foundation Level)
                        /|\
               ┌────────┼────────────────────────────┐
              /         |                           \
            bin/       etc/        home/      usr/      var/
             │          |           │         │         │
        (Commands)  (Configs)   (Users)   (Programs)  (Data)
             │          │           │         │         │
          ┌──┴──┐      │      ┌────┴────┐   │    ┌────┴────┐
         ls   cp      │     alice/  bob/   │   log/    tmp/
         mv   rm    passwd    │      │    │    │        │
         ...       hosts   Documents Desktop bin/   system.log
                            Pictures         lib/   messages
```

**Navigation Commands Deep Dive:**
```bash
# Absolute paths (start from root /)
cd /home/username/Documents     # Full path from root
ls /usr/bin                     # List system commands
cat /etc/hostname               # Read system configuration

# Relative paths (from current location)
cd Documents                    # Go to Documents from current location
cd ../..                        # Go up two directories
cd ./projects/web              # Current directory + path

# Special shortcuts
cd ~                           # Home directory
cd -                           # Previous directory
cd                             # Also goes home
```

### **B. Efficient Path Navigation (20 minutes)**

#### **Advanced Directory Navigation**
```bash
# Path shortcuts you must know
~           # Home directory
.           # Current directory  
..          # Parent directory
-           # Previous directory
/           # Root directory

# Navigation examples
cd ~/Documents                  # Go to Documents in home
cd ./project1                   # Go to project1 in current directory
cd ../../etc                    # Go up two levels, then to etc
cd -                           # Return to previous location
```

#### **Directory Stack Management**
```bash
# Bookmark and return system
pushd /var/log                 # Save current location, go to /var/log
pushd ~/Documents              # Stack another location
dirs                           # Show directory stack
popd                           # Return to previous location
popd                           # Return to location before that
```

**Directory Stack Visual:**
```
Initial: /home/user
         ↓
pushd /var/log
Stack: [/home/user] → /var/log
         ↓
pushd ~/Documents  
Stack: [/home/user, /var/log] → /home/user/Documents
         ↓
popd
Stack: [/home/user] → /var/log
         ↓
popd  
Stack: [] → /home/user
```

---

## **Part 2: Environment Variables & PATH (30 minutes)**

### **A. Understanding Your Workshop Environment (15 minutes)**

#### **Environment Variables Explained**
Environment variables are like workshop settings that tell programs how to behave.

```bash
# Essential environment variables
echo $HOME          # Your home directory path
echo $USER          # Your username
echo $PATH          # Where system looks for commands
echo $SHELL         # Your command interpreter
echo $PWD           # Present working directory

# See all environment variables
printenv            # List all environment variables
env                 # Alternative command for same thing
```

#### **Environment Variables Visual**
```
Environment Variables = Workshop Settings
┌─────────────────────────────────────────┐
│ $HOME = /home/username  (Your Space)    │
│ $PATH = /bin:/usr/bin   (Tool Locations)│  
│ $USER = username        (Your Identity) │
│ $SHELL = /bin/bash      (Your Interface)│
│ $PWD = /current/path    (Where You Are) │
└─────────────────────────────────────────┘
```

### **B. PATH Variable Deep Dive (15 minutes)**

#### **Understanding PATH**
PATH tells the system where to look for commands when you type them.

```bash
# View your PATH
echo $PATH
# Output: /usr/local/bin:/usr/bin:/bin:/usr/games

# What this means:
# /usr/local/bin  (Local programs - highest priority)
# /usr/bin        (User programs)  
# /bin            (System commands)
# /usr/games      (Games - lowest priority)
```

#### **PATH Visual Diagram**
```
You type: ls
         ↓
System searches PATH in order:
    /usr/local/bin/ls  (not found)
           ↓
    /usr/bin/ls        (not found)  
           ↓
    /bin/ls            (FOUND! ✓)
           ↓  
    Execute: /bin/ls
```

**PATH Manipulation:**
```bash
# See where a command is located
which ls            # Shows: /bin/ls
which python3       # Shows: /usr/bin/python3
type ls             # Shows: ls is hashed (/bin/ls)

# Temporarily add directory to PATH
export PATH="$PATH:/home/username/my_scripts"
echo $PATH          # Verify addition

# Create a custom command location
mkdir ~/my_commands
echo 'echo "Hello from custom command!"' > ~/my_commands/hello
chmod +x ~/my_commands/hello
export PATH="$PATH:$HOME/my_commands"
hello               # Now works from anywhere!
```

---

## **Part 3: Input/Output Redirection & Pipes (40 minutes)**

### **A. Understanding Data Flow (20 minutes)**

#### **Standard Data Streams**
Every command has three data streams:
- **stdin** (0): Input channel
- **stdout** (1): Output channel  
- **stderr** (2): Error channel

#### **Data Flow Visual**
```
Command Processing Flow:
┌─────────┐    ┌─────────────┐    ┌─────────┐
│ Input   │───▶│   Command   │───▶│ Output  │
│ (stdin) │    │ Processing  │    │(stdout) │
└─────────┘    └─────────────┘    └─────────┘
                      │
                      ▼
                ┌─────────┐
                │ Errors  │
                │(stderr) │
                └─────────┘
```

#### **Basic Redirection**
```bash
# Output redirection
echo "Hello Workshop" > greeting.txt        # Write to file (overwrite)
echo "Day 2 progress" >> workshop_log.txt   # Append to file
ls -la > directory_listing.txt              # Save command output

# Input redirection  
cat < greeting.txt                          # Read from file
sort < names.txt                            # Sort contents of file

# Error redirection
ls /nonexistent 2> error_log.txt           # Redirect errors to file
ls /nonexistent 2>/dev/null                # Discard errors
ls /nonexistent > output.txt 2>&1          # Redirect both output and errors
```

### **B. Pipes - Connecting Commands (20 minutes)**

#### **Pipe Concept Visual**
```
Command Chaining with Pipes:
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Command 1│ │  │Command 2│ │  │Command 3│ │  │ Final   │
│  ls -la │─┼─▶│  grep   │─┼─▶│  sort   │─┼─▶│ Output  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

**Practical Pipe Examples:**
```bash
# Basic pipes
ls -la | head -5                    # Show first 5 files
ls -la | tail -3                    # Show last 3 files
ls -la | grep "txt"                 # Show only .txt files
ps aux | grep "bash"                # Find bash processes

# Multi-stage pipes
ls -la | grep "txt" | sort          # Find txt files and sort them
cat /etc/passwd | cut -d: -f1 | sort # List usernames alphabetically
history | tail -10 | grep "ls"      # Find recent ls commands

# Practical examples
du -h | sort -hr | head -10         # Find 10 largest directories
ps aux | sort -k3 -nr | head -5     # Find processes using most CPU
```

#### **Pipe Practice Workshop**
```bash
# Create practice data
echo -e "apple\nbanana\ncherry\napricot\nblueberry" > fruits.txt
echo -e "red\nblue\ngreen\nyellow\nred\nblue" > colors.txt

# Practice pipe combinations
cat fruits.txt | sort                       # Sort alphabetically
cat fruits.txt | grep "a" | sort           # Find fruits with 'a', then sort
cat colors.txt | sort | uniq               # Sort and remove duplicates
cat colors.txt | sort | uniq -c            # Count occurrences
```

---

## **Part 4: Information Gathering Mastery (20 minutes)**

### **A. Advanced File Inspection (10 minutes)**

#### **File Information Commands**
```bash
# File content analysis
wc filename.txt             # Lines, words, characters
wc -l filename.txt          # Just line count
wc -w filename.txt          # Just word count
wc -c filename.txt          # Just character count

# File type identification
file script.sh              # Identify file type
file image.jpg              # Works on any file
file /bin/ls                # Check binary files

# File size and space usage
ls -lh                      # Human-readable file sizes
du -sh directory/           # Directory size
du -sh * | sort -hr         # Largest items first
```

### **B. System Information Commands (10 minutes)**

```bash
# System status
uptime                      # System load and uptime
free -h                     # Memory usage (human-readable)
df -h                       # Disk space usage
ps aux | head -10           # Top 10 processes
who                         # Who is logged in
id                          # Your user/group information

# Hardware information
uname -a                    # Complete system information
lscpu | head -10            # CPU information (first 10 lines)
lsblk                       # Block devices (disks)
```

---

## **Part 5: Comprehensive Lab Challenge (15 minutes)**

### **Workshop Information System**
*"Create a comprehensive information gathering system for your workshop."*

```bash
# Create workshop intelligence script
cat > workshop_intel.sh << 'EOF'
#!/bin/bash
echo "=== WORKSHOP INTELLIGENCE REPORT ==="
echo "Generated: $(date)"
echo "Analyst: $(whoami)"
echo "Location: $(pwd)"
echo

echo "--- ENVIRONMENT STATUS ---"
echo "Home: $HOME"
echo "Shell: $SHELL"
echo "Path: $PATH" | tr ':' '\n' | head -5

echo
echo "--- SYSTEM RESOURCES ---"
uptime
free -h | grep Mem
df -h / | tail -1

echo
echo "--- RECENT ACTIVITY ---"
history | tail -5 | cut -c8-

echo
echo "--- CURRENT DIRECTORY ANALYSIS ---"
ls -la | wc -l | tr -d '\n'; echo " total items"
ls -la | grep "^d" | wc -l | tr -d '\n'; echo " directories"
ls -la | grep "^-" | wc -l | tr -d '\n'; echo " files"

echo "=== REPORT COMPLETE ==="
EOF

chmod +x workshop_intel.sh
./workshop_intel.sh
```

### **Advanced Pipe Challenges**
```bash
# Challenge 1: Find your most used commands
history | cut -c8- | cut -d' ' -f1 | sort | uniq -c | sort -nr | head -5

# Challenge 2: Analyze file types in current directory
file * | cut -d: -f2 | sort | uniq -c

# Challenge 3: Create a system summary one-liner
echo "System: $(uname -s), User: $(whoami), Files: $(ls | wc -l), Date: $(date +%Y-%m-%d)"
```

---

## **Session Summary & Key Takeaways**

### **Advanced Skills Mastered**
```bash
# Navigation Mastery
cd ~, cd -, cd .., pushd, popd, dirs

# Environment Management  
echo $VAR, export PATH, which, type, printenv

# I/O Redirection
>, >>, <, 2>, 2>&1, |

# Information Commands
wc, file, du, df, free, uptime, ps, who, id
```

### **Pipe Combinations to Remember**
```bash
command | head -n        # First n lines
command | tail -n        # Last n lines  
command | grep pattern   # Filter by pattern
command | sort           # Sort output
command | uniq           # Remove duplicates
command | wc -l          # Count lines
```

### **Environment Variables to Know**
- `$HOME` - Your home directory
- `$PATH` - Command search path
- `$USER` - Your username
- `$SHELL` - Your command shell
- `$PWD` - Current directory

---

## **Take-Home Practice**

### **Daily Efficiency Script**
```bash
# Create your daily efficiency enhancer
cat > ~/daily_check.sh << 'EOF'
#!/bin/bash
# Quick system check with pipes and redirection
echo "=== DAILY EFFICIENCY CHECK ===" | tee daily_log.txt
date >> daily_log.txt
echo "Disk Usage:" >> daily_log.txt
df -h / | tail -1 >> daily_log.txt
echo "Most Recent Commands:" >> daily_log.txt
history | tail -3 | cut -c8- >> daily_log.txt
echo "Check complete - logged to daily_log.txt"
EOF

chmod +x ~/daily_check.sh
```

### **Practice Exercises**
1. **Pipe Practice**: Combine `ls`, `grep`, `sort`, and `head` in different ways
2. **Environment**: Add a custom directory to your PATH
3. **Redirection**: Save command outputs to files and combine them
4. **Navigation**: Use `pushd`/`popd` to bookmark frequently visited directories

**Next Session Preview**: "System Information & Processes" - Monitor system resources, manage processes, and understand system performance.
