import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={28}
          className={`cursor-pointer transition-colors duration-200 
            ${star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  )
}
