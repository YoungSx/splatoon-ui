import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardImage,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Info, Zap, Skull, Flame } from 'lucide-react'

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 bg-[#f5f0e8] text-chaos-black">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="sticker">
            <Zap className="mr-1 h-3.5 w-3.5" />
            Component Library
          </Badge>
          <h1 className="splat-skew text-5xl font-black uppercase tracking-wider text-chaos-black drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
            Splatoon UI
          </h1>
          <p className="max-w-md text-muted-foreground font-medium">
            1:1 Replica Component Library inspired by Splatoon 3
          </p>
        </div>

        {/* Marquee Tape */}
        <Marquee speed={25} variant="tape" className="w-full max-w-4xl">
          <MarqueeItem>Splat Zones</MarqueeItem>
          <MarqueeItem>Tower Control</MarqueeItem>
          <MarqueeItem>Rainmaker</MarqueeItem>
          <MarqueeItem>Clam Blitz</MarqueeItem>
          <MarqueeItem>Turf War</MarqueeItem>
          <MarqueeItem>Salmon Run</MarqueeItem>
        </Marquee>

        <Tabs defaultValue="cards" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">Official Card Variants</TabsTrigger>
            <TabsTrigger value="preview">Other UI Components</TabsTrigger>
          </TabsList>

          {/* Cards Tab Content */}
          <TabsContent value="cards" className="mt-6 space-y-12">
            {/* Section 1: news variant */}
            <div className="space-y-4">
              <div className="border-b-2 border-dashed border-chaos-black/20 pb-2">
                <h2 className="text-2xl font-black uppercase tracking-wider text-chaos-black">
                  1. Polaroid News Card (`news` variant)
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  Matches the scrapbook Polaroid style on the official Splatoon news feed. Features ripped edges, metal staples, and tilted tape stickers.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                {/* News Card Left Tape */}
                <Card
                  variant="news"
                  hasTape={true}
                  tapeText="Beginner Basics"
                  tapeColor="yellow"
                  tapePosition="news"
                  hasStaples={true}
                >
                  <CardImage className="bg-[#603bff] p-4 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#eaff3d] fill-current">
                      {/* Splatoon Squid vector illustration */}
                      <path d="M50,10 C40,25 35,40 35,60 C35,70 40,80 50,85 C60,80 65,70 65,60 C65,40 60,25 50,10 Z M35,60 C25,65 15,55 10,70 C20,70 25,65 35,60 Z M65,60 C75,65 85,55 90,70 C80,70 75,65 65,60 Z" />
                      <circle cx="45" cy="55" r="4" fill="black" />
                      <circle cx="55" cy="55" r="4" fill="black" />
                    </svg>
                  </CardImage>
                  <CardHeader>
                    <CardTitle>Choosing Weapons</CardTitle>
                    <CardDescription>Official weapon kits guide</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Learn how to control Splat Shooters, Rollers, and Chargers to claim the ultimate turf in Splatsville battles.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="yellow">Read Guide</Button>
                  </CardFooter>
                </Card>

                {/* News Card Right Tape */}
                <Card
                  variant="news"
                  hasTape={true}
                  tapeText="Event Info"
                  tapeColor="blue"
                  tapePosition="event"
                  hasStaples={true}
                >
                  <CardImage className="bg-[#ff9750] p-4 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#603bff] fill-current">
                      {/* Splatoon Octo vector illustration */}
                      <path d="M50,15 C30,15 20,35 20,55 C20,70 30,85 50,85 C70,85 80,70 80,55 C80,35 70,15 50,15 Z" />
                      <circle cx="42" cy="45" r="6" fill="#ff9750" />
                      <circle cx="58" cy="45" r="6" fill="#ff9750" />
                      <circle cx="42" cy="45" r="3" fill="black" />
                      <circle cx="58" cy="45" r="3" fill="black" />
                    </svg>
                  </CardImage>
                  <CardHeader>
                    <CardTitle>Splatfest Battles</CardTitle>
                    <CardDescription>New theme coming next weekend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Choose your favorite team—Bread, Rice, or Pasta—and fight for victory under the festival night lights!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="blue">Join Team</Button>
                  </CardFooter>
                </Card>

                {/* News Card Danger Red Custom Bg */}
                <Card
                  variant="news"
                  hasTape={true}
                  tapeText="Danger Alert"
                  tapeColor="red"
                  tapePosition="news"
                  hasStaples={true}
                  cardBgColor="bg-[#ff505e] text-white shadow-solid border-2 border-chaos-black"
                >
                  <CardImage className="bg-[#0d0d0d] p-4 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#ff505e] fill-current">
                      {/* Salmon Run Boss illustration */}
                      <path d="M50,10 L15,80 L85,80 Z M50,30 L50,55 M50,65 L50,72" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                    </svg>
                  </CardImage>
                  <CardHeader className="border-white/20">
                    <CardTitle className="text-white">Salmon Run Max</CardTitle>
                    <CardDescription className="text-white/80">Hazard Level Max Warning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-white/95 leading-relaxed">
                      Golden Eggs demand is surging! Watch out for Coho Salmon and horror-boros in the spawning grounds.
                    </p>
                  </CardContent>
                  <CardFooter className="border-white/20">
                    <Button size="sm" variant="destructive" hasChevron={false}>Defend Ground</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Section 2: tag variant */}
            <div className="space-y-4">
              <div className="border-b-2 border-dashed border-chaos-black/20 pb-2">
                <h2 className="text-2xl font-black uppercase tracking-wider text-chaos-black">
                  2. Apparel Hanging Tag Card (`tag` variant)
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  Hanging clothing-tag style container with custom clip background paths, hanger cut-outs, tilted photo layers, and integrated scotch tape.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                {/* Yellow Tag */}
                <Card variant="tag" tagTheme="yellow" tagRotation="-2deg">
                  <CardHeader>
                    <CardTitle>Fit Check!</CardTitle>
                  </CardHeader>
                  <CardImage className="bg-[#603bff] flex items-center justify-center p-4">
                    <svg viewBox="0 0 120 120" className="w-20 h-20 text-[#eaff3d] fill-current">
                      {/* Gear Icon */}
                      <path d="M60,10 L70,25 L85,20 L85,35 L100,40 L90,52 L100,68 L85,70 L85,85 L70,80 L60,95 L50,80 L35,85 L35,70 L20,68 L30,52 L20,40 L35,35 L35,20 L50,25 Z M60,40 A15,15 0 1,0 60,70 A15,15 0 1,0 60,40 Z" />
                    </svg>
                  </CardImage>
                  <CardContent>
                    <p className="text-[15px] font-semibold leading-snug">
                      Make a splash with the latest street wear and battle gear from the Splatsville shopping district!
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center border-none mt-0">
                    <Button variant="blue" size="sm">Equip Now</Button>
                  </CardFooter>
                </Card>

                {/* Blue Tag */}
                <Card variant="tag" tagTheme="blue" tagRotation="3deg">
                  <CardHeader>
                    <CardTitle>Turf War</CardTitle>
                  </CardHeader>
                  <CardImage className="bg-[#eaff3d] flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#603bff] fill-current">
                      {/* Ink splat path */}
                      <path d="M30,20 C10,35 15,60 30,70 C40,75 70,90 80,70 C90,50 65,45 60,30 C55,10 40,10 30,20 Z M25,45 A6,6 0 1,0 25,57 A6,6 0 1,0 25,45 Z" />
                    </svg>
                  </CardImage>
                  <CardContent>
                    <p className="text-[15px] font-semibold leading-snug opacity-90">
                      Join standard turf battles to paint the desert grounds and defend your team colors online.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center border-none mt-0">
                    <Button variant="yellow" size="sm">Ink Up</Button>
                  </CardFooter>
                </Card>

                {/* Purple Tag */}
                <Card variant="tag" tagTheme="purple" tagRotation="-1deg">
                  <CardHeader>
                    <CardTitle>Plaza Tour</CardTitle>
                  </CardHeader>
                  <CardImage className="bg-[#6af7ce] flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#af50ff] fill-current">
                      {/* Splatsville tower silhouette */}
                      <path d="M50,10 L55,25 L45,25 Z M42,25 L58,25 L55,75 L45,75 Z M35,75 L65,75 L60,95 L40,95 Z" />
                    </svg>
                  </CardImage>
                  <CardContent>
                    <p className="text-[15px] font-semibold leading-snug opacity-90">
                      Unlock the expansion pass and travel back to the nostalgic Inkopolis Plaza!
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center border-none mt-0">
                    <Button variant="green" size="sm">Travel</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other UI Components Tab Content */}
          <TabsContent value="preview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Button</CardTitle>
                  <CardDescription>Tape, solid shadow, color inversion, rotate on hover</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="yellow">Yellow (Primary)</Button>
                  <Button variant="blue">Blue</Button>
                  <Button variant="green">Green</Button>
                  <Button variant="orange">Orange</Button>
                  <Button variant="purple">Purple</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badge</CardTitle>
                  <CardDescription>Sticker aesthetic, bold borders</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="sticker">Sticker</Badge>
                </CardContent>
              </Card>

              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>Bold borders, uppercase placeholder</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Input placeholder="Enter text..." />
                  <Input type="email" placeholder="Email address" disabled />
                </CardContent>
              </Card>

              {/* Alert */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Alert</CardTitle>
                  <CardDescription>Bold border, solid shadow, skewed title</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Notice</AlertTitle>
                    <AlertDescription>
                      This is a default alert with solid border and shadow.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <Skull className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      This is a destructive alert for critical messages.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <Flame className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This is a warning alert using the primary brand color.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Warning Marquee */}
        <Marquee speed={20} variant="warning" direction="right" className="w-full max-w-4xl">
          <MarqueeItem>Woomy!</MarqueeItem>
          <MarqueeItem>Ngyes!</MarqueeItem>
          <MarqueeItem>Booyah!</MarqueeItem>
          <MarqueeItem>Stay Fresh!</MarqueeItem>
          <MarqueeItem>Splashdown!</MarqueeItem>
        </Marquee>

        <Card className="max-w-md w-full">
          <CardFooter className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
            <span>splatoon-ui v0.1.0</span>
            <span>Next.js + Radix + Tailwind CSS</span>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
