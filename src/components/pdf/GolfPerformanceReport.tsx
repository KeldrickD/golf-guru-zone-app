'use client';

import React, { useState } from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  PDFViewer,
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

// Register fonts (optional but improves the look)
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_bZF3gnD-w.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Montserrat',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    color: '#4f46e5',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  roundInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
  },
  value: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  statHeader: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    flexDirection: 'row',
    marginBottom: 5,
  },
  statHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    color: '#475569',
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#fff',
  },
  statLabel: {
    flex: 2,
    fontSize: 10,
    color: '#334155',
  },
  statValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  excellent: { color: '#22c55e' },
  good: { color: '#3b82f6' },
  average: { color: '#eab308' },
  needsWork: { color: '#ef4444' },
  insightsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  insightsText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
  },
  qrCodeSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  shareLink: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  better: { color: '#22c55e' },
  worse: { color: '#ef4444' },
});

// Types for the report data
interface RoundData {
  id?: string;
  date: string;
  totalScore: number;
  putts?: number;
  fairwaysHit?: number;
  totalFairways?: number;
  greensInRegulation?: number;
  totalGreens?: number;
  courseName?: string;
  courseLocation?: string;
  par?: number;
  holeDetails?: Array<{
    number: number;
    par: number;
    score: number;
    putts?: number;
    fairwayHit?: boolean;
    gir?: boolean;
  }>;
}

interface PlayerData {
  name: string;
  handicap?: number;
  averageScore?: number;
  image?: string;
}

interface ComparisonData {
  avgScore?: number;
  avgPutts?: number;
  fairwayHitPercentage?: number;
  girPercentage?: number;
  userAverageScore?: number;
  userAveragePutts?: number;
  userFairwayHitPercentage?: number;
  userGirPercentage?: number;
}

interface GoalData {
  type: string;
  targetValue: number;
  progress: number;
  isCompleted: boolean;
  deadline?: string;
}

interface PerformanceReportProps {
  playerData: PlayerData;
  roundData?: RoundData;
  historicalData?: {
    rounds: number;
    avgScore?: number;
    bestScore?: number;
    scoreImprovement?: number;
  };
  comparisonData?: {
    user: ComparisonData;
    global?: ComparisonData;
  };
  goals?: GoalData[];
  insights?: string;
  shareUrl?: string;
  qrCodeDataUrl?: string;
}

// Helper function to format dates
const formatReportDate = (dateString: string): string => {
  try {
    return formatDate(new Date(dateString));
  } catch (error) {
    return dateString || 'Unknown Date';
  }
};

// Calculate performance level
const getPerformanceLevel = (score: number, par: number): string => {
  const diff = score - par;
  if (diff <= -3) return 'Exceptional';
  if (diff <= -1) return 'Very Good';
  if (diff <= 1) return 'Good';
  if (diff <= 3) return 'Average';
  if (diff <= 5) return 'Below Average';
  return 'Needs Improvement';
};

