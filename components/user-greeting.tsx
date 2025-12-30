"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cloud, CloudRain, Sun, CloudLightning, Wind, Quote } from "lucide-react";
import Image from "next/image";

interface UserGreetingProps {
    user: {
        id: string;
        name?: string | null;
        image?: string | null;
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
    { text: "Confie no Senhor de todo o seu coração.", ref: "Provérbios 3:5" },
    { text: "O Senhor é a minha luz e a minha salvação.", ref: "Salmos 27:1" },
    { text: "Alegrem-se sempre no Senhor.", ref: "Filipenses 4:4" },
    { text: "Deus é o nosso refúgio e a nossa fortaleza.", ref: "Salmos 46:1" },
    { text: "O Senhor está perto de todos os que o invocam.", ref: "Salmos 145:18" },
    { text: "Entregue o seu caminho ao Senhor.", ref: "Salmos 37:5" },
    { text: "A paz de Deus excede todo o entendimento.", ref: "Filipenses 4:7" },
    { text: "O Senhor é bom, um refúgio em tempos de angústia.", ref: "Naum 1:7" },
    { text: "Não temas, porque eu estou contigo.", ref: "Isaías 41:10" },
    { text: "Busquem primeiro o Reino de Deus.", ref: "Mateus 6:33" },
    { text: "O Senhor é fiel em todas as suas promessas.", ref: "Salmos 145:13" },
    { text: "Venham a mim, todos os que estão cansados.", ref: "Mateus 11:28" },
    { text: "O amor de Deus é derramado em nossos corações.", ref: "Romanos 5:5" },
    { text: "Deus amou o mundo de tal maneira.", ref: "João 3:16" },
    { text: "Nada poderá nos separar do amor de Deus.", ref: "Romanos 8:39" },
    { text: "O Senhor é compassivo e misericordioso.", ref: "Salmos 103:8" },
    { text: "Grandes coisas fez o Senhor por nós.", ref: "Salmos 126:3" },
    { text: "O Senhor sustenta todos os que caem.", ref: "Salmos 145:14" },
    { text: "Provem e vejam como o Senhor é bom.", ref: "Salmos 34:8" },
    { text: "O Senhor é a minha rocha e a minha fortaleza.", ref: "Salmos 18:2" },
    { text: "Eu sou o caminho, a verdade e a vida.", ref: "João 14:6" },
    { text: "Onde estiver o seu tesouro, aí estará o seu coração.", ref: "Mateus 6:21" },
    { text: "Tudo coopera para o bem daqueles que amam a Deus.", ref: "Romanos 8:28" },
    { text: "O Senhor é o meu auxílio, não temerei.", ref: "Hebreus 13:6" },
    { text: "Bem-aventurados os puros de coração.", ref: "Mateus 5:8" },
    { text: "A fé é a certeza daquilo que esperamos.", ref: "Hebreus 11:1" },
    { text: "Ame o Senhor, o seu Deus, de todo o coração.", ref: "Deuteronômio 6:5" },
    { text: "O Senhor é justo em todos os seus caminhos.", ref: "Salmos 145:17" },
    { text: "Lancem sobre ele toda a sua ansiedade.", ref: "1 Pedro 5:7" },
    { text: "O Senhor é a minha herança e o meu cálice.", ref: "Salmos 16:5" },
    { text: "Sejam fortes no Senhor e no seu poder.", ref: "Efésios 6:10" },
    { text: "O Senhor é bom para todos.", ref: "Salmos 145:9" },
    { text: "Aquele que habita no abrigo do Altíssimo.", ref: "Salmos 91:1" },
    { text: "O Senhor é a minha força e o meu escudo.", ref: "Salmos 28:7" },
    { text: "Feliz é aquele que teme ao Senhor.", ref: "Salmos 112:1" },
    { text: "O Senhor é a minha porção para sempre.", ref: "Salmos 73:26" },
    { text: "Deus é amor.", ref: "1 João 4:8" },
    { text: "O Senhor é o meu ajudador.", ref: "Salmos 118:7" },
    { text: "Sejam sóbrios e vigiem.", ref: "1 Pedro 5:8" },
    { text: "O Senhor é rico em misericórdia.", ref: "Efésios 2:4" },
    { text: "Felizes os que promovem a paz.", ref: "Mateus 5:9" },
    { text: "O Senhor reina! Exulte a terra!", ref: "Salmos 97:1" },
    { text: "Deus não nos deu espírito de covardia.", ref: "2 Timóteo 1:7" },
    { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
    { text: "Orem continuamente.", ref: "1 Tessalonicenses 5:17" },
    { text: "O Senhor é a minha salvação.", ref: "Isaías 12:2" },
    { text: "Deus é maior do que o nosso coração.", ref: "1 João 3:20" },
    { text: "O Senhor é meu refúgio nos tempos de angústia.", ref: "Salmos 9:9" },
    { text: "Felizes os misericordiosos.", ref: "Mateus 5:7" },
    { text: "O Senhor é a minha canção.", ref: "Êxodo 15:2" },
    { text: "Deus nos escolheu antes da fundação do mundo.", ref: "Efésios 1:4" },
    { text: "O Senhor é meu ajudador, não temerei.", ref: "Salmos 118:6" },
    { text: "Sejam santos, porque eu sou santo.", ref: "1 Pedro 1:16" },
    { text: "O Senhor é a força do seu povo.", ref: "Salmos 28:8" },
    { text: "Deus é fiel.", ref: "1 Coríntios 1:9" },
    { text: "O Senhor é minha luz e salvação.", ref: "Salmos 27:1" },
    { text: "Felizes os que têm fome de justiça.", ref: "Mateus 5:6" },
    { text: "O Senhor é minha rocha.", ref: "Salmos 18:2" },
    { text: "Deus é nosso refúgio e fortaleza.", ref: "Salmos 46:1" },
    { text: "O Senhor é gracioso e compassivo.", ref: "Salmos 111:4" },
    { text: "Felizes os mansos.", ref: "Mateus 5:5" },
    { text: "O Senhor é minha esperança.", ref: "Salmos 71:5" },
    { text: "Deus é amor, e quem permanece no amor permanece em Deus.", ref: "1 João 4:16" },
    { text: "O Senhor é meu libertador.", ref: "Salmos 18:2" },
    { text: "Felizes os que choram.", ref: "Mateus 5:4" },
    { text: "O Senhor é meu protetor.", ref: "Salmos 121:5" },
    { text: "Deus é poderoso para fazer infinitamente mais.", ref: "Efésios 3:20" },
    { text: "O Senhor é meu guia.", ref: "Salmos 48:14" },
    { text: "Felizes os pobres em espírito.", ref: "Mateus 5:3" },
    { text: "O Senhor é minha alegria.", ref: "Salmos 43:4" },
    { text: "Deus é a nossa paz.", ref: "Efésios 2:14" },
    { text: "O Senhor é minha defesa.", ref: "Salmos 94:22" },
    { text: "Felizes os perseguidos por causa da justiça.", ref: "Mateus 5:10" },
    { text: "O Senhor é minha torre forte.", ref: "Provérbios 18:10" },
    { text: "Deus é o nosso amparo.", ref: "Salmos 62:8" },
    { text: "O Senhor é minha porção.", ref: "Lamentações 3:24" },
    { text: "Nele vivemos, nos movemos e existimos.", ref: "Atos 17:28" },
    { text: "O Senhor é meu consolo.", ref: "Salmos 94:19" },
    { text: "Deus é o Pai das misericórdias.", ref: "2 Coríntios 1:3" },
    { text: "O Senhor é minha confiança.", ref: "Salmos 71:5" },
    { text: "Aquele que começou boa obra a aperfeiçoará.", ref: "Filipenses 1:6" },
    { text: "O Senhor é minha glória.", ref: "Salmos 3:3" },
    { text: "Deus é o nosso sol e escudo.", ref: "Salmos 84:11" },
    { text: "O Senhor é minha vida.", ref: "Salmos 27:1" },
    { text: "Maior é aquele que está em vós.", ref: "1 João 4:4" },
    { text: "O Senhor é minha justiça.", ref: "Jeremias 23:6" },
    { text: "Deus é o nosso socorro bem presente.", ref: "Salmos 46:1" },
    { text: "O Senhor é minha santificação.", ref: "1 Coríntios 1:30" },
    { text: "Sejam perfeitos como perfeito é o Pai celestial.", ref: "Mateus 5:48" },
    { text: "O Senhor é minha redenção.", ref: "Salmos 130:7" },
    { text: "Deus é o nosso Pai.", ref: "Mateus 6:9" },
    { text: "O Senhor é minha sabedoria.", ref: "1 Coríntios 1:30" },
    { text: "Não andeis ansiosos por coisa alguma.", ref: "Filipenses 4:6" },
    { text: "O Senhor é minha paz.", ref: "Juízes 6:24" },
    { text: "Deus é o nosso Rei.", ref: "Salmos 47:7" },
    { text: "O Senhor é minha vitória.", ref: "1 Coríntios 15:57" },
    { text: "Sejam imitadores de Deus.", ref: "Efésios 5:1" },
    { text: "O Senhor é minha herança.", ref: "Salmos 16:5" },
    { text: "Deus é o nosso Criador.", ref: "Isaías 40:28" },
    { text: "O Senhor é minha esperança eterna.", ref: "Jeremias 17:13" },
    { text: "Amem-se uns aos outros.", ref: "João 13:34" },
    { text: "O Senhor é minha fonte de vida.", ref: "Salmos 36:9" },
    { text: "Deus é o nosso Salvador.", ref: "1 Timóteo 1:1" },
    { text: "O Senhor é minha fortaleza eterna.", ref: "Isaías 26:4" },
    { text: "Sejam bondosos uns para com os outros.", ref: "Efésios 4:32" },
    { text: "O Senhor é minha ajuda.", ref: "Salmos 121:2" },
    { text: "Deus é o nosso Senhor.", ref: "Salmos 8:1" },
    { text: "O Senhor é minha proteção.", ref: "Salmos 18:2" },
    { text: "Perdoem-se mutuamente.", ref: "Colossenses 3:13" },
    { text: "O Senhor é minha segurança.", ref: "Provérbios 3:26" },
    { text: "Deus é o nosso Juiz.", ref: "Salmos 50:6" },
    { text: "O Senhor é minha firmeza.", ref: "Salmos 18:2" },
    { text: "Sirvam uns aos outros em amor.", ref: "Gálatas 5:13" },
    { text: "O Senhor é minha certeza.", ref: "Hebreus 6:19" },
    { text: "Deus é o nosso Mestre.", ref: "Mateus 23:8" },
    { text: "O Senhor é minha âncora.", ref: "Hebreus 6:19" },
    { text: "Sejam compassivos.", ref: "Lucas 6:36" },
    { text: "O Senhor é minha base.", ref: "1 Coríntios 3:11" },
    { text: "Deus é o nosso Provedor.", ref: "Filipenses 4:19" },
    { text: "O Senhor é minha fundação.", ref: "Isaías 28:16" },
    { text: "Sejam humildes.", ref: "1 Pedro 5:5" },
    { text: "O Senhor é minha estabilidade.", ref: "Isaías 33:6" },
    { text: "Deus é o nosso Guardião.", ref: "Salmos 121:5" },
    { text: "O Senhor é minha constância.", ref: "Malaquias 3:6" },
    { text: "Sejam pacientes.", ref: "Tiago 5:7" },
    { text: "O Senhor é minha eternidade.", ref: "Deuteronômio 33:27" },
    { text: "Deus é o nosso Conselheiro.", ref: "Isaías 9:6" },
    { text: "O Senhor é minha verdade.", ref: "João 14:6" },
    { text: "Sejam gratos.", ref: "Colossenses 3:15" },
    { text: "O Senhor é minha fidelidade.", ref: "Lamentações 3:23" },
    { text: "Deus é o nosso Príncipe da Paz.", ref: "Isaías 9:6" },
    { text: "O Senhor é minha bondade.", ref: "Salmos 23:6" },
    { text: "Sejam generosos.", ref: "2 Coríntios 9:11" },
    { text: "O Senhor é minha misericórdia.", ref: "Salmos 103:8" },
    { text: "Deus é o nosso Pai Eterno.", ref: "Isaías 9:6" },
    { text: "O Senhor é minha graça.", ref: "2 Coríntios 12:9" },
    { text: "Sejam alegres.", ref: "Filipenses 4:4" },
    { text: "O Senhor é minha suficiência.", ref: "2 Coríntios 3:5" },
    { text: "Deus é o nosso Deus Forte.", ref: "Isaías 9:6" },
    { text: "O Senhor é minha plenitude.", ref: "Colossenses 2:10" },
    { text: "Sejam perseverantes.", ref: "Hebreus 10:36" },
    { text: "O Senhor é minha completude.", ref: "Colossenses 2:10" },
];

export function UserGreeting({ user }: UserGreetingProps) {
    const [greeting, setGreeting] = useState("");
    const [weather, setWeather] = useState<{ temp: number; icon: any; description: string } | null>(null);
    const [locationName, setLocationName] = useState("");
    const [verse, setVerse] = useState({ text: "", ref: "" });
    const firstName = user.name?.split(" ")[0] || "Usuário";
    const now = new Date();

    useEffect(() => {
        // 1. Set Greeting
        const hour = now.getHours();
        if (hour < 12) setGreeting("Bom dia");
        else if (hour < 18) setGreeting("Boa tarde");
        else setGreeting("Boa noite");

        // 2. Set Verse (random each time, but consistent per day per user)
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
        // Create a simple hash from user ID
        const userHash = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        // Use a combination of day, user hash, and hour to get different verses
        const verseIndex = (dayOfYear + userHash + hour) % BIBLE_VERSES.length;
        setVerse(BIBLE_VERSES[verseIndex]);

        // 3. Get Weather
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // 1. Weather
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                    );
                    const data = await res.json();
                    const { temperature, weathercode } = data.current_weather;

                    // 2. City Name (Reverse Geocoding)
                    try {
                        const locRes = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
                        );
                        const locData = await locRes.json();
                        if (locData.city || locData.locality) {
                            setLocationName(locData.city || locData.locality);
                        }
                    } catch (e) {
                        console.error("City fetch error", e);
                    }

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
                            {greeting}, {firstName} {locationName && <span className="text-lg font-normal text-muted-foreground">({locationName})</span>} 👋
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
                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-[1250ms] group-hover:duration-[250ms] animate-spin-slow"></div>

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
