function CreateNewChat({ onClick }) {
  return (
    <div className="p-6">
      <button
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl transition-all font-medium active:scale-95"
        onClick={onClick}
      >
        <span className="text-lg">+</span> 新建对话
      </button>
    </div>
  );
}

export default CreateNewChat;
