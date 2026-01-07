import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
function MessageSection({ currentMessages, isLoading }) {
  const MessageEndRef = useRef(null);
  const scrollToBottom = () => {
    MessageEndRef.current?.scrollIntoView({ behavior: "auto" });
  };
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [currentMessages, isLoading]);
  const [copiedId, setCopiedId] = useState(null);
  const handleCopy = (id, content) => {
    setCopiedId(id);
    navigator.clipboard.writeText(content);
    setTimeout(() => {
      setCopiedId(null);
    }, 1000);
  };
  return (
    <section className="flex-1 overflow-y-auto py-10 px-4 [&::-webkit-scrollbar]:w-2">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* AI 消息实例 */}
        {currentMessages.map((message) =>
          message.role === "ai" ? (
            <div className="flex gap-4 mb-6" key={message.id}>
              {/* AI 头像 - 改为更专业的图标或背景 */}
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                AI
              </div>

              {/* AI 消息气泡 - 使用 prose 插件处理排版 */}
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] overflow-hidden">
                <div className="prose prose-slate prose-sm md:prose-base max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <button
                  onClick={() => handleCopy(message.id, message.content)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-all text-xs ml-1 mt-1 group"
                >
                  {copiedId === message.id ? (
                    <span className="flex items-center gap-1 text-green-500">
                      {/* 这里的 SVG 是一个打勾图标 */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      已复制
                    </span>
                  ) : (
                    <>
                      {/* 这里的 SVG 就是上面的复制图标 */}
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
                        className="group-hover:scale-110 transition-transform"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span>复制全文</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 flex-row-reverse mb-6" key={message.id}>
              {/* 用户头像 - 使用浅色系 */}
              <div className="w-9 h-9 rounded-xl bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 text-[10px] font-bold shadow-sm">
                ME
              </div>

              {/* 用户消息气泡 - 这种深色背景建议开启 prose-invert */}
              <div className="bg-slate-900 text-slate-50 p-4 rounded-2xl rounded-tr-none shadow-md max-w-[85%] overflow-hidden">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          )
        )}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-[10px]">
              AI
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              {/* 三个跳动的小圆点 */}
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
      <div ref={MessageEndRef} />
    </section>
  );
}

export default MessageSection;
