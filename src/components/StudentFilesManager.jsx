import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { uploadStudentFilesThunk } from "../redux/slices/STUDENTS/uploadStudentFilesThunk";

export const StudentFilesManager = ({ student, onUpdated }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
  const dispatch = useDispatch();
  const [photoFile, setPhotoFile] = useState(null);
  const [docFiles, setDocFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const id_number = student?.id_number;
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(student?.photoUrl || student?.photo_url || null);
  const [currentDocuments, setCurrentDocuments] = useState(Array.isArray(student?.documents) ? student.documents : []);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // allow common image types too for documents
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
  ];

  const validatePhoto = (file) => {
    if (!file) return true;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('ניתן להעלות רק תמונות לתמונת פרופיל');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setErrorMsg('גודל קובץ תמונה עד 10MB');
      return false;
    }
    return true;
  };

  const validateDocs = (filesList) => {
    const files = Array.from(filesList || []);
    for (const f of files) {
      if (!(allowedDocTypes.includes(f.type) || f.type.startsWith('image/'))) {
        setErrorMsg('ניתן להעלות רק PDF/Word/תמונות');
        return false;
      }
      if (f.size > MAX_SIZE) {
        setErrorMsg('גודל מסמך/תמונה עד 10MB');
        return false;
      }
    }
    return true;
  };

  const handleUpload = async () => {
    if (!id_number) return;
    setErrorMsg("");
    if (!validatePhoto(photoFile)) return;
    if (!validateDocs(docFiles)) return;
    const resultAction = await dispatch(
      uploadStudentFilesThunk({ id_number, profilePhoto: photoFile, documents: docFiles })
    );
    if (uploadStudentFilesThunk.fulfilled.match(resultAction)) {
      const payload = resultAction.payload;
      const nextPhoto = payload.photoUrl || payload.photo_url || currentPhotoUrl;
      const nextDocs = Array.isArray(payload.documents) ? payload.documents : currentDocuments;
      setCurrentPhotoUrl(nextPhoto);
      setCurrentDocuments(nextDocs);
      onUpdated?.({ photoUrl: nextPhoto, documents: nextDocs });
      setPhotoFile(null);
      setDocFiles([]);
    } else {
      console.error("Upload failed", resultAction.payload || resultAction.error);
      setErrorMsg('העלאה נכשלה, נסי שוב.');
    }
  };

  useEffect(() => {
    if (!id_number) return;
    let isMounted = true;
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/studentsData/${id_number}/photo`);
        if (res.ok) {
          const data = await res.json();
          const url = data.photoUrl || data.photo_url || data.url || null;
          if (isMounted && url) setCurrentPhotoUrl(url);
        }
      } catch {}
    };
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/studentsData/${id_number}/documents`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) setCurrentDocuments(data);
          if (isMounted && data?.documents && Array.isArray(data.documents)) setCurrentDocuments(data.documents);
        }
      } catch {}
    };
    fetchPhoto();
    fetchDocs();
    return () => { isMounted = false; };
  }, [id_number]);

const API_BASE = BACKEND_URL;

const resolveFileUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url.startsWith('/') ? url : '/' + url}`;
};

// No client-side filename mangling is needed; server returns proper display names

const displayNameForDoc = (doc) => {
  if (!doc) return '';
  if (doc.name) return doc.name;
  if (doc.originalName) return doc.originalName;
  const url = doc.url || '';
  try {
    const full = resolveFileUrl(url);
    const u = new URL(full);
    const last = u.pathname.split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(last) || full;
  } catch {
    return url;
  }
};

  return (
    <div className="space-y-3">
      <h3 className="text-md font-semibold">תמונה ומסמכים</h3>
      {/* Current photo */}
      {currentPhotoUrl && (
<img
    src={resolveFileUrl(currentPhotoUrl)}
    alt="student"
    className="w-24 h-24 object-cover rounded"
  />      )}

      {/* Photo input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm">תמונת פרופיל</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setErrorMsg("");
            if (!validatePhoto(file)) return;
            setPhotoFile(file);
          }}
        />
      </div>

      {/* Docs input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm">מסמכים (PDF/Word/תמונות)</label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          onChange={(e) => {
            const files = e.target.files || [];
            setErrorMsg("");
            if (!validateDocs(files)) return;
            setDocFiles(Array.from(files));
          }}
        />
      </div>

      {errorMsg && (
        <div className="text-red-600 text-sm" role="alert">{errorMsg}</div>
      )}

      {/* Existing documents list */}
      {Array.isArray(currentDocuments) && currentDocuments.length > 0 && (
        <ul className="list-disc pr-4 text-sm">
          {currentDocuments.map((d, i) => (
            <li key={i}>
              <a href={resolveFileUrl(d.url)} target="_blank" rel="noreferrer" className="text-blue-600 underline">{displayNameForDoc(d)}</a>
            </li>
          ))}
        </ul>
      )}

      <Button onClick={handleUpload}>העלה קבצים</Button>
    </div>
  );
};

export default StudentFilesManager;