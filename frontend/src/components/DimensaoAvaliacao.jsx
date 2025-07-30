import { FaStar } from 'react-icons/fa'

export default function DimensaoAvaliacao({
  titulo,
  descricao,
  nota,
  onNotaChange,
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
      <h3 className="font-semibold">{titulo}</h3>
      <p className="text-sm text-gray-600 mb-2">{descricao}</p>
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={`cursor-pointer transition-colors duration-200 
              ${star <= nota ? 'text-yellow-400' : 'text-gray-300'}
              hover:text-yellow-500`}
            onClick={() => onNotaChange(star)}
          />
        ))}
      </div>
    </div>
  )
}
