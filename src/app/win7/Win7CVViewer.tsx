"use client";

import React, { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Win7CVViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const onLoadError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const prevPage = () => setPageNumber(p => Math.max(1, p - 1));
  const nextPage = () => setPageNumber(p => Math.min(numPages, p + 1));

  return (
    <div className="app-content cv-app">
      <div className="explorer-toolbar">
        <button className="toolbar-btn" onClick={prevPage} disabled={pageNumber <= 1}>← Back</button>
        <button className="toolbar-btn" onClick={nextPage} disabled={pageNumber >= numPages}>→ Forward</button>
        <div className="address-bar">
          <span className="address-icon">📄</span>
          <span>C:\Users\Eugene\Documents\Eugene_CV_Fullstack.pdf</span>
        </div>
        {numPages > 0 && (
          <span className="cv-page-indicator">Page {pageNumber} of {numPages}</span>
        )}
        <a
          href="/Eugene_CV_Fullstack.pdf"
          download="Eugene_CV_Fullstack.pdf"
          className="toolbar-btn"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          💾 Download
        </a>
      </div>

      <div className="cv-viewer" ref={containerRef}>
        {loading && !error && (
          <div className="cv-loading">
            <div className="cv-spinner" />
            <span>Loading CV…</span>
          </div>
        )}
        {error && (
          <div className="cv-loading">
            <span>⚠️ Could not load PDF.</span>
            <a href="/Eugene_CV_Fullstack.pdf" download className="toolbar-btn" style={{ marginTop: 8 }}>
              💾 Download CV instead
            </a>
          </div>
        )}
        <Document
          file="/Eugene_CV_Fullstack.pdf"
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading=""
        >
          <Page
            pageNumber={pageNumber}
            width={containerRef.current ? containerRef.current.clientWidth - 32 : 820}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>

      {numPages > 0 && (
        <div className="cv-nav-bar">
          <button className="media-btn" onClick={prevPage} disabled={pageNumber <= 1}>◀</button>
          <span>{pageNumber} / {numPages}</span>
          <button className="media-btn" onClick={nextPage} disabled={pageNumber >= numPages}>▶</button>
        </div>
      )}
    </div>
  );
}
