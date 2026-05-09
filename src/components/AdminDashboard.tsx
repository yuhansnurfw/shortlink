'use client';

import React, { useState, useEffect } from 'react';
import { getLinks, deleteLink, updateLink } from '@/app/actions';
import { NeonButton } from './ui/NeonButton';
import { UrlInput } from './ui/UrlInput';

interface Link {
  id: string;
  original_url: string;
  created_at: string;
}

export function AdminDashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const fetchLinks = async () => {
    setLoading(true);
    const res = await getLinks();
    if (res.error) {
      setError(res.error);
    } else if (res.links) {
      setLinks(res.links as Link[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete the shortlink "5id.me/${id}"?`)) return;
    
    const res = await deleteLink(id);
    if (res.error) {
      alert(res.error);
    } else {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  const startEditing = (link: Link) => {
    setEditingId(link.id);
    setEditUrl(link.original_url);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditUrl('');
  };

  const handleUpdate = async (id: string) => {
    if (!editUrl) return;
    const res = await updateLink(id, editUrl);
    if (res.error) {
      alert(res.error);
    } else {
      setLinks(links.map((l) => (l.id === id ? { ...l, original_url: res.originalUrl || editUrl } : l)));
      setEditingId(null);
      setEditUrl('');
    }
  };

  if (loading && links.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-white">
        <div className="w-8 h-8 border-4 border-[--color-neon-cyan] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center text-red-400 border border-red-500/20">
        <p>{error}</p>
        <button onClick={fetchLinks} className="mt-4 hover:underline">Try Again</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">Manage your shortlinks</p>
        </div>
        <NeonButton onClick={fetchLinks} className="px-6 py-2 text-sm">
          Refresh List
        </NeonButton>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Short Code</th>
                <th className="px-6 py-4 font-medium">Original URL</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No shortlinks found.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                      <a href={`https://5id.me/${link.id}`} target="_blank" rel="noreferrer" className="hover:text-[--color-neon-cyan] transition-colors">
                        5id.me/{link.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 w-full">
                      {editingId === link.id ? (
                        <div className="flex flex-col gap-2">
                          <UrlInput
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full text-sm py-2"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <a href={link.original_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[--color-neon-purple] transition-colors break-all line-clamp-1">
                          {link.original_url}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {editingId === link.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(link.id)}
                            className="text-green-400 hover:text-green-300 hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-400 hover:text-white transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(link)}
                            className="text-[--color-neon-cyan] hover:text-white hover:drop-shadow-[0_0_8px_var(--color-neon-cyan)] transition-all font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)] transition-all font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
