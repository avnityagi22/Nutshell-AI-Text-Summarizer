import "../styles/Buttons.css";

function Buttons({ onClear, onSummarize, loading }) {
  return (
    <div className="button-container">

      <button
        className={`summarize-btn ${loading ? "loading" : ""}`}
        onClick={onSummarize}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="button-spinner"></span>
            Summarizing...
          </>
        ) : (
          <>
            ✨ Summarize Text
          </>
        )}
      </button>

      <button
        className="clear-btn"
        onClick={onClear}
        disabled={loading}
      >
        🗑 Clear
      </button>

    </div>
  );
}

export default Buttons;