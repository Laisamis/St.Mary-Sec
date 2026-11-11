import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Server, 
  Laptop, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  Info
} from 'lucide-react';
import { BACKEND_FILES, BackendFile } from '../data/backendPhpFiles';

export const PhpAccessDocs: React.FC = () => {
  const [selectedFilename, setSelectedFilename] = useState('config.php');
  const [copied, setCopied] = useState(false);

  const selectedFile = BACKEND_FILES.find(f => f.filename === selectedFilename) || BACKEND_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (file: BackendFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Server-Side Integration Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">
          PHP & Microsoft Access (*.accdb) Backend Code
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Complete, production-ready server-side PHP scripts and Microsoft Access SQL schemas developed to power St. Mary's Secondary School. All scripts use standard PHP PDO ODBC drivers to connect directly to <code>st_marys_school.accdb</code>.
        </p>
      </div>

      {/* Troubleshooting Notice: Why a Blank White Screen Happened & How to Fix */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-200 text-amber-900 font-bold shrink-0 text-base">
            ⚠️
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Why Did the Start File Show a Blank White Screen Locally?
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
              <p>
                <strong>Cause 1 (Vite / TypeScript file):</strong> If you opened the project root <code>index.html</code> directly in your browser, that file contains <code>&lt;script type="module" src="/src/main.tsx"&gt;</code>. Standard web browsers cannot execute TypeScript (<code>.tsx</code>) files without a Vite development server running. When opened directly, the page stays completely blank!
              </p>
              <p>
                <strong>Cause 2 (PHP Error Suppression):</strong> If you ran <code>index.php</code> or <code>config.php</code> on XAMPP and <code>extension=pdo_odbc</code> had a connection error while <code>display_errors=Off</code> was set in <code>php.ini</code>, PHP outputs a blank page (the PHP White Screen of Death).
              </p>
              <div className="pt-2">
                <strong className="text-emerald-800 font-bold">The Solution:</strong> Use the <strong>Standalone HTML files</strong> below! They are pure, native HTML/CSS/JS with zero build tools or Node.js required. You can simply double-click <code>index.html</code> to open it in Chrome/Edge, or place them in XAMPP!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Standalone File Downloads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Individual Standalone Files</h2>
            <p className="text-xs text-slate-500">Download each file individually or open them directly in your browser</p>
          </div>
          <a
            href="/vanilla-version/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Standalone Preview in New Tab</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'index.html', path: '/vanilla-version/index.html', desc: 'Standalone School Homepage' },
            { name: 'register.html', path: '/vanilla-version/register.html', desc: 'Student Registration Form' },
            { name: 'login.html', path: '/vanilla-version/login.html', desc: 'Student & Admin Login Form' },
            { name: 'courses.html', path: '/vanilla-version/courses.html', desc: 'Curriculum & Subjects Page' },
            { name: 'student_dashboard.html', path: '/vanilla-version/student_dashboard.html', desc: 'Student Dashboard & Report' },
            { name: 'admin_dashboard.html', path: '/vanilla-version/admin_dashboard.html', desc: 'Admin Management Console' },
            { name: 'style.css', path: '/vanilla-version/style.css', desc: 'Complete CSS Stylesheet' },
            { name: 'script.js', path: '/vanilla-version/script.js', desc: 'Client Validation & Logic JS' },
            { name: 'index.php', path: '/vanilla-version/index.php', desc: 'PHP Web Server Entry Router' },
            { name: 'config.php', path: '/vanilla-version/config.php', desc: 'ODBC PDO Access DB Connection' },
            { name: 'register.php', path: '/vanilla-version/register.php', desc: 'PHP Backend Registration Handler' },
            { name: 'login.php', path: '/vanilla-version/login.php', desc: 'PHP Backend Login Authentication' },
            { name: 'schema_access.sql', path: '/vanilla-version/database/schema_access.sql', desc: 'MS Access SQL Table Creation DDL' },
            { name: 'README.txt', path: '/vanilla-version/README.txt', desc: 'Setup & Troubleshooting Guide' }
          ].map((item) => (
            <div key={item.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 truncate">
                <span className="font-mono font-bold text-slate-900 block truncate">{item.name}</span>
                <span className="text-[11px] text-slate-500 block truncate">{item.desc}</span>
              </div>
              <a
                href={item.path}
                download={item.name}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] shrink-0 flex items-center gap-1 transition-colors"
                title={`Download ${item.name}`}
              >
                <Download className="w-3 h-3 text-amber-400" />
                <span>Save</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Flow Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2 font-heading text-blue-300">
          <Server className="w-5 h-5" />
          <span>System Architecture: HTML/CSS/JS + PHP + MS Access</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs sm:text-sm">
          {/* Frontend */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 mx-auto flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-base">Client Frontend</div>
            <p className="text-slate-400 text-xs">
              HTML5, CSS3, & Modern JavaScript (Fetch API / FormData). Sends asynchronous requests to PHP endpoints.
            </p>
            <div className="text-[11px] text-blue-300 font-mono">index.html, register.html, login.html</div>
          </div>

          {/* PHP Middle Layer */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 mx-auto flex items-center justify-center font-bold">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-base">PHP Application Layer</div>
            <p className="text-slate-400 text-xs">
              Handles input sanitation, BCrypt password hashing, session cookies, and prepared PDO SQL queries.
            </p>
            <div className="text-[11px] text-purple-300 font-mono">config.php, register.php, login.php</div>
          </div>

          {/* Database */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-base">Microsoft Access DB</div>
            <p className="text-slate-400 text-xs">
              Microsoft Access database (<code>.accdb</code>) queried via Windows ODBC Jet/ACE driver with relations and constraints.
            </p>
            <div className="text-[11px] text-emerald-300 font-mono">st_marys_school.accdb</div>
          </div>
        </div>
      </div>

      {/* Code Viewer Deck */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Top File Select Bar */}
        <div className="border-b border-slate-200 bg-slate-50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {BACKEND_FILES.map((file) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFilename(file.filename)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                  selectedFilename === file.filename
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {file.filename.endsWith('.sql') ? (
                  <Database className="w-3.5 h-3.5" />
                ) : file.filename.endsWith('.md') ? (
                  <BookOpen className="w-3.5 h-3.5" />
                ) : (
                  <FileCode2 className="w-3.5 h-3.5" />
                )}
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => handleDownload(selectedFile)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile.filename}</span>
            </button>
          </div>
        </div>

        {/* File Description */}
        <div className="p-4 bg-blue-50/60 border-b border-blue-100 flex items-center gap-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>{selectedFile.filename}</strong> — {selectedFile.description}
          </span>
        </div>

        {/* Code Content */}
        <div className="p-6 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
          <pre className="whitespace-pre">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
