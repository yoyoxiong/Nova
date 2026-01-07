function SideBar({ children }) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {children}
    </aside>
  );
}

export default SideBar;
