import "../styles/Textinput.css";

function TextInput({ text, setText }) {
  const MAX_CHARACTERS = 10000;

  const wordCount =
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const characterCount = text.length;

  const handleTextChange = (e) => {
    const newText = e.target.value;

    if (newText.length <= MAX_CHARACTERS) {
      setText(newText);
    }
  };

  return (
    <div className="text-input-card">

      <div className="input-heading">
        <h2>Enter Your Text</h2>

        <span className="character-limit">
          Max 10,000 characters
        </span>
      </div>

      <textarea
        placeholder="Paste or type your text here. Nutshell will turn it into a clear, concise summary..."
        value={text}
        onChange={handleTextChange}
        maxLength={MAX_CHARACTERS}
      />

      <div className="counter">

        <span>
          Words: {wordCount}
        </span>

        <span
          className={
            characterCount > 9000
              ? "counter-warning"
              : ""
          }
        >
          Characters: {characterCount}/{MAX_CHARACTERS}
        </span>

      </div>

    </div>
  );
}

export default TextInput;