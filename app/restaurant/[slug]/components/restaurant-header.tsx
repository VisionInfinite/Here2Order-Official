'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Restaurant } from '@/lib/types'

interface RestaurantHeaderProps {
  restaurant: Restaurant
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <motion.header 
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner Image with Overlay */}
      <div className="relative h-[400px] w-full">
        {restaurant.bannerImage ? (
          <Image
            src={restaurant.bannerImage}
            alt={`${restaurant.name} banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#403D39] to-[#252422]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#252422]/50 to-[#252422]" />
      </div>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <motion.div 
          className="container mx-auto flex items-end gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Logo */}
          {restaurant.logo && (
            <motion.div 
              className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-xl overflow-hidden 
                         border-4 border-[#FFFCF2] bg-[#FFFCF2] shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
          
          {/* Restaurant Details */}
          <div className="flex-1 text-[#FFFCF2]">
            <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="mt-2 text-[#CCC5B9] text-lg max-w-2xl">
                {restaurant.description}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
} 