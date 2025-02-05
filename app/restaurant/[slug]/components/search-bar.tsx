'use client'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search menu items..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md 
                 text-white placeholder-white/70 pl-11 outline-none border border-white/20
                 focus:bg-white/20 transition-all"
      />
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>
  )
} 