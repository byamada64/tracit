"use client";

import React from "react";

export default function ResumeUploadPage() {
  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "16px" }}>
        Resume Upload
      </h1>

      <p style={{ marginBottom: "24px", color: "#555" }}>
        Upload your resume to get started.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "200px",
          border: "2px dashed #b48cff",
          borderRadius: "10px",
          background: "#faf0ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "14px",
          color: "#777",
        }}
      >
        Drag & Drop your file here
        <br />
        (PDF, DOCX)
      </div>
    </div>
  );
}
