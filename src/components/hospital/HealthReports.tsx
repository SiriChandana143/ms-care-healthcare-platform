import { useState } from 'react';
import {
  FileText, ArrowLeft, Calendar, User, Building2, CheckCircle2,
  AlertCircle, Download, X,
} from 'lucide-react';
import { HEALTH_REPORTS, type HealthReport } from '../../data/hospitalData';

export function HealthReports() {
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);

  if (selectedReport) {
    return <ReportDetail report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-medical-600" />
        <h2 className="text-lg font-bold font-display text-navy-900">Health Reports</h2>
      </div>

      {/* Demo disclaimer */}
      <div className="p-3 rounded-xl bg-warn-50 border border-warn-100 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-warn-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-warn-700 leading-relaxed">
          Demo Health Report — Simulated Data. These reports are fictional and for demonstration purposes only. They are not real medical records.
        </p>
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEALTH_REPORTS.map((report) => (
          <div key={report.id} className="card-lg p-5 hover:shadow-large transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-medical-600" />
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                report.status === 'Normal' ? 'bg-safe-100 text-safe-700' :
                report.status === 'Review Needed' ? 'bg-warn-100 text-warn-600' :
                'bg-navy-100 text-navy-700'
              }`}>
                {report.status}
              </span>
            </div>
            <h3 className="font-bold text-navy-900 text-sm leading-tight">{report.type}</h3>
            <div className="space-y-1 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-navy-400">
                <Calendar className="w-3.5 h-3.5" />
                {report.date}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-navy-400">
                <User className="w-3.5 h-3.5" />
                {report.doctor}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-navy-400">
                <Building2 className="w-3.5 h-3.5" />
                {report.department}
              </div>
            </div>
            <button
              onClick={() => setSelectedReport(report)}
              className="w-full btn-secondary text-xs mt-4 group-hover:bg-medical-50"
            >
              <FileText className="w-3.5 h-3.5" />
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportDetail({ report, onBack }: { report: HealthReport; onBack: () => void }) {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </button>

      <div className="card-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-medical-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-medical-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-navy-900">{report.type}</h1>
              <p className="text-sm text-navy-400 mt-0.5">{report.date} • {report.doctor}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            report.status === 'Normal' ? 'bg-safe-100 text-safe-700' :
            report.status === 'Review Needed' ? 'bg-warn-100 text-warn-600' :
            'bg-navy-100 text-navy-700'
          }`}>
            {report.status}
          </span>
        </div>

        {/* Demo disclaimer */}
        <div className="p-3 rounded-xl bg-warn-50 border border-warn-100 flex items-start gap-2 mb-6">
          <AlertCircle className="w-4 h-4 text-warn-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warn-700 leading-relaxed">
            Demo Health Report — Simulated Data. This is a fictional report for demonstration purposes and is not a real medical record.
          </p>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-gray-50 mb-6">
          <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">Summary</h3>
          <p className="text-sm text-navy-700 leading-relaxed">{report.summary}</p>
        </div>

        {/* Details table */}
        <div>
          <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wide mb-3">Test Results</h3>
          <div className="space-y-2">
            {report.details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy-700">{detail.label}</div>
                  <div className="text-xs text-navy-400 mt-0.5">Reference: {detail.range}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${detail.normal ? 'text-safe-600' : 'text-warn-600'}`}>
                    {detail.value}
                  </span>
                  {detail.normal ? (
                    <CheckCircle2 className="w-4 h-4 text-safe-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-warn-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <Building2 className="w-3.5 h-3.5" />
            {report.department}
          </div>
          <div className="flex-1" />
          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button onClick={onBack} className="btn-secondary text-xs">
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
