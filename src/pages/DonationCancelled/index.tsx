import Button from '../../components/common/Button';

export default function DonationCancelled() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Not Completed</h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Your payment was not processed. You may return to the donation page and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/donate" size="lg">Return to Donation</Button>
          <Button to="/" size="lg" variant="outline">Return Home</Button>
        </div>
      </div>
    </div>
  );
}
