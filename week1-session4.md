# Week 1 Session 4: File Operations & Text Processing
*Mastering the Workshop's Information Systems*

---

## Session Overview (2 Hours)
### **Story Theme: "The Information Architect's Toolkit"**

**Learning Objectives:**
- Master advanced file operations and permissions
- Learn powerful text processing and pattern matching
- Understand file archiving and compression
- Practice systematic file management workflows

---

## **Opening Narrative (10 minutes)**
*"The workshop's previous information architect has left behind a vast collection of documents, logs, and data files scattered throughout the facility. As the new Information Architect, you must organize, analyze, and manage these digital resources efficiently. Today, you'll learn the sophisticated tools that separate amateur file handlers from professional information architects."*

---

## **Part 1: Advanced File Operations (40 minutes)**

### **A. File Content Analysis & Manipulation (20 minutes)**

#### **The Information Inspector's Tools**
```
FILE CONTENT ANALYSIS TOOLKIT
┌─────────────────────────────────────────────────────────┐
│ Quick Preview:  head, tail, less, more                 │
│ Content Stats:  wc, file, stat                         │
│ Text Search:    grep, egrep, fgrep                     │
│ Data Sorting:   sort, uniq, cut, awk                   │
│ Text Transform: tr, sed, column                        │
└─────────────────────────────────────────────────────────┘
```

**Advanced Content Viewing:**
```bash
# Intelligent file preview
less filename.txt              # Interactive scrollable view
more filename.txt              # Page-by-page viewing
head -n 20 filename.txt        # First 20 lines
tail -n 15 filename.txt        # Last 15 lines
tail -f logfile.txt            # Follow file changes (live monitoring)

# File characteristics
file document.pdf              # Identify file type
stat filename.txt              # Detailed file information
wc -lwc filename.txt           # Lines, words, characters count
```

#### **Text Processing Fundamentals**
```bash
# Create sample data for practice
cat > workshop_inventory.txt << 'EOF'
Tools,Quantity,Location,Status
Hammers,15,Section-A,Available
Screwdrivers,23,Section-B,Available
Wrenches,8,Section-A,Maintenance
Drills,12,Section-C,Available
Saws,6,Section-B,Maintenance
Pliers,19,Section-A,Available
Sanders,4,Section-C,Available
EOF

# Text extraction and manipulation
cut -d',' -f1,3 workshop_inventory.txt    # Extract columns 1 and 3
cut -d',' -f2 workshop_inventory.txt | tail -n +2 | sort -n  # Sort quantities

# Character transformation
tr ',' '\t' < workshop_inventory.txt       # Convert commas to tabs
tr 'a-z' 'A-Z' < workshop_inventory.txt    # Convert to uppercase
```

#### **Advanced Text Searching**
```bash
# Pattern matching with grep family
grep "Section-A" workshop_inventory.txt    # Basic pattern search
grep -i "available" workshop_inventory.txt # Case-insensitive search
grep -n "Maintenance" workshop_inventory.txt # Show line numbers
grep -c "Available" workshop_inventory.txt # Count matches
grep -v "Available" workshop_inventory.txt # Inverse match (exclude)

# Extended regular expressions
egrep "Section-[AB]" workshop_inventory.txt    # Match A or B
egrep "^[HS]" workshop_inventory.txt           # Lines starting with H or S
egrep "[0-9]{2}" workshop_inventory.txt        # Two-digit numbers
```

### **B. Data Sorting & Unique Operations (20 minutes)**

#### **Sorting Workshop Data**
```
SORTING STRATEGIES VISUAL
┌─────────────────────────────────────────────────────────┐
│ Alphabetical Sort:  sort filename                      │
│ Reverse Sort:       sort -r filename                   │
│ Numeric Sort:       sort -n filename                   │
│ Field-Based Sort:   sort -t',' -k2 filename           │
│ Multiple Keys:      sort -t',' -k3,3 -k2,2n filename  │
└─────────────────────────────────────────────────────────┘
```

