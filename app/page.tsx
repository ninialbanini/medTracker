"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { PlusCircle, Clock, FileText, BarChart3, X, Calendar, AlarmClock, FileEdit } from "lucide-react"
import '../app/globals.css'


type Medicine = {
  name: string
  dosage: string
}

export type MedicineLog = {
  medicineName: string
  date: string
  time: string
  symptoms: string
}

export default function Home() {
  const router = useRouter()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [logs, setLogs] = useState<MedicineLog[]>([])
  const [medicineName, setMedicineName] = useState("")
  const [dosage, setDosage] = useState("")
  const [trackInfo, setTrackInfo] = useState({ date: "", time: "", symptoms: "" })
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null)
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)

  useEffect(() => {
    const savedMedicines = localStorage.getItem("medicines")
    if (savedMedicines) {
      setMedicines(JSON.parse(savedMedicines))
    }

    const savedLogs = localStorage.getItem("logs")
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines))
  }, [medicines])

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs))
  }, [logs])

  const handleAddMedicine = () => {
    if (medicineName && dosage) {
      const newMedicines = [...medicines, { name: medicineName, dosage }]
      setMedicines(newMedicines)
      setMedicineName("")
      setDosage("")
    }
  }

  const handleTrackMedicine = (index: number) => {
    setTrackingIndex(index)
    setTrackInfo({ date: getCurrentDate(), time: getCurrentTime(), symptoms: "" })
    setIsTrackingDialogOpen(true)
  }

  const handleSaveTrack = () => {
    if (trackingIndex !== null) {
      const medicine = medicines[trackingIndex]
      setLogs([...logs, { medicineName: medicine.name, ...trackInfo }])
      setTrackingIndex(null)
      setTrackInfo({ date: "", time: "", symptoms: "" })
      setIsTrackingDialogOpen(false)
    }
  }

  const handleCancelTrack = () => {
    setTrackingIndex(null)
    setTrackInfo({ date: "", time: "", symptoms: "" })
    setIsTrackingDialogOpen(false)
  }

  const handleViewLogs = (index: number) => {
    const medicine = medicines[index]
    router.push(`/view-logs?medicine=${medicine.name}&dosage=${medicine.dosage}`)
  }

  const handleViewInsights = (index: number) => {
    const medicine = medicines[index]
    router.push(`/insights?medicine=${medicine.name}&dosage=${medicine.dosage}`)
  }

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const getRecentLogs = (medicineName: string, limit = 1) => {
    return logs
      .filter((log) => log.medicineName === medicineName)
      .sort((a, b) => new Date(b.date + "T" + b.time).getTime() - new Date(a.date + "T" + a.time).getTime())
      .slice(0, limit)
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-800">Medication Tracker</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Add Medication Card */}
        <div className="bg-white rounded-lg border shadow-sm mb-8">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Add New Medication</h2>
            <p className="text-sm text-gray-500">Enter the details of your medication</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="medicine-name" className="block text-sm font-medium">
                Medicine Name
              </label>
              <input
                id="medicine-name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medicine name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
              />
            </div>
            <div className="space-y-2 mt-4">
              <label htmlFor="dosage" className="block text-sm font-medium">
                Dosage
              </label>
              <input
                id="dosage"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10mg, 1 pill, etc."
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleAddMedicine}
              disabled={!medicineName || !dosage}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${
                !medicineName || !dosage ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medication
            </button>
          </div>
        </div>

        {/* Medications List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-slate-600" />
            Your Medications
          </h2>

          {medicines.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {medicines.map((med, index) => {
                const recentLog = getRecentLogs(med.name)[0]

                return (
                  <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{med.name}</h3>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {med.dosage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3">
                      {recentLog && (
                        <div className="text-sm text-gray-500 mb-3">
                          <p className="font-medium text-slate-700">Last taken:</p>
                          <p>{formatDateTime(recentLog.date, recentLog.time)}</p>
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 border-t flex justify-between">
                      <button
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        onClick={() => handleTrackMedicine(index)}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Track
                      </button>
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleViewLogs(index)}
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          Logs
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleViewInsights(index)}
                        >
                          <BarChart3 className="mr-1 h-4 w-4" />
                          Insights
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed rounded-lg">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-slate-100 p-3 mb-3">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No medications added yet</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Add your first medication using the form above to start tracking
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Dialog */}
        {isTrackingDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {trackingIndex !== null ? `Track ${medicines[trackingIndex]?.name}` : "Track Medication"}
                </h2>
                <button onClick={() => setIsTrackingDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500">Record when you took this medication and any symptoms</p>

                <div className="space-y-2">
                  <label htmlFor="track-date" className="flex items-center text-sm font-medium">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date
                  </label>
                  <input
                    id="track-date"
                    type="date"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trackInfo.date}
                    onChange={(e) => setTrackInfo({ ...trackInfo, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="track-time" className="flex items-center text-sm font-medium">
                    <AlarmClock className="mr-2 h-4 w-4" />
                    Time
                  </label>
                  <input
                    id="track-time"
                    type="time"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={trackInfo.time}
                    onChange={(e) => setTrackInfo({ ...trackInfo, time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="track-symptoms" className="flex items-center text-sm font-medium">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Symptoms or Notes
                  </label>
                  <textarea
                    id="track-symptoms"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How are you feeling? Any side effects?"
                    value={trackInfo.symptoms}
                    onChange={(e) => setTrackInfo({ ...trackInfo, symptoms: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-4 border-t flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  onClick={handleCancelTrack}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 sm:w-auto w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTrack}
                  disabled={!trackInfo.date || !trackInfo.time}
                  className={`px-4 py-2 rounded-md text-white sm:w-auto w-full ${
                    !trackInfo.date || !trackInfo.time
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Save Record
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

