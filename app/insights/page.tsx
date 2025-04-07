"use client";

import { useState, useEffect, Suspense } from 'react';
import type { MedicineLog } from '../page';
import { useRouter, useSearchParams } from 'next/navigation';

function InsightsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicineName = searchParams.get('medicine');
  const dosage = searchParams.get('dosage');
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem('logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  }, [logs]);

  const fetchInsights = async () => {
    const notes = logs.map(log => log.symptoms).join('\n');
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicineName,
          dosage,
          notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights(['There was an error generating insights. Please try again later.']);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20">
      <main className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Insights for {medicineName} - {dosage}</h1>
        <button onClick={fetchInsights} className="bg-blue-500 text-white p-2 mb-4">Generate Insights</button>
        <ul className="list-disc">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <li key={index} className="mb-2">
                {insight}
              </li>
            ))
          ) : (
            <p>No insights available. Click the button to generate insights.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default function Insights() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InsightsContent />
    </Suspense>
  );
}