import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { fetchAIInsights } from "./firebase"; 

const ReflectiveDashboard = () => {
  const [user] = useAuthState(auth); 
  const [currentSection, setCurrentSection] = useState("logDecision"); 

 
  const [formData, setFormData] = useState({
    stockSymbol: "",
    action: "Buy",
    amount: "",
    reasoning: "",
    expectations: "",
    downsideRisk: "",
    reactionToDrop: "",
  });

  
  const [aiInsights, setAIInsights] = useState(null);


  const [pastDecisions, setPastDecisions] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      fetchPastDecisions();
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

      
{currentSection === "aiInsights" && (
  <div>
    <h3>AI Insights</h3>
    
    
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
