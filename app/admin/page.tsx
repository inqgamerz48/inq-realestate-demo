'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, LogOut, Plus, Edit2, Trash2, Home, Users, MessageSquare, Star } from 'lucide-react';

type Tab = 'properties' | 'agents' | 'testimonials' | 'inquiries';

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('properties');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [properties, setProperties] = useState<any[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [modalType, setModalType] = useState('');

    const authHeaders = {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [propRes, agentsRes, testiRes, inqRes] = await Promise.all([
                fetch('/api/properties', { headers: authHeaders }),
                fetch('/api/agents', { headers: authHeaders }),
                fetch('/api/testimonials', { headers: authHeaders }),
                fetch('/api/inquiries', { headers: authHeaders })
            ]);
            
            if (!propRes.ok || !agentsRes.ok || !testiRes.ok || !inqRes.ok) {
                throw new Error('Unauthorized');
            }
            
            setProperties(await propRes.json());
            setAgents(await agentsRes.json());
            setTestimonials(await testiRes.json());
            setInquiries(await inqRes.json());
            setIsAuthenticated(true);
        } catch (err) {
            console.error(err);
            setError('Access denied. Invalid admin token.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (type: string, id: number, status: string) => {
        try {
            const res = await fetch(`/api/${type}/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                if (type === 'inquiries') {
                    setInquiries(prev => prev.map(r => r.id === id ? { ...r, status } : r));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (type: string, item: any = null) => {
        setModalType(type);
        setEditItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditItem(null);
        setModalType('');
    };

    const handleSave = async (e: React.FormEvent<any>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form));
        
        const endpoint = modalType;
        const method = editItem ? 'PUT' : 'POST';
        const url = editItem ? `/api/${endpoint}/${editItem.id}` : `/api/${endpoint}`;
        
        try {
            await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify(data)
            });
            closeModal();
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (type: string, id: number) => {
        if (!confirm('Delete this item?')) return;
        try {
            await fetch(`/api/${type}/${id}`, { 
                method: 'DELETE',
                headers: authHeaders 
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated && !ADMIN_TOKEN) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="bg-slate-800 p-10 w-full max-w-md rounded-lg border border-slate-700">
                    <h1 className="text-3xl font-bold mb-2 text-amber-400 text-center">Meridian Properties</h1>
                    <p className="text-center text-slate-400 text-sm mb-8">Admin Portal</p>
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 border border-red-800">
                        Admin token not configured. Please set NEXT_PUBLIC_ADMIN_TOKEN in your environment variables.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="bg-slate-800 border-b border-slate-700 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h1 className="text-2xl font-bold text-amber-400">Meridian Properties</h1>
                    <span className="text-xs text-slate-400 uppercase">Management Console</span>
                </div>
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-xs uppercase text-slate-400 hover:text-red-400 transition-colors">
                    <LogOut size={14} /> Refresh
                </button>
            </header>

            <div className="flex bg-slate-800 border-b border-slate-700">
                {[
                    { id: 'properties', label: 'Properties', icon: Home },
                    { id: 'agents', label: 'Agents', icon: Users },
                    { id: 'testimonials', label: 'Testimonials', icon: Star },
                    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm uppercase transition-colors ${
                            activeTab === tab.id 
                            ? 'text-amber-400 border-b-2 border-amber-400' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <main className="p-8 max-w-7xl mx-auto">
                {activeTab === 'properties' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Properties</h2>
                            <button onClick={() => openModal('properties')} className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 text-sm font-bold uppercase">
                                <Plus size={16} /> Add Property
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {properties.map(item => (
                                <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-slate-400">{item.location} · {item.beds} bed · {item.baths} bath · {item.sqft} sqft</div>
                                    </div>
                                    <div className="text-amber-400 font-bold">{item.price}</div>
                                    {item.badge && <span className={`px-2 py-1 text-xs rounded ${item.badgeClass === 'new' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>{item.badge}</span>}
                                    {item.featured === 1 && <span className="px-2 py-1 bg-amber-400/20 text-amber-400 text-xs">Featured</span>}
                                    <button onClick={() => openModal('properties', item)} className="p-2 text-slate-400 hover:text-amber-400"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete('properties', item.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'agents' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Agents</h2>
                            <button onClick={() => openModal('agents')} className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 text-sm font-bold uppercase">
                                <Plus size={16} /> Add Agent
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {agents.map(agent => (
                                <div key={agent.id} className="bg-slate-800 border border-slate-700 p-4">
                                    <img src={agent.photoUrl} alt={agent.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                                    <div className="font-medium text-lg">{agent.name}</div>
                                    <div className="text-sm text-slate-400 mb-2">{agent.role}</div>
                                    <div className="text-xs text-slate-500">Sold: {agent.totalSold} · Clients: {agent.totalClients}</div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => openModal('agents', agent)} className="flex-1 py-2 text-sm border border-slate-600 text-slate-400 hover:text-amber-400 hover:border-amber-400">Edit</button>
                                        <button onClick={() => handleDelete('agents', agent.id)} className="flex-1 py-2 text-sm border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'testimonials' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Testimonials</h2>
                            <button onClick={() => openModal('testimonials')} className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 text-sm font-bold uppercase">
                                <Plus size={16} /> Add Testimonial
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {testimonials.map(t => (
                                <div key={t.id} className="bg-slate-800 border border-slate-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold">{t.initials}</div>
                                            <div>
                                                <div className="font-medium">{t.name}</div>
                                                <div className="text-xs text-slate-400">{t.info}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded ${t.active ? 'bg-green-900 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                                {t.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <button onClick={() => openModal('testimonials', t)} className="p-1 text-slate-400 hover:text-amber-400"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete('testimonials', t.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="text-amber-400 text-sm">{'★'.repeat(t.rating)}</div>
                                    <div className="mt-2 text-slate-300 text-sm">{t.text}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'inquiries' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Inquiries</h2>
                            <div className="text-sm text-slate-400 bg-slate-800 px-4 py-2 border border-slate-700">
                                Pending: <span className="text-amber-400 font-bold">{inquiries.filter(r => r.status === 'pending').length}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-700 bg-slate-900/50">
                                    <tr>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400">Name</th>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400">Email</th>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400">Phone</th>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400">Message</th>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400">Status</th>
                                        <th className="py-3 px-4 text-xs uppercase text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(inq => (
                                        <tr key={inq.id} className="border-b border-slate-700/50">
                                            <td className="py-3 px-4">{inq.name}</td>
                                            <td className="py-3 px-4 text-slate-400">{inq.email}</td>
                                            <td className="py-3 px-4 text-slate-400">{inq.phone || '—'}</td>
                                            <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{inq.message}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs rounded ${
                                                    inq.status === 'completed' ? 'bg-green-900 text-green-400' :
                                                    inq.status === 'cancelled' ? 'bg-red-900 text-red-400' :
                                                    'bg-yellow-900 text-yellow-400'
                                                }`}>{inq.status}</span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button onClick={() => updateStatus('inquiries', inq.id, 'completed')} className="p-1 text-slate-400 hover:text-green-400" title="Mark Complete"><CheckCircle size={18} /></button>
                                                <button onClick={() => updateStatus('inquiries', inq.id, 'cancelled')} className="p-1 text-slate-400 hover:text-red-400 ml-2" title="Cancel"><XCircle size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-slate-800 border border-slate-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-light mb-4 text-amber-400">
                            {editItem ? 'Edit' : 'Add'} {modalType}
                        </h3>
                        <form onSubmit={handleSave}>
                            {modalType === 'properties' && (
                                <>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Property Name</label><input name="name" defaultValue={editItem?.name} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Price</label><input name="price" defaultValue={editItem?.price} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Category</label>
                                            <select name="category" defaultValue={editItem?.category} className="w-full bg-slate-900 border border-slate-700 p-2">
                                                <option value="luxury">Luxury</option><option value="modern">Modern</option><option value="residential">Residential</option><option value="commercial">Commercial</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Location</label><input name="location" defaultValue={editItem?.location} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Beds</label><input name="beds" type="number" defaultValue={editItem?.beds} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Baths</label><input name="baths" type="number" defaultValue={editItem?.baths} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Sqft</label><input name="sqft" type="number" defaultValue={editItem?.sqft} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Badge</label><input name="badge" defaultValue={editItem?.badge} className="w-full bg-slate-900 border border-slate-700 p-2" placeholder="e.g. New Listing" /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Badge Class</label><input name="badge_class" defaultValue={editItem?.badgeClass} className="w-full bg-slate-900 border border-slate-700 p-2" placeholder="e.g. new, sold" /></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Image URL</label><input name="image_url" defaultValue={editItem?.imageUrl} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Featured</label>
                                        <select name="featured" defaultValue={editItem?.featured || 0} className="w-full bg-slate-900 border border-slate-700 p-2">
                                            <option value={0}>No</option><option value={1}>Yes</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            {modalType === 'agents' && (
                                <>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Name</label><input name="name" defaultValue={editItem?.name} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Role</label><input name="role" defaultValue={editItem?.role} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Photo URL</label><input name="photo_url" defaultValue={editItem?.photoUrl} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Total Sold</label><input name="total_sold" type="number" defaultValue={editItem?.totalSold} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Total Clients</label><input name="total_clients" type="number" defaultValue={editItem?.totalClients} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Sort Order</label><input name="sort_order" type="number" defaultValue={editItem?.sortOrder || 0} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                </>
                            )}
                            {modalType === 'testimonials' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Name</label><input name="name" defaultValue={editItem?.name} className="w-full bg-slate-900 border border-slate-700 p-2" required /></div>
                                        <div><label className="block text-xs uppercase text-slate-400 mb-1">Initials</label><input name="initials" defaultValue={editItem?.initials} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Info</label><input name="info" defaultValue={editItem?.info} className="w-full bg-slate-900 border border-slate-700 p-2" placeholder="e.g. Bought in Beverly Hills" /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Rating</label><input name="rating" type="number" min="1" max="5" defaultValue={editItem?.rating || 5} className="w-full bg-slate-900 border border-slate-700 p-2" /></div>
                                    <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Text</label><textarea name="text" defaultValue={editItem?.text} className="w-full bg-slate-900 border border-slate-700 p-2" rows={3} required /></div>
                                    {editItem && (
                                        <div className="mb-4"><label className="block text-xs uppercase text-slate-400 mb-1">Active</label>
                                            <select name="active" defaultValue={editItem?.active} className="w-full bg-slate-900 border border-slate-700 p-2">
                                                <option value={1}>Yes</option><option value={0}>No</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={closeModal} className="flex-1 border border-slate-600 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="flex-1 bg-amber-400 text-slate-900 py-2 font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
