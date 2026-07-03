import { useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceForm() {
  const [name, setName] = useState("");

  const { addWorkspace } = useWorkspace();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    await addWorkspace(name);

    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Workspace name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button>Create</button>
    </form>
  );
}
