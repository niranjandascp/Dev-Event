'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const CreateEvent = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        overview: '',
        venue: '',
        location: '',
        date: '',
        time: '',
        mode: 'offline',
        audience: '',
        organizer: '',
    });

    const [tags, setTags] = useState<string>('');
    const [agenda, setAgenda] = useState<string[]>(['']);
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleAgendaChange = (index: number, value: string) => {
        const newAgenda = [...agenda];
        newAgenda[index] = value;
        setAgenda(newAgenda);
    };

    const addAgendaItem = () => {
        setAgenda([...agenda, '']);
    };

    const removeAgendaItem = (index: number) => {
        const newAgenda = agenda.filter((_, i) => i !== index);
        setAgenda(newAgenda);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (image) {
                formData.append('image', image);
            }

            // Process tags: split by comma and trim
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            formData.append('tags', JSON.stringify(tagsArray));

            // Filter empty agenda items
            const agendaArray = agenda.filter(item => item.trim() !== '');
            formData.append('agenda', JSON.stringify(agendaArray));

            const response = await fetch('/api/events', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create event');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex-center flex-col mb-10 w-full">
            <h1 className="text-white text-3xl font-bold mb-10">Create Event</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-2xl bg-dark-100 p-8 rounded-xl border border-border-dark">
                {error && <div className="text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-light-200">Event Title</label>
                    <input required type="text" name="title" value={form.title} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., Next.js Conf 2025" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-light-200">Description</label>
                    <textarea required name="description" value={form.description} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white h-24 focus:ring-2 focus:ring-primary outline-none" placeholder="Brief description of the event" />
                </div>

                {/* Overview */}
                <div className="flex flex-col gap-2">
                    <label className="text-light-200">Overview</label>
                    <textarea required name="overview" value={form.overview} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white h-24 focus:ring-2 focus:ring-primary outline-none" placeholder="Detailed overview" />
                </div>

                {/* Image */}
                 <div className="flex flex-col gap-2">
                    <label className="text-light-200">Event Image</label>
                    <input required type="file" accept="image/*" onChange={handleImageChange} className="bg-dark-200 rounded-lg p-3 text-white" />
                </div>

                {/* Date & Time */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Date</label>
                        <input required type="date" name="date" value={form.date} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Time</label>
                        <input required type="time" name="time" value={form.time} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                </div>

                {/* Venue & Location */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Venue</label>
                        <input required type="text" name="venue" value={form.venue} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Moscone Center" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Location</label>
                        <input required type="text" name="location" value={form.location} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. San Francisco, CA" />
                    </div>
                </div>

                {/* Mode & Audience */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Mode</label>
                        <select name="mode" value={form.mode} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none">
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-light-200">Audience</label>
                        <input required type="text" name="audience" value={form.audience} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Developers, Designers" />
                    </div>
                </div>

                 {/* Organizer */}
                 <div className="flex flex-col gap-2">
                    <label className="text-light-200">Organizer</label>
                    <input required type="text" name="organizer" value={form.organizer} onChange={handleChange} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Vercel" />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-2">
                    <label className="text-light-200">Tags (comma separated)</label>
                    <input required type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-dark-200 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. web, react, javascript" />
                </div>

                {/* Agenda */}
                <div className="flex flex-col gap-2">
                    <label className="text-light-200">Agenda</label>
                    {agenda.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleAgendaChange(index, e.target.value)}
                                className="bg-dark-200 rounded-lg p-3 text-white flex-1 focus:ring-2 focus:ring-primary outline-none"
                                placeholder={`Agenda item ${index + 1}`}
                            />
                            {agenda.length > 1 && (
                                <button type="button" onClick={() => removeAgendaItem(index)} className="text-red-500 px-2 py-1 bg-dark-200 rounded hover:bg-red-900/20">✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addAgendaItem} className="text-primary text-sm self-start mt-1 hover:underline">
                        + Add Agenda Item
                    </button>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreateEvent;
