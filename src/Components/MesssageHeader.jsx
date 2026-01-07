function MesssageHeader({ currentItem }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="font-semibold text-lg text-slate-800">
        {currentItem.title}
      </h2>
      <div className="flex gap-4 text-slate-500 text-sm">
        <span>Model: deepseek</span>
      </div>
    </header>
  );
}

export default MesssageHeader;
