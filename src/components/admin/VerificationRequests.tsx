import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface VerificationRequest {
  id: string;
  supplier_id: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  supplier: {
    company_name: string;
    contact_name: string;
    phone: string;
    address: string;
  };
}

export default function VerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          supplier:suppliers (
            company_name,
            contact_name,
            phone,
            address
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .rpc('process_verification_request', {
          request_id: requestId,
          new_status: status,
          notes: adminNotes
        });

      if (error) throw error;
      await loadRequests();
      setAdminNotes('');
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading verification requests...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Supplier Verification Requests</h2>
      <div className="space-y-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{request.supplier.company_name}</h3>
                <p className="text-sm text-gray-600">Contact: {request.supplier.contact_name}</p>
                <p className="text-sm text-gray-600">Phone: {request.supplier.phone}</p>
                <p className="text-sm text-gray-600">Address: {request.supplier.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={`notes-${request.id}`} className="block text-sm font-medium text-gray-700">
                    Admin Notes
                  </label>
                  <textarea
                    id={`notes-${request.id}`}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerification(request.id, 'approved')}
                    disabled={!!processingId}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(request.id, 'rejected')}
                    disabled={!!processingId}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )}

            {request.admin_notes && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                    <p className="text-sm text-gray-600">{request.admin_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No verification requests found
          </div>
        )}
      </div>
    </div>
  );
}