**Practical Sorting Examples:**
```bash
# Create test data
cat > employee_data.txt << 'EOF'
Alice,Developer,85000,2019
Bob,Manager,95000,2017
Charlie,Developer,75000,2020
Diana,Senior Developer,105000,2015
Eve,Manager,98000,2018
EOF

# Various sorting techniques
sort employee_data.txt                     # Default alphabetical
sort -t',' -k3,3n employee_data.txt       # Sort by salary (numeric)
sort -t',' -k4,4n employee_data.txt       # Sort by year
sort -t',' -k2,2 -k3,3nr employee_data.txt # Sort by role, then salary desc
```

#### **Removing Duplicates & Counting**
```bash
# Create data with duplicates
cat > access_log.txt << 'EOF'
user1
user2
user1
user3
user2
user1
user4
user3
EOF

# Duplicate management
sort access_log.txt | uniq             # Remove duplicates (must sort first)
sort access_log.txt | uniq -c          # Count occurrences
sort access_log.txt | uniq -d          # Show only duplicates
sort access_log.txt | uniq -u          # Show only unique lines
sort access_log.txt | uniq -c | sort -nr  # Most frequent first
```

#### **Advanced Data Processing Pipeline**
```bash
# Real-world example: Analyze system logs
cat > system_events.log << 'EOF'
2024-01-15 10:30:15 INFO User alice logged in
2024-01-15 10:35:22 ERROR Failed login attempt for bob
2024-01-15 10:40:18 INFO User charlie logged in
2024-01-15 10:45:30 WARNING Disk space low on /var
2024-01-15 10:50:45 ERROR Failed login attempt for bob
2024-01-15 11:00:12 INFO User alice logged out
2024-01-15 11:05:33 INFO User diana logged in
EOF

# Complex data analysis pipeline
echo "=== SYSTEM LOG ANALYSIS ==="
echo "Error count: $(grep -c ERROR system_events.log)"
echo "Failed login attempts:"
grep "Failed login" system_events.log | cut -d' ' -f8 | sort | uniq -c
echo "Users by activity:"
grep -E "(logged in|logged out)" system_events.log | cut -d' ' -f5 | sort | uniq -c
```

---

## **Part 2: File Permissions & Security (35 minutes)**

### **A. Understanding Permission Matrix (20 minutes)**

#### **Permission System Visual**
```
LINUX PERMISSION MATRIX
┌─────────────────────────────────────────────────────────────────┐
│                    READ    WRITE   EXECUTE                      │
│                     r       w        x                          │
│ ┌─────────────┐ ┌─────┐ ┌─────┐ ┌─────────┐                   │
│ │ Owner (u)   │ │  4  │ │  2  │ │    1    │ = 7 (rwx)         │
│ │ Group (g)   │ │  4  │ │  0  │ │    1    │ = 5 (r-x)         │
│ │ Others (o)  │ │  4  │ │  0  │ │    0    │ = 4 (r--)         │
│ └─────────────┘ └─────┘ └─────┘ └─────────┘                   │
│                                                                 │
│ Result: chmod 754 filename  →  rwxr-xr--                       │
└─────────────────────────────────────────────────────────────────┘
```

**Understanding Permission Representation:**
```bash
# Analyze file permissions
ls -la /etc/passwd
# Output: -rw-r--r-- 1 root root 2847 Jan 15 10:30 /etc/passwd

# Breaking down -rw-r--r--:
# Position 1: - (regular file, d=directory, l=link)
# Positions 2-4: rw- (owner can read/write, not execute)
# Positions 5-7: r-- (group can read only)
# Positions 8-10: r-- (others can read only)
```

