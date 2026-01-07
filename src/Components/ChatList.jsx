function ChatList({ children }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 space-y-1">
      {/* 选中的会话状态 */}
      {children}
    </nav>
  );
}

export default ChatList;
