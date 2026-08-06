import { AppShell } from './AppShell';
import { EditorArea } from './EditorArea';
import { Header } from './Header';
import { MetaPanel } from './MetaPanel';
import { BlogSidebar } from './BlogSidebar';
import { Outlet } from '@tanstack/react-router';
import { PostsProvider } from '../../../context/PostsProvider';

function BlogLayout() {
  return (
    <PostsProvider>
      <AppShell>
        <Header />
        <BlogSidebar />
        <EditorArea>
          <Outlet />
        </EditorArea>
        <MetaPanel />
      </AppShell>
    </PostsProvider>
  );
}

export default BlogLayout;
