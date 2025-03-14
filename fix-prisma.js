// Script to replace Prisma imports with mock implementations
const fs = require('fs');
const path = require('path');

// Function to walk through directory
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

// Function to check if file contains Prisma imports
function hasPrismaImport(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('from \'@prisma/client\'') || 
           content.includes('from "@prisma/client"') ||
           content.includes('from \'@/lib/prisma\'') ||
           content.includes('from "@/lib/prisma"');
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return false;
  }
}

// Replace Prisma import with mock implementation for API routes
function replacePrismaInApiRoute(filePath) {
  if (!filePath.includes('/api/') || (!filePath.endsWith('route.ts') && !filePath.endsWith('route.tsx'))) {
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this file uses Prisma
    if (!hasPrismaImport(filePath)) {
      return false;
    }

    console.log(`Replacing Prisma usage in ${filePath}`);
    
    // Replace imports
    content = content.replace(/import.*prisma.*from.*('|").*('|");?/g, 'import { NextResponse } from \'next/server\';');
    
    // Replace any other imports we might want to keep
    if (!content.includes('NextResponse')) {
      content = 'import { NextResponse } from \'next/server\';\n' + content;
    }
    
    // Replace any GET method that uses Prisma
    if (content.includes('export async function GET')) {
      content = content.replace(
        /export async function GET[\s\S]*?{[\s\S]*?return NextResponse/,
        'export async function GET() {\n  return NextResponse'
      );
    }
    
    // Write the file back
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return false;
  }
}

// Main function
function main() {
  const srcDir = path.join(__dirname, 'src');
  let replacedFiles = 0;
  
  console.log('Scanning for Prisma usage in API routes...');
  
  walkDir(srcDir, (filePath) => {
    if (replacePrismaInApiRoute(filePath)) {
      replacedFiles++;
    }
  });
  
  console.log(`Replaced Prisma usage in ${replacedFiles} files.`);
}

main(); 