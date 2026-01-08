import SideBar from "./Components/SideBar";
import { useState } from "react";
import MessageSpace from "./Components/MessageSpace";
import MessageFooter from "./Components/MessageFooter";
import MessageSection from "./Components/MessageSection";
import MesssageHeader from "./Components/MesssageHeader";
import ChatList from "./Components/ChatList";
import CreateNewChat from "./Components/CreateNewChat";
import ChatItem from "./Components/ChatItem";
import axios from "axios";
import { useEffect } from "react";
//1.建立一个ai服务器
const aiClient = axios.create({
  baseURL: "https://api.deepseek.com/v1",
  headers: {
    "Content-Type": "application/json",
    // 超时设置（fetch 原生不支持，Axios 很好用）
    // 如果 AI 15秒还没理我，就自动断开，防止页面卡死
    timeout: 15000,
    Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_KEY}`,
  },
});

function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats_title");
    return saved ? JSON.parse(saved) : [{ id: 0, title: "默认对话" }];
  });
  const [activeId, setActiveId] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [currentItem, setCurrentItem] = useState(chats[0]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setallMessages] = useState(() => {
    const saved = localStorage.getItem("chats_history");
    return saved ? JSON.parse(saved) : { 0: [] };
  });
  //实现对话本地存储
  useEffect(() => {
    localStorage.setItem("chats_title", JSON.stringify(chats));
    localStorage.setItem("chats_history", JSON.stringify(allMessages));
  }, [chats, allMessages]);
  const currentMessages = allMessages[activeId];
  function handleCreateNewChat() {
    setIsOpened(true);
    const newTitle = "默认对话";
    if (newTitle) {
      const newChat = { id: Date.now(), title: newTitle };
      setChats((prev) => [...prev, newChat]);
      setallMessages((prev) => ({ ...prev, [newChat.id]: [] }));
      setActiveId(newChat.id);
      setCurrentItem(newChat);
      setIsOpened(false);
    }
  }
  function handleDeleteChat(id) {
    if (window.confirm("确定删除该对话吗？")) {
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      setallMessages((prev) => {
        const newAll = { ...prev };
        delete newAll[id];
        return newAll;
      });
      if (activeId === id) {
        const remainingChats = chats.filter((chat) => chat.id !== id);
        setActiveId(remainingChats[0].id);
        setCurrentItem(remainingChats[0]);
      }
    }
  }

  //用户发送问题给AI
  async function HandleSendMessages(content) {
    if (!content || isLoading) return;
    const isFirstMessage = currentMessages.length === 0;
    const newMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    setallMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage],
    }));
    setInputValue("");
    setIsLoading(true);
    try {
      //2.记录历史消息
      const history = currentMessages.slice(-10).map((msg) => ({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content,
      }));
      //含有最新消息的历史消息（setMessages是异步）
      const ApiMessages = [
        { role: "system", content: "你是一个专业的助手。" },
        ...history,
        { role: "user", content: content },
      ];
      // 3. 发送消息给 AI 服务器
      const response = await aiClient.post("/chat/completions", {
        model: "deepseek-chat",
        messages: ApiMessages,
      });
      //4.获得 AI 服务器的回复
      const fullText = response.data.choices[0].message.content;
      //5.显示 AI 服务器的回复(打字机效果)
      displayTextWithTyping(fullText);
    } catch (error) {
      console.error("请求失败了：", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: "❌ 信号中断，无法连接至云端核心。请检查网络或 API 配置。",
      };
      setallMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
    if (isFirstMessage) {
      generateAutoTitle(content, activeId);
    }
  }
  async function generateAutoTitle(content, activeId) {
    try {
      const response = await aiClient.post("/chat/completions", {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "你是一个标题生成器,请根据用户的内容,生成一个8个字以内的标题,，不要包含标点符号，不要解释，直接返回标题文字。",
          },
          {
            role: "user",
            content: content,
          },
        ],
      });
      const fullText = response.data.choices[0].message.content;
      setChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          title: chat.id === activeId ? fullText : chat.title,
        }))
      );
      setCurrentItem((prev) => ({ ...prev, title: fullText, id: activeId }));
    } catch (error) {
      console.error("请求失败了：", error);
    }
  }

  //模拟流式传输效果
  function displayTextWithTyping(text) {
    const id = Date.now();
    setallMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { id, role: "ai", content: "" }],
    }));
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        const currentText = text.slice(0, currentIndex);
        setallMessages((prev) => ({
          ...prev,
          [activeId]: prev[activeId].map((msg) =>
            msg.id === id ? { ...msg, content: currentText } : msg
          ),
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* 侧边栏：采用深色渐变或纯净白 */}
      <SideBar>
        <CreateNewChat onClick={() => handleCreateNewChat()} />
        <ChatList>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              isActive={chat.id === activeId}
              title={chat.title}
              onClick={() => {
                setActiveId(chat.id);
                setCurrentItem(chat);
              }}
              onDeleteChat={() => handleDeleteChat(chat.id)}
            />
          ))}
        </ChatList>
      </SideBar>
      {/* 主聊天区 */}
      <MessageSpace>
        {/* 顶部透明毛玻璃标题栏 */}
        <MesssageHeader currentItem={currentItem} />
        {/* 对话区：注意最大宽度，不要撑满屏幕，那样很难看 */}
        <MessageSection
          currentMessages={currentMessages}
          isLoading={isLoading}
        />
        {/* 底部输入框：悬浮感设计 */}
        <MessageFooter
          inputValue={inputValue}
          onInputValue={setInputValue}
          onSendMessages={HandleSendMessages}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </MessageSpace>
    </div>
  );
}
export default App;