**Permission Calculation Practice:**
```bash
# Create practice files
touch practice_file.txt
mkdir practice_dir

# Current permissions
ls -la practice_file.txt practice_dir

# Permission modifications
chmod 644 practice_file.txt    # rw-r--r-- (common file permission)
chmod 755 practice_dir         # rwxr-xr-x (common directory permission)
chmod 600 practice_file.txt    # rw------- (private file)
chmod 700 practice_dir         # rwx------ (private directory)

# Symbolic notation
chmod u+x practice_file.txt    # Add execute for owner
chmod g-w practice_file.txt    # Remove write for group
chmod o+r practice_file.txt    # Add read for others
chmod a+x practice_file.txt    # Add execute for all (a=all)
```

### **B. Advanced Permission Management (15 minutes)**

#### **Special Permissions & Attributes**
```bash
# Sticky bit, SUID, SGID concepts
ls -la /tmp                    # Check sticky bit on /tmp (drwxrwxrwt)
ls -la /usr/bin/passwd         # Check SUID bit (-rwsr-xr-x)

# File attributes
touch secure_file.txt
chmod 600 secure_file.txt      # Private file
chattr +i secure_file.txt      # Make immutable (if supported)
lsattr secure_file.txt         # View attributes

# Ownership management (demonstration only)
ls -la secure_file.txt         # Check current ownership
# Note: chown requires root privileges
echo "File ownership: $(stat -c '%U:%G' secure_file.txt)"
```

#### **Permission Troubleshooting Workflow**
```
PERMISSION PROBLEM DIAGNOSIS
┌─────────────────────────────────────────────────────────────────┐
│ 1. IDENTIFY THE PROBLEM                                         │
│    → ls -la filename (check current permissions)               │
├─────────────────────────────────────────────────────────────────┤
│ 2. CHECK YOUR IDENTITY                                          │
│    → whoami, id, groups (verify your user/group status)        │
├─────────────────────────────────────────────────────────────────┤
│ 3. DETERMINE REQUIRED ACCESS                                    │
│    → Read? Write? Execute? What do you need to do?             │
├─────────────────────────────────────────────────────────────────┤
│ 4. APPLY APPROPRIATE SOLUTION                                   │
│    → chmod for permissions, or request owner assistance        │
└─────────────────────────────────────────────────────────────────┘
```

**Common Permission Scenarios:**
```bash
# Scenario 1: Script won't execute
chmod +x script.sh            # Add execute permission

# Scenario 2: Can't edit configuration file
ls -la config.txt             # Check who owns it
chmod u+w config.txt          # Add write permission for owner (if you own it)

# Scenario 3: Directory access denied
chmod 755 directory/          # Standard directory permissions
```

---

## **Part 3: Archive Management & Compression (30 minutes)**

### **A. Creating and Managing Archives (20 minutes)**

#### **Archive Strategy Visual**
```
ARCHIVE MANAGEMENT WORKFLOW
┌─────────────────────────────────────────────────────────────────┐
│ CREATE ARCHIVE                                                  │
│ ┌─────────┐  tar -czf  ┌──────────────┐                        │
│ │ Files & │ ────────►  │ compressed   │                        │
│ │ Folders │  archive   │ archive.tgz  │                        │
│ └─────────┘             └──────────────┘                        │
│                                │                                │
│ EXTRACT ARCHIVE                │                                │
│ ┌─────────┐  tar -xzf  ┌──────▼────────┐                      │
│ │ Files & │ ◄──────────│ compressed    │                        │
│ │ Folders │   extract  │ archive.tgz   │                        │
│ └─────────┘             └───────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

**Comprehensive Archive Operations:**
```bash
# Create project structure for archiving practice
mkdir -p project_backup/{documents,scripts,configs,logs}
echo "Important document" > project_backup/documents/readme.txt
echo "#!/bin/bash\necho 'Hello World'" > project_backup/scripts/hello.sh
echo "debug=true" > project_backup/configs/app.conf
echo "2024-01-15: System started" > project_backup/logs/system.log

