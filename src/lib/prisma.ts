import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Mock Prisma Client
class MockPrismaClient {
  user = {
    findUnique: async () => ({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      image: 'https://via.placeholder.com/150',
    }),
    findFirst: async () => ({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      image: 'https://via.placeholder.com/150',
    }),
    create: async (data: any) => ({
      id: '1',
      ...data.data,
    }),
    update: async (data: any) => ({
      id: '1',
      ...data.data,
    }),
  };

  clubDistance = {
    findMany: async () => ([
      { club: 'Driver', avgDistance: 230, minDistance: 210, maxDistance: 250 },
      { club: '3-Wood', avgDistance: 210, minDistance: 195, maxDistance: 225 },
      { club: '5-Wood', avgDistance: 195, minDistance: 180, maxDistance: 210 },
      { club: '4-Iron', avgDistance: 180, minDistance: 170, maxDistance: 190 },
      { club: '5-Iron', avgDistance: 170, minDistance: 160, maxDistance: 180 },
      { club: '6-Iron', avgDistance: 160, minDistance: 150, maxDistance: 170 },
      { club: '7-Iron', avgDistance: 150, minDistance: 140, maxDistance: 160 },
      { club: '8-Iron', avgDistance: 140, minDistance: 130, maxDistance: 150 },
      { club: '9-Iron', avgDistance: 130, minDistance: 120, maxDistance: 140 },
      { club: 'PW', avgDistance: 120, minDistance: 110, maxDistance: 130 },
      { club: 'GW', avgDistance: 100, minDistance: 90, maxDistance: 110 },
      { club: 'SW', avgDistance: 80, minDistance: 70, maxDistance: 90 },
      { club: 'LW', avgDistance: 60, minDistance: 50, maxDistance: 70 },
    ]),
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
  };

  round = {
    findMany: async () => ([
      { 
        id: '1', 
        date: new Date(), 
        courseName: 'Sample Golf Course', 
        totalScore: 85, 
        userId: '1',
        putts: 34,
        fairwaysHit: 10,
        greensInRegulation: 8
      }
    ]),
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
  };

  subscription = {
    findUnique: async () => ({
      id: '1',
      userId: '1',
      status: 'active',
      plan: 'premium',
      nextBillingDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (data: any) => ({ id: '1', ...data.data }),
  };
}

// Create and export a mock Prisma client instance
const mockPrisma = new MockPrismaClient();
export default mockPrisma; 