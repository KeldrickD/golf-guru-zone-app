import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        handicap: true,
        homeClub: true,
        settings: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Default settings if none exist
    const defaultSettings = {
      preferredUnits: 'imperial',
      notifications: {
        roundReminders: true,
        performanceUpdates: true,
        equipmentMaintenance: true,
      },
      displayPreferences: {
        darkMode: false,
        compactView: false,
      },
    };

    return NextResponse.json({
      handicap: user.handicap,
      homeClub: user.homeClub,
      ...defaultSettings,
      ...(user.settings as any),
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { handicap, homeClub, ...settings } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        handicap,
        homeClub,
        settings,
      },
    });

    return NextResponse.json({
      handicap: user.handicap,
      homeClub: user.homeClub,
      ...settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 