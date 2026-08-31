function SummaryHistory({ history = [] }) {

    return (
        <div className="history-box">

            <h2>📚 Summary History</h2>

            {history.length === 0 ? (
                <p>No summaries yet.</p>
            ) : (
                history.map((item) => (
                    <div
                        className="history-item"
                        key={item.id}
                    >
                        <h3>{item.title}</h3>

                        <p>
                            {item.preview}
                        </p>

                        <small>
                            {item.date}
                        </small>
                    </div>
                ))
            )}

        </div>
    );
}

export default SummaryHistory;