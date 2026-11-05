import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp, Send } from 'lucide-react';
import { INITIAL_TESTIMONIALS } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const CustomerReviews: React.FC = () => {
  const { showToast } = useStore();
  const [reviews, setReviews] = useState(INITIAL_TESTIMONIALS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev = {
      id: `t-${Date.now()}`,
      name: newName.trim(),
      area: newArea.trim() || 'Local Customer',
      comment: newComment.trim(),
      rating: newRating,
      date: 'Just now',
      orderType: 'Verified Kirana Buyer'
    };

    setReviews([newRev, ...reviews]);
    setIsFormOpen(false);
    setNewName('');
    setNewArea('');
    setNewComment('');
    showToast('Thank you for sharing your feedback!', 'success');
  };

  return (
    <section className="py-12 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span>Neighbourhood Trust</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Loved by 4,500+ Local Households
            </h2>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold flex items-center gap-2 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
            <span>{isFormOpen ? 'Cancel' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Write Review Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 max-w-xl text-xs space-y-3">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Share your shopping experience
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sundaram"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Neighbourhood / Locality</label>
                <input
                  type="text"
                  placeholder="e.g. Defence Colony"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Rating</label>
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current text-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Your Review *</label>
              <textarea
                required
                rows={2}
                placeholder="How was the quality of staples, ghee, and delivery speed?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[11px] text-stone-400 block">{rev.area}</span>
                </div>

                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  {rev.orderType}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
