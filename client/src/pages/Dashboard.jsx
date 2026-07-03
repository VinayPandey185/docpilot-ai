// import { useAuth } from "../context/AuthContext";

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>🎉 Dashboard</h1>

//       <p>Welcome</p>

//       <h3>{user?.email}</h3>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

import { useWorkspace } from "../context/WorkspaceContext";
import WorkspaceForm from "../components/workspace/WorkspaceForm";

export default function Dashboard() {
  const { workspaces, activeWorkspace } = useWorkspace();

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard</h1>

      <WorkspaceForm />

      <hr />

      <h2>Current Workspace</h2>

      <pre>{JSON.stringify(activeWorkspace, null, 2)}</pre>

      <hr />

      <h2>All Workspaces</h2>

      <pre>{JSON.stringify(workspaces, null, 2)}</pre>
    </div>
  );
}
