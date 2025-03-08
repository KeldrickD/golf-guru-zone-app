"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Card } from "@/components/ui/Card"
import { RoundStats } from "@/types/golf"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
  CircleDotIcon,
  CrosshairIcon,
  RulerIcon,
} from "lucide-react"

interface DrilldownModalProps {
  round: RoundStats
  isOpen: boolean
  onClose: () => void
}

const DrilldownModal: React.FC<DrilldownModalProps> = ({
  round,
  isOpen,
  onClose,
}) => {
  const getScoreDiff = (score: number, par: number) => {
    const diff = score - par
    if (diff > 0) {
      return (
        <span className="flex items-center text-destructive">
          <ArrowUpIcon className="h-4 w-4 mr-1" />
          {`+${diff}`}
        </span>
      )
    } else if (diff < 0) {
      return (
        <span className="flex items-center text-primary">
          <ArrowDownIcon className="h-4 w-4 mr-1" />
          {diff}
        </span>
      )
    }
    return (
      <span className="flex items-center text-muted-foreground">
        <MinusIcon className="h-4 w-4 mr-1" />E
      </span>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Round Details - {new Date(round.date).toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Scoring Overview */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Scoring</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Score</span>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">{round.totalScore}</span>
                  {getScoreDiff(round.totalScore, round.coursePar)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Score to Par</span>
                <span className="font-semibold">
                  {getScoreDiff(round.totalScore, round.coursePar)}
                </span>
              </div>
            </div>
          </Card>

          {/* Accuracy Stats */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CrosshairIcon className="h-5 w-5 mr-2" />
              Accuracy
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Fairways Hit</span>
                <span className="font-semibold">
                  {round.fairwaysHit}/{round.totalFairways} (
                  {Math.round((round.fairwaysHit / round.totalFairways) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Greens in Regulation</span>
                <span className="font-semibold">
                  {round.greensInRegulation}/{18} (
                  {Math.round((round.greensInRegulation / 18) * 100)}%)
                </span>
              </div>
            </div>
          </Card>

          {/* Putting Stats */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CircleDotIcon className="h-5 w-5 mr-2" />
              Putting
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Putts</span>
                <span className="font-semibold">{round.totalPutts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Putts per Hole</span>
                <span className="font-semibold">
                  {(round.totalPutts / 18).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>

          {/* Distance Stats */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <RulerIcon className="h-5 w-5 mr-2" />
              Distance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Avg. Drive Distance</span>
                <span className="font-semibold">{round.avgDriveDistance} yards</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DrilldownModal 