import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export const syncUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (existingUser) return;

    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumbers[0]?.phoneNumber,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error syncing user", error);
  }
};
