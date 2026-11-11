import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { MEMORY_CATEGORIES } from '../../engine/memoryEngine';
import type { MemoryCategory } from '../../types';
import {
  BookOpen,
  Sparkles,
  Award,
  Brain,
  Dumbbell,
  Apple,
  Plus,
  Trash2,
  Search,
  Filter,
  Calendar,
  Zap,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HunterMemoryVault: React.FC = () => {
  const { memories, saveMemory, removeMemory, userProfile, hunterStats } = useAppStore();

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('reflection');
  const [tagsInput, setTagsInput] = useState('#Discipline, #Transformation');
  const [moodScore, setMoodScore] = useState<number>(5);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleInscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    await saveMemory(title, content, category, tags, moodScore, energyLevel);

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C084FC', '#00D4FF', '#27E58C']
    });

    setTitle('');
    setContent('');
    setIsComposerOpen(false);
  };

  const filteredMemories = memories.filter(m => {
    const matchesFilter = selectedFilter === 'all' || m.category === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalReflectionXP = memories.reduce((sum, m) => sum + (m.xpAwarded || 50), 0);

  const getCategoryIcon = (cat: MemoryCategory) => {
    switch (cat) {
      case 'milestone':
        return <Award className="w-4 h-4 text-[#27E58C]" />;
      case 'mindset':
        return <Brain className="w-4 h-4 text-[#00D4FF]" />;
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-[#FFB547]" />;
      case 'physique':
        return <Sparkles className="w-4 h-4 text-[#FF5263]" />;
      case 'nutrition':
        return <Apple className="w-4 h-4 text-[#10B981]" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#C084FC]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#A78BFA]/30 bg-gradient-to-r from-[#17112B] via-[#1D1438] to-[#120E24] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C084FC] animate-pulse" />
              <h2 className="font-cinzel text-base sm:text-lg font-bold tracking-[0.18em] text-[#F5F7FF] uppercase">
                HUNTER MEMORY VAULT
              </h2>
            </div>
            <p className="text-xs text-[#9D94B8] mt-1 font-mono">
              System Chronicle • Permanent Records & Reflections
            </p>
          </div>

          <button
            onClick={() => setIsComposerOpen(!isComposerOpen)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#7C3AED] text-white font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(192,132,252,0.4)] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Inscribe
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#A78BFA]/20 text-center font-mono">
          <div className="bg-[#120E24]/60 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#9D94B8] block">Memories</span>
            <span className="text-sm font-bold text-[#C084FC]">{memories.length}</span>
          </div>
          <div className="bg-[#120E24]/60 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#9D94B8] block">Current Day</span>
            <span className="text-sm font-bold text-[#00D4FF]">
              {userProfile?.currentDay || 1} / 90
            </span>
          </div>
          <div className="bg-[#120E24]/60 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#9D94B8] block">Memory XP</span>
            <span className="text-sm font-bold text-[#27E58C]">+{totalReflectionXP}</span>
          </div>
        </div>
      </div>

      {/* Composer Section */}
      {isComposerOpen && (
        <form
          onSubmit={handleInscribe}
          className="rounded-2xl border border-[#C084FC]/40 bg-[#16102E] p-4 space-y-3 shadow-[0_0_25px_rgba(192,132,252,0.2)] animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-cinzel text-xs font-bold text-[#C084FC] tracking-wider uppercase">
              Inscribe New Memory Record
            </span>
            <span className="text-[10px] font-mono text-[#27E58C] bg-[#27E58C]/15 px-2 py-0.5 rounded-full border border-[#27E58C]/30">
              +50 XP
            </span>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
              Title / Record Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Breakthrough on Set 4, Face bloat dropped"
              className="w-full px-3 py-2 rounded-xl bg-[#120E24] border border-[#A78BFA]/30 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#C084FC]"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {MEMORY_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-mono flex items-center justify-center gap-1 border transition-all ${
                    category === cat.id
                      ? 'border-[#C084FC] bg-[#C084FC]/20 text-white font-bold'
                      : 'border-white/5 bg-[#120E24] text-[#9D94B8] hover:text-white'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
              Thought, Reflection or Milestone Notes
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What did you observe today? Any physical differences, energy levels, diet victories or discipline tests?"
              className="w-full px-3 py-2 rounded-xl bg-[#120E24] border border-[#A78BFA]/30 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#C084FC] resize-none"
            />
          </div>

          {/* Mood & Energy Ratings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
                Mindset Score ({moodScore}/5)
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setMoodScore(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      moodScore >= v
                        ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                        : 'border-white/5 bg-[#120E24] text-[#6C768E]'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
                Energy Level ({energyLevel}/5)
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setEnergyLevel(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      energyLevel >= v
                        ? 'bg-[#FFB547]/20 border-[#FFB547] text-[#FFB547]'
                        : 'border-white/5 bg-[#120E24] text-[#6C768E]'
                    }`}
                  >
                    ⚡
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="#Discipline, #Pushups, #FaceFat"
              className="w-full px-3 py-1.5 rounded-xl bg-[#120E24] border border-[#A78BFA]/30 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#C084FC]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="flex-1 py-2 rounded-xl border border-white/10 bg-[#120E24] text-xs font-mono text-[#9D94B8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#7C3AED] text-white font-cinzel text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:brightness-110 active:scale-95"
            >
              Inscribe (+50 XP)
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9D94B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chronicle records, tags, or thoughts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#140E26] border border-[#A78BFA]/20 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#C084FC]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase whitespace-nowrap border transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#C084FC] text-[#080B14] font-bold border-[#C084FC]'
                : 'bg-[#140E26] text-[#9D94B8] border-white/10'
            }`}
          >
            All ({memories.length})
          </button>
          {MEMORY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase whitespace-nowrap border transition-all ${
                selectedFilter === cat.id
                  ? 'bg-[#C084FC] text-[#080B14] font-bold border-[#C084FC]'
                  : 'bg-[#140E26] text-[#9D94B8] border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Timeline List */}
      <div className="space-y-2.5">
        {filteredMemories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-[#120E24]/50">
            <BookOpen className="w-8 h-8 text-[#6C768E] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#9D94B8] font-mono">
              No chronicle records found for this filter.
            </p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="mt-2 text-xs font-mono text-[#C084FC] underline"
            >
              Inscribe your first thought
            </button>
          </div>
        ) : (
          filteredMemories.map(entry => (
            <div
              key={entry.id}
              className="rounded-2xl border border-white/5 bg-[#15102A]/85 hover:border-[#C084FC]/30 p-4 space-y-2.5 shadow-sm transition-all"
            >
              {/* Top row: Day badge, Date, and Delete */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-[10px] font-bold text-[#C084FC] bg-[#C084FC]/15 px-2 py-0.5 rounded-full border border-[#C084FC]/30">
                    DAY {entry.dayNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-[#9D94B8]">
                    {entry.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(entry.category)}
                    <span className="text-[10px] font-mono uppercase text-[#9D94B8]">
                      {entry.category}
                    </span>
                  </div>
                  {entry.id && (
                    <button
                      onClick={() => entry.id && removeMemory(entry.id)}
                      className="p-1 text-[#6C768E] hover:text-[#FF5263] transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-sans font-bold text-sm text-[#F5F7FF] tracking-wide">
                {entry.title}
              </h3>

              {/* Content */}
              <p className="text-xs text-[#D8D0E8] leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>

              {/* Bottom stats: Mood, Energy, Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                <div className="flex items-center gap-3 text-[#9D94B8]">
                  <span>Mindset: {'★'.repeat(entry.moodScore || 5)}</span>
                  <span>Energy: {'⚡'.repeat(entry.energyLevel || 5)}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] text-[#A78BFA] bg-[#A78BFA]/10 px-1.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
