"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cloud, CloudRain, Sun, CloudLightning, Wind, Quote } from "lucide-react";
import Image from "next/image";

interface UserGreetingProps {
    user: {
        name: string | null;
        image: string | null;
    };
}

const BIBLE_VERSES = [
    { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
    { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
    { text: "O amor é paciente, o amor é bondoso.", ref: "1 Coríntios 13:4" },
    { text: "Seja forte e corajoso! Não se apavore nem desanime.", ref: "Josué 1:9" },
    { text: "O Senhor te abençoe e te guarde.", ref: "Números 6:24" },
    { text: "Deem graças ao Senhor, porque ele é bom.", ref: "Salmos 107:1" },
    { text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", ref: "Salmos 119:105" },
];

export function UserGreeting({ user }: UserGreetingProps) {
    const [greeting, setGreeting] = useState("");
    const [weather, setWeather] = useState<{ temp: number; icon: any; description: string } | null>(null);
    const [verse, setVerse] = useState({ text: "", ref: "" });
    const firstName = user.name?.split(" ")[0] || "Usuário";
    const now = new Date();

    useEffect(() => {
        // 1. Set Greeting
        const hour = now.getHours();
        if (hour < 12) setGreeting("Bom dia");
        else if (hour < 18) setGreeting("Boa tarde");
        else setGreeting("Boa noite");

        // 2. Set Random Verse
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
        setVerse(BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length]);

        // 3. Get Weather
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                    );
                    const data = await res.json();
                    const { temperature, weathercode } = data.current_weather;

                    let icon = Sun;
                    let description = "Céu Limpo";

                    if (weathercode >= 1 && weathercode <= 3) {
                        icon = Cloud;
                        description = "Parcialmente Nublado";
                    } else if (weathercode >= 45 && weathercode <= 48) {
                        icon = Wind;
                        description = "Nevoeiro";
                    } else if (weathercode >= 51 && weathercode <= 67) {
                        icon = CloudRain;
                        description = "Chuva";
                    } else if (weathercode >= 95) {
                        icon = CloudLightning;
                        description = "Trovoada";
                    }

                    setWeather({ temp: Math.round(temperature), icon, description });
                } catch (err) {
                    console.error("Failed to fetch weather", err);
                }
            });
        }
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between pb-4 border-b">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {greeting}, {firstName} 👋
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase font-medium">
                        <span>{format(now, "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
                        {weather && (
                            <>
                                <span className="text-muted-foreground/30">|</span>
                                <div className="flex items-center gap-1.5 text-primary">
                                    <weather.icon className="size-4" />
                                    <span>{weather.temp}°C</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {user.image && (
                    <div className="relative group">
                        {/* Google Animation Ring */}
                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>

                        <div className="relative size-14 overflow-hidden rounded-full border-2 border-background shadow-xl">
                            <Image
                                src={user.image}
                                alt={user.name || "Perfil"}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Google "G" Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-gray-100">
                            <svg width="12" height="12" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </header>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 border border-primary/10 shadow-sm animate-in zoom-in-95 duration-500">
                <Quote className="absolute -top-2 -left-2 size-12 text-primary/10 -rotate-12" />
                <div className="relative space-y-2">
                    <p className="text-sm font-medium italic leading-relaxed text-foreground/80">
                        "{verse.text}"
                    </p>
                    <p className="text-xs font-bold text-primary text-right uppercase tracking-widest">
                        — {verse.ref}
                    </p>
                </div>
            </div>
        </div>
    );
}
