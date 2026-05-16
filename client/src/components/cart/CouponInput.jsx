import { useState } from 'react'
import { useValidateCouponMutation } from '../../services/adminApi.js'
import { toast } from '../../hooks/useToast.js'

export default function CouponInput({ subtotal, onApply }) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [validate, { isLoading }] = useValidateCouponMutation()

  const handleApply = async () => {
    if (!code.trim()) return
    try {
      const res = await validate({ code: code.trim(), orderAmount: subtotal }).unwrap()
      setApplied({ code: code.trim(), ...res.data })
      onApply({ code: code.trim(), discount: res.data.discountAmount })
      toast.success(res.message || 'Coupon applied!')
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid coupon code')
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    onApply({ code: '', discount: 0 })
  }

  if (applied) return (
    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
      <div>
        <p className="text-sm font-semibold text-green-800">🎉 {applied.code} applied!</p>
        <p className="text-xs text-green-600">You save Rs. {applied.discountAmount?.toLocaleString()}</p>
      </div>
      <button onClick={handleRemove} className="text-red-500 text-xs hover:underline">Remove</button>
    </div>
  )

  return (
    <div className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter coupon code"
        className="input flex-1 py-2 text-sm uppercase"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <button onClick={handleApply} disabled={isLoading || !code} className="btn-primary py-2 px-4 text-sm">
        {isLoading ? '...' : 'Apply'}
      </button>
    </div>
  )
}
