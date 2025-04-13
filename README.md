# Research Assistant Chrome Extension

A browser extension that helps researchers by providing summarization and topic suggestion features for selected text.

## Features

- **Text Summarization**: Get concise summaries of selected text
- **Topic Suggestions**: Receive relevant research topics based on selected content
- **Notes Management**: 
  - Save research notes locally
  - Clear notes with confirmation
  - Export all content to PDF
- **Persistent Storage**: Notes are saved between sessions
- **Clean Modern UI**: Professional interface with intuitive controls

## Installation

1. Clone this repository or download the source files
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked" and select the extension directory

## Usage

1. Select text on any webpage
2. Click the extension icon to open the Research Assistant
3. Choose an action:
   - **Summarize**: Get a summary of the selected text
   - **Suggest Topics**: Get related research topics
4. Manage your notes:
   - Type in the notes textarea
   - Save notes to local storage
   - Clear notes when needed
   - Export everything to PDF

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Springboot
- **Storage**: 
  - `localStorage` for persistent notes
  - `sessionStorage` for current research results
- **PDF Generation**: Browser print-to-PDF functionality

