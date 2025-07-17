// app/[workspace]/layout.jsx
import Sidebar from "../../components/Sidebar";

export default function WorkspaceLayout({ children, params }) {
  const workspace = params.workspace;

  const dummyTeams = [
    { name: "UX", slug: "ux" },
    { name: "Testwork", slug: "testwork" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar workspace={workspace} teams={dummyTeams} />
      <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
    </div>
  );
}