# Archive creation with different compression methods
tar -czf project_gzip.tar.gz project_backup/    # Gzip compression (most common)
tar -cjf project_bzip2.tar.bz2 project_backup/  # Bzip2 compression (smaller)
tar -cJf project_xz.tar.xz project_backup/      # XZ compression (smallest)
tar -cf project_uncompressed.tar project_backup/ # No compression

# Compare archive sizes
ls -lh project_*.tar*
echo "Archive size comparison completed"
```

**Advanced Archive Operations:**
```bash
# List archive contents without extracting
tar -tzf project_gzip.tar.gz        # List files in gzip archive
tar -tjf project_bzip2.tar.bz2      # List files in bzip2 archive

# Extract to specific location
mkdir restore_test
cd restore_test
tar -xzf ../project_gzip.tar.gz     # Extract here

# Extract specific files only
tar -xzf ../project_gzip.tar.gz project_backup/documents/readme.txt

# Add files to existing archive
echo "New file content" > new_file.txt
tar -rzf ../project_gzip.tar.gz new_file.txt  # Add to existing archive
```

#### **Archive Best Practices**
```bash
# Create systematic backup script
cat > create_backup.sh << 'EOF'
#!/bin/bash

# Configuration
BACKUP_DIR="/tmp/backups"
SOURCE_DIR="$HOME/important_files"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DATE}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create archive with verification
echo "Creating backup: $BACKUP_NAME"
if tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$SOURCE_DIR" 2>/dev/null; then
    echo "Backup created successfully"
    echo "Size: $(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)"
    echo "Location: $BACKUP_DIR/$BACKUP_NAME"
else
    echo "Backup failed!"
    exit 1
fi

# Verify archive integrity
echo "Verifying archive integrity..."
if tar -tzf "$BACKUP_DIR/$BACKUP_NAME" > /dev/null 2>&1; then
    echo "Archive verification successful"
else
    echo "Archive verification failed!"
    exit 1
fi
EOF

chmod +x create_backup.sh
```

### **B. File Compression Utilities (10 minutes)**

#### **Individual File Compression**
```bash
# Create test files
echo "This is a large text file with repetitive content." > large_file.txt
for i in {1..100}; do echo "Line $i: This is repetitive content for compression testing." >> large_file.txt; done

# Compression comparison
cp large_file.txt original_file.txt

# Different compression tools
gzip original_file.txt           # Creates original_file.txt.gz
gunzip original_file.txt.gz      # Decompresses back to original_file.txt

bzip2 original_file.txt          # Creates original_file.txt.bz2  
bunzip2 original_file.txt.bz2    # Decompresses back

xz original_file.txt             # Creates original_file.txt.xz
unxz original_file.txt.xz        # Decompresses back

# Compare compression ratios
ls -lh large_file.txt original_file.txt.*
```

#### **Compression Efficiency Analysis**
```bash
# Create compression comparison script
cat > compression_test.sh << 'EOF'
#!/bin/bash

# Test file
TEST_FILE="compression_test.txt"
echo "Creating test file..."
for i in {1..1000}; do
    echo "This is line $i with some repetitive content for testing compression algorithms." >> $TEST_FILE
done

ORIGINAL_SIZE=$(stat -c%s "$TEST_FILE")
echo "Original size: $ORIGINAL_SIZE bytes"

# Test different compression methods
for method in gzip bzip2 xz; do
    cp "$TEST_FILE" "temp_$method"
    
    case $method in
        gzip) gzip "temp_$method" ;;
        bzip2) bzip2 "temp_$method" ;;
        xz) xz "temp_$method" ;;
    esac
    
    COMPRESSED_SIZE=$(stat -c%s "temp_$method.$method" 2>/dev/null || stat -c%s "temp_$method.gz" 2>/dev/null)
    RATIO=$(echo "scale=1; $COMPRESSED_SIZE * 100 / $ORIGINAL_SIZE" | bc 2>/dev/null || echo "N/A")
    echo "$method: $COMPRESSED_SIZE bytes ($RATIO% of original)"
