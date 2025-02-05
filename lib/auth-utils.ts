import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

// Define types for our user data
interface DbUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  restaurant: {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    bannerImage: string | null;
    slug: string;
    websiteGenerated: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export async function getCurrentUser() {
  try {
    return await requireAuth();
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const authResult = await auth();
  const userId = authResult.userId;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  // Try to find existing user
  let user = await prisma.user.findFirst({
    where: {
      email: clerkUser.emailAddresses[0].emailAddress,
    },
    include: {
      restaurant: true,
    },
  });

  // If user doesn't exist, create one with a restaurant
  if (!user) {
    console.log("Creating new user and restaurant...");
    
    try {
      user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            role: 'RESTAURANT_ADMIN',
            hashedPassword: 'clerk-auth', // Not used with Clerk
          },
        });

        // Create restaurant
        const restaurant = await tx.restaurant.create({
          data: {
            name: `${clerkUser.firstName || 'My'}'s Restaurant`,
            description: 'Welcome to my restaurant',
            slug: `${(clerkUser.firstName || 'restaurant').toLowerCase()}-${Date.now()}`,
            userId: newUser.id,
            websiteGenerated: false,
          },
        });

        // Return user with restaurant
        return tx.user.findUnique({
          where: { id: newUser.id },
          include: { restaurant: true },
        });
      });

      console.log("Created new user and restaurant:", user?.id);
    } catch (error) {
      console.error("Error creating user and restaurant:", error);
      throw new Error("Failed to create user account");
    }
  }

  if (!user) {
    throw new Error("Failed to get or create user");
  }

  // Add debug logging
  console.log('Auth User:', {
    id: user.id,
    email: user.email,
    restaurant: user.restaurant?.id
  });
  
  return user;
}
