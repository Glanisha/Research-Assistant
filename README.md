# Research Assistant Chrome Extension

I originally built this extension to help streamline my own research workflow while working on a paper — constantly switching tabs, summarizing content, jotting down ideas... it got a little chaotic. So I made this tool to make things easier, and now it’s available for anyone else who could use a hand with their research.

## What It Does

This extension is like a lightweight research companion built right into your browser. Here’s what it offers:

- **Text Summarization** – Quickly get concise summaries of selected text on any webpage.
- **Topic Suggestions** – Get research topic ideas based on the content you highlight.
- **Notes Management**:
  - Write and save notes directly in the extension
  - Clear notes when needed (with a confirmation prompt)
  - Export your notes and results to PDF
- **Persistent Storage** – Your notes stay saved between sessions.
- **Clean, Modern UI** – Simple and distraction-free design to help you focus on your work.

## Installation

1. Clone this repository or download the source files
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked" and select the extension folder

## How to Use

1. Select text on any webpage
2. Click the Research Assistant extension icon
3. Choose an action:
   - **Summarize** the selected text
   - **Suggest Topics** related to what you’ve highlighted
4. Use the notes panel to:
   - Write and save thoughts
   - Clear them if needed
   - Export everything to a PDF for easy access later

## Technical Details

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Spring Boot  
- **Storage**:
  - `localStorage` for persistent notes
  - `sessionStorage` for temporary research results
- **PDF Export**: Utilizes browser’s print-to-PDF functionality
