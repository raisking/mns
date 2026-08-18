import Button from '../../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-gray-100 select-none">404</p>
        <div className="-mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <Button to="/" size="lg">Return Home</Button>
        </div>
      </div>
    </div>
  );
}
