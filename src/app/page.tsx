import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Tape, Staple, InkSplat, Sticker, WavyDivider } from '@/components/ui/tape'
import { Heart, Info, MoreHorizontal, Settings, Star, Zap, Skull, Flame } from 'lucide-react'

export default function Home() {
  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen flex-col items-center gap-0 overflow-hidden bg-background">
        {/* === Background camo texture (exact from real site) === */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
          style={{
            backgroundImage: 'url(https://splatoon.nintendo.com/_images/backgrounds/camo-black-2x.png)',
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* === Background ink splatters 鈥?massive, organic === */}
        <InkSplat color="pink" size="xl" position="top-left" variant="splash-2" className="opacity-30 -rotate-12" />
        <InkSplat color="cyan" size="xl" position="top-right" variant="splash-1" className="opacity-25 rotate-6" />
        <InkSplat color="yellow" size="lg" position="bottom-left" variant="splash-4" className="opacity-20 rotate-45" />
        <InkSplat color="pink" size="lg" position="bottom-right" variant="splash-3" className="opacity-25 -rotate-30" />
        <InkSplat color="blue" size="md" position="center" variant="drip" className="opacity-15 rotate-90" />
        <InkSplat color="cyan" size="md" position="top-left" variant="splash-2" className="opacity-12 rotate-180" />
        <InkSplat color="green" size="sm" position="top-right" variant="splash-1" className="opacity-18" />
        <InkSplat color="yellow" size="sm" position="bottom-left" variant="drip" className="opacity-12" />

        {/* === Scattered sticker decorations === */}
        <Sticker emoji="猸? rotation={-15} className="top-[100px] left-[5%] text-3xl" />
        <Sticker emoji="馃" rotation={12} className="top-[180px] right-[4%] text-4xl" />
        <Sticker emoji="馃敟" rotation={-8} className="top-[380px] left-[3%] text-2xl" />
        <Sticker emoji="馃拃" rotation={20} className="top-[550px] right-[6%] text-3xl" />
        <Sticker emoji="鉁? rotation={-25} className="top-[750px] left-[8%] text-2xl" />
        <Sticker emoji="馃" rotation={5} className="top-[950px] right-[3%] text-3xl" />
        <Sticker emoji="鈿? rotation={-18} className="top-[1150px] left-[5%] text-2xl" />

        {/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?            SECTION 1: HERO 鈥?matches real site layout
            鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/}
        <section className="relative w-full z-10">
          {/* Hero background image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://splatoon.nintendo.com/_images/home/header-back.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: 0.3,
            }}
          />
          {/* Character illustrations 鈥?like real site */}
          <img
            src="https://splatoon.nintendo.com/_images/home/character-2x.webp"
            alt=""
            className="pointer-events-none absolute bottom-0 left-[5%] z-10 h-[70%] object-contain opacity-80"
          />
          <img
            src="https://splatoon.nintendo.com/_images/characters/char-4.png"
            alt=""
            className="pointer-events-none absolute bottom-[5%] right-[8%] z-10 h-[60%] object-contain opacity-70"
          />
          {/* Tape decorations on hero */}
          <img
            src="https://splatoon.nintendo.com/_images/tape-assets/tape-1.png"
            alt=""
            className="pointer-events-none absolute top-4 left-[10%] z-20 h-12 rotate-[-5deg] opacity-80"
          />
          <img
            src="https://splatoon.nintendo.com/_images/tape-assets/tape-2.png"
            alt=""
            className="pointer-events-none absolute top-8 right-[12%] z-20 h-14 rotate-[8deg] opacity-80"
          />

          {/* Hero content */}
          <div className="relative flex flex-col items-center gap-4 py-20 z-10">
            {/* Logo 鈥?like real site uses image */}
            <img
              src="https://splatoon.nintendo.com/_images/logos/splatoon3-logo.png"
              alt="Splatoon 3"
              className="h-24 w-auto drop-shadow-[3px_3px_0px_var(--chaos-black)]"
            />
            <Badge variant="sticker" className="rotate-[-3deg] z-20">
              <Zap className="mr-1 h-3 w-3" />
              Component Library
            </Badge>
            <h1 className="text-6xl font-black uppercase tracking-wider splat-skew drop-shadow-[3px_3px_0px_var(--chaos-black)]">
              Splatoon UI
            </h1>
            <p className="max-w-md text-center text-muted-foreground font-medium text-lg leading-relaxed">
              Scrapbook-inspired component library built on shadcn/ui + Radix
            </p>
            <div className="flex gap-3 mt-2">
              <Button variant="tape" size="lg" className="rotate-[-2deg]">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="rotate-[1deg]">
                View Source
              </Button>
            </div>
          </div>
        </section>

        {/* === Colored banner strip (like real site's banner-design PNGs) === */}
        <div className="relative w-full h-14 overflow-hidden -rotate-[1deg]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://splatoon.nintendo.com/_images/banners/banner-yellow-medium-up-2x.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'repeat-x',
            }}
          />
        </div>

        {/* === Marquee tape strip === */}
        <Marquee speed={25} variant="tape" className="w-full max-w-5xl my-4">
          <MarqueeItem>Splat Zones</MarqueeItem>
          <MarqueeItem>Tower Control</MarqueeItem>
          <MarqueeItem>Rainmaker</MarqueeItem>
          <MarqueeItem>Clam Blitz</MarqueeItem>
          <MarqueeItem>Turf War</MarqueeItem>
          <MarqueeItem>Salmon Run</MarqueeItem>
        </Marquee>

        {/* === Wavy divider (like real site) === */}
        <WavyDivider color="pink" height={20} className="w-full max-w-5xl" />

        {/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?            SECTION 2: COMPONENT SHOWCASE
            鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/}
        <Tabs defaultValue="preview" className="w-full max-w-5xl z-10 my-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="preview">Components</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-2">
            <div className="relative min-h-[650px]">
              {/* Button card */}
              <Card className="absolute top-0 left-[2%] w-[48%] rotate-[-1.5deg] z-10 animate-slide-up stagger-1">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-2.png" alt="" className="pointer-events-none absolute -top-3 -left-2 z-20 h-14 rotate-[-8deg]" />
                <Staple position="right" />
                <CardHeader>
                  <CardTitle>Button</CardTitle>
                  <CardDescription>Tape style, solid shadow, rotate on hover</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="tape">Tape Style</Button>
                  <Button variant="ghost">Ghost</Button>
                </CardContent>
              </Card>

              {/* Badge card */}
              <Card className="absolute top-8 right-[2%] w-[48%] rotate-[2deg] z-20 animate-slide-up stagger-2">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-3.png" alt="" className="pointer-events-none absolute -top-3 -right-2 z-20 h-16 rotate-[6deg]" />
                <Staple position="left" />
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

              {/* Input card */}
              <Card className="absolute top-[280px] left-[5%] w-[42%] rotate-[0.8deg] z-30 animate-slide-up stagger-3">
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>Bold borders, uppercase placeholder</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Input placeholder="Enter text..." />
                  <Input type="email" placeholder="Email address" disabled />
                </CardContent>
              </Card>

              {/* Switch card */}
              <Card className="absolute top-[260px] right-[4%] w-[44%] rotate-[-2.5deg] z-25 animate-slide-up stagger-4">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/sticker-9.png" alt="" className="pointer-events-none absolute -top-2 -left-3 z-20 h-8 rotate-[-12deg]" />
                <CardHeader>
                  <CardTitle>Switch & Progress</CardTitle>
                  <CardDescription>State controls</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="airplane" />
                    <Label htmlFor="airplane">Airplane Mode</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="dark-mode" defaultChecked />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Progress value={66} className="w-full" />
                </CardContent>
              </Card>

              {/* Alert card */}
              <Card className="absolute top-[500px] left-[8%] w-[84%] rotate-[0.5deg] z-35 animate-slide-up stagger-5">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-1.png" alt="" className="pointer-events-none absolute -top-3 -left-2 z-20 h-10 rotate-[-5deg]" />
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-1.png" alt="" className="pointer-events-none absolute -top-3 -right-2 z-20 h-10 rotate-[5deg] scale-x-[-1]" />
                <InkSplat color="pink" size="sm" position="bottom-right" variant="splash-1" />
                <InkSplat color="cyan" size="sm" position="bottom-left" variant="splash-2" />
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

          <TabsContent value="cards" className="mt-2">
            <div className="relative min-h-[500px]">
              <Card className="absolute top-0 left-[2%] w-[30%] rotate-[-2deg] z-10 animate-slide-up stagger-1">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-2.png" alt="" className="pointer-events-none absolute -top-3 -left-2 z-20 h-14 rotate-[-8deg]" />
                <Staple position="right" />
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Solid shadow, skewed title</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Standard card with 2px border and solid offset shadow.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">Action</Button>
                </CardFooter>
              </Card>

              <Card className="absolute top-12 left-[36%] w-[30%] rotate-[1.5deg] z-20 animate-slide-up stagger-2">
                <Staple position="left" />
                <CardHeader>
                  <CardTitle>Content Card</CardTitle>
                  <CardDescription>Flat geometric edges</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with torn paper edges using clip-path masks.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="tape">Tape It</Button>
                </CardFooter>
              </Card>

              <Card className="absolute top-4 right-[2%] w-[30%] rotate-[-1deg] z-30 animate-slide-up stagger-3">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-3.png" alt="" className="pointer-events-none absolute -bottom-3 -right-2 z-20 h-16 rotate-[-5deg]" />
                <CardHeader>
                  <CardTitle>Tape Decoration</CardTitle>
                  <CardDescription>Rotated, tape-secured card</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card styled like a piece of tape stuck on at an angle.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Peel Off</Button>
                </CardFooter>
              </Card>

              <Card className="absolute top-[280px] left-[10%] w-[80%] rotate-[-0.8deg] z-15 ink-splatter animate-slide-up stagger-4">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-1.png" alt="" className="pointer-events-none absolute -top-3 -left-2 z-20 h-10 rotate-[-5deg]" />
                <InkSplat color="pink" size="md" position="bottom-right" variant="splash-3" />
                <InkSplat color="yellow" size="sm" position="top-right" variant="splash-1" />
                <InkSplat color="cyan" size="sm" position="bottom-left" variant="drip" />
                <CardHeader>
                  <CardTitle>Ink Splatter</CardTitle>
                  <CardDescription>Layered ink overlays with tape and splat decorations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with faint ink splatter effect, tape strips, and scattered decorations.
                    The real Splatoon site layers these elements to create a physical, scrapbook feel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="mt-2">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rotate-[-1deg] animate-slide-up stagger-1">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-2.png" alt="" className="pointer-events-none absolute -top-3 -left-2 z-20 h-14 rotate-[-8deg]" />
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                  <CardDescription>Scrapbook overlay with solid shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" />}>
                      Open Dialog
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Continue?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="rotate-[1deg] animate-slide-up stagger-2">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/tape-3.png" alt="" className="pointer-events-none absolute -top-3 -right-2 z-20 h-16 rotate-[6deg]" />
                <CardHeader>
                  <CardTitle>Dropdown</CardTitle>
                  <CardDescription>Menu actions with solid border</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        Like
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              <Card className="rotate-[1.5deg] animate-slide-up stagger-3">
                <img src="https://splatoon.nintendo.com/_images/news/news-staple-left.png" alt="" className="pointer-events-none absolute top-1/2 -left-2 z-20 h-8 -translate-y-1/2" />
                <CardHeader>
                  <CardTitle>Avatar & Tooltip</CardTitle>
                  <CardDescription>User info display</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger render={<Avatar className="cursor-pointer" />}>
                      <AvatarFallback>SN</AvatarFallback>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Splatoon User</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold uppercase tracking-wider">Splatoon User</p>
                    <p className="text-xs text-muted-foreground">user@splatoon.dev</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rotate-[-1.2deg] animate-slide-up stagger-4">
                <img src="https://splatoon.nintendo.com/_images/tape-assets/sticker-8.png" alt="" className="pointer-events-none absolute -top-2 -left-4 z-20 h-6 rotate-[-12deg]" />
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                  <CardDescription>Loading state placeholder</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* === Colored banner strip === */}
        <div className="relative w-full h-14 overflow-hidden rotate-[1deg]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://splatoon.nintendo.com/_images/banners/banner-purple-medium-up-2x.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'repeat-x',
            }}
          />
        </div>

        {/* === Warning marquee === */}
        <Marquee speed={20} variant="warning" direction="right" className="w-full max-w-5xl my-4">
          <MarqueeItem>Woomy!</MarqueeItem>
          <MarqueeItem>Ngyes!</MarqueeItem>
          <MarqueeItem>Booyah!</MarqueeItem>
          <MarqueeItem>Stay Fresh!</MarqueeItem>
          <MarqueeItem>Splashdown!</MarqueeItem>
        </Marquee>

        {/* === Wavy divider === */}
        <WavyDivider color="cyan" height={20} className="w-full max-w-5xl" />

        {/* === Footer card === */}
        <Card className="max-w-md my-8 z-10 border-none bg-transparent">
          <CardFooter className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider bg-transparent border-t-0">
            <span>splatoon-ui v0.1.0</span>
            <span>Next.js + Radix + Tailwind CSS</span>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}
