import { AppShell } from './AppShell';
import { EditorArea } from './EditorArea';
import { Header } from './Header';
import { MetaPanel } from './MetaPanel';
import { BlogSidebar } from './BlogSidebar';
import { Outlet } from '@tanstack/react-router';

function BlogLayout() {
  return (
    <AppShell>
      <Header />
      <BlogSidebar />
      <EditorArea>
        <Outlet />
      </EditorArea>
      <MetaPanel />
    </AppShell>
  );
}

export default BlogLayout;
