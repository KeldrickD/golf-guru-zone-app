import { RoundStats } from '@/services/performanceAnalysisService';
import { PracticePlan } from '@/services/performanceAnalysisService';

export const exportRoundStats = (roundStats: RoundStats[]): void => {
  const csvContent = convertToCSV(roundStats);
  downloadCSV(csvContent, 'golf_round_stats.csv');
};

export const exportPracticePlan = (plan: PracticePlan): void => {
  const content = `
Practice Plan: ${plan.title}

Description: ${plan.description}
Focus Area: ${plan.focusArea}
Expected Timeframe: ${plan.expectedTimeframe}

Goals:
${plan.goals.map(goal => `- ${goal}`).join('\n')}

Drills:
${plan.drills.map(drill => `
- ${drill.name}
  Duration: ${drill.duration}
  Description: ${drill.description}
  ${drill.videoUrl ? `Video: ${drill.videoUrl}` : ''}`).join('\n')}
`;

  downloadTXT(content.trim(), `practice_plan_${plan.id}.txt`);
};

const convertToCSV = (roundStats: RoundStats[]): string => {
  const headers = [
    'Date',
    'Course',
    'Score',
    'Par',
    'Fairways Hit',
    'GIR',
    'Putts',
    'Driving Distance'
  ].join(',');

  const data = roundStats.map(round => ({
    Date: new Date(round.date).toLocaleDateString(),
    Course: round.courseName,
    Score: round.totalScore,
    Par: round.coursePar,
    'Fairways Hit': `${round.fairwaysHit}/${round.totalFairways}`,
    'GIR': round.greensInRegulation,
    'Putts': round.totalPutts,
    'Driving Distance': round.avgDriveDistance
  }));

  const rows = data.map(obj => Object.values(obj).join(','));
  return [headers, ...rows].join('\n');
};

const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadTXT = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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