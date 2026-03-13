import React from "react";
import "./ToolsRow.css";

const tools = [
  { icon: "📝", label: "Edit Section" },
  { icon: "🤖", label: "AI Improve" },
  { icon: "🎯", label: "Keyword Match" },
  { icon: "📊", label: "Metrics Booster" },
  { icon: "⚡", label: "ATS Fixes" },
];

export default function ToolsRow() {
  return (
    <div className="tools-row">
      {tools.map((tool, index) => (
        <div key={index} className="tool-item">
          <span className="tool-icon">{tool.icon}</span>
          <span className="tool-label">{tool.label}</span>
        </div>
      ))}
    </div>
  );
}
