"use client"

import { useState, useEffect, Suspense } from "react"
import type { MedicineLog } from "../page"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, Clock, FileText, AlertCircle } from "lucide-react"

function ViewLogsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const medicineName = searchParams.get("medicine")
  const dosage = searchParams.get("dosage")

  const [logs, setLogs] = useState<MedicineLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<MedicineLog[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLogs = localStorage.getItem("logs")
      const parsedLogs = savedLogs ? JSON.parse(savedLogs) : []
      setLogs(parsedLogs)
    }
  }, [])

  useEffect(() => {
    // Filter logs to only show the selected medicine
    if (medicineName) {
      const filtered = logs.filter((log) => log.medicineName === medicineName)
      setFilteredLogs(filtered)
    }
  }, [logs, medicineName])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Medication Logs</h1>
            {medicineName && dosage && (
              <p className="text-sm text-gray-500">
                {medicineName} - {dosage}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {filteredLogs.length > 0 ? (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center">
              <FileText className="h-5 w-5 text-slate-600 mr-2" />
              <h2 className="font-medium">History</h2>
            </div>

            <div className="divide-y">
              {filteredLogs.map((log, index) => (
                <div key={index} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                    <div className="flex items-center text-slate-700">
                      <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                      <span className="font-medium">{formatDate(log.date)}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Clock className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{formatTime(log.time)}</span>
                    </div>
                  </div>

                  {log.symptoms && (
                    <div className="mt-2 bg-slate-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-slate-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Symptoms/Notes:</p>
                          <p className="text-sm text-slate-700">{log.symptoms}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-dashed p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-slate-100 p-3 mb-3">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No logs found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {medicineName
                  ? `You haven't tracked ${medicineName} yet.`
                  : "No medication selected or no logs available."}
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ViewLogs() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center">
            <div className="animate-pulse h-8 w-8 bg-blue-600 rounded-full mb-4"></div>
            <p className="text-slate-600">Loading medication logs...</p>
          </div>
        </div>
      }
    >
      <ViewLogsContent />
    </Suspense>
  )
}

