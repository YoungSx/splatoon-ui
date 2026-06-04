"use client"

import * as React from 'react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Zap, Skull, Flame, Sun, Moon } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'
import { CharacterShowcase } from '@/components/ui/character-showcase'
import { InteractiveSplatter } from '@/components/ui/splats'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'

const THEME_STORAGE_KEY = 'splat-theme'

export default function Home() {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  const toggleTheme = React.useCallback(() => {
    const root = window.document.documentElement
    const nextTheme = root.classList.contains('dark') ? 'light' : 'dark'
    root.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0d0d] text-chaos-black dark:text-white overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* 🦑 Navigation Header Bar */}
      <Navigation />

      {/* ────────────────────────────────────────────────────────
         FIXED FLOAT: SPLATOON THEMED THEME TOGGLER
         ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleTheme}
          variant="yellow"
          size="icon-lg"
          hasChevron={false}
          className="rounded-full border-[3px] border-chaos-black shadow-solid-lg hover:scale-[1.1] active:scale-[0.95] dark:border-white [--bg-color:var(--ink-blue)] [--text-color:#eaff3d] [--hover-bg-color:var(--neon-yellow)] [--hover-text-color:var(--ink-blue)] dark:[--bg-color:var(--neon-yellow)] dark:[--text-color:var(--chaos-black)] dark:[--hover-bg-color:var(--ink-blue)] dark:[--hover-text-color:#ffffff]"
          title="Toggle Ink Battle Theme"
        >
          <span className="flex flex-col items-center justify-center dark:hidden">
            <Moon className="h-5 w-5 text-[#eaff3d]" />
            <span className="mt-0.5 text-[9px] font-black leading-none">DARK</span>
          </span>
          <span className="hidden flex-col items-center justify-center dark:flex">
            <Sun className="h-5 w-5 animate-spin-slow text-chaos-black" />
            <span className="mt-0.5 text-[9px] font-black leading-none">LIGHT</span>
          </span>
        </Button>
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 1: HERO HEADER (Self-Adapting Theme - bg-white/bg-[#0d0d0d])
         ──────────────────────────────────────────────────────── */}
      <header className="relative flex flex-col items-center justify-center pt-28 md:pt-36 pb-12 px-6 bg-white dark:bg-[#0d0d0d] text-chaos-black dark:text-white gap-6 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3 text-center z-10">
          <Badge variant="sticker">
            <Zap className="mr-1 h-3.5 w-3.5 text-[#eaff3d]" />
            Component Library
          </Badge>
          <h1 className="splat-skew text-5xl md:text-6xl font-black uppercase tracking-wider text-chaos-black dark:text-[#eaff3d] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)] dark:drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
            Splatoon UI
          </h1>
          <p className="max-w-md text-chaos-black/70 dark:text-white/70 font-medium text-sm md:text-base">
            1:1 Replica Component Library inspired by Splatoon 3
          </p>
        </div>

        {/* Marquee Tape (Neon Yellow Warning Tape) */}
        <Marquee speed={25} variant="tape" className="w-full max-w-4xl z-10 shadow-solid-sm">
          <MarqueeItem>Splat Zones</MarqueeItem>
          <MarqueeItem>Tower Control</MarqueeItem>
          <MarqueeItem>Rainmaker</MarqueeItem>
          <MarqueeItem>Clam Blitz</MarqueeItem>
          <MarqueeItem>Turf War</MarqueeItem>
          <MarqueeItem>Salmon Run</MarqueeItem>
        </Marquee>
      </header>

      {/* Slanted Transition Divider 1: Header to News Feed */}
      <div className="w-full h-12 relative z-10 -mt-1 bg-white dark:bg-[#0d0d0d]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full text-[#f5f0e8] dark:text-[#151515] fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,60 L1440,0 L1440,60 Z" />
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 2: NEWS FEED (Adapting Theme - bg-[#f5f0e8]/bg-[#111111])
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f0e8] dark:bg-[#151515] text-chaos-black dark:text-white py-12 px-6 flex flex-col items-center relative z-10 transition-colors duration-300">
        <InteractiveSplatter />
        <div className="w-full max-w-4xl space-y-8 relative z-10">
          {/* Section Header */}
          <div className="border-b-2 border-dashed border-chaos-black/20 dark:border-white/10 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-wider text-chaos-black dark:text-white">
              1. Polaroid News Card (`news` variant)
            </h2>
            <p className="text-sm font-medium text-chaos-black/60 dark:text-white/60 mt-1">
              Matches the scrapbook Polaroid style on the official Splatoon news feed. Features ripped edges, metal staples, and tilted brand stickers.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 pt-6">
            {/* News Card 1: Default Sticker */}
            <Card
              variant="news"
              hasTape={true}
              tapeText="8W-157" // Official default brand marking
              tapeColor="yellow"
              tapePosition="news"
              hasStaples={true}
            >
              <CardImage className="bg-[#603bff] p-4 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#eaff3d] fill-current">
                  <path d="M50,10 C40,25 35,40 35,60 C35,70 40,80 50,85 C60,80 65,70 65,60 C65,40 60,25 50,10 Z M35,60 C25,65 15,55 10,70 C20,70 25,65 35,60 Z M65,60 C75,65 85,55 90,70 C80,70 75,65 65,60 Z" />
                  <circle cx="45" cy="55" r="4" fill="black" />
                  <circle cx="55" cy="55" r="4" fill="black" />
                </svg>
              </CardImage>
              <div className="flex h-full flex-col items-center justify-center py-4 text-center">
                <p className="max-w-[18ch] text-balance text-[1.25rem] font-medium leading-[1.6]">
                  Beginner Basics for Splatoon 3: Choosing the right weapons
                </p>
                <Button size="sm" variant="arrow" className="mt-2">
                  Read
                </Button>
              </div>
            </Card>

            {/* News Card 2: Custom Text Sticker (Blue) */}
            <Card
              variant="news"
              hasTape={true}
              tapeText="EVENT INFO"
              tapeColor="blue"
              tapePosition="event"
              hasStaples={true}
            >
              <CardImage className="bg-[#ff9750] p-4 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#603bff] fill-current">
                  <path d="M50,15 C30,15 20,35 20,55 C20,70 30,85 50,85 C70,85 80,70 80,55 C80,35 70,15 50,15 Z" />
                  <circle cx="42" cy="45" r="6" fill="#ff9750" />
                  <circle cx="58" cy="45" r="6" fill="#ff9750" />
                  <circle cx="42" cy="45" r="3" fill="black" />
                  <circle cx="58" cy="45" r="3" fill="black" />
                </svg>
              </CardImage>
              <div className="flex h-full flex-col items-center justify-center py-4 text-center">
                <p className="max-w-[18ch] text-balance text-[1.25rem] font-medium leading-[1.6]">
                  Beginner Basics for Splatoon 3: Choosing the right gear
                </p>
                <Button size="sm" variant="arrow" className="mt-2">
                  Read
                </Button>
              </div>
            </Card>

            {/* News Card 3: Custom Danger Alert (Red Custom Bg) */}
            <Card
              variant="news"
              hasTape={true}
              tapeText="DANGER ALERT"
              tapeColor="red"
              tapePosition="news"
              hasStaples={true}
              surface="danger"
            >
              <CardImage className="bg-[#0d0d0d] p-4 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#ff505e] fill-current">
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
                <Button size="sm" variant="arrow" className="text-white hover:text-[#eaff3d]">
                  Read
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Slanted Transition Divider 2A: News Feed to Character Showcase Section */}
      <div className="w-full h-12 relative z-10 -mt-1 bg-[#f5f0e8] dark:bg-[#151515]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full text-[#ead6b8] dark:text-[#1e1b15] fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 2.5: 3D CHARACTER PARALLAX SHOWCASE (bg-[#ead6b8] / bg-[#1e1b15])
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#ead6b8] dark:bg-[#1e1b15] text-chaos-black dark:text-white py-16 px-6 flex flex-col items-center relative z-10 transition-colors duration-300">
        <div className="w-full max-w-4xl space-y-12">
          {/* Section Header */}
          <div className="border-b-2 border-dashed border-chaos-black/20 dark:border-white/10 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-wider text-chaos-black dark:text-white">
              1.5 3D Character Parallax Showcase
            </h2>
            <p className="text-sm font-medium text-chaos-black/60 dark:text-white/60 mt-1">
              Interactive 3D layer perspective card using framer-motion springs. Hover or move your cursor to interact.
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid gap-12 md:grid-cols-2 items-center">
            
            {/* Left Column: 3D Parallax Showcase Card */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-[340px] aspect-[3/4] relative">
                <CharacterShowcase
                  reducedMotion={reducedMotion}
                  boardClassName="bg-none bg-[#f5f0e8] dark:bg-[#151515] border-[3px] border-chaos-black dark:border-white shadow-solid-lg rounded-2xl"
                />
              </div>
            </div>

            {/* Right Column: Beautiful Typography Description */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="sticker">
                  <Zap className="mr-1 h-3.5 w-3.5 text-[#eaff3d]" />
                  Premium Feature
                </Badge>
                <h3 className="text-2xl font-black uppercase tracking-wide text-chaos-black dark:text-[#eaff3d]">
                  Tactile 3D Depth Mechanics
                </h3>
                <p className="text-sm font-medium text-chaos-black/75 dark:text-white/75 leading-relaxed">
                  This showcase is built to feel responsive and alive, matching Splatoon's signature tactile visual style. By mapping mouse coordinates to 3D rotational values and projecting layers at varying visual depths (Z-index), we achieve a high-fidelity parallax effect.
                </p>
              </div>

              {/* Component Spec Table / Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f5f0e8] dark:bg-[#151515]/60 p-3 border-[2px] border-chaos-black dark:border-white/20 rounded-lg">
                  <span className="text-[10px] font-black uppercase tracking-wider text-chaos-black/50 dark:text-white/50">Stiffness</span>
                  <p className="font-heading text-lg font-black text-[#603bff] dark:text-[#eaff3d]">180</p>
                </div>
                <div className="bg-[#f5f0e8] dark:bg-[#151515]/60 p-3 border-[2px] border-chaos-black dark:border-white/20 rounded-lg">
                  <span className="text-[10px] font-black uppercase tracking-wider text-chaos-black/50 dark:text-white/50">Damping</span>
                  <p className="font-heading text-lg font-black text-[#603bff] dark:text-[#eaff3d]">20</p>
                </div>
                <div className="bg-[#f5f0e8] dark:bg-[#151515]/60 p-3 border-[2px] border-chaos-black dark:border-white/20 rounded-lg col-span-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-chaos-black/50 dark:text-white/50">Z-Index Depth Layer Projection</span>
                  <div className="flex flex-col gap-1 mt-1 text-[11px] font-semibold text-chaos-black/80 dark:text-white/80">
                    <div className="flex justify-between border-b border-chaos-black/5 dark:border-white/5 pb-0.5">
                      <span>Foreground Inkling</span>
                      <code className="text-[#ff505e]">translateZ(35px)</code>
                    </div>
                    <div className="flex justify-between border-b border-chaos-black/5 dark:border-white/5 pb-0.5">
                      <span>Brand Ink Splatters</span>
                      <code className="text-[#6af7ce]">translateZ(10px - 15px)</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Background Skewed Text</span>
                      <code className="text-[#af50ff]">translateZ(-5px)</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reduced Motion Toggle Panel */}
              <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 p-4 border-[2px] border-chaos-black dark:border-white rounded-xl shadow-solid-sm">
                <div className="flex-1">
                  <p className="font-heading text-sm font-black uppercase text-chaos-black dark:text-white">Reduced Motion Mode</p>
                  <p className="text-xs text-chaos-black/75 dark:text-white/75 font-medium mt-0.5">Disables mouse-tracking 3D rotations for accessibility.</p>
                </div>
                <Button
                  variant={reducedMotion ? "destructive" : "yellow"}
                  size="sm"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className="min-w-[80px]"
                >
                  {reducedMotion ? "ON" : "OFF"}
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Slanted Transition Divider 2B: Character Showcase to Tags Section */}
      <div className="w-full h-12 relative z-10 -mt-1 bg-[#ead6b8] dark:bg-[#1e1b15]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full text-white dark:text-[#0d0d0d] fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,60 L1440,0 L1440,60 Z" />
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 3: APPAREL TAGS & COMPONENTS (Adapting Theme - bg-white/bg-[#0d0d0d])
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#0d0d0d] text-chaos-black dark:text-white py-16 px-6 flex flex-col items-center relative z-10 transition-colors duration-300">
        <InteractiveSplatter />
        <div className="w-full max-w-4xl space-y-16 relative z-10">
          {/* Sub-Section 1: Apparel Tags */}
          <div className="space-y-8">
            <div className="border-b-2 border-dashed border-chaos-black/10 dark:border-white/10 pb-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-chaos-black dark:text-white">
                2. Apparel Hanging Tag Card (`tag` variant)
              </h2>
              <p className="text-sm font-medium text-chaos-black/60 dark:text-white/60 mt-1">
                Hanging clothing-tag style container with custom clip background paths, hanger cut-outs, tilted photo layers, and integrated scotch tape.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 pt-6">
              {/* Yellow Tag */}
              <Card variant="tag" tagTheme="yellow" tagRotation="-2deg">
                <CardHeader>
                  <CardTitle>Fit Check!</CardTitle>
                </CardHeader>
                <CardImage className="bg-[#603bff] flex items-center justify-center p-4">
                  <svg viewBox="0 0 120 120" className="w-20 h-20 text-[#eaff3d] fill-current">
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

          {/* Sub-Section 2: Other Components Tab Showcase */}
          <div className="space-y-8">
            <div className="border-b-2 border-dashed border-chaos-black/10 dark:border-white/10 pb-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-chaos-black dark:text-white">
                3. Interactive Component Showcase
              </h2>
              <p className="text-sm font-medium text-chaos-black/60 dark:text-white/60 mt-1">
                Toggle between the official tab switcher styles below to preview other UI elements.
              </p>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              {/* TabsList rendering our high-fidelity Skewed Tab Triggers! */}
              <TabsList className="grid w-full grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
                <TabsTrigger value="preview">Buttons & Badges</TabsTrigger>
                <TabsTrigger value="forms">Form Fields & Alerts</TabsTrigger>
                <TabsTrigger value="dialogs">Graffiti Dialogs</TabsTrigger>
              </TabsList>

              {/* Content Panel 1: Buttons & Badges */}
              <TabsContent value="preview" className="outline-none">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Buttons Card (Adapting Card) */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Drip Buttons</CardTitle>
                      <CardDescription>Featuring liquid-fill math & bouncy rotational physics</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 pt-2">
                      <Button variant="yellow">Yellow</Button>
                      <Button variant="blue">Blue</Button>
                      <Button variant="green">Green</Button>
                      <Button variant="orange">Orange</Button>
                      <Button variant="purple">Purple</Button>
                      <Button variant="destructive">Alert</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </CardContent>
                  </Card>

                  {/* Badges Card */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Sticker Badges</CardTitle>
                      <CardDescription>Double-border sticker badges with custom shapes</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3 pt-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="sticker">Sticker Badge</Badge>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Panel 2: Forms & Selection */}
              <TabsContent value="forms" className="outline-none">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Form Fields & Selection Inputs */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Input & Selection</CardTitle>
                      <CardDescription>Form controls with bold borders and ink theme accents</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="demo-input">Player Nickname</Label>
                        <Input id="demo-input" placeholder="ENTER NICKNAME..." />
                      </div>

                      <div className="space-y-2">
                        <Label>Battle Mode Preference</Label>
                        <Select defaultValue="turf">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="SELECT MODE" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="turf">Turf War</SelectItem>
                            <SelectItem value="ranked">Ranked Battle</SelectItem>
                            <SelectItem value="salmon">Salmon Run</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label>Notification Settings</Label>
                        <div className="flex items-center gap-3">
                          <Checkbox id="demo-checkbox-1" defaultChecked />
                          <Label htmlFor="demo-checkbox-1" className="cursor-pointer pb-0 font-medium text-sm">
                            Receive Splatfest reminders
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox id="demo-checkbox-2" />
                          <Label htmlFor="demo-checkbox-2" className="cursor-pointer pb-0 font-medium text-sm">
                            Enable desktop sounds
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Weapon Class</Label>
                        <RadioGroup defaultValue="shooter">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem id="r1" value="shooter" />
                            <Label htmlFor="r1" className="cursor-pointer pb-0 font-medium text-sm">Shooter</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem id="r2" value="roller" />
                            <Label htmlFor="r2" className="cursor-pointer pb-0 font-medium text-sm">Roller</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem id="r3" value="charger" />
                            <Label htmlFor="r3" className="cursor-pointer pb-0 font-medium text-sm">Charger</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alert Card */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Ink Alerts</CardTitle>
                      <CardDescription>High contrast alert blocks with warning icons</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 pt-2 font-heading">
                      <Alert variant="warning">
                        <Flame className="h-4 w-4 text-chaos-black" />
                        <AlertTitle>Caution</AlertTitle>
                        <AlertDescription>
                          A new stage rotation is scheduled to begin in 5 minutes!
                        </AlertDescription>
                      </Alert>
                      <Alert variant="destructive">
                        <Skull className="h-4 w-4 text-white" />
                        <AlertTitle>Critical</AlertTitle>
                        <AlertDescription>
                          Connection to multiplayer server has been lost.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Panel 3: Overlays & Popups */}
              <TabsContent value="dialogs" className="outline-none">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Default Dialog Card */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Graffiti Dialogs</CardTitle>
                      <CardDescription>Paper-tear modal with rotation and caution sticker tape</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 pt-2">
                      <Dialog>
                        <DialogTrigger render={<Button variant="yellow">Open Yellow Dialog</Button>} />
                        <DialogContent surface="paper" hasTape={true} tapeText="ALERT!" tapeColor="yellow">
                          <DialogHeader>
                            <DialogTitle>Splatfest Incoming!</DialogTitle>
                            <DialogDescription>
                              The next Splatfest battle is starting soon. Select your team in the lobby!
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="font-bold text-chaos-black/80">Choose your side:</p>
                            <div className="flex gap-3 mt-2">
                              <Button size="sm" variant="blue">Team Water</Button>
                              <Button size="sm" variant="orange">Team Fire</Button>
                              <Button size="sm" variant="green">Team Grass</Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button size="sm" variant="ghost">Learn More</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger render={<Button variant="blue">Open Blue Dialog</Button>} />
                        <DialogContent surface="cream" hasTape={true} tapeText="EVENT INFO" tapeColor="blue" tapePosition="event">
                          <DialogHeader>
                            <DialogTitle>Big Run Event</DialogTitle>
                            <DialogDescription>
                              Salmonids are invading Wahoo World! Team up with your squad to defend the city.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="font-medium text-chaos-black/75">
                              Golden Egg quotas have been increased. High-hazard level rewards are active.
                            </p>
                          </div>
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>

                  {/* Danger Dialog & Drawers/Popovers Card */}
                  <Card
                    variant="news"
                    surface="cream"
                  >
                    <CardHeader>
                      <CardTitle>Drawers & Popovers</CardTitle>
                      <CardDescription>Side sheets, contextual menus and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 pt-2">
                      <Dialog>
                        <DialogTrigger render={<Button variant="destructive">Open Danger Dialog</Button>} />
                        <DialogContent surface="danger" hasTape={true} tapeText="DANGER!" tapeColor="red">
                          <DialogHeader>
                            <DialogTitle className="text-white">Connection Lost</DialogTitle>
                            <DialogDescription className="text-white/80">
                              You have been disconnected from the battle lobby. Please check your internet connection.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-2">
                            <p className="text-sm font-semibold text-white/90">
                              Error Code: 2318-0502. Game stats will not be recorded.
                            </p>
                          </div>
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <Sheet>
                        <SheetTrigger render={<Button variant="green">Open Right Drawer</Button>} />
                        <SheetContent side="right" className="bg-[#f5f0e8] text-chaos-black p-6 border-l-[3px] border-chaos-black">
                          <SheetHeader>
                            <SheetTitle className="text-xl font-black">LOBBY TERMINAL</SheetTitle>
                            <SheetDescription>
                              Access your match statistics, gear catalog, and online lobby features.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-white p-3 border-2 border-chaos-black">
                              <h4 className="font-bold text-sm">Last Battle Result</h4>
                              <p className="text-xs text-muted-foreground mt-1">Turf War - Wahoo World</p>
                              <p className="font-black text-[#eaff3d] bg-chaos-black px-2 py-0.5 inline-block text-xs mt-2 rounded">
                                VICTORY
                              </p>
                            </div>
                            <div className="rounded-lg bg-white p-3 border-2 border-chaos-black">
                              <h4 className="font-bold text-sm">Active Catalog</h4>
                              <p className="text-xs text-muted-foreground mt-1">Sizzle Season 2026</p>
                              <div className="w-full bg-muted h-2 mt-2 overflow-hidden border border-chaos-black">
                                <div className="bg-[#603bff] h-full" style={{ width: '45%', height: '8px' }} />
                              </div>
                            </div>
                          </div>
                          <SheetFooter>
                            <Button size="sm" variant="yellow">Refresh Data</Button>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      <Popover>
                        <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
                        <PopoverContent align="center" className="bg-white text-chaos-black border-2 border-chaos-black p-4 max-w-xs shadow-solid-sm rounded-lg">
                          <PopoverHeader>
                            <PopoverTitle className="font-black">Grizzco Industries</PopoverTitle>
                            <PopoverDescription className="text-xs">
                              Corporate sponsorship details & job requirements.
                            </PopoverDescription>
                          </PopoverHeader>
                          <div className="py-2 text-xs">
                            <p>We are currently recruiting part-time workers to collect Golden Eggs in remote ocean zones.</p>
                            <p className="font-bold text-[#ff505e] mt-1.5">No experience needed. Hazard pay included!</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Warning Marquee (Bottom Decoration) */}
      <Marquee speed={20} variant="warning" direction="right" className="w-full border-t-2 border-b-2 border-chaos-black dark:border-white/20">
        <MarqueeItem>Woomy!</MarqueeItem>
        <MarqueeItem>Ngyes!</MarqueeItem>
        <MarqueeItem>Booyah!</MarqueeItem>
        <MarqueeItem>Stay Fresh!</MarqueeItem>
        <MarqueeItem>Splashdown!</MarqueeItem>
      </Marquee>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0c0c0c] border-t border-chaos-black/10 dark:border-white/5 py-8 flex justify-center text-center transition-colors duration-300">
        <div className="max-w-md w-full flex items-center justify-between text-xs uppercase tracking-wider text-chaos-black/40 dark:text-white/40 px-4">
          <span>splatoon-ui v0.1.0</span>
          <span>Next.js + Radix + Tailwind CSS</span>
        </div>
      </footer>
    </div>
  )
}
