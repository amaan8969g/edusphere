import React from 'react';
import { Award, CheckCircle2, Printer, ShieldCheck } from 'lucide-react';

const CertificateView = ({ certificate }) => {
  if (!certificate) return null;

  const issueDateStr = certificate.issueDate 
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Certificate Frame */}
      <div className="glass-panel rounded-3xl border border-amber-700/40 overflow-hidden shadow-2xl relative bg-slate-950 print:bg-white print:text-slate-900 print:border-none print:shadow-none">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none print:hidden" />

        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-brand-500/20 p-8 sm:p-10 border-b border-amber-700/30 text-center relative print:bg-none print:border-slate-300">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-xs font-bold text-amber-300 uppercase tracking-widest mb-4 print:border-slate-400 print:text-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            Official Certificate of Completion
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight print:text-slate-900">
            {certificate.course?.title || 'Course Completion'}
          </h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base print:text-slate-700">
            This certificate confirms that <span className="font-bold text-amber-300 print:text-slate-900">{certificate.student?.name || 'Student'}</span> has successfully mastered all course modules and satisfied all graduation requirements.
          </p>
        </div>

        {/* Certificate Metadata */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold print:text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              Official Completion Credential
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 print:text-slate-800">
              <ShieldCheck className="w-4 h-4" />
              Issued by EduSphere LMS
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 print:text-slate-800 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 print:bg-slate-100 print:border-slate-300">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 font-medium print:text-slate-600">Certificate Reference Code:</span>
              <span className="font-mono font-bold text-amber-300 print:text-slate-900">{certificate.certificateCode}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 font-medium print:text-slate-600">Issue Date:</span>
              <span className="font-medium text-slate-200 print:text-slate-900">{issueDateStr}</span>
            </div>
            {certificate.course?.instructor?.name && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400 font-medium print:text-slate-600">Instructor:</span>
                <span className="font-medium text-slate-200 print:text-slate-900">{certificate.course.instructor.name}</span>
              </div>
            )}
          </div>

          {/* Action buttons (hidden when printing) */}
          <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 shadow-glow transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
