import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import { nanoid } from "nanoid";

// Generate a short unique identifier for shareable links
function generateShareId() {
  return crypto.randomBytes(6).toString('base64url');
}

// GET /api/share/:shareId - Get shared content by ID
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const sharedContent = await prisma.sharedContent.findMany({
      where: {
        userId: session.user.id,
        // Optionally filter out expired content
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        round: {
          select: {
            id: true,
            date: true,
            course: true,
            totalScore: true
          }
        },
        goal: {
          select: {
            id: true,
            type: true,
            targetValue: true,
            progress: true,
            isCompleted: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(sharedContent);
    
  } catch (error) {
    console.error("Error fetching shared content:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared content" },
      { status: 500 }
    );
  }
}

// POST /api/share - Create a new shareable link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const { contentType, contentId, title, description, isPublic, expiresAt } = await req.json();
    
    // Validate the content type
    if (!["round", "stats", "goal"].includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }
    
    // Validate that the user has access to this content
    let contentExists = false;
    
    if (contentType === "round") {
      const round = await prisma.round.findUnique({
        where: { 
          id: contentId,
          userId: session.user.id
        }
      });
      contentExists = !!round;
    } else if (contentType === "stats") {
      // For stats, we just verify the user exists since stats are aggregated
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      contentExists = !!user;
    } else if (contentType === "goal") {
      const goal = await prisma.userGoal.findUnique({
        where: {
          id: contentId,
          userId: session.user.id
        }
      });
      contentExists = !!goal;
    }
    
    if (!contentExists) {
      return NextResponse.json(
        { error: "Content not found or not accessible" },
        { status: 404 }
      );
    }
    
    // Generate a unique share ID
    const shareId = nanoid(10);
    
    // Create the shared content record
    const sharedContent = await prisma.sharedContent.create({
      data: {
        shareId,
        contentType,
        title: title || "Golf Performance",
        description: description || "Check out my golf performance!",
        user: {
          connect: { id: session.user.id }
        },
        ...(contentType === "round" && { round: { connect: { id: contentId } } }),
        ...(contentType === "goal" && { goal: { connect: { id: contentId } } }),
        isPublic: isPublic ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        viewCount: 0
      }
    });
    
    return NextResponse.json({ 
      shareId: sharedContent.shareId,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/share/${sharedContent.shareId}`
    });
    
  } catch (error) {
    console.error("Error creating shared content:", error);
    return NextResponse.json(
      { error: "Failed to create shared content" },
      { status: 500 }
    );
  }
}

// DELETE /api/share/:shareId - Delete a shared content
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const shareId = url.pathname.split('/').pop();
    
    if (!shareId) {
      return NextResponse.json(
        { error: 'Missing share ID' },
        { status: 400 }
      );
    }
    
    // Check if the shared content exists and belongs to the user
    const sharedContent = await prisma.sharedContent.findFirst({
      where: {
        shareId,
        userId: session.user.id,
      },
    });
    
    if (!sharedContent) {
      return NextResponse.json(
        { error: 'Shared content not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Delete the shared content
    await prisma.sharedContent.delete({
      where: {
        id: sharedContent.id,
      },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in /api/share DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete shared content' },
      { status: 500 }
    );
  }
} 