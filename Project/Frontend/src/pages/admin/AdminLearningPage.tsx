import React, { useState, useEffect } from 'react';
import { learningApi } from '../../lib/api';
import { Course } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { BookOpen, Plus, Video, HelpCircle, CheckCircle2 } from 'lucide-react';

export const AdminLearningPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    q1_question: '',
    q1_opt1: '',
    q1_opt2: '',
    q1_opt3: '',
    q1_correct: '',
  });

  const loadCourses = async () => {
    try {
      const data = await learningApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await learningApi.createCourse({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        questions: [
          {
            question: formData.q1_question,
            options: [formData.q1_opt1, formData.q1_opt2, formData.q1_opt3].filter(Boolean),
            correctAnswer: formData.q1_correct,
          },
        ],
      });
      setIsModalOpen(false);
      await loadCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Learning Curriculum & Course Manager
          </h1>
          <p className="text-xs text-slate-500">
            Publish video modules and interactive knowledge check quizzes for frontline workers
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Publish New Module
        </Button>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <Card key={c._id} className="space-y-3 p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-teal-700" /> Video Lesson
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-900" /> {c.questions?.length || 1} Quiz Questions
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Badge variant="success" size="sm">
                Published & Active
              </Badge>
              <span className="text-slate-400">Low bandwidth ready</span>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE COURSE MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish New Learning Module"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Module Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Recognizing Severe Preeclampsia Signs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of key concepts..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Video Embed URL (YouTube embed or MP4) *
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase">Knowledge Check Quiz Question</h4>
              <div>
                <input
                  type="text"
                  required
                  value={formData.q1_question}
                  onChange={(e) => setFormData({ ...formData, q1_question: e.target.value })}
                  placeholder="Question text..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={formData.q1_opt1}
                  onChange={(e) => setFormData({ ...formData, q1_opt1: e.target.value })}
                  placeholder="Option A"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="text"
                  required
                  value={formData.q1_opt2}
                  onChange={(e) => setFormData({ ...formData, q1_opt2: e.target.value })}
                  placeholder="Option B"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="text"
                  value={formData.q1_opt3}
                  onChange={(e) => setFormData({ ...formData, q1_opt3: e.target.value })}
                  placeholder="Option C"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Correct Answer (must match one option exactly) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.q1_correct}
                  onChange={(e) => setFormData({ ...formData, q1_correct: e.target.value })}
                  placeholder="Exact text of correct option"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving} className="bg-slate-900">
                Publish Course
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

