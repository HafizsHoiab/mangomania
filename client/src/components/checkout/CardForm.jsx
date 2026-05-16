export default function CardForm({ onSubmit, isLoading }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4 space-y-4">
      <p className="font-semibold text-dark">Card Payment (Stripe)</p>
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-500 text-center py-4">
          💳 Stripe card element loads here after order is created.
          <br />
          <span className="text-xs">Test card: 4242 4242 4242 4242</span>
        </p>
      </div>
      <button onClick={onSubmit} disabled={isLoading} className="btn-primary w-full">
        {isLoading ? 'Processing...' : 'Pay with Card 💳'}
      </button>
    </div>
  )
}
