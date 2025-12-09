'use client';

import { useState } from 'react';
import { getDocuments, deleteDocument } from '@/app/actions/documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FileUploader from './file-uploader';
import { Search, Trash2, Download, FileText, Plus, X } from 'lucide-react';

export default function DocumentManager({ initialDocuments }: { initialDocuments: any[] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [open, setOpen] = useState(false);

  const refreshDocuments = async () => {
    const docs = await getDocuments(search, filter);
    setDocuments(docs);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this document?')) {
      await deleteDocument(id);
      refreshDocuments();
    }
  };

  const filteredDocs = documents.filter((doc: any) => 
    doc.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'ALL' || doc.category === filter)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Center</h1>
          <p className="text-white/50">Securely manage and share your company documents.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Upload Document
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-bold text-white mb-4">Upload Document</h2>
            <FileUploader onUploadComplete={() => { setOpen(false); refreshDocuments(); }} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input 
            placeholder="Search documents..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="ALL">All Categories</option>
          <option value="FINANCIAL">Financials</option>
          <option value="LEGAL">Legal</option>
          <option value="FILING">Filings</option>
          <option value="MARKETING">Marketing</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* List */}
      <Card className="bg-neutral-900 border-white/10">
        <CardContent className="p-0">
          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-white/40">No documents found.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredDocs.map((doc: any) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-white/10">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>{(doc.size / 1024).toFixed(0)} KB</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <Badge variant="default" className="text-[10px] py-0 h-4 border-white/20 text-white/60">
                          {doc.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => window.open(doc.url, '_blank')}>
                      <Download className="w-4 h-4 text-white/70" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4 text-red-500/70 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
