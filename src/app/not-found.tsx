import { NotFound } from '../components/ui/ErrorBoundary';

export default function NotFoundPage() {
  return (
    <NotFound 
      title="Page Not Found"
      message="Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted."
      showHomeButton={true}
    />
  );
}
