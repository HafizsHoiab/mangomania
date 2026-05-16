const STEPS = ['Cart', 'Details', 'Payment', 'Confirm']

export default function CheckoutSteps({ current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
            i < current ? 'bg-green-500 text-white' : i === current ? 'bg-mango text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`ml-2 text-sm font-medium hidden sm:block ${i === current ? 'text-mango' : i < current ? 'text-green-600' : 'text-gray-400'}`}>
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`w-10 sm:w-20 h-0.5 mx-3 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