// The actual PDF Document component
const PerformanceReport = ({ 
  playerData,
  roundData,
  historicalData,
  comparisonData,
  goals,
  insights,
  shareUrl,
  qrCodeDataUrl
}: PerformanceReportProps) => {
  // Calculate fairways and greens percentages if round data exists
  const fairwaysPercentage = roundData?.fairwaysHit && roundData?.totalFairways 
    ? Math.round((roundData.fairwaysHit / roundData.totalFairways) * 100) 
    : null;
  
  const girPercentage = roundData?.greensInRegulation && roundData?.totalGreens 
    ? Math.round((roundData.greensInRegulation / roundData.totalGreens) * 100) 
    : null;
  
  // Determine performance levels
  const getPerformanceLevel = (value: number | undefined | null, category: string) => {
    if (value === undefined || value === null) return {};
    
    if (category === 'putts') {
      if (value <= 28) return { text: 'Excellent', style: styles.excellent };
      if (value <= 32) return { text: 'Good', style: styles.good };
      if (value <= 36) return { text: 'Average', style: styles.average };
      return { text: 'Needs Work', style: styles.needsWork };
    }
    
    if (category === 'fairways') {
      if (value >= 70) return { text: 'Excellent', style: styles.excellent };
      if (value >= 55) return { text: 'Good', style: styles.good };
      if (value >= 40) return { text: 'Average', style: styles.average };
      return { text: 'Needs Work', style: styles.needsWork };
    }
    
    if (category === 'gir') {
      if (value >= 65) return { text: 'Excellent', style: styles.excellent };
      if (value >= 50) return { text: 'Good', style: styles.good };
      if (value >= 35) return { text: 'Average', style: styles.average };
      return { text: 'Needs Work', style: styles.needsWork };
    }
    
    return { text: '', style: {} };
  };
  
  const puttsLevel = roundData?.putts ? getPerformanceLevel(roundData.putts, 'putts') : null;
  const fairwaysLevel = fairwaysPercentage ? getPerformanceLevel(fairwaysPercentage, 'fairways') : null;
  const girLevel = girPercentage ? getPerformanceLevel(girPercentage, 'gir') : null;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Golf Guru Zone</Text>
          {/* If you have a logo, uncomment this:
          <Image 
            src="/logo.png" 
            style={styles.logo} 
          />
          */}
        </View>
        
        {/* Report Title */}
        <Text style={styles.title}>
          {roundData ? 'Round Performance Report' : 'Golf Performance Summary'}
        </Text>
        
        {/* Player Info */}
        <View style={styles.roundInfo}>
          <Text style={styles.subtitle}>Player Information</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>Player</Text>
              <Text style={styles.value}>{playerData.name}</Text>
            </View>
            {playerData.handicap && (
              <View style={styles.cell}>
                <Text style={styles.label}>Handicap</Text>
                <Text style={styles.value}>{playerData.handicap}</Text>
              </View>
            )}
            {historicalData?.rounds && (
              <View style={styles.cell}>
                <Text style={styles.label}>Total Rounds</Text>
                <Text style={styles.value}>{historicalData.rounds}</Text>
              </View>
            )}
            {historicalData?.avgScore && (
              <View style={styles.cell}>
                <Text style={styles.label}>Average Score</Text>
                <Text style={styles.value}>{historicalData.avgScore}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Round Info - If specific round data is provided */}
        {roundData && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Round Details - {formatReportDate(roundData.date)}</Text>
            
            <View style={styles.roundInfo}>
              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.label}>Score</Text>
                  <Text style={styles.value}>{roundData.totalScore}</Text>
                </View>
                {roundData.courseName && (
                  <View style={styles.cell}>
                    <Text style={styles.label}>Course</Text>
                    <Text style={styles.value}>{roundData.courseName}</Text>
                  </View>
                )}
                {roundData.par && (
                  <View style={styles.cell}>
                    <Text style={styles.label}>Par</Text>
                    <Text style={styles.value}>{roundData.par}</Text>
                  </View>
                )}
              </View>
              
              {/* Stats Row */}
              <View style={styles.row}>
                {roundData.putts !== undefined && (
                  <View style={styles.cell}>
                    <Text style={styles.label}>Putts</Text>
                    <Text style={styles.value}>{roundData.putts}</Text>
                    {puttsLevel && (
                      <Text style={[styles.label, puttsLevel.style]}>
                        {puttsLevel.text}
                      </Text>
                    )}
                  </View>
                )}
                
                {fairwaysPercentage !== null && (
                  <View style={styles.cell}>
                    <Text style={styles.label}>Fairways</Text>
                    <Text style={styles.value}>
                      {roundData.fairwaysHit}/{roundData.totalFairways} ({fairwaysPercentage}%)
                    </Text>
                    {fairwaysLevel && (
                      <Text style={[styles.label, fairwaysLevel.style]}>
                        {fairwaysLevel.text}
                      </Text>
                    )}
                  </View>
                )}
                
                {girPercentage !== null && (
                  <View style={styles.cell}>
                    <Text style={styles.label}>Greens in Regulation</Text>
                    <Text style={styles.value}>
                      {roundData.greensInRegulation}/{roundData.totalGreens} ({girPercentage}%)
                    </Text>
                    {girLevel && (
                      <Text style={[styles.label, girLevel.style]}>
                        {girLevel.text}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        
        {/* Comparison Data - If comparison stats are provided */}
        {comparisonData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Comparison</Text>
            <View style={styles.statsRow}>
              {comparisonData.user.avgScore !== undefined && comparisonData.global?.avgScore !== undefined && (
                <View style={styles.comparisonItem}>
                  <Text style={styles.label}>Average Score:</Text>
                  <Text style={
                    comparisonData.user.avgScore < comparisonData.global.avgScore 
                      ? styles.better 
                      : comparisonData.user.avgScore > comparisonData.global.avgScore 
                        ? styles.worse 
                        : styles.value
                  }>
                    {comparisonData.user.avgScore} 
                    {' ('}
                    {comparisonData.user.avgScore < comparisonData.global.avgScore 
                      ? `${(comparisonData.global.avgScore - comparisonData.user.avgScore).toFixed(1)} better than average` 
                      : comparisonData.user.avgScore > comparisonData.global.avgScore 
                        ? `${(comparisonData.user.avgScore - comparisonData.global.avgScore).toFixed(1)} worse than average` 
                        : 'same as average'}
                    {')'}
                  </Text>
                </View>
              )}

              {comparisonData.user.fairwayHitPercentage !== undefined && comparisonData.global?.fairwayHitPercentage !== undefined && (
                <View style={styles.comparisonItem}>
                  <Text style={styles.label}>Fairways Hit:</Text>
                  <Text style={
                    comparisonData.user.fairwayHitPercentage > comparisonData.global.fairwayHitPercentage 
                      ? styles.better 
                      : comparisonData.user.fairwayHitPercentage < comparisonData.global.fairwayHitPercentage 
                        ? styles.worse 
                        : styles.value
                  }>
                    {comparisonData.user.fairwayHitPercentage.toFixed(1)}% 
                    {' ('}
                    {comparisonData.user.fairwayHitPercentage > comparisonData.global.fairwayHitPercentage 
                      ? `${(comparisonData.user.fairwayHitPercentage - comparisonData.global.fairwayHitPercentage).toFixed(1)}% better than average` 
                      : comparisonData.user.fairwayHitPercentage < comparisonData.global.fairwayHitPercentage 
                        ? `${(comparisonData.global.fairwayHitPercentage - comparisonData.user.fairwayHitPercentage).toFixed(1)}% worse than average` 
                        : 'same as average'}
                    {')'}
                  </Text>
                </View>
              )}

              {comparisonData.user.girPercentage !== undefined && comparisonData.global?.girPercentage !== undefined && (
                <View style={styles.comparisonItem}>
                  <Text style={styles.label}>Greens in Regulation:</Text>
                  <Text style={
                    comparisonData.user.girPercentage > comparisonData.global.girPercentage 
                      ? styles.better 
                      : comparisonData.user.girPercentage < comparisonData.global.girPercentage 
                        ? styles.worse 
                        : styles.value
                  }>
                    {comparisonData.user.girPercentage.toFixed(1)}% 
                    {' ('}
                    {comparisonData.user.girPercentage > comparisonData.global.girPercentage 
                      ? `${(comparisonData.user.girPercentage - comparisonData.global.girPercentage).toFixed(1)}% better than average` 
                      : comparisonData.user.girPercentage < comparisonData.global.girPercentage 
                        ? `${(comparisonData.global.girPercentage - comparisonData.user.girPercentage).toFixed(1)}% worse than average` 
                        : 'same as average'}
                    {')'}
                  </Text>
                </View>
              )}

              {comparisonData.user.avgPutts !== undefined && comparisonData.global?.avgPutts !== undefined && (
                <View style={styles.comparisonItem}>
                  <Text style={styles.label}>Average Putts:</Text>
                  <Text style={
                    comparisonData.user.avgPutts < comparisonData.global.avgPutts 
                      ? styles.better 
                      : comparisonData.user.avgPutts > comparisonData.global.avgPutts 
                        ? styles.worse 
                        : styles.value
                  }>
                    {comparisonData.user.avgPutts.toFixed(1)} 
                    {' ('}
                    {comparisonData.user.avgPutts < comparisonData.global.avgPutts 
                      ? `${(comparisonData.global.avgPutts - comparisonData.user.avgPutts).toFixed(1)} better than average` 
                      : comparisonData.user.avgPutts > comparisonData.global.avgPutts 
                        ? `${(comparisonData.user.avgPutts - comparisonData.global.avgPutts).toFixed(1)} worse than average` 
                        : 'same as average'}
                    {')'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* Goals Section - If goals are provided */}
        {goals && goals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Golf Goals</Text>
            
            <View style={styles.statHeader}>
              <Text style={[styles.statHeaderText, { flex: 2 }]}>Goal</Text>
              <Text style={styles.statHeaderText}>Target</Text>
              <Text style={styles.statHeaderText}>Progress</Text>
            </View>
            
            {goals.map((goal, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>
                  {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                </Text>
                <Text style={styles.statValue}>{goal.targetValue}</Text>
                <Text style={styles.statValue}>{goal.progress}%</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Insights Box - If insights are provided */}
        {insights && (
          <View style={styles.insightsBox}>
            <Text style={styles.insightsTitle}>Performance Insights</Text>
            <Text style={styles.insightsText}>{insights}</Text>
          </View>
        )}
        
        {/* QR Code for Sharing - If QR code is provided */}
        {qrCodeDataUrl && (
          <View style={styles.qrCodeSection}>
            <Image src={qrCodeDataUrl} style={styles.qrCode} />
            <Text style={styles.shareLink}>
              Scan to view online: {shareUrl}
            </Text>
          </View>
        )}
        
        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Golf Guru Zone • {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

// Viewer component with download option
interface GolfPerformanceReportProps {
  data: PerformanceReportProps;
  showPreview?: boolean;
}

export default function GolfPerformanceReport({ 
  data, 
  showPreview = false 
}: GolfPerformanceReportProps) {
  const [showPreviewState, setShowPreviewState] = useState(showPreview);
  
  // Generate file name
  const getFileName = () => {
    const playerName = data.playerData.name.replace(/\s+/g, '_');
    const date = data.roundData?.date 
      ? new Date(data.roundData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    return `${playerName}_Golf_Report_${date}.pdf`;
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <Button 
          onClick={() => setShowPreviewState(!showPreviewState)}
          variant="outline"
        >
          {showPreviewState ? "Hide Preview" : "Preview PDF"}
        </Button>
        
        <PDFDownloadLink
          document={<PerformanceReport {...data} />}
          fileName={getFileName()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
      
      {showPreviewState && (
        <div className="h-[600px] border border-gray-200 rounded-md overflow-hidden">
          <PDFViewer width="100%" height="100%" style={{border: 'none'}}>
            <PerformanceReport {...data} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
} 