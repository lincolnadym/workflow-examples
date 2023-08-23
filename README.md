# Workflow-examples

The workflow-examples contains various workflow jobs, runnable from the command line, that utilize the workflow-chain library.

## Project

The workflow-examples project is a source code library that discusses and illustrates how to use the workflow-chain library.

# Examples

The following is a list of workflow examples. As time permits, more examples will be added that illustrate key concepts of workflow-chain, new features added, etc... The examples are designed to be run within an IDE, preferably a Node IDE.

## Setup

In order to run the samples there is a small amount of setup to your environment. In this first step(s) with workflow-chain, we setup a simple workflow that does the following :

Start by running the following command from a terminal within the IDE. This will setup ts-node as an executable on the terminal. We use ts-node, as it appears to operate the best no matter what OS (Windows, MacOS, Linux, other) is being used.

```
npm install -g ts-node typescript '@types/node'
```

You can then run a sample workflow using 1 of the included run-\*.ts files in the src/ folder.

## Simple Workflow

In this first step(s) with workflow-chain, we setup a simple workflow that does the following :

- Reads in a large JSON
- Parses and processes various elements from that JSON
- Writes out a simple report on the findings.

Concepts Illustrated :

- Setting up a Workflow Definition
- Chaining Tasks
- Command line Node runtime
- Local Node (package.json) library depedencies

  "workflow-chain": "file:./workflow-chain-1.0.1.tgz"
  "workflow-chain": "^1.0.1"
