import React from 'react'
import { FileText, AlertTriangle, Shield, AlertCircle, TrendingUp } from "lucide-react"

const insightsData = [
    {
      title: "Total Policies",  
      value: 42,
      icon: FileText,
      color: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      title: "Unused Policies",
      value: 8,
      subtitle: "19% of total policies",
      icon: AlertTriangle,
      color: "bg-yellow-500/10 border-yellow-500/20",
      textColor: "text-yellow-400",
    },
    {
      title: "Over-Permissive Policies",
      value: 12,
      subtitle: "29% of total policies",
      trend: "3% up from last month",
      icon: Shield,
      color: "bg-orange-500/10 border-orange-500/20",
      textColor: "text-orange-400",
    },
    {
      title: "Critical Risk",
      value: 5,
      subtitle: "Requires immediate attention",
      trend: "12% up from last month",
      icon: AlertCircle,
      color: "bg-red-500/10 border-red-500/20",
      textColor: "text-red-400",
    },
  ]
  
  const Insights = () => {
    return (
      <section
        className="min-h-fit w-full rounded-lg border-2 border-[#161A1f] text-white"
        style={{ background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)" }}
      >
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Policy Insights</h2>
          <p className="text-gray-400 text-sm mt-1">
            Overview of your security policies and risk assessment
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold">Quick Summary</h4>
                <p className="text-gray-400 text-sm mt-1">
                  {Math.round(((8 + 12) / 42) * 100)}% of your policies need attention
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-2xl font-bold text-orange-400">
                  {Math.round(((8 + 12) / 42) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Optimization needed</div>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            {insightsData.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={index}
                  className={`flex-1 min-w-[200px] max-w-[300px] h-[220px] ${item.color} border backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/20`}
                >
                  {/* Icon and Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${item.color} border`}>
                      <IconComponent className={`w-5 h-5 ${item.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-300 font-medium text-sm leading-tight break-words">
                        {item.title}
                      </h3>
                    </div>
                  </div>
  
                  {/* Value */}
                  <div className="mb-3">
                    <span className={`text-4xl font-bold ${item.textColor} block`}>{item.value}</span>
                  </div>
  
                  {/* Subtitle and Trend */}
                  <div className="space-y-2">
                    {item.subtitle && (
                      <p className="text-gray-400 text-sm leading-relaxed">{item.subtitle}</p>
                    )}
                    {item.trend && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-300 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {item.trend}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
   

      </section>
    )
  }
  

export default Insights