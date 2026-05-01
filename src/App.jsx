import { useState, useEffect, useRef } from "react";

const s = {
  app: {
    minHeight: "100vh",
    background: "#eef2ff",
    padding: "48px 24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: { maxWidth: 860, margin: "0 auto 40px", textAlign: "center" },
  title: { fontSize: 32, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", margin: 0 },
  grid: {
    maxWidth: 860,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px 28px 24px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  inputRow: { display: "flex", gap: 10, marginBottom: 20 },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 },
  empty: { textAlign: "center", color: "#9ca3af", fontStyle: "italic", fontSize: 14, padding: "20px 0" },
  footer: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 40 },
};

const theme = {
  indigo: {
    title: { fontSize: 18, fontWeight: 700, color: "#4338ca", marginBottom: 20, paddingBottom: 14, borderBottom: "2px solid #e0e7ff", display: "flex", alignItems: "center", gap: 8 },
    input: { flex: 1, border: "1.5px solid #c7d2fe", borderRadius: 12, padding: "12px 14px", fontSize: 15, outline: "none", background: "#fafbff", color: "#1e1b4b" },
    btn: { background: "#4338ca", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
    item: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f5f3ff", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: "14px 16px" },
    cbDone: { borderColor: "#4338ca", background: "#4338ca", color: "#fff" },
    cbEmpty: { borderColor: "#a5b4fc", background: "#fff" },
    editInput: { flex: 1, border: "1.5px solid #a5b4fc", borderRadius: 10, padding: "8px 12px", fontSize: 14, outline: "none", background: "#eef2ff", color: "#1e1b4b" },
    saveBtn: { background: "#4338ca", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  },
  emerald: {
    title: { fontSize: 18, fontWeight: 700, color: "#059669", marginBottom: 20, paddingBottom: 14, borderBottom: "2px solid #d1fae5", display: "flex", alignItems: "center", gap: 8 },
    input: { flex: 1, border: "1.5px solid #a7f3d0", borderRadius: 12, padding: "12px 14px", fontSize: 15, outline: "none", background: "#f0fdf9", color: "#064e3b" },
    btn: { background: "#059669", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
    item: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf4", border: "1.5px solid #d1fae5", borderRadius: 14, padding: "14px 16px" },
    cbDone: { borderColor: "#059669", background: "#059669", color: "#fff" },
    cbEmpty: { borderColor: "#6ee7b7", background: "#fff" },
    editInput: { flex: 1, border: "1.5px solid #6ee7b7", borderRadius: 10, padding: "8px 12px", fontSize: 14, outline: "none", background: "#ecfdf5", color: "#064e3b" },
    saveBtn: { background: "#059669", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  },
};

function Section({ title, icon, color, placeholder, items, onAdd, onToggle, onDelete, onEdit, emptyMsg }) {
  const t = theme[color];
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const editRef = useRef(null);

  const handleAdd = () => {
    if (input.trim()) { onAdd(input.trim()); setInput(""); }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    if (editText.trim()) { onEdit(editingId, editText.trim()); }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <section style={s.card}>
      <h2 style={t.title}>
        <span>{icon}</span>{title}
      </h2>
      <div style={s.inputRow}>
        <input
          style={t.input}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button style={t.btn} onClick={handleAdd}>Ekle</button>
      </div>

      {items.length === 0 ? (
        <p style={s.empty}>{emptyMsg}</p>
      ) : (
        <ul style={s.list}>
          {items.map((item) => (
            <li key={item.id} style={t.item}>
              {editingId === item.id ? (
                <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "center" }}>
                  <input
                    ref={editRef}
                    style={t.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                  />
                  <button style={t.saveBtn} onClick={saveEdit}>Kaydet</button>
                  <button onClick={cancelEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: "8px 6px" }}>
                    İptal
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                    <div
                      onClick={() => onToggle(item.id)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: "2px solid",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0, fontSize: 15, fontWeight: 700,
                        userSelect: "none",
                        ...(item.completed ? t.cbDone : t.cbEmpty),
                      }}
                    >
                      {item.completed && "✓"}
                    </div>
                    <span style={{
                      fontSize: 15, fontWeight: 500,
                      color: item.completed ? "#9ca3af" : "#1f2937",
                      textDecoration: item.completed ? "line-through" : "none",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {item.text}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button onClick={() => startEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, fontWeight: 500, padding: "4px 8px", borderRadius: 8 }}>
                      Düzenle
                    </button>
                    <button onClick={() => onDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 13, fontWeight: 500, padding: "4px 8px", borderRadius: 8 }}>
                      Sil
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function App() {
  const [topics, setTopics] = useState(() => JSON.parse(localStorage.getItem("topics")) || []);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos")) || []);

  useEffect(() => { localStorage.setItem("topics", JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem("todos", JSON.stringify(todos)); }, [todos]);

  const addItem    = (list, setList) => (text) => setList([...list, { id: Date.now(), text, completed: false }]);
  const toggleItem = (list, setList) => (id)   => setList(list.map((i) => i.id === id ? { ...i, completed: !i.completed } : i));
  const deleteItem = (list, setList) => (id)   => setList(list.filter((i) => i.id !== id));
  const editItem   = (list, setList) => (id, text) => setList(list.map((i) => i.id === id ? { ...i, text } : i));

  return (
    <div style={s.app}>
      <header style={s.header}>
        <h1 style={s.title}>Konu & Görev Takibi</h1>
      </header>

      <div style={s.grid}>
        <Section
          title="Öğrenilecek Konular" icon="📚" color="indigo"
          placeholder="Yeni konu gir..."
          items={topics}
          onAdd={addItem(topics, setTopics)}
          onToggle={toggleItem(topics, setTopics)}
          onDelete={deleteItem(topics, setTopics)}
          onEdit={editItem(topics, setTopics)}
          emptyMsg="Henüz konu eklenmedi ✍️"
        />
        <Section
          title="Günlük Görevler" icon="✅" color="emerald"
          placeholder="Görev gir..."
          items={todos}
          onAdd={addItem(todos, setTodos)}
          onToggle={toggleItem(todos, setTodos)}
          onDelete={deleteItem(todos, setTodos)}
          onEdit={editItem(todos, setTodos)}
          emptyMsg="Henüz görev eklenmedi 🕓"
        />
      </div>

      <footer style={s.footer}>
        
      </footer>
    </div>
  );
}

export default App;
