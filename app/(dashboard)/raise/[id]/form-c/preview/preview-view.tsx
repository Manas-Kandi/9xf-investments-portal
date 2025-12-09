'use client';

import { Button } from '@/components/ui/button';
import { Printer, Download, CheckCircle } from 'lucide-react';

export default function PreviewView({ filing, company, raise }: { filing: any, company: any, raise: any }) {
  const content = filing.contentJson || {};
  const issuer = content.issuer || {};
  const offering = content.offering || {};
  const risks = content.risks || {};
  const useOfProceeds = content.useOfProceeds || {};
  const financial = content.financialCondition || {};
  const related = content.relatedParties || {};

  const handlePrint = () => window.print();
  
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-c-${company.legalName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Actions Toolbar */}
      <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-white/10 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-white">Review & Finalize</h2>
          <p className="text-xs text-white/50">Preview your Form C before filing.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
          <Button variant="secondary" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print / PDF
          </Button>
          <Button onClick={() => alert('This would verify all fields and submit to the portal API.')}>
            <CheckCircle className="w-4 h-4 mr-2" /> Mark Ready
          </Button>
        </div>
      </div>

      {/* Form C Document Preview */}
      <div className="bg-white text-black p-12 rounded-xl shadow-xl max-w-[8.5in] mx-auto min-h-[11in] print:p-0 print:shadow-none print:rounded-none print:w-full print:max-w-none">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold uppercase mb-2">Form C</h1>
          <h2 className="text-xl font-medium">Offering Statement</h2>
          <p className="text-sm text-gray-500 mt-4">(Exhibit A to Form C)</p>
        </div>

        <div className="space-y-8 text-sm">
          {/* 1. ISSUER */}
          <section>
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">1. The Issuer</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="font-semibold">Name of Issuer:</div>
              <div>{issuer.legalName}</div>
              
              <div className="font-semibold">Jurisdiction:</div>
              <div>{issuer.jurisdiction}</div>
              
              <div className="font-semibold">Date of Incorporation:</div>
              <div>{issuer.formationDate}</div>
              
              <div className="font-semibold">Entity Type:</div>
              <div>{issuer.entityType}</div>
              
              <div className="font-semibold">Address:</div>
              <div>
                {issuer.streetAddress}<br/>
                {issuer.city}, {issuer.state} {issuer.zipCode}
              </div>
              
              <div className="font-semibold">Website:</div>
              <div>{issuer.website}</div>
            </div>
          </section>

          {/* 2. ELIGIBILITY */}
          <section>
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">2. Eligibility</h3>
            <p className="mb-2">The issuer certifies that:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>It is organized under, and subject to, the laws of a State or territory of the United States or the District of Columbia.</li>
              <li>It is not subject to the requirement to file reports pursuant to Section 13 or Section 15(d) of the Securities Exchange Act of 1934.</li>
              <li>It is not an investment company registered or required to be registered under the Investment Company Act of 1940.</li>
              <li>It is not ineligible to rely on this exemption under Section 4(a)(6) of the Securities Act as a result of a disqualification specified in Rule 503(a) of Regulation Crowdfunding.</li>
            </ul>
          </section>

          {/* 3. DIRECTORS & OFFICERS */}
          <section>
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">3. Directors and Officers</h3>
            <p className="italic text-gray-500 mb-2">See attached Team Roster.</p>
          </section>

          {/* 4. OFFERING */}
          <section>
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">4. The Offering</h3>
            <div className="grid grid-cols-2 gap-y-2 mb-4">
              <div className="font-semibold">Security Type:</div>
              <div>{offering.securityType}</div>
              
              <div className="font-semibold">Target Amount:</div>
              <div>${Number(offering.targetAmount || 0).toLocaleString()}</div>
              
              <div className="font-semibold">Maximum Amount:</div>
              <div>${Number(offering.maximumAmount || 0).toLocaleString()}</div>
              
              <div className="font-semibold">Price Per Security:</div>
              <div>${Number(offering.pricePerSecurity || 0).toFixed(2)}</div>
              
              <div className="font-semibold">Minimum Investment:</div>
              <div>${Number(offering.minimumInvestment || 0).toLocaleString()}</div>
            </div>
            
            <h4 className="font-bold mb-2 mt-4">Use of Proceeds</h4>
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Category</th>
                  <th className="border border-gray-300 p-2 text-right">Amount</th>
                  <th className="border border-gray-300 p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {(useOfProceeds.items || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2">{item.category}</td>
                    <td className="border border-gray-300 p-2 text-right">${Number(item.amount).toLocaleString()}</td>
                    <td className="border border-gray-300 p-2 text-gray-600">{item.description}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-right">
                    ${(useOfProceeds.totalTarget || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 5. FINANCIAL CONDITION */}
          <section>
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">5. Financial Condition</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-1">Operating History</h4>
                <p className="whitespace-pre-wrap text-gray-700">{financial.history || 'Not provided.'}</p>
              </div>
              <div>
                <h4 className="font-bold mb-1">Liquidity & Capital Resources</h4>
                <p className="whitespace-pre-wrap text-gray-700">{financial.liquidity || 'Not provided.'}</p>
              </div>
              <div>
                <h4 className="font-bold mb-1">Historical Capital</h4>
                <p className="whitespace-pre-wrap text-gray-700">{financial.capitalResources || 'Not provided.'}</p>
              </div>
            </div>
          </section>

          {/* 6. RISK FACTORS */}
          <section className="break-before-page">
            <h3 className="text-lg font-bold border-b border-black pb-1 mb-4">6. Risk Factors</h3>
            <p className="mb-4 text-gray-600">Investing in the Company involves a high degree of risk. You should carefully consider the following risks.</p>
            <div className="space-y-6">
              {(risks.riskFactors || []).map((risk: any, i: number) => (
                <div key={i}>
                  <h4 className="font-bold mb-1">{risk.title}</h4>
                  <p className="whitespace-pre-wrap text-gray-700">{risk.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
