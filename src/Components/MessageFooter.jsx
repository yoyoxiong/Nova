function MessageFooter({
  inputValue,
  onInputValue,
  onSendMessages,
  isLoading,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSendMessages(inputValue);
  }
  return (
    <footer className="p-6 bg-transparent">
      <form
        className="max-w-3xl mx-auto relative"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <textarea
          rows="1"
          value={inputValue}
          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 pr-12 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all"
          placeholder="输入消息..."
          onChange={(e) => onInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
          disabled={isLoading || !inputValue}
          type="submit"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            ></path>
          </svg>
          ;
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-3">
        AI 可能会犯错。请核查重要信息。
      </p>
    </footer>
  );
}

export default MessageFooter;
