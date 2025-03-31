import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, type, notes } = await request.json();

    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    if (equipment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maintenanceRecord = await prisma.maintenanceRecord.create({
      data: {
        date: new Date(date),
        type,
        notes,
        equipmentId: params.id,
      },
    });

    return NextResponse.json(maintenanceRecord);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance record' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    if (equipment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: { equipmentId: params.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance records' },
      { status: 500 }
    );
  }
} 