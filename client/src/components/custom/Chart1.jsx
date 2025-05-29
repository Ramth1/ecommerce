"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Colors } from "@/constants/colors"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { TrendingUp } from "lucide-react"

const chartData = [
  { month: "January", mouse: 186, keyboard: 80, headset:50 },
  { month: "February", mouse: 305, keyboard: 200, headset:50 },
  { month: "March", mouse: 237, keyboard: 120, headset:50 },
  { month: "April", mouse: 73, keyboard: 190, headset:50 },
  { month: "May", mouse: 209, keyboard: 130, headset:50 },
  { month: "June", mouse: 214, keyboard: 140, headset:50 },
]

const chartConfig = {
  mouse: {
    label: "Mouse",
    color: Colors.customGray,
  },
  keyboard: {
    label: "keyboard",
    color: Colors.customYellow,
  },
  headset: {
    label: "Headset",
    color: Colors.customIsabelline,
  },
} 

export function Chart1() {
  return (
    <Card className="flex-1 rounded-xl bg-muted/50 md:min-hmin">
      <CardHeader>
        <CardTitle>Bar chart - Multiple</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="mouse" fill="var(--color-mouse)" radius={4} />
          <Bar dataKey="keyboard" fill="var(--color-keyboard)" radius={4} />
          <Bar dataKey="headset" fill="var(--color-headset)" radius={4} />
        </BarChart>
      </ChartContainer>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4"/>
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6-months</div>
      </CardFooter>
    </CardContent>
    </Card>
    
  )
}
