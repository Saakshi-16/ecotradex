// client-react/src/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import "./style.css";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

const SERVER_URL = "http://localhost:4000";
const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

export default function Dashboard({ email, theme }) {
  const [socket, setSocket] = useState(null);
  const [selected, setSelected] = useState([]);
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [flash, setFlash] = useState({});
  const [history, setHistory] = useState({});
  const [status, setStatus] = useState("Connecting...");

  // create socket once
  useEffect(() => {
    const s = io(SERVER_URL);

    s.on("connect", () => {
      setStatus("Connected to server");
      s.emit("login", email);
    });

    s.on("disconnect", () => setStatus("Disconnected from server"));

    setSocket(s);
    return () => s.disconnect();
  }, [email]);

  // handle incoming prices
  useEffect(() => {
    if (!socket) return;

    socket.on("price_update", (newData) => {
      let updatedFlash = {};
      const updatedHistory = { ...history };

      Object.keys(newData).forEach((ticker) => {
        const oldPrice = prices[ticker];
        const newPrice = newData[ticker];

        if (oldPrice !== undefined) {
          if (newPrice > oldPrice) updatedFlash[ticker] = "flash-up";
          else if (newPrice < oldPrice) updatedFlash[ticker] = "flash-down";
        }

        if (!updatedHistory[ticker]) updatedHistory[ticker] = [];
        updatedHistory[ticker].push(newPrice);
        if (updatedHistory[ticker].length > 20) updatedHistory[ticker].shift();
      });

      setPrevPrices(prices);
      setFlash(updatedFlash);
      setPrices(newData);
      setHistory(updatedHistory);

      setTimeout(() => setFlash({}), 500);
      setStatus("Last update: " + new Date().toLocaleTimeString());
    });

    return () => socket.off("price_update");
  }, [socket, prices, history]);

  // subscribe toggles
  const toggleStock = (ticker) => {
    const updated = selected.includes(ticker)
      ? selected.filter((t) => t !== ticker)
      : [...selected, ticker];
    setSelected(updated);
    if (socket) socket.emit("subscribe", updated);
  };

  // compute gainers/losers from selected stocks (use price diff from prevPrices)
  const topMovers = useMemo(() => {
    const diffs = [];
    selected.forEach((t) => {
      const oldP = prevPrices[t];
      const newP = prices[t];
      if (oldP && newP) {
        const percent = ((newP - oldP) / oldP) * 100;
        diffs.push({ ticker: t, percent });
      }
    });
    diffs.sort((a, b) => b.percent - a.percent);
    const topGainer = diffs[0] || null;
    const topLoser = diffs[diffs.length - 1] || null;
    return { topGainer, topLoser };
  }, [selected, prevPrices, prices]);

  const getChangeInfo = (ticker) => {
    const oldP = prevPrices[ticker];
    const newP = prices[ticker];
    if (!oldP || !newP) return "";
    const diff = newP - oldP;
    const percent = ((diff / oldP) * 100).toFixed(2);
    if (diff > 0) return <span className="up">▲ {percent}%</span>;
    if (diff < 0) return <span className="down">▼ {Math.abs(percent)}%</span>;
    return <span className="neutral">0.00%</span>;
  };

  return (
    <div className="dashboard-layout">
      <div className="left-col">
        <div className="card">
          <h3>Subscriptions</h3>
          <div className="stock-list grid">
            {STOCKS.map((t) => (
              <label
                key={t}
                className={`stock-item ${selected.includes(t) ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(t)}
                  onChange={() => toggleStock(t)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="card mini-row">
          <div>
            <h4>Top Gainer</h4>
            <div className="mover">
              {topMovers.topGainer ? (
                <>
                  <div className="mover-t">{topMovers.topGainer.ticker}</div>
                  <div className="mover-v up">
                    {topMovers.topGainer.percent.toFixed(2)}%
                  </div>
                </>
              ) : (
                <div className="muted">—</div>
              )}
            </div>
          </div>

          <div>
            <h4>Top Loser</h4>
            <div className="mover">
              {topMovers.topLoser ? (
                <>
                  <div className="mover-t">{topMovers.topLoser.ticker}</div>
                  <div className="mover-v down">
                    {Math.abs(topMovers.topLoser.percent).toFixed(2)}%
                  </div>
                </>
              ) : (
                <div className="muted">—</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="right-col">
        <div className="card">
          <div className="table-header">
            <h3>Live Stock Prices</h3>
            <div className="status-small">{status}</div>
          </div>

          <table className="price-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Trend</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {selected.length === 0 && (
                <tr>
                  <td colSpan="3" className="muted">
                    No stocks selected — pick from Subscriptions
                  </td>
                </tr>
              )}

              {selected.map((ticker) => (
                <tr key={ticker} className={flash[ticker] || ""}>
                  <td className="ticker-col">{ticker}</td>

                  <td className="trend-col">
                    {history[ticker] && history[ticker].length > 1 ? (
                      <Sparklines
                        data={history[ticker]}
                        width={120}
                        height={40}
                        margin={5}
                      >
                        <SparklinesLine
                          color={theme === "light" ? "#2ecc71" : "#00ff96"}
                          style={{ strokeWidth: 3, fill: "none" }}
                        />
                        <SparklinesSpots size={3} />
                      </Sparklines>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>

                  <td className="price-col">
                    <div className="price-value">{prices[ticker] || "—"}</div>
                    <div className="price-meta">{getChangeInfo(ticker)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card small-note">
          <strong>Tip:</strong> Open an incognito window and login with another
          email to test multi-user updates.
        </div>
      </div>
    </div>
  );
}
