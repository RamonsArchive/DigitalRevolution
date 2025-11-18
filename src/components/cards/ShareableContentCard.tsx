import React from "react";
import { Copy, Check } from "lucide-react";

interface ShareableContentCardProps {
  type: string;
  content: string;
  hashtags: string[];
  onCopyText: () => void;
  onCopyAll: () => void;
  isTextCopied: boolean;
  isAllCopied: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const ShareableContentCard: React.FC<ShareableContentCardProps> = ({
  type,
  content,
  hashtags,
  onCopyText,
  onCopyAll,
  isTextCopied,
  isAllCopied,
  gradientFrom = "from-primary-500/10",
  gradientTo = "to-secondary-500/10",
  className = "",
}) => {
  return (
    <div className={`group relative ${className}`}>
      <div
        className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden`}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold rounded-full">
                {type}
              </span>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed mb-4">
              {content}
            </p>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, hashtagIdx) => (
                <span
                  key={hashtagIdx}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-md"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onCopyText}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {isTextCopied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy Text
            </button>
            <button
              onClick={onCopyAll}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {isAllCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableContentCard;
