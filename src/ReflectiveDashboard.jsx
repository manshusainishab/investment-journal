import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase"; // Firebase Auth and Firestore instance
import { collection, getDocs, addDoc } from "firebase/firestore";
import { fetchAIInsights } from "./firebase"; 

const ReflectiveDashboard = () => {
  const [user] = useAuthState(auth); // Get current logged-in user
  const [currentSection, setCurrentSection] = useState("logDecision"); // Control active section

  // State for investment decision form
  const [formData, setFormData] = useState({
    stockSymbol: "",
    action: "Buy",
    amount: "",
    reasoning: "",
    expectations: "",
    downsideRisk: "",
    reactionToDrop: "",
  });

  // State for AI insights
  const [aiInsights, setAIInsights] = useState(null);

  // State for past decisions
  const [pastDecisions, setPastDecisions] = useState([]);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Log investment decision)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to log a decision.");
      return;
    }

    try {
      const decisionsRef = collection(db, "users", user.uid, "decisions");
      await addDoc(decisionsRef, {
        ...formData,
        userId: user.uid,
        timestamp: Date.now(),
      });
      alert("Decision logged successfully!");
      setFormData({
        stockSymbol: "",
        action: "Buy",
        amount: "",
        reasoning: "",
        expectations: "",
        downsideRisk: "",
        reactionToDrop: "",
      });
    } catch (error) {
      alert("Failed to save decision.");
    }
  };

  // Fetch past decisions
  const fetchPastDecisions = async () => {
    if (user) {
      const decisionsRef = collection(db, "users", user.uid, "decisions");
      const decisionSnapshot = await getDocs(decisionsRef);
      const decisionList = decisionSnapshot.docs.map(doc => doc.data());
      setPastDecisions(decisionList);
    }
  };

  // Fetch AI insights
  const fetchInsights = async (decision) => {
    try {
      const insights = await fetchAIInsights(user.uid,decision);
      setAIInsights(insights);
    } catch (error) {
      alert("Failed to fetch AI insights.");
    }
  };

  // Fetch past decisions on component mount
  useEffect(() => {
    if (user) fetchPastDecisions();
    // if (user) fetchInsights();
  }, [user]);

  return (
    <div>
      <h2>Reflective Dashboard</h2>

      {/* Tabs for navigation */}
      <div className="tabs">
        <button onClick={() => setCurrentSection("logDecision")}>
          Log Investment Decision
        </button>
        <button onClick={() => setCurrentSection("pastDecisions")}>
          Past Decisions
        </button>
        <button onClick={() => setCurrentSection("aiInsights")}>
          AI Insights
        </button>
      </div>

      {/* Section 1: Log Investment Decision */}
      {currentSection === "logDecision" && (
        <div>
          <form onSubmit={handleSubmit}>
      <h2>Log Your Investment Decision</h2>
      
      <label>
        Stock Symbol:
        <input
          type="text"
          name="stockSymbol"
          value={formData.stockSymbol}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Action:
        <select name="action" value={formData.action} onChange={handleChange}>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </label>

      <label>
        Amount Invested:
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Reasoning:
        <textarea
          name="reasoning"
          value={formData.reasoning}
          onChange={handleChange}
          required
        ></textarea>
      </label>

      <label>
        Expectations for this investment:
        <textarea
          name="expectations"
          value={formData.expectations}
          onChange={handleChange}
          required
        ></textarea>
      </label>

      <label>
        Downside Risk:
        <textarea
          name="downsideRisk"
          value={formData.downsideRisk}
          onChange={handleChange}
          required
        ></textarea>
      </label>

      <label>
        Reaction to 20% Price Drop:
        <textarea
          name="reactionToDrop"
          value={formData.reactionToDrop}
          onChange={handleChange}
          required
        ></textarea>
      </label>

      <button type="submit">Log Decision</button>
    </form>
        </div>
      )}

      {/* Section 2: Past Decisions */}
      {currentSection === "pastDecisions" && (
        <div>
          <h3>Your Past Decisions</h3>
          {pastDecisions.length > 0 ? (
            pastDecisions.map((decision, index) => (
              <div key={index}>
                <h4>Stock: {decision.stockSymbol}</h4>
                <p>Action: {decision.action}</p>
                <p>Amount Invested: {decision.amount}</p>
                <p>Reasoning: {decision.reasoning}</p>
              </div>
            ))
          ) : (
            <p>No past decisions found.</p>
          )}
        </div>
      )}

      {/* Section 3: AI Insights */}
{currentSection === "aiInsights" && (
  <div>
    <h3>AI Insights</h3>
    
    {/* Show loading state if insights are still being fetched */}
    {!aiInsights ? (
      <p>Feature Coming Soon</p>
    ) : error ? (
      <p style={{ color: 'red' }}>Error fetching AI insights: {error}</p>
    ) : (
      aiInsights && (
        <div>
          <p>{aiInsights}</p>
        </div>
      )
    )}
  </div>
)}
    </div>
  );
};

export default ReflectiveDashboard;
