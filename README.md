# Run commands/npm scripts in parallel
This is a super minimalistic package for running shell commands or npm scripts in parallel without any dependencies.

## Scope
+ Complete lines from child processes are written to stdout.
+ Ansi escape codes are not handled in any way.
+ If any child process is terminated or exit's with a non zero exit code, this will exit with code 1.

## Usage
```bash
mx-parallel [...commands]

# Run npm scripts "a" and "b":
mx-parallel npm:a npm:b

# Run all npm scripts matching a pattern:
mx-parallel npm:start:*
```
