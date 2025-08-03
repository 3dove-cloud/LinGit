import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { 
  ArrowLeft, 
  Terminal as TerminalIcon, 
  CheckCircle, 
  Play, 
  RotateCcw,
  Lightbulb,
  Target,
  Award,
  ChevronRight
} from 'lucide-react'

const LabPage = () => {
  const { sessionId, labId } = useParams()
  const { markLabComplete, getSessionProgress } = useProgress()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [terminalOutput, setTerminalOutput] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isLabCompleted, setIsLabCompleted] = useState(false)
  const terminalRef = useRef(null)
  const xtermRef = useRef(null)
  const fitAddonRef = useRef(null)

  const sessionProgress = getSessionProgress(sessionId)
  const labCompleted = sessionProgress.labs?.[labId]?.completed || false

  useEffect(() => {
    setIsLabCompleted(labCompleted)
    initializeTerminal()
    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose()
      }
    }
  }, [labCompleted])

  const initializeTerminal = () => {
    if (terminalRef.current && !xtermRef.current) {
      const terminal = new Terminal({
        theme: {
          background: '#000000',
          foreground: '#ffffff',
          cursor: '#ffffff',
          selection: '#ffffff30',
          black: '#000000',
          red: '#ff5555',
          green: '#50fa7b',
          yellow: '#f1fa8c',
          blue: '#bd93f9',
          magenta: '#ff79c6',
          cyan: '#8be9fd',
          white: '#bfbfbf',
          brightBlack: '#4d4d4d',
          brightRed: '#ff6e67',
          brightGreen: '#5af78e',
          brightYellow: '#f4f99d',
          brightBlue: '#caa9fa',
          brightMagenta: '#ff92d0',
          brightCyan: '#9aedfe',
          brightWhite: '#e6e6e6'
        },
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        cursorBlink: true,
        rows: 20,
        cols: 80
      })

      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      terminal.open(terminalRef.current)
      fitAddon.fit()

      // Welcome message
      terminal.writeln('Welcome to Linux Mastery Academy Interactive Lab!')
      terminal.writeln('Type commands below to practice. Use "help" for available commands.')
      terminal.writeln('')
      terminal.write('student@linux-lab:~$ ')

      let currentLine = ''
      
      terminal.onData((data) => {
        if (data === '\r') { // Enter key
          terminal.writeln('')
          if (currentLine.trim()) {
            executeCommand(currentLine.trim(), terminal)
          }
          terminal.write('student@linux-lab:~$ ')
          currentLine = ''
        } else if (data === '\u007f') { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            terminal.write('\b \b')
          }
        } else if (data >= ' ') { // Printable characters
          currentLine += data
          terminal.write(data)
        }
      })

      xtermRef.current = terminal
      fitAddonRef.current = fitAddon
    }
  }

  const executeCommand = (command, terminal) => {
    const args = command.split(' ')
    const cmd = args[0]

    // Simulate command execution
    switch (cmd) {
      case 'help':
        terminal.writeln('Available commands:')
        terminal.writeln('  ls          - list directory contents')
        terminal.writeln('  pwd         - print working directory')
        terminal.writeln('  whoami      - print current user')
        terminal.writeln('  date        - show current date and time')
        terminal.writeln('  echo        - display text')
        terminal.writeln('  clear       - clear terminal screen')
        terminal.writeln('  cat         - display file contents')
        terminal.writeln('  mkdir       - create directory')
        terminal.writeln('  touch       - create empty file')
        terminal.writeln('  help        - show this help message')
        break
      
      case 'ls':
        if (args.includes('-la') || args.includes('-l')) {
          terminal.writeln('total 12')
          terminal.writeln('drwxr-xr-x 3 student student 4096 Jan 15 10:30 .')
          terminal.writeln('drwxr-xr-x 3 root    root    4096 Jan 15 10:00 ..')
          terminal.writeln('-rw-r--r-- 1 student student  220 Jan 15 10:30 .bashrc')
          terminal.writeln('drwxr-xr-x 2 student student 4096 Jan 15 10:30 Documents')
          terminal.writeln('-rw-r--r-- 1 student student   18 Jan 15 10:30 hello.txt')
        } else {
          terminal.writeln('Documents  hello.txt')
        }
        break
      
      case 'pwd':
        terminal.writeln('/home/student')
        break
      
      case 'whoami':
        terminal.writeln('student')
        break
      
      case 'date':
        terminal.writeln(new Date().toString())
        break
      
      case 'echo':
        terminal.writeln(args.slice(1).join(' '))
        break
      
      case 'clear':
        terminal.clear()
        break
      
      case 'cat':
        if (args[1] === 'hello.txt') {
          terminal.writeln('Hello, Linux World!')
        } else if (args[1]) {
          terminal.writeln(`cat: ${args[1]}: No such file or directory`)
        } else {
          terminal.writeln('cat: missing file operand')
        }
        break
      
      case 'mkdir':
        if (args[1]) {
          terminal.writeln(`Directory '${args[1]}' created successfully`)
        } else {
          terminal.writeln('mkdir: missing operand')
        }
        break
      
      case 'touch':
        if (args[1]) {
          terminal.writeln(`File '${args[1]}' created successfully`)
        } else {
          terminal.writeln('touch: missing file operand')
        }
        break
      
      default:
        terminal.writeln(`${cmd}: command not found`)
        break
    }

    // Check if command matches current step requirement
    checkStepCompletion(command)
  }

  const checkStepCompletion = (command) => {
    const lab = getLabData()
    if (lab && lab.steps[currentStep]) {
      const step = lab.steps[currentStep]
      if (step.expectedCommand && command.includes(step.expectedCommand)) {
        const newCompleted = new Set(completedSteps)
        newCompleted.add(currentStep)
        setCompletedSteps(newCompleted)
        
        if (currentStep < lab.steps.length - 1) {
          setTimeout(() => setCurrentStep(currentStep + 1), 1000)
        } else {
          // Lab completed
          setTimeout(() => {
            markLabComplete(sessionId, labId)
            setIsLabCompleted(true)
          }, 1000)
        }
      }
    }
  }

  const resetTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear()
      xtermRef.current.writeln('Terminal reset!')
      xtermRef.current.writeln('')
      xtermRef.current.write('student@linux-lab:~$ ')
    }
  }

  const getLabData = () => {
    // Lab data based on sessionId and labId
    const labsData = {
      'week1-session1': {
        'basic-navigation': {
          title: 'Basic Navigation Lab',
          description: 'Learn fundamental Linux navigation commands',
          objectives: [
            'Navigate the file system using cd, ls, and pwd',
            'Understand absolute and relative paths',
            'Use tab completion for efficiency'
          ],
          steps: [
            {
              title: 'Check Current Directory',
              instruction: 'Use the pwd command to see where you are currently located',
              expectedCommand: 'pwd',
              hint: 'Type "pwd" and press Enter'
            },
            {
              title: 'List Directory Contents',
              instruction: 'Use ls to see what files and directories are in your current location',
              expectedCommand: 'ls',
              hint: 'Type "ls" to list files and directories'
            },
            {
              title: 'Detailed Listing',
              instruction: 'Use ls -la to see detailed information about files including hidden files',
              expectedCommand: 'ls -la',
              hint: 'Type "ls -la" for a detailed listing'
            },
            {
              title: 'Check Your Identity',
              instruction: 'Use whoami to confirm your current user identity',
              expectedCommand: 'whoami',
              hint: 'Type "whoami" to see your username'
            }
          ]
        },
        'command-history': {
          title: 'Command History Lab',
          description: 'Master command history and tab completion',
          objectives: [
            'Use command history effectively',
            'Practice tab completion',
            'Learn keyboard shortcuts'
          ],
          steps: [
            {
              title: 'Display Current Date',
              instruction: 'Use the date command to show the current date and time',
              expectedCommand: 'date',
              hint: 'Type "date" to see current date and time'
            },
            {
              title: 'Echo a Message',
              instruction: 'Use echo to display "Hello Linux World!"',
              expectedCommand: 'echo',
              hint: 'Type "echo Hello Linux World!"'
            },
            {
              title: 'Create a Directory',
              instruction: 'Use mkdir to create a directory called "practice"',
              expectedCommand: 'mkdir',
              hint: 'Type "mkdir practice"'
            }
          ]
        },
        'file-system-exploration': {
          title: 'File System Exploration Lab',
          description: 'Explore the Linux file system structure',
          objectives: [
            'Navigate different directories',
            'Understand file system hierarchy',
            'Practice file operations'
          ],
          steps: [
            {
              title: 'View File Contents',
              instruction: 'Use cat to view the contents of hello.txt',
              expectedCommand: 'cat',
              hint: 'Type "cat hello.txt"'
            },
            {
              title: 'Create a New File',
              instruction: 'Use touch to create a new file called "myfile.txt"',
              expectedCommand: 'touch',
              hint: 'Type "touch myfile.txt"'
            },
            {
              title: 'List Files Again',
              instruction: 'Use ls to see your newly created file',
              expectedCommand: 'ls',
              hint: 'Type "ls" to see all files including your new one'
            }
          ]
        }
      },
      'week1-session2': {
        'advanced-navigation': {
          title: 'Advanced Navigation Lab',
          description: 'Master advanced navigation techniques',
          objectives: [
            'Use advanced ls options',
            'Navigate with relative and absolute paths',
            'Practice directory shortcuts'
          ],
          steps: [
            {
              title: 'Long Format Listing',
              instruction: 'Use ls -l to see files in long format',
              expectedCommand: 'ls -l',
              hint: 'Type "ls -l" for detailed file information'
            },
            {
              title: 'Show Hidden Files',
              instruction: 'Use ls -a to show all files including hidden ones',
              expectedCommand: 'ls -a',
              hint: 'Type "ls -a" to see hidden files'
            },
            {
              title: 'Combined Options',
              instruction: 'Use ls -la to combine long format and show all files',
              expectedCommand: 'ls -la',
              hint: 'Type "ls -la" to combine both options'
            }
          ]
        }
      }
      // Add more labs for other sessions...
    }

    return labsData[sessionId]?.[labId]
  }

  const lab = getLabData()

  if (!lab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lab Not Found</h1>
          <p className="text-gray-400 mb-6">The requested lab could not be loaded.</p>
          <Link to={`/session/${sessionId}`} className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Session
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/session/${sessionId}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Session</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <TerminalIcon className="w-5 h-5 text-green-400" />
                  {lab.title}
                </h1>
                <p className="text-sm text-gray-400">{lab.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Step {currentStep + 1} of {lab.steps.length}
              </div>
              {isLabCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Lab Completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Lab Objectives */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {lab.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Step */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Current Step
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-400">
                      {currentStep + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-white">
                        {lab.steps[currentStep]?.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Step {currentStep + 1} of {lab.steps.length}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    {lab.steps[currentStep]?.instruction}
                  </p>
                  {lab.steps[currentStep]?.hint && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-200">
                          {lab.steps[currentStep].hint}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Progress</h3>
                <div className="space-y-2">
                  {lab.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        index === currentStep
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : completedSteps.has(index)
                          ? 'bg-green-500/20'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      {completedSteps.has(index) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : index === currentStep ? (
                        <Play className="w-4 h-4 text-blue-400" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-500 rounded-full"></div>
                      )}
                      <span className={`text-sm ${
                        completedSteps.has(index) ? 'text-green-300' :
                        index === currentStep ? 'text-blue-300' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Controls */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Terminal Controls</h3>
                <div className="space-y-2">
                  <button
                    onClick={resetTerminal}
                    className="btn btn-secondary w-full btn-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Terminal
                  </button>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Use Tab for auto-completion</p>
                    <p>• Use Up/Down arrows for history</p>
                    <p>• Type "help" for available commands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                </div>
                <div className="terminal-title">
                  Linux Mastery Academy - Interactive Terminal
                </div>
              </div>
              <div 
                ref={terminalRef}
                className="h-96 bg-black"
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Lab Completion */}
            {isLabCompleted && (
              <div className="mt-6 card bg-green-500/10 border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Congratulations! 🎉
                    </h3>
                    <p className="text-green-300">
                      You've successfully completed the {lab.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to={`/session/${sessionId}`}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Session
                  </Link>
                  <button className="btn btn-success">
                    <ChevronRight className="w-4 h-4" />
                    Next Lab
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabPage