"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Ship, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PredictionData {
  Pclass: number
  Sex: number
  Age: number
  SibSp: number
  Parch: number
  Fare: number
  Embarked: number
}

interface PredictionResult {
  prediction: number
  probability?: number
}

export default function TitanicPredictor() {
  const [formData, setFormData] = useState<PredictionData>({
    Pclass: 3,
    Sex: 0,
    Age: 30,
    SibSp: 0,
    Parch: 0,
    Fare: 50.0,
    Embarked: 2,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState<string>("")

  const handleInputChange = (field: keyof PredictionData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // MOCK/FAKE API RESPONSE FOR TESTING - Remove this when using real API
      const isMockMode = false // Set to false when using real API

      if (isMockMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock prediction logic based on historical patterns
        let prediction = 0
        let probability = 0.5

        // Simple mock logic: First class females and children have higher survival rates
        if (formData.Sex === 0) {
          // Female
          prediction = 1
          probability = formData.Pclass === 1 ? 0.95 : formData.Pclass === 2 ? 0.85 : 0.75
        } else {
          // Male
          if (formData.Pclass === 1 && formData.Age < 16) {
            prediction = 1
            probability = 0.85
          } else if (formData.Pclass === 1) {
            prediction = Math.random() > 0.6 ? 1 : 0
            probability = 0.65
          } else {
            prediction = 0
            probability = formData.Pclass === 2 ? 0.25 : 0.15
          }
        }

        setResult({ prediction, probability })
      } else {
        // REAL API CALL - Uncomment and update endpoint when ready
        const response = await fetch("https://titanic-fastapi-1-7sk4.onrender.com/Passenger", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to get prediction")
        }

        const data = await response.json()
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getSurvivalText = (prediction: number) => {
    return prediction === 1 ? "Would Survive" : "Would Not Survive"
  }

  const getSurvivalColor = (prediction: number) => {
    return prediction === 1 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ship className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Titanic Survival Predictor</h1>
          </div>
          <p className="text-gray-600">Enter passenger details to predict survival probability on the Titanic</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Passenger Information</CardTitle>
            <CardDescription>Fill in the details below to get a survival prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <Label htmlFor="name">Passenger Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter passenger name"
                className="text-lg"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pclass">Passenger Class</Label>
                  <Select
                    value={formData.Pclass.toString()}
                    onValueChange={(value) => handleInputChange("Pclass", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Class</SelectItem>
                      <SelectItem value="2">2nd Class</SelectItem>
                      <SelectItem value="3">3rd Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={formData.Sex.toString()}
                    onValueChange={(value) => handleInputChange("Sex", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Female</SelectItem>
                      <SelectItem value="1">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.Age}
                    onChange={(e) => handleInputChange("Age", e.target.value)}
                    placeholder="e.g., 22.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fare">Fare (£)</Label>
                  <Input
                    id="fare"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.Fare}
                    onChange={(e) => handleInputChange("Fare", e.target.value)}
                    placeholder="e.g., 50.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sibsp">Siblings/Spouses Aboard</Label>
                  <Input
                    id="sibsp"
                    type="number"
                    min="0"
                    value={formData.SibSp}
                    onChange={(e) => handleInputChange("SibSp", e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parch">Parents/Children Aboard</Label>
                  <Input
                    id="parch"
                    type="number"
                    min="0"
                    value={formData.Parch}
                    onChange={(e) => handleInputChange("Parch", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="embarked">Port of Embarkation</Label>
                <Select
                  value={formData.Embarked.toString()}
                  onValueChange={(value) => handleInputChange("Embarked", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Cherbourg</SelectItem>
                    <SelectItem value="1">Queenstown</SelectItem>
                    <SelectItem value="2">Southampton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Predict Survival"
                )}
              </Button>
            </form>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">
                      {name ? `${name}'s Prediction: ` : "Prediction: "}
                      <span className={getSurvivalColor(result.prediction)}>{getSurvivalText(result.prediction)}</span>
                    </div>
                    {result.probability && (
                      <div className="text-sm text-gray-600">Confidence: {(result.probability * 100).toFixed(1)}%</div>
                    )}
                    {name && (
                      <div className="text-sm text-gray-500 italic">
                        Based on {name}'s passenger profile and historical Titanic data
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This prediction is based on historical Titanic passenger data and machine learning algorithms.</p>
        </div>
      </div>
    </div>
  )
}
