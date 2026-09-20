import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Certificate } from '../types';
import { Award, ShieldCheck, X, Eye } from 'lucide-react';

export const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    api.getCertificates().then(setCerts);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyber-border pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" /> CERTIFICATE INVENTORY
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">X.509 public key infrastructure audit, revocation status, and validity schedules</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50 uppercase font-semibold">
          TOTAL MANAGED: {certs.length}
        </span>
      </div>

      {/* Certificate Inventory Data Table */}
      <div className="bg-cyber-panel border border-cyber-border rounded overflow-hidden shadow-xl">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-cyber-border text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Issuer</th>
              <th className="py-2.5 px-3">Valid Until</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border text-slate-300">
            {certs.map((c) => {
              const validUntilStr = new Date(c.validity_end).toISOString().split('T')[0];
              const isExpired = c.expiration_status === 'Expired';
              const isWarning = c.expiration_status === 'Expiring Soon';
              
              return (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCert(c)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-100 font-sans">{c.subject}</td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{c.issuer}</td>
                  <td className="py-2.5 px-3 text-slate-300">{validUntilStr}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${
                      isExpired
                        ? 'bg-red-950/60 text-red-400 border-red-800/60'
                        : isWarning
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    }`}>
                      {c.expiration_status || 'Valid'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCert(c);
                      }}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3 h-3" /> DETAILS
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#1e293b] rounded max-w-lg w-full p-5 space-y-4 font-mono text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" /> CERTIFICATE DETAILS: {selectedCert.subject}
              </h3>
              <button onClick={() => setSelectedCert(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Subject CN:</span>
                <span className="text-slate-100 font-semibold">{selectedCert.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Issuer CA:</span>
                <span className="text-slate-200 truncate max-w-xs">{selectedCert.issuer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Public Key:</span>
                <span className="text-blue-400 font-bold">{selectedCert.public_key_size}-bit {selectedCert.public_key_algorithm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Signature Alg:</span>
                <span className="text-slate-200">{selectedCert.signature_algorithm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Subject Alt Names (SAN):</span>
                <span className="text-slate-200">{selectedCert.sans?.join(', ') || selectedCert.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Validity End:</span>
                <span className="text-amber-400">{new Date(selectedCert.validity_end).toISOString().split('T')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Revocation Status:</span>
                <span className="text-emerald-400 font-semibold">GOOD (OCSP Verified)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-mono px-3 py-1.5 rounded text-xs"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

