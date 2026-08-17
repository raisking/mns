import Button from '../../components/common/Button';

export default function DonationSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-gray-600 leading-relaxed mb-2">
          Thank you for supporting Marietta Nepali Samaj.
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">
          Your contribution helps us continue our cultural, educational, and community programs.
        </p>
        <Button to="/" size="lg">Return Home</Button>
      </div>
    </div>
  );
}
