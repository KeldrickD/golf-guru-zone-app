import { RoundStats, PerformanceAnalysis, PracticePlan } from "@/services/performanceAnalysisService";

export function exportToCSV(data: any[], filename: string) {
  // Convert data to CSV format
  const csvContent = convertToCSV(data);
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportRoundStats(roundStats: RoundStats[]) {
  const data = roundStats.map(round => ({
    Date: new Date(round.date).toLocaleDateString(),
    Course: round.course,
    Score: round.score,
    Par: round.par,
    'Fairways Hit': `${round.fairwaysHit}/${round.fairwaysTotal}`,
    'Fairway %': ((round.fairwaysHit / round.fairwaysTotal) * 100).toFixed(1),
    'Greens in Regulation': round.greensInRegulation,
    'GIR %': ((round.greensInRegulation / 18) * 100).toFixed(1),
    Putts: round.putts,
    'Driving Distance': round.drivingDistance || 'N/A',
    'Bunkers Hit': round.bunkersHit,
    'Penalty Strokes': round.penaltyStrokes,
    Notes: round.notes
  }));
  
  exportToCSV(data, 'golf-round-stats.csv');
}

export function exportPracticePlan(plan: PracticePlan) {
  const data = [
    {
      Title: plan.title,
      Description: plan.description,
      'Focus Area': plan.focusArea,
      'Expected Timeframe': plan.expectedTimeframe
    },
    { Title: 'Drills:' },
    ...plan.drills.map(drill => ({
      Name: drill.name,
      Description: drill.description,
      Duration: drill.duration,
      'Video URL': drill.videoUrl || 'N/A'
    })),
    { Title: 'Goals:' },
    ...plan.goals.map(goal => ({ Goal: goal }))
  ];
  
  exportToCSV(data, `practice-plan-${plan.id}.csv`);
}

export function generatePracticePlanPDF(plan: PracticePlan): string {
  // This would typically use a PDF generation library
  // For now, we'll return a data URL that could be used for sharing
  const planData = {
    title: plan.title,
    description: plan.description,
    focusArea: plan.focusArea,
    drills: plan.drills,
    goals: plan.goals,
    timeframe: plan.expectedTimeframe
  };
  
  return `data:text/plain;base64,${btoa(JSON.stringify(planData))}`;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const rows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that need quotes (contains comma, newline, or quotes)
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];
  
  return rows.join('\n');
} 