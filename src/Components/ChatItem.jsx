const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9h4m-4-4h4" />
  </svg>
);
function ChatItem({ isActive, title, onClick, onDeleteChat }) {
  return (
    <div
      className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium border border-blue-100 shadow-sm" // 选中状态
          : "text-slate-500 hover:bg-gray-100 border border-transparent" // 未选中状态
      }`}
      onClick={onClick}
    >
      <span className="truncate pr-6 text-sm font-medium">{title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteChat();
        }}
        className="hidden group-hover:flex absolute right-2 w-7 h-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default ChatItem;