done

# Cleanup
rm -f temp_* compression_test.txt
EOF

chmod +x compression_test.sh
```

---

## **Part 4: Advanced Text Processing (25 minutes)**

### **A. Pattern Matching with Regular Expressions (15 minutes)**

#### **Regular Expression Fundamentals**
```
REGEX PATTERN MATCHING GUIDE
┌─────────────────────────────────────────────────────────────────┐
│ Basic Patterns:                                                 │
│ .        → Any single character                                 │
│ *        → Zero or more of preceding character                  │
│ +        → One or more of preceding character                   │
│ ?        → Zero or one of preceding character                   │
│ ^        → Start of line                                        │
│ $        → End of line                                          │
│ [abc]    → Any character in brackets                            │
│ [^abc]   → Any character NOT in brackets                        │
│ \d       → Any digit (0-9)                                     │
│ \w       → Any word character (a-z, A-Z, 0-9, _)              │
│ \s       → Any whitespace character                             │
└─────────────────────────────────────────────────────────────────┘
```

**Practical Regex Examples:**
```bash
# Create sample data with various patterns
cat > sample_data.txt << 'EOF'
john.doe@email.com
jane_smith@company.org
admin@localhost
192.168.1.1
192.168.1.100
10.0.0.1
phone: 555-123-4567
phone: (555) 987-6543
Date: 2024-01-15
Date: 01/15/2024
Error: Code 404
Warning: Code 200
EOF

# Email pattern matching
echo "=== EMAIL ADDRESSES ==="
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" sample_data.txt

# IP address pattern matching
echo "=== IP ADDRESSES ==="
grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" sample_data.txt

# Phone number patterns
echo "=== PHONE NUMBERS ==="
grep -E "(\([0-9]{3}\)|[0-9]{3})[- ]?[0-9]{3}[- ]?[0-9]{4}" sample_data.txt

# Date patterns
echo "=== DATES ==="
grep -E "[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}/[0-9]{2}/[0-9]{4}" sample_data.txt
```

#### **Advanced Text Processing with Sed**
```bash
# Text transformation examples
cat > transform_data.txt << 'EOF'
Name: John Doe, Age: 30, City: New York
Name: Jane Smith, Age: 25, City: Los Angeles  
Name: Bob Johnson, Age: 35, City: Chicago
EOF

echo "=== ORIGINAL DATA ==="
cat transform_data.txt

echo -e "\n=== TRANSFORMED DATA ==="
# Replace commas with pipe separators
sed 's/,/|/g' transform_data.txt

# Extract just names
sed 's/Name: \([^,]*\).*/\1/' transform_data.txt

