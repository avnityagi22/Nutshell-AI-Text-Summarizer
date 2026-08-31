import { useState } from "react";
import "../styles/Summarybox.css";

function Summarybox({ summary, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDownload = () => {
    if (!summary) return;

    const blob = new Blob([summary], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Nutshell-Summary.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="summary-box">

      {/* HEADER */}
      <div className="summary-header">

        <h2>📝 Summary</h2>

        {summary && !loading && (
          <div className="summary-actions">

            <button
              className={`copy-button ${copied ? "active" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>

            <button
              className="download-button"
              onClick={handleDownload}
            >
              📥 Download
            </button>

          </div>
        )}

      </div>


      {/* CONTENT */}
      <div className="summary-content">

        {loading ? (

          /* LOADING STATE */

          <div className="ai-loading">

            <div className="loading-icon">
              ✦
            </div>

            <h3>
              AI is thinking...
            </h3>

            <p>
              Analyzing your text and creating
              a concise summary
            </p>

            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

        ) : summary ? (

          /* SUMMARY */

          <p className="summary-text">
            {summary}
          </p>

        ) : (

          /* EMPTY STATE */

          <div className="summary-placeholder">

            <div className="placeholder-icon">
              ✦
            </div>

            <p>
              Your AI-generated summary will appear here.
            </p>

            <span>
              Enter your text above and click
              "Summarize Text"
            </span>

          </div>

        )}

      </div>

    </div>
  );
}

export default Summarybox;