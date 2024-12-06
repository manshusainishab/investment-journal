import React, { useState } from "react";
import { db } from "./firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import './decision-form.css';

const DecisionForm = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    stockSymbol: "",
    action: "Buy",
    amount: "",
    reasoning: "",
    expectations: "",
    downsideRisk: "",
    reactionToDrop: "",
  });

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
    } catch (error) {
      console.error("Error saving decision: ", error);
      alert("Failed to save decision. Try again.");
    }
  };

  return (
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
  );
};

export default DecisionForm;
