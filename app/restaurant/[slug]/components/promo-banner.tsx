import Image from 'next/image'

export function PromoBanner() {
  return (
    <div className="mx-4 my-6">
      <div className="relative bg-gray-900 rounded-2xl p-6 overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Free delivery for pasta
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            Order any pasta dish and get free delivery
          </p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Order Now
          </button>
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32">
          <Image
            src="/promo-pasta.jpg"
            alt="Pasta dish"
            fill
            className="object-cover rounded-full"
          />
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 