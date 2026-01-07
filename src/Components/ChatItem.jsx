function ChatItem({ children, isActive, onClick }) {
  return (
    <div
      className={`p-3 rounded-xl cursor-pointer transition-all ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium border border-blue-100 shadow-sm" // 选中状态
          : "text-slate-500 hover:bg-gray-100 border border-transparent" // 未选中状态
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ChatItem;
