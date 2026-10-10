import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Workshop } from '../../types';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

interface WorkshopRegisterModalProps {
  workshop: Workshop | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WorkshopRegisterModal: React.FC<WorkshopRegisterModalProps> = ({
  workshop,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    experienceLevel: 'Intermediate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  if (!workshop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.studentId) {
      error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ok = dataStore.registerForWorkshop({
        workshop_id: workshop.id,
        workshop_name: workshop.name,
        full_name: formData.fullName,
        email: formData.email,
        student_id: formData.studentId,
        department: formData.department,
        semester: formData.semester,
        experience_level: formData.experienceLevel,
      });

      setIsSubmitting(false);

      if (ok) {
        setRegisteredSuccess(true);
        success(`Successfully registered for ${workshop.name}!`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#60a5fa'],
        });
        onSuccess?.();
      } else {
        error('Workshop registration is currently unavailable or seats are full.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl glass-panel border border-white/15 bg-dark-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
              Workshop Registration
            </span>
            <h3 className="text-lg font-bold text-white truncate max-w-sm">
              {workshop.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {registeredSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Registration Confirmed</h4>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Your seat for <strong className="text-blue-400">{workshop.name}</strong> is reserved. A calendar invite and preparatory details have been logged.
            </p>
            <div className="p-3 bg-dark-surface rounded-xl border border-white/10 text-xs text-slate-400 font-mono text-left space-y-1">
              <div>Attendee: {formData.fullName} ({formData.studentId})</div>
              <div>Date & Time: {workshop.date} at {workshop.time}</div>
              <div>Venue: {workshop.venue}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Event Quick Info */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-dark-surface p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{workshop.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">{workshop.venue}</span>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2 rounded-lg bg-dark-bg border border-white/10 focus:border-blue-500 text-white text-sm focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@university.edu"
                  className="w-full px-3.5 py-2 rounded-lg bg-dark-bg border border-white/10 focus:border-blue-500 text-white text-sm focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="23CS042"
                  className="w-full px-3.5 py-2 rounded-lg bg-dark-bg border border-white/10 focus:border-blue-500 text-white text-sm focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-dark-bg border border-white/10 focus:border-blue-500 text-white text-sm focus:outline-none transition"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical Engineering">EE</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-dark-bg border border-white/10 focus:border-blue-500 text-white text-sm focus:outline-none transition"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Reserving Seat...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
