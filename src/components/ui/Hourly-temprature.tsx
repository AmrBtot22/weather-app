import type { ForecastData } from "@/api/type";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { useTheme } from "@/context/theme-provider";

interface HourlyTemperatureProps {
  data: ForecastData;
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));

  const axisColor = isDark ? "#ffffff70" : "#1f293770"; // نص داكن للوضع الفاتح
  const lineTempColor = isDark ? "#2536eb" : "#1d4ed8"; // أزرق داكن / فاتح
  const lineFeelsColor = isDark ? "#64748b" : "#6b7280"; // رمادي

  return (
    <Card
      className={`backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl flex-1
        ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"}`}
    >
      <CardHeader>
        <CardTitle className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-semibold tracking-wide drop-shadow-sm`}>
          Today's Temperature
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(value) => `${value}°`}
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`rounded-lg border p-2 shadow-lg backdrop-blur-md ${isDark ? "bg-white/5 border-white/20" : "bg-white/80 border-gray-300"}`}>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className={`${isDark ? "text-white/70" : "text-gray-700"} text-[0.70rem] uppercase`}>
                            Temperature
                          </span>
                          <span className={`${isDark ? "text-white" : "text-gray-900"} font-bold`}>{payload[0].value}°</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={`${isDark ? "text-white/70" : "text-gray-700"} text-[0.70rem] uppercase`}>
                            Feels Like
                          </span>
                          <span className={`${isDark ? "text-white" : "text-gray-900"} font-bold`}>{payload[1].value}°</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="temp" stroke={lineTempColor} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="feels_like" stroke={lineFeelsColor} strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
