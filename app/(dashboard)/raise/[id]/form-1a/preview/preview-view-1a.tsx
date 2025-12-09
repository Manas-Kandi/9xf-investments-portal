'use client';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function PreviewView1A({ filing, company }: { filing: any, company: any }) {
  const content = filing.contentJson || {};
  
  return (
    <div className="space-y-8">
      <div className="flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print PDF
        </Button>
      </div>
      <div className="bg-white text-black p-12 max-w-[8.5in] mx-auto min-h-[11in] shadow-lg print:shadow-none print:p-0 print:w-full">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold uppercase mb-2">Form 1-A</h1>
          <h2 className="text-xl font-medium">REGULATION A OFFERING STATEMENT</h2>
          <p className="text-sm text-gray-500 mt-2">UNDER THE SECURITIES ACT OF 1933</p>
        </div>
        
        <section className="mb-8">
          <h3 className="font-bold border-b border-black mb-4 pb-1">Part I: Notification</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div><strong>Exact name of issuer:</strong></div>
            <div>{company.legalName}</div>
            
            <div><strong>Jurisdiction of incorporation:</strong></div>
            <div>{company.stateOfIncorporation}</div>
            
            <div><strong>Entity Type:</strong></div>
            <div>{company.entityType}</div>
            
            <div><strong>Address:</strong></div>
            <div>{company.streetAddress}, {company.city}, {company.state} {company.zipCode}</div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-bold border-b border-black mb-4 pb-1">Part II: Offering Circular</h3>
          
          <div className="mb-6">
            <h4 className="font-bold mb-2">Cover Page</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div><strong>Securities Offered:</strong></div>
              <div>{content.cover?.securitiesOffered || 'N/A'}</div>
              
              <div><strong>Price per Security:</strong></div>
              <div>${Number(content.cover?.pricePerSecurity || 0).toFixed(2)}</div>
              
              <div><strong>Total Maximum Offering:</strong></div>
              <div>${Number(content.cover?.totalMaxOffering || 0).toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-2">Item 1. Business</h4>
            <p className="whitespace-pre-wrap text-sm text-justify">{content.business?.narrative || 'No business description provided.'}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
