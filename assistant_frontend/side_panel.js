
const summarizeBtn = document.getElementById("summarization");
const suggestBtn = document.getElementById("suggestTopics");
const resultsDiv = document.getElementById("results");
const notesTextarea = document.getElementById("notes");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const clearNotesBtn = document.getElementById("clearNotesBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");


let currentSummary = "";
let currentSuggestions = "";

document.addEventListener('DOMContentLoaded', () => {
    const savedNotes = localStorage.getItem('researchAssistantNotes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }

    const savedSummary = sessionStorage.getItem('currentSummary');
    const savedSuggestions = sessionStorage.getItem('currentSuggestions');
    
    if (savedSummary) {
        currentSummary = savedSummary;
        resultsDiv.innerHTML = `<h4>Summary:</h4><p>${currentSummary}</p>`;
    }
    if (savedSuggestions) {
        currentSuggestions = savedSuggestions;
        resultsDiv.innerHTML = `<h4>Suggested Topics:</h4>${currentSuggestions}`;
    }
});

saveNotesBtn.addEventListener('click', () => {
    const notes = notesTextarea.value;
    localStorage.setItem('researchAssistantNotes', notes);
    showButtonFeedback(saveNotesBtn, 'Saved!');
});

clearNotesBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all notes?')) {
        notesTextarea.value = '';
        localStorage.removeItem('researchAssistantNotes');
        showButtonFeedback(clearNotesBtn, 'Cleared!');
    }
});

exportPdfBtn.addEventListener('click', () => {
    generatePrintableContent();
});

function showButtonFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

function generatePrintableContent() {
    try {
        const notes = notesTextarea.value || 'No notes available';
        const date = new Date().toLocaleString();

        let resultsContent = '';
        if (currentSummary) {
            resultsContent += `<h2>Summary</h2><div class="results-content">${currentSummary}</div>`;
        }
        if (currentSuggestions) {
            resultsContent += `<h2>Suggested Topics</h2><div class="results-content">${currentSuggestions}</div>`;
        }
        if (!currentSummary && !currentSuggestions) {
            resultsContent = '<div class="results-content">No research results available</div>';
        }
        
        const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Research Assistant Export</title>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            color: #333;
                            line-height: 1.6;
                        }
                        h1 { 
                            color: #2b6cb0; 
                            text-align: center; 
                            margin-bottom: 5px;
                        }
                        .date { 
                            color: #666; 
                            text-align: center; 
                            margin-bottom: 30px;
                            font-size: 0.9em;
                        }
                        h2 { 
                            color: #2b6cb0; 
                            border-bottom: 1px solid #ddd; 
                            padding-bottom: 5px;
                            margin-top: 30px;
                        }
                        .notes-content { 
                            white-space: pre-wrap;
                            margin-bottom: 30px;
                            padding: 10px;
                            background-color: #f9f9f9;
                            border-radius: 5px;
                        }
                        .results-content {
                            margin-bottom: 30px;
                        }
                        .topic {
                            margin-bottom: 15px;
                            padding: 10px;
                            background-color: #f5f5f5;
                            border-radius: 6px;
                            border-left: 3px solid #2b6cb0;
                        }
                        .topic-title {
                            font-weight: bold;
                            color: #2b6cb0;
                            margin-bottom: 5px;
                        }
                        .topic-description {
                            font-size: 0.9rem;
                            color: #555;
                        }
                        @media print {
                            body { margin: 0; padding: 10mm; }
                            h1 { margin-top: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Research Assistant Export</h1>
                    <div class="date">Generated on: ${date}</div>
                    
                    <h2>Your Notes</h2>
                    <div class="notes-content">${notes}</div>
                    
                    ${resultsContent}
                </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            setTimeout(() => printWindow.close(), 100);
        }, 500);
    } catch (error) {
        console.error('Error generating printable content:', error);
        alert('Failed to generate PDF. Please try printing manually instead.');
    }
}

async function makeResearchRequest(operation, selectedText) {
    try {
        const response = await fetch("http://localhost:8080/api/research/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: selectedText,
                operation: operation,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `Server responded with status ${response.status}: ${errorData.message || 'Unknown error'}`
            );
        }

        return await response.text();
    } catch (err) {
        console.error(`Error in ${operation} request:`, err);
        throw err;
    }
}

async function handleResearchAction(operation) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: getSelectedText,
        },
        async (injectionResults) => {
            const selectedText = injectionResults[0].result;

            if (!selectedText) {
                resultsDiv.innerHTML = `<p style="color: red;">Please select some text on the page.</p>`;
                return;
            }

            resultsDiv.innerHTML = `<p>Processing ${operation} request...</p>`;

            try {
                const text = await makeResearchRequest(operation, selectedText);
                
                if (operation === "summarize") {
                    currentSummary = text;
                    currentSuggestions = ""; // Clear suggestions when getting new summary
                    sessionStorage.setItem('currentSummary', currentSummary);
                    sessionStorage.removeItem('currentSuggestions');
                    resultsDiv.innerHTML = `<h4>Summary:</h4><p>${currentSummary}</p>`;
                } else if (operation === "suggest") {
                    currentSuggestions = formatSuggestedTopics(text);
                    sessionStorage.setItem('currentSuggestions', currentSuggestions);
                    resultsDiv.innerHTML = `<h4>Suggested Topics:</h4>${currentSuggestions}`;
                }
            } catch (err) {
                resultsDiv.innerHTML = `
                    <p style="color: red;">Error in ${operation}: ${err.message}</p>
                    <p>Please check:</p>
                    <ul>
                        <li>Is the server running at localhost:8080?</li>
                        <li>Does the endpoint /api/research/process exist?</li>
                        <li>Check server logs for more details</li>
                    </ul>
                `;
            }
        }
    );
}

summarizeBtn.addEventListener("click", () => handleResearchAction("summarize"));
suggestBtn.addEventListener("click", () => handleResearchAction("suggest"));

function getSelectedText() {
    return window.getSelection().toString();
}

function formatSuggestedTopics(text) {
  try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
          return data.map(item => `
              <div class="topic">
                  <div class="topic-title">${item.title || 'Untitled'}</div>
                  <div class="topic-description">${item.description || 'No description provided'}</div>
              </div>
          `).join('');
      }
  } catch (e) {
  }

  const cleanedText = text.replace(/\*\*/g, '');
  return `<pre>${cleanedText}</pre>`;
}

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}