"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { ChevronDown, ChevronUp, Crown } from "lucide-react"

// Mock data - replace with actual data from your auth/database
const mockUserProfile = {
  email: "user@example.com",
  company: "Acme Corp",
  role: "Consultant",
  isPremium: true
}

const mockUsageStats = [
  { label: "Projects", value: 45, color: "bg-blue-500" },
  { label: "Reports", value: 30, color: "bg-green-500" },
  { label: "Meetings", value: 15, color: "bg-purple-500" },
  { label: "Tasks", value: 10, color: "bg-orange-500" }
]

const mockDeadlines = [
  { id: 1, task: "Q4 Financial Report", priority: "high", dueDate: "2025-11-20", details: "Complete quarterly analysis" },
  { id: 2, task: "Client Presentation", priority: "high", dueDate: "2025-11-15", details: "Prepare slides for stakeholder meeting" },
  { id: 3, task: "Team Review", priority: "medium", dueDate: "2025-11-13", details: "Conduct performance reviews" },
  { id: 4, task: "Budget Planning", priority: "low", dueDate: "2025-11-25", details: "Draft next quarter budget" }
]

const mockTeams = [
  { 
    id: 1, 
    name: "Strategy Team", 
    isLeader: true, 
    members: ["Alice Johnson", "Bob Smith", "Carol White"] 
  },
  { 
    id: 2, 
    name: "Analytics Team", 
    isLeader: false, 
    members: ["David Brown", "Eve Davis", "Frank Miller"] 
  },
  { 
    id: 3, 
    name: "Client Relations", 
    isLeader: false, 
    members: ["Grace Lee", "Henry Wilson", "Iris Taylor"] 
  }
]

export default function ProfilePage() {
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set())
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredDeadline, setHoveredDeadline] = useState<number | null>(null)

  const toggleTeam = (teamId: number) => {
    const newExpanded = new Set(expandedTeams)
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId)
    } else {
      newExpanded.add(teamId)
    }
    setExpandedTeams(newExpanded)
  }

  const total = mockUsageStats.reduce((sum, stat) => sum + stat.value, 0)

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-[1600px] mx-auto flex gap-6">
        {/* Main Content Area - 4 Quadrants */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* Quadrant 1: Usage Statistics */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                {/* Simple Pie Chart */}
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    {mockUsageStats.map((stat, index) => {
                      const prevTotal = mockUsageStats.slice(0, index).reduce((sum, s) => sum + s.value, 0)
                      const startAngle = (prevTotal / total) * 360
                      const endAngle = ((prevTotal + stat.value) / total) * 360
                      const largeArcFlag = stat.value / total > 0.5 ? 1 : 0
                      
                      const startX = 100 + 90 * Math.cos((startAngle * Math.PI) / 180)
                      const startY = 100 + 90 * Math.sin((startAngle * Math.PI) / 180)
                      const endX = 100 + 90 * Math.cos((endAngle * Math.PI) / 180)
                      const endY = 100 + 90 * Math.sin((endAngle * Math.PI) / 180)

                      return (
                        <path
                          key={index}
                          d={`M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                          className={`${stat.color.replace('bg-', 'fill-')} cursor-pointer transition-opacity ${hoveredStat === index ? 'opacity-100' : 'opacity-80'}`}
                          onMouseEnter={() => setHoveredStat(index)}
                          onMouseLeave={() => setHoveredStat(null)}
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2 mt-4">
                {mockUsageStats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${stat.color}`}></div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {stat.value}% {hoveredStat === index && "📊"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quadrant 2: Upcoming Deadlines */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDeadlines
                  .sort((a, b) => {
                    // High priority items first, then by date
                    const priorityWeight = { high: 3, medium: 2, low: 1 }
                    const priorityDiff = priorityWeight[b.priority as keyof typeof priorityWeight] - priorityWeight[a.priority as keyof typeof priorityWeight]
                    if (priorityDiff !== 0) return priorityDiff
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                  })
                  .map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative"
                      onMouseEnter={() => setHoveredDeadline(deadline.id)}
                      onMouseLeave={() => setHoveredDeadline(null)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              deadline.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                              deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {deadline.priority.toUpperCase()}
                            </span>
                            <span className="font-medium">{deadline.task}</span>
                          </div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Due: {new Date(deadline.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {hoveredDeadline === deadline.id && (
                        <div className="mt-2 pt-2 border-t text-sm text-zinc-600 dark:text-zinc-400">
                          {deadline.details}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Quadrant 3: Teams */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTeams.map((team) => (
                  <div key={team.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="p-3 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors"
                      onClick={() => toggleTeam(team.id)}
                    >
                      <div className="flex items-center gap-2">
                        {team.isLeader && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{team.name}</span>
                        <span className="text-xs text-zinc-500">({team.members.length} members)</span>
                      </div>
                      {expandedTeams.has(team.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                    {expandedTeams.has(team.id) && (
                      <div className="p-3 space-y-2">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            className="text-sm p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded transition-colors"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quadrant 4: TBD */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-zinc-400">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">This quadrant is reserved for future features</p>
                  <p className="text-sm">Stay tuned for updates!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Sidebar - Right Side */}
        <div className="w-80 shrink-0">
          <Card className="bg-white dark:bg-zinc-900 sticky top-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</label>
                <p className="text-base mt-1">{mockUserProfile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Company</label>
                <p className="text-base mt-1">{mockUserProfile.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</label>
                <p className="text-base mt-1">{mockUserProfile.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Account Type</label>
                <div className="mt-1">
                  {mockUserProfile.isPremium ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-linear-to-r from-purple-500 to-pink-500 text-white font-medium">
                      ✨ Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      Free
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
