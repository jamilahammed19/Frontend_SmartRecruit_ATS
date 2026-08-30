import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as scannerService from "../../services/scannerService";

export default function AiScanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch already uploaded documents on page load
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await scannerService.getDocuments();
        setDocuments(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Failed to load documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Instantly upload file when selected
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newDoc = await scannerService.uploadDocument(file);
      setDocuments(prev => [...prev, newDoc]);
    } catch (error) {
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await scannerService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      alert("Failed to delete document.");
    }
  };

  const handleSubmitToAi = async () => {
    if (documents.length === 0) return alert("Please upload at least one document first.");
    
    setIsProcessing(true);
    try {
      // Send to AI Backend
      const aiParsedData = await scannerService.processDocumentsWithAi();
      
      // Navigate back to Edit Profile and pass the parsed JSON data via React Router state!
      alert("Documents processed successfully! Review your updated details.");
      navigate("/candidate/profile-edit", { state: { aiData: aiParsedData } });
      
    } catch (error) {
      alert("AI Processing failed. Make sure your documents are clear and readable.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your documents...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 font-sans">
      <Link to="/candidate/profile-edit" className="text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 inline-block">
        ← Back to Profile
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-4xl">✨</span> AI Document Scanner
        </h1>
        <p className="text-slate-500 mt-2">
          Upload your resume, certificates, or transcripts. Our AI will extract your details and automatically fill your profile forms!
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Upload a New Document</h3>
          <p className="text-sm text-slate-500">PDF, PNG, or JPG up to 5MB</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
        />
        
        <button 
          onClick={() => fileInputRef.current.click()} 
          disabled={isUploading || isProcessing}
          className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "+ Add Document"}
        </button>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Uploaded Documents ({documents.length})</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No documents uploaded yet.</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{doc.file_name || 'Document'}</p>
                    <p className="text-xs text-slate-500">Ready for processing</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)} 
                  disabled={isProcessing}
                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSubmitToAi}
          disabled={isProcessing || documents.length === 0}
          className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? "🧠 AI is Scanning..." : "Submit to AI Scanner 🚀"}
        </button>
      </div>
    </div>
  );
}