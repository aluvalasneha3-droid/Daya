"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, FileText, FileType, Trash2, Upload } from "lucide-react";
import { getAccessToken } from "@/lib/auth-client";

type ChildDocument = {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  category: string;
  created_at: string;
  url: string;
};

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MedicalRecordsPage() {
  const [documents, setDocuments] = useState<ChildDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const refreshDocuments = useCallback(async () => {
    const token = await getAccessToken();
    const response = await fetch("/api/profile/documents", {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not load reports.");
    setDocuments(data.documents ?? []);
  }, []);

  useEffect(() => {
    getAccessToken()
      .then(async (token) => {
        const response = await fetch("/api/profile/documents", {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Could not load reports.");
        setDocuments(data.documents ?? []);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Could not load reports."))
      .finally(() => setLoading(false));
  }, []);

  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/profile/documents", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not upload report.");
      await refreshDocuments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload report.");
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(document: ChildDocument) {
    if (!window.confirm(`Delete "${document.file_name}" from your private reports?`)) return;
    setError("");
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/profile/documents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: document.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not delete report.");
      setDocuments((current) => current.filter((item) => item.id !== document.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete report.");
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Medical Reports</h1>
          <p className="text-daya-text-secondary leading-relaxed">
            Upload and privately organize reports for your family. Files are stored in your Supabase account and only accessible through your signed-in account.
          </p>
        </div>

        <div className="bg-daya-sky/10 border border-daya-sky/30 rounded-2xl p-4 flex gap-3 text-daya-text">
          <AlertCircle className="size-5 text-daya-sky shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Important:</strong> DAYA does not diagnose or prescribe treatment. Reports are for family organization and context. Only PDF, JPEG, or PNG files up to 10 MB are accepted.
          </p>
        </div>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div className="bg-white rounded-3xl shadow-sm border border-daya-border p-8 md:p-12 text-center">
          <div className="size-16 bg-daya-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="size-8 text-daya-sage" />
          </div>
          <h2 className="text-xl font-bold text-daya-text mb-2">Upload a previous report</h2>
          <p className="text-sm text-daya-text-secondary mb-8 max-w-md mx-auto">
            Choose a developmental, therapy, school, or other care document to keep it with this child&apos;s private profile.
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-daya-sage px-8 py-3.5 font-medium text-white transition-colors hover:bg-daya-sage-dark has-[:disabled]:opacity-70">
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Browse Files"}
            <input type="file" accept=".pdf,image/jpeg,image/png" onChange={uploadFile} disabled={uploading} className="sr-only" />
          </label>
        </div>

        <section>
          <h2 className="text-lg font-bold text-daya-text mb-4">Past Uploads</h2>
          {loading ? (
            <p className="rounded-xl bg-white p-5 text-sm text-daya-text-secondary">Loading your saved reports...</p>
          ) : documents.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-sm text-daya-text-secondary">No reports uploaded to this account yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <motion.div key={document.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl border border-daya-border">
                  <div className="size-10 rounded-lg bg-daya-cream flex items-center justify-center text-daya-sage shrink-0">
                    {document.mime_type === "application/pdf" ? <FileText className="size-5" /> : <FileType className="size-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-daya-text truncate">{document.file_name}</p>
                    <p className="text-xs text-daya-text-light">
                      {new Date(document.created_at).toLocaleDateString()} · {formatSize(document.file_size)}
                    </p>
                  </div>
                  <a href={document.url} target="_blank" rel="noopener noreferrer"
                    className="text-daya-sage-dark hover:text-daya-sage text-sm font-medium p-2">View</a>
                  <button type="button" onClick={() => void deleteDocument(document)} aria-label={`Delete ${document.file_name}`}
                    className="rounded-lg p-2 text-daya-text-light hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
