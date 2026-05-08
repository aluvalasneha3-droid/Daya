"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle, FileType, CheckCircle2 } from "lucide-react";

export default function MedicalRecordsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }, 2000);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Medical Reports</h1>
          <p className="text-daya-text-secondary leading-relaxed">
            Upload and organize Aarav's reports in one place. These documents serve as a private reference to help DAYA understand his needs better, and keep your records perfectly organized.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-daya-sky/10 border border-daya-sky/30 rounded-2xl p-4 flex gap-3 text-daya-text">
          <AlertCircle className="size-5 text-daya-sky shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Important:</strong> DAYA does not use these files to diagnose or prescribe medical treatment. They are safely stored to assist you in organizing information and providing contextual background for your daily support tools.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-daya-border p-8 md:p-12 text-center relative overflow-hidden">
          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="size-16 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-daya-text mb-1">Upload Complete</h3>
              <p className="text-daya-text-secondary text-sm">Your file has been safely stored in Aarav's profile.</p>
            </motion.div>
          ) : (
            <>
              <div className="size-16 bg-daya-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="size-8 text-daya-sage" />
              </div>
              
              <h3 className="text-xl font-bold text-daya-text mb-2">Upload a New Report</h3>
              <p className="text-sm text-daya-text-secondary mb-8 max-w-md mx-auto">
                Drag and drop your file here, or click to browse. Supported formats: PDF, JPEG, PNG.
              </p>

              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button 
                  disabled={isUploading}
                  className="bg-daya-sage text-white px-8 py-3.5 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors disabled:opacity-70 flex items-center gap-2 mx-auto"
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>Browse Files</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Past Reports List */}
        <div>
          <h2 className="text-lg font-bold text-daya-text mb-4">Past Uploads</h2>
          <div className="space-y-3">
            {[
              { name: "Developmental_Assessment_Jan2026.pdf", date: "Jan 12, 2026", size: "2.4 MB" },
              { name: "Speech_Therapy_Summary_Nov.pdf", date: "Nov 30, 2025", size: "1.1 MB" },
              { name: "Sensory_Profile_Questionnaire.png", date: "Sep 15, 2025", size: "4.5 MB" }
            ].map((file) => (
              <div key={file.name} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-daya-border hover:border-daya-sage/30 transition-colors">
                <div className="size-10 rounded-lg bg-daya-cream flex items-center justify-center text-daya-sage shrink-0">
                  <FileType className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-daya-text truncate">{file.name}</p>
                  <p className="text-xs text-daya-text-light">{file.date} • {file.size}</p>
                </div>
                <button className="text-daya-sage hover:text-daya-sage-dark text-sm font-medium transition-colors p-2">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