# Convert to CSV format
sed 's/Name: \([^,]*\), Age: \([^,]*\), City: \(.*\)/\1,\2,\3/' transform_data.txt
```

### **B. Data Processing Pipelines (10 minutes)**

#### **Complex Data Analysis Pipeline**
```bash
# Create realistic log data
cat > access.log << 'EOF'
192.168.1.10 - - [15/Jan/2024:10:30:15 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.20 - - [15/Jan/2024:10:35:22 +0000] "POST /login HTTP/1.1" 401 567
192.168.1.10 - - [15/Jan/2024:10:40:18 +0000] "GET /dashboard HTTP/1.1" 200 2345
192.168.1.30 - - [15/Jan/2024:10:45:30 +0000] "GET /api/data HTTP/1.1" 500 123
192.168.1.20 - - [15/Jan/2024:10:50:45 +0000] "POST /login HTTP/1.1" 200 890
192.168.1.40 - - [15/Jan/2024:11:00:12 +0000] "GET /index.html HTTP/1.1" 200 1234
EOF

echo "=== LOG ANALYSIS PIPELINE ==="

# Most common IP addresses
echo "Top IP addresses:"
cut -d' ' -f1 access.log | sort | uniq -c | sort -nr | head -3

# HTTP status code distribution
echo -e "\nHTTP status codes:"
grep -o '"[^"]*" [0-9]* ' access.log | cut -d' ' -f2 | sort | uniq -c

# Most requested resources
echo -e "\nMost requested resources:"
grep -o '"[A-Z]* [^"]*' access.log | cut -d' ' -f2 | sort | uniq -c | sort -nr

# Error analysis (4xx and 5xx status codes)
echo -e "\nError requests:"
grep -E ' [45][0-9]{2} ' access.log | cut -d' ' -f1,7,9
```

#### **Data Processing Workflow Creation**
```bash
# Create a comprehensive data processing script
cat > data_processor.sh << 'EOF'
#!/bin/bash

# Data Processing Pipeline Script
echo "=== DATA PROCESSING PIPELINE ==="

INPUT_FILE="$1"
if [ -z "$INPUT_FILE" ]; then
    echo "Usage: $0 <input_file>"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File '$INPUT_FILE' not found"
    exit 1
fi

echo "Processing file: $INPUT_FILE"
echo "File size: $(stat -c%s "$INPUT_FILE") bytes"
echo "Line count: $(wc -l < "$INPUT_FILE")"
echo

# Basic statistics
echo "=== BASIC STATISTICS ==="
echo "Total lines: $(wc -l < "$INPUT_FILE")"
echo "Total words: $(wc -w < "$INPUT_FILE")"
echo "Total characters: $(wc -c < "$INPUT_FILE")"
echo

# Content analysis
echo "=== CONTENT ANALYSIS ==="
echo "Lines with numbers: $(grep -c '[0-9]' "$INPUT_FILE")"
echo "Lines with email patterns: $(grep -cE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' "$INPUT_FILE")"
echo "Blank lines: $(grep -c '^ "$INPUT_FILE")"
echo

# Most common words (top 5)
echo "=== MOST COMMON WORDS ==="
tr ' ' '\n' < "$INPUT_FILE" | tr '[:upper:]' '[:lower:]' | grep -v '^ | sort | uniq -c | sort -nr | head -5

echo "=== PROCESSING COMPLETE ==="
EOF

chmod +x data_processor.sh

# Test the processor
echo "Testing data processor with sample data..."
./data_processor.sh sample_data.txt
```

---

## **Part 5: Integration Challenge (20 minutes)**

### **Information Architecture Project**
*"You've been tasked with organizing and analyzing the workshop's complete information system. Demonstrate your mastery by creating a comprehensive file management and analysis solution."*

#### **Challenge: Complete Information System**
```bash
# Create the master information management script
cat > info_architect.sh << 'EOF'
#!/bin/bash

# Information Architecture Master Script
echo "========================================"
echo "WORKSHOP INFORMATION ARCHITECTURE SYSTEM"
echo "========================================"
echo "Architect: $(whoami)"
echo "System: $(hostname)"
echo "Timestamp: $(date)"
echo

# Create comprehensive directory structure
echo "=== CREATING INFORMATION STRUCTURE ==="
mkdir -p workshop_data/{raw,processed,archives,reports,scripts}
mkdir -p workshop_data/raw/{logs,configs,documents,databases}
mkdir -p workshop_data/processed/{daily,weekly,monthly}

# Generate sample data for analysis
echo "Generating sample workshop data..."

# Create log files
cat > workshop_data/raw/logs/system.log << 'LOGEOF'
2024-01-15 08:00:01 INFO System startup completed
2024-01-15 08:15:23 WARNING Disk usage at 75%
2024-01-15 08:30:45 ERROR Database connection failed
2024-01-15 08:45:12 INFO User alice logged in
2024-01-15 09:00:33 INFO Backup process started
2024-01-15 09:15:55 ERROR Backup process failed
2024-01-15 09:30:17 WARNING High memory usage detected
2024-01-15 09:45:39 INFO User bob logged in
2024-01-15 10:00:01 INFO System maintenance completed
LOGEOF

# Create configuration files
cat > workshop_data/raw/configs/app.conf << 'CONFEOF'
# Workshop Application Configuration
database_host=localhost
database_port=5432
max_connections=100
debug_mode=true
log_level=INFO
backup_interval=3600
CONFEOF

# Create inventory document
cat > workshop_data/raw/documents/inventory.csv << 'INVEOF'
Item,Quantity,Location,Status,Last_Updated
Computers,25,Lab-A,Active,2024-01-15
Printers,8,Office,Active,2024-01-14
Servers,4,Server-Room,Active,2024-01-15
Routers,12,Network-Closet,Active,2024-01-13
Tablets,15,Lab-B,Maintenance,2024-01-12
INVEOF

echo "Sample data created successfully"
echo

# Perform comprehensive analysis
echo "=== COMPREHENSIVE DATA ANALYSIS ==="

# Log analysis
echo "1. System Log Analysis:"
echo "   Total log entries: $(wc -l < workshop_data/raw/logs/system.log)"
echo "   Error count: $(grep -c ERROR workshop_data/raw/logs/system.log)"
echo "   Warning count: $(grep -c WARNING workshop_data/raw/logs/system.log)"
echo "   Most active hour: $(cut -d' ' -f2 workshop_data/raw/logs/system.log | cut -d':' -f1 | sort | uniq -c | sort -nr | head -1 | awk '{print $2}')"
echo

# Configuration analysis
echo "2. Configuration Analysis:"
echo "   Configuration parameters: $(grep -c '=' workshop_data/raw/configs/app.conf)"
echo "   Debug mode: $(grep debug_mode workshop_data/raw/configs/app.conf | cut -d'=' -f2)"
echo "   Database port: $(grep database_port workshop_data/raw/configs/app.conf | cut -d'=' -f2)"
echo

# Inventory analysis
echo "3. Inventory Analysis:"
echo "   Total items: $(tail -n +2 workshop_data/raw/documents/inventory.csv | wc -l)"
echo "   Active items: $(grep -c Active workshop_data/raw/documents/inventory.csv)"
echo "   Items in Maintenance: $(grep -c Maintenance workshop_data/raw/documents/inventory.csv)"
echo "   Total quantity: $(tail -n +2 workshop_data/raw/documents/inventory.csv | cut -d',' -f2 | paste -sd+ | bc)"
echo

# Create processed reports
echo "=== GENERATING PROCESSED REPORTS ==="

# Daily report
cat > workshop_data/processed/daily/$(date +%Y-%m-%d)_report.txt << REPORTEOF
DAILY WORKSHOP REPORT - $(date +%Y-%m-%d)
=====================================

System Status:
- Total log entries today: $(wc -l < workshop_data/raw/logs/system.log)
- Critical errors: $(grep -c ERROR workshop_data/raw/logs/system.log)
- Warnings issued: $(grep -c WARNING workshop_data/raw/logs/system.log)

Equipment Status:
- Active equipment: $(grep -c Active workshop_data/raw/documents/inventory.csv) units
- Equipment in maintenance: $(grep -c Maintenance workshop_data/raw/documents/inventory.csv) units

System Configuration:
- Debug mode enabled: $(grep debug_mode workshop_data/raw/configs/app.conf | cut -d'=' -f2)
- Database connections allowed: $(grep max_connections workshop_data/raw/configs/app.conf | cut -d'=' -f2)

Report generated by: $(whoami)
Generation time: $(date)
REPORTEOF

echo "Daily report generated: workshop_data/processed/daily/$(date +%Y-%m-%d)_report.txt"

# Create archive
echo "=== CREATING ARCHIVES ==="
cd workshop_data
tar -czf archives/workshop_backup_$(date +%Y%m%d_%H%M%S).tar.gz raw/ processed/
cd ..

echo "Archive created successfully"
echo "Archive size: $(du -h workshop_data/archives/*.tar.gz | cut -f1)"

# Final system summary
echo
echo "=== INFORMATION ARCHITECTURE SUMMARY ==="
echo "Directory structure created: $(find workshop_data -type d | wc -l) directories"
echo "Files processed: $(find workshop_data -type f | wc -l) files"
echo "Total data size: $(du -sh workshop_data | cut -f1)"
echo "Archive integrity: $(tar -tzf workshop_data/archives/*.tar.gz > /dev/null 2>&1 && echo "VERIFIED" || echo "FAILED")"

echo
echo "========================================"
echo "INFORMATION ARCHITECTURE SETUP COMPLETE"
echo "========================================"
EOF

chmod +x info_architect.sh

# Execute the challenge
echo "Executing Information Architecture Challenge..."
./info_architect.sh
```

---

## **Session Summary & Mastery Achievement**

### **Advanced Skills Mastered**
```bash
# File Content Analysis
head, tail, less, more, wc, file, stat, cut, tr, column

# Text Processing & Search
grep, egrep, grep -E, sed, sort, uniq, awk (basic)

# Permission Management
chmod (numeric & symbolic), ls -la, stat, chattr, lsattr

# Archive Operations
tar -czf, tar -xzf, tar -tzf, gzip, bzip2, xz

# Data Processing Pipelines
Complex command combinations with pipes and redirections
```

### **Professional Competencies Developed**
- **Data Analysis**: Extract meaningful insights from log files and structured data
- **File Security**: Implement appropriate permission schemes for different file types  
- **Archive Management**: Create, verify, and restore backup archives efficiently
- **Text Processing**: Use regular expressions and text manipulation tools professionally
- **Workflow Automation**: Build repeatable processes for common file operations

### **Problem-Solving Methodologies**
- **Systematic Analysis**: Break complex data processing into manageable steps
- **Security Assessment**: Evaluate and implement appropriate file access controls
- **Quality Assurance**: Verify archive integrity and data processing accuracy
- **Documentation**: Create clear, maintainable processing workflows

---

## **Take-Home Practice & Advanced Preparation**

### **Daily Information Architecture Tasks**
```bash
# Create your daily file management routine
cat > ~/daily_file_ops.sh << 'EOF'
#!/bin/bash
echo "=== DAILY FILE OPERATIONS ==="
echo "Date: $(date)"

# Cleanup old temporary files
find /tmp -name "*.tmp" -mtime +1 2>/dev/null | wc -l | xargs echo "Temp files to clean:"

# Archive old logs (demonstration)
echo "Log files to archive: $(find /var/log -name "*.log" -mtime +7 2>/dev/null | wc -l)"

# Check disk space usage
echo "Home directory usage: $(du -sh ~ 2>/dev/null | cut -f1)"

# File permission audit
echo "Writable files in current directory: $(find . -maxdepth 1 -type f -perm /200 2>/dev/null | wc -l)"

echo "=== FILE OPERATIONS COMPLETE ==="
EOF

chmod +x ~/daily_file_ops.sh
```

### **Advanced Practice Challenges**
1. **Text Processing**: Create scripts to analyze different log formats and extract specific patterns
2. **Permission Security**: Practice setting up proper permissions for shared project directories
3. **Archive Strategy**: Develop a backup rotation system using different compression methods
4. **Data Pipeline**: Build complex text processing workflows for real data analysis

### **Preparation for Advanced Topics**
- Research shell scripting basics for automation
- Explore advanced regex patterns for complex data extraction
- Study system administration best practices for file management
- Practice with larger datasets to understand performance implications

**Next Session Preview**: "System Administration Fundamentals" - Learn user management, service control, system monitoring, and maintenance automation that transforms you from a Linux user into a system administrator.
