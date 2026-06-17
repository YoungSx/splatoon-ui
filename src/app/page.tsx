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
import { TornCard, TornCardTitle, TornCardDescription } from '@/components/ui/torn-card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Zap } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'
import { NavigationDialog } from '@/components/ui/navigation-dialog'
import {
  navLinks,
  renderSplatoonLink,
  SplatoonMenuLogo,
  SplatoonMenuDecorations,
  SplatoonOverlayDecorations,
  SplatoonHeaderDrip,
  SplatoonBackgroundTransition,
} from '@/config/splatoon-navigation'
import { InteractiveSplatter, Splat3 } from '@/components/ui/splats'
import { VideoDialog, VideoDialogThumbnail, VideoDialogContent } from '@/components/ui/video-dialog'
import { FeedCarousel } from '@/components/ui/feed-carousel'
import { WeaponsGalleryCarousel } from '@/components/ui/weapons-gallery-carousel'
import { IconPaginatedCarousel } from '@/components/ui/icon-paginated-carousel'
import { MarqueeCarousel } from '@/components/ui/marquee-carousel'
import { BlackTapeContainer } from '@/components/ui/black-tape-container'
import { StapleCard } from '@/components/ui/staple-card'
import { HeadingTape } from '@/components/ui/heading-tape'
import { Section } from '@/components/ui/section'
import { TapeTitle } from '@/components/ui/tape-title'
import { PageTransition, type PageTransitionHandle } from '@/components/ui/page-transition'
import { SquidMaskTransition, type SquidMaskTransitionHandle } from '@/components/ui/squid-mask-transition'

import { CardGrid, CardGridGroup } from '@/components/ui/card-grid'
import { BannerDivider } from '@/components/ui/banner-divider'
import { InkTrailCanvas } from '@/components/ui/ink-trail'
import { Loader } from '@/components/ui/loader'
import { IconButton } from '@/components/ui/icon-button'
import { InView, InViewStagger } from '@/components/ui/in-view'
import { SectionSideNav } from '@/components/ui/section-side-nav'
import { Progress } from '@/components/ui/progress'
import { Footer } from '@/components/ui/footer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTriggerButton,
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
  SheetTriggerButton,
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
  PopoverTriggerButton,
} from '@/components/ui/popover'

const homepageFeedCarouselItems = [1, 2, 3, 4, 5, 6].map((item) => ({
  id: item,
  hoverTilt: true,
  paperLabel: {
    text: `SNAP 0${item}`,
    color: item % 2 === 0 ? "yellow" as const : "blue" as const,
    placement: item % 2 === 0 ? "left" as const : "right" as const,
  },
  mediaClassName: item % 2 === 0 ? "bg-blue" : "bg-orange",
  media: (
    <span className="font-heading text-6xl font-black text-yellow">
      {`0${item}`}
    </span>
  ),
  title: `Battle Record #${item}`,
  bodyClassName: "gap-1.5",
  action: (
    <>
      <p className="text-sm font-bold text-chaos-black/60">Splatlands Region</p>
      <Button size="sm" variant="arrow">
        Read
      </Button>
    </>
  ),
}))

// ── Page Transition Demo ────────────────────────────────────────────────────

function PageTransitionDemo() {
  const webglRef = React.useRef<PageTransitionHandle>(null)
  const squidRef = React.useRef<SquidMaskTransitionHandle>(null)
  const [variant, setVariant] = React.useState<'webgl' | 'squid'>('webgl')
  const [demoPage, setDemoPage] = React.useState<'home' | 'about' | 'weapons'>('home')
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [inkColor, setInkColor] = React.useState('var(--color-true-black)')

  const navigateTo = React.useCallback(async (target: 'home' | 'about' | 'weapons', mode: 'webgl' | 'squid', color?: string) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setVariant(mode)
    if (color) setInkColor(color)

    if (mode === 'webgl') {
      await webglRef.current?.transitionOut({ color })
      setDemoPage(target)
      webglRef.current?.transitionIn({ color })
    } else {
      await squidRef.current?.transitionOut()
      setDemoPage(target)
      squidRef.current?.transitionIn()
    }
  }, [isTransitioning])

  const pageContent: Record<string, { title: string; subtitle: string; emoji: string }> = {
    home: { title: 'INKopolis Square', subtitle: 'The heart of Splatoon 3', emoji: '\u{1F3D9}️' },
    about: { title: 'Battle Stages', subtitle: 'Where turf wars happen', emoji: '\u{1F5FA}️' },
    weapons: { title: 'Weapon Shop', subtitle: 'Fresh weapons for fresh squids', emoji: '\u{1F52B}' },
  }

  const current = pageContent[demoPage]

  return (
    <Section
      size="md"
      bgColor="bg-white"
      text="text-chaos-black"
      pattern="chip-white"
      className="transition-colors duration-300"
      headingTape={
        <HeadingTape color="green" className="text-center">
          Page Transition
        </HeadingTape>
      }
    >
      <InView direction="up" rootMargin="-50px">
        <div className="w-full max-w-5xl mx-auto space-y-6 relative z-10">
          <p className="text-center text-chaos-black/60 text-sm font-medium">
            {variant === 'webgl'
              ? 'WebGL ink splash — ported from splatoon.nintendo.com shader'
              : 'Canvas 2D rotating squid mask — ported from Nintendo JP Splatoon Base'}
          </p>

          {/* Demo box — both components stacked, only active one visible */}
          <div className="relative w-full h-[320px]">
            <PageTransition
              ref={webglRef}
              color={inkColor}
              durationIn={700}
              durationOut={1000}
              autoReveal={false}
              onRevealed={() => setIsTransitioning(false)}
              className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-dashed border-chaos-black/20 bg-white transition-all duration-300 ${
                variant === 'webgl' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <p className="text-6xl">{current.emoji}</p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider">
                    {current.title}
                  </h3>
                  <p className="text-sm text-chaos-black/50 font-medium">
                    {current.subtitle}
                  </p>
                </div>
              </div>
            </PageTransition>

            <SquidMaskTransition
              ref={squidRef}
              durationIn={700}
              durationOut={1000}
              autoReveal={false}
              onRevealed={() => setIsTransitioning(false)}
              className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-dashed border-chaos-black/20 bg-white transition-all duration-300 ${
                variant === 'squid' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <p className="text-6xl">{current.emoji}</p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider">
                    {current.title}
                  </h3>
                  <p className="text-sm text-chaos-black/50 font-medium">
                    {current.subtitle}
                  </p>
                </div>
              </div>
            </SquidMaskTransition>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="yellow"
              onClick={() => navigateTo('home', 'webgl', 'var(--color-true-black)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'home')}
            >
              Inkopolis
            </Button>
            <Button
              variant="blue"
              onClick={() => navigateTo('about', 'webgl', 'var(--color-blue)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'about')}
            >
              Stages
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigateTo('weapons', 'webgl', 'var(--color-red)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'weapons')}
            >
              Weapons
            </Button>
            <Button
              variant="green"
              onClick={() => navigateTo('home', 'squid')}
              disabled={isTransitioning || (variant === 'squid' && demoPage === 'home')}
            >
              Squid Canvas
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {variant === 'webgl' ? (
              <>
                <Badge>WebGL Shader</Badge>
                <Badge variant="blue">Simplex Noise</Badge>
                <Badge variant="green">Ink Cover/Reveal</Badge>
                <Badge variant="monochrome">Official Port</Badge>
              </>
            ) : (
              <>
                <Badge>Canvas 2D</Badge>
                <Badge variant="blue">Rotating Mask</Badge>
                <Badge variant="green">source-out</Badge>
                <Badge variant="monochrome">Nintendo JP Port</Badge>
              </>
            )}
          </div>
        </div>
      </InView>
    </Section>
  )
}

// ── Carousel Demo Data ──────────────────────────────────────────────────────

const weaponsGalleryItems = [
  { id: 'shooter', image: '/official/hero-image.png', title: 'Shooters', description: 'Reliable all-rounders with steady ink output.' },
  { id: 'roller', image: '/official/kv-image-06.png', title: 'Rollers', description: 'Paint massive areas with sweeping ink rolls.' },
  { id: 'charger', image: '/official/banner_4.png', title: 'Chargers', description: 'Long-range precision sniper weapons.' },
  { id: 'slosher', image: '/official/slider_banner_1.png', title: 'Sloshers', description: 'Arc-splash buckets that lob ink over cover.' },
  { id: 'dualies', image: '/official/slider_banner_7.png', title: 'Dualies', description: 'Dual-wield pistols with dodge-roll bursts.' },
  { id: 'splatana', image: '/official/thumnail_112.png', title: 'Splatanas', description: 'Blade weapons that slash ink projectiles.' },
]

const shopsGalleryItems = [
  { id: 'hotlantis', image: '/official/hero-image.png', title: 'Hotlantis', description: 'General store run by Harmony.', icon: '/official/nav-character-image.png', iconRotate: -14 },
  { id: 'ammo-knights', image: '/official/kv-image-06.png', title: 'Ammo Knights', description: 'Weapon shop run by Sheldon.', icon: '/official/nav-fashion-image.png', iconRotate: -38 },
  { id: 'naut-couture', image: '/official/banner_4.png', title: 'Naut Couture', description: 'Headgear shop run by Jelonzo.', icon: '/official/nav-story-image.png', iconRotate: -43 },
  { id: 'man-o-wardrobe', image: '/official/slider_banner_1.png', title: 'Man-O\'-Wardrobe', description: 'Clothing shop run by Spyke.', icon: '/official/nav-world-image.png', iconRotate: 25 },
  { id: 'crush-station', image: '/official/slider_banner_7.png', title: 'Crush Station', description: 'Shoe shop run by Crusty Sean.', icon: '/official/nav-character-image.png', iconRotate: 11 },
]

const marqueeItems = [
  { id: 1, image: '/official/hero-image.png', alt: 'Gameplay 1' },
  { id: 2, image: '/official/kv-image-06.png', alt: 'Gameplay 2' },
  { id: 3, image: '/official/banner_4.png', alt: 'Gameplay 3' },
  { id: 4, image: '/official/slider_banner_1.png', alt: 'Gameplay 4' },
  { id: 5, image: '/official/slider_banner_7.png', alt: 'Gameplay 5' },
  { id: 6, image: '/official/thumnail_112.png', alt: 'Gameplay 6' },
  { id: 7, image: '/official/thumnail_113.png', alt: 'Gameplay 7' },
  { id: 8, image: '/official/hero-image.png', alt: 'Gameplay 8' },
]

export default function Home() {
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex flex-col bg-white text-chaos-black font-sans transition-colors duration-300">

      {/* 🦑 Navigation Header Bar */}
      <Navigation headerDecoration={(isCollapsed) => <SplatoonHeaderDrip isCollapsed={isCollapsed} />}>
        <NavigationDialog
          navLinks={navLinks}
          highlightColor="var(--color-yellow)"
          cta={<Button variant="yellow" size="lg" theme="dark-yellow">Buy now</Button>}
          logo={(contentPhase) => <SplatoonMenuLogo contentPhase={contentPhase} />}
          menuDecorations={<SplatoonMenuDecorations />}
          overlayDecorations={(contentPhase) => <SplatoonOverlayDecorations contentPhase={contentPhase} />}
          renderLink={renderSplatoonLink}
          backgroundTransition={(props) => <SplatoonBackgroundTransition {...props} />}
        />
      </Navigation>

      {/* ── Section Side Nav (right-side numbered navigation) ── */}
      <SectionSideNav
        sections={[
          { id: 'trailer', number: '01' },
          { id: 'titles', number: '02' },
          { id: 'buttons-badges', number: '03' },
          { id: 'overlays', number: '04' },
          { id: 'apparel', number: '05' },
          { id: 'replicas', number: '06' },
          { id: 'carousels', number: '07' },
          { id: 'progress', number: '08' },
        ]}
        contentRef={contentRef}
      />

      {/* ────────────────────────────────────────────────────────
         HERO: Navigation + Ink Trail cursor effect
         ──────────────────────────────────────────────────────── */}
      <InkTrailCanvas colors={['var(--color-yellow)', 'var(--color-blue)', 'var(--color-red)', 'var(--color-green)', 'var(--color-orange)']}>
        <header className="relative flex flex-col items-center justify-center pt-28 md:pt-36 pb-12 px-6 bg-white text-chaos-black gap-6 transition-colors duration-300 pattern-chip-white">
          <div className="flex flex-col items-center gap-3 text-center z-10">
            <Badge variant="sticker">
              <Zap className="mr-1 h-3.5 w-3.5 text-yellow" />
              Component Library
            </Badge>
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-wider text-chaos-black drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]" style={{ transform: 'rotate(-4deg)' }}>
              Splatoon UI
            </h1>
            <p className="max-w-md text-chaos-black/70 font-medium text-sm md:text-base">
              1:1 Replica Component Library inspired by Splatoon 3
            </p>
            <a href="https://github.com/YoungSx/splatoon-ui" target="_blank" rel="noopener noreferrer">
              <Button
                variant="blue"
                leftIcon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                }
              >
                View on GitHub
              </Button>
            </a>
          </div>

          {/* Marquee Tape (Neon Yellow Warning Tape) */}
          <Marquee speed={25} variant="tape" className="z-10 w-full max-w-4xl">
            <MarqueeItem>Splat Zones</MarqueeItem>
            <MarqueeItem>Tower Control</MarqueeItem>
            <MarqueeItem>Rainmaker</MarqueeItem>
            <MarqueeItem>Clam Blitz</MarqueeItem>
            <MarqueeItem>Turf War</MarqueeItem>
            <MarqueeItem>Salmon Run</MarqueeItem>
          </Marquee>
        </header>
      </InkTrailCanvas>

      {/* Content sections container — observed by SectionSideNav for visibility */}
      <div ref={contentRef}>

      {/* ────────────────────────────────────────────────────────
         01 — Trailer
         ──────────────────────────────────────────────────────── */}
      <Section
        id="trailer"
        size="md"
        bgColor="bg-white"
        text="text-chaos-black"
        pattern="tapes-black"
        className="py-24 flex flex-col items-center transition-colors duration-300"
      >
        {/* Decorative Splats */}
        <div className="absolute top-10 left-10 text-red">
          <Splat3 className="w-32 h-32" />
        </div>
        <div className="absolute bottom-10 right-10 text-green">
          <Splat3 className="w-48 h-48" />
        </div>

        {/* Official column system: row max-width 1440px, column--8 (66.67%) / column-large--7 (58.33%) */}
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-3">
          {/* column--8 falls back to width:100% on mobile (parent is not flex), column-large--7 = 58.33% (1024px+) */}
          {/* Official introTrailerColumn: margin-top -5% at 640px+ */}
          <div className="flex flex-col items-center mx-auto sm:-mt-[5%] lg:w-[58.333%] lg:max-w-[840px]">
            <TapeTitle color="red" className="text-center lg:min-w-[400px]" id="trailer-section-title">
              Watch the trailer
            </TapeTitle>

            <div className="w-full text-center">
              <VideoDialog>
              <VideoDialogThumbnail
                src="/_images/screenshots/video-trailer.jpg"
                alt="Splatoon 3 Trailer"
                blobColor="var(--color-true-black)"
                imageClassName="sm:-top-8"
              />
              <VideoDialogContent src="//player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1&autoplay=1&muted=0" title="Splatoon 3 - Announcement Trailer" />
            </VideoDialog>
          </div>
        </div>
        </div>
      </Section>

      {/* Banner divider: Trailer → PageTransition */}
      <BannerDivider pattern="design1" color="green" animate />

      {/* ── Page Transition Demo (not in SideNav) ── */}
      <PageTransitionDemo />

      {/* Banner divider: PageTransition → Titles */}
      <BannerDivider pattern="design1" color="yellow" animate />

      {/* ────────────────────────────────────────────────────────
         02 — Tape Titles & Heading Tapes
         ──────────────────────────────────────────────────────── */}
      <Section
        id="titles"
        size="md"
        bgColor="bg-white"
        text="text-chaos-black"
        pattern="chip-white"
        className="transition-colors duration-300"
        headingTape={<HeadingTape>Tape Titles & Heading Tapes</HeadingTape>}
      >
        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          {/* TapeTitle variants */}
          <InView direction="up" rootMargin="-50px">
            <Card variant="torn" rotation="0deg" showTape={false}>
              <CardHeader>
                <CardTitle>TapeTitle</CardTitle>
                <CardDescription>Asymmetric SVG tape decoration with colored background — used above the video player on splatoon.nintendo.com</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <TapeTitle color="black">Watch the trailer</TapeTitle>
                    <span className="text-xs text-chaos-black/40 font-mono">color="black"</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <TapeTitle color="red">Watch the trailer</TapeTitle>
                    <span className="text-xs text-chaos-black/40 font-mono">color="red"</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <TapeTitle color="yellow">Watch the trailer</TapeTitle>
                    <span className="text-xs text-chaos-black/40 font-mono">color="yellow"</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </InView>

          {/* HeadingTape */}
          <InView direction="up" rootMargin="-50px">
            <Card variant="torn" rotation="0deg" showTape={false}>
              <CardHeader>
                <CardTitle>HeadingTape</CardTitle>
                <CardDescription>White background with responsive sticker decorations (sticker-8, sticker-12) — single style, used for section headings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <HeadingTape>Section Heading</HeadingTape>
                </div>
              </CardContent>
            </Card>
          </InView>

        </div>
      </Section>

      {/* ────────────────────────────────────────────────────────
         03 — Buttons & Badges
         ──────────────────────────────────────────────────────── */}
      <Section
        id="buttons-badges"
        size="lg"
        bgColor="bg-white"
        text="text-chaos-black"
        pattern="chip-white"
        className="transition-colors duration-300"
        headingTape={<HeadingTape color="blue">Buttons & Badges</HeadingTape>}
      >
        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          <InView direction="up" rootMargin="-50px">
            <div className="text-center space-y-4">
              <p className="text-chaos-black/60 text-sm font-medium max-w-xl mx-auto">
                1:1 replica of splatoon.nintendo.com circular icon button — official squish animation, ink-splatter SVG arrows, theme-driven colors.
              </p>
            </div>
          </InView>

          {/* Variants + Sizes */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Variants &amp; Sizes</h3>
              <p className="text-xs text-chaos-black/50 text-center">6 color themes · size prop overrides variant defaults</p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                {(['carousel', 'primary', 'yellow', 'accent', 'ghost', 'outline'] as const).map((v) => (
                  <div key={v} className="flex flex-col items-center gap-3">
                    <IconButton variant={v} size="lg" direction="right" animation="squish" aria-label={v} />
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-end justify-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <IconButton size="sm" direction="right" animation="squish" aria-label="Small" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">sm 40px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton size="md" direction="right" animation="squish" aria-label="Medium" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">md 48px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton size="lg" direction="right" animation="squish" aria-label="Large" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">lg 60px</span>
                </div>
              </div>
            </div>
          </InView>

          {/* Behavior: animation, disabled, custom icon */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Behavior</h3>
              <p className="text-xs text-chaos-black/50 text-center">squish · pulse · disabled · custom icon</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <IconButton size="lg" direction="right" animation="squish" aria-label="Squish" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Squish</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="primary" size="lg" direction="right" animation="pulse" aria-label="Pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Pulse</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton size="lg" direction="right" disabled aria-label="Disabled" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Disabled</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="primary" size="lg" aria-label="Play" icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  } />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Custom Icon</span>
                </div>
              </div>
            </div>
          </InView>

          {/* Drip Buttons */}
          <InView direction="up" rootMargin="-50px">
            <Card variant="torn" rotation="0deg" showTape={false}>
              <CardHeader>
                <CardTitle>Drip Buttons</CardTitle>
                <CardDescription>Featuring liquid-fill math & bouncy rotational physics</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 pt-2">
                <Button variant="yellow" theme="dark-yellow">Yellow</Button>
                <Button variant="blue" theme="light-blue">Blue</Button>
                <Button variant="green" theme="light-green">Green</Button>
                <Button variant="orange" theme="dark-purpleOrange">Orange</Button>
                <Button variant="purple" theme="dark-purple">Purple</Button>
                <Button variant="destructive" theme="light-red">Alert</Button>
                <Button variant="outline" theme="yellow">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </CardContent>
            </Card>
          </InView>

          {/* Sticker Badges */}
          <InView direction="up" rootMargin="-50px">
            <Card variant="torn" rotation="0deg" showTape={false}>
              <CardHeader>
                <CardTitle>Sticker Badges</CardTitle>
                <CardDescription>Ink-colored badges with offset shadows and skew</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 pt-2">
                <Badge>Yellow</Badge>
                <Badge variant="blue">Blue</Badge>
                <Badge variant="red">Red</Badge>
                <Badge variant="green">Green</Badge>
                <Badge variant="sticker">Sticker</Badge>
              </CardContent>
            </Card>
          </InView>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge>60px Circle</Badge>
            <Badge variant="blue">No Border</Badge>
            <Badge variant="green">Squish Animation</Badge>
            <Badge variant="monochrome">Theme Colors</Badge>
          </div>
        </div>
      </Section>

      {/* Banner divider: Buttons & Badges → Overlays */}
      <BannerDivider pattern="design1" color="purple" animate />

      {/* ────────────────────────────────────────────────────────
         04 — Overlays
         ──────────────────────────────────────────────────────── */}
      <Section
        id="overlays"
        size="lg"
        bgColor="bg-black"
        text="text-white"
        pattern="camo-black"
        headingTape={<HeadingTape color="red">Overlays & Dialogs</HeadingTape>}
      >
        <div className="absolute top-6 right-6 text-purple">
          <Splat3 className="w-24 h-24" />
        </div>
        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          <InView direction="up" rootMargin="-50px">
            <div className="text-center space-y-4">
              <p className="text-white/60 text-sm font-medium max-w-xl mx-auto">
                Modal dialogs, side drawers, contextual popovers, and the official JP feature page modal system.
              </p>
            </div>
          </InView>

          {/* Dialog demos */}
          <InView direction="up" rootMargin="-50px">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-yellow">
                  Graffiti Dialogs
                </h3>
                <p className="text-xs text-white/50">Paper-tear modal with rotation and caution sticker tape</p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTriggerButton variant="yellow" theme="dark-yellow">Yellow Dialog</DialogTriggerButton>
                    <DialogContent surface="paper" hasTape={true}>
                      <DialogHeader>
                        <DialogTitle>Splatfest Incoming!</DialogTitle>
                        <DialogDescription>The next Splatfest battle is starting soon. Select your team!</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="font-bold text-chaos-black/80">Choose your side:</p>
                        <div className="flex gap-3 mt-2">
                          <Button size="sm" variant="blue" theme="light-blue">Team Water</Button>
                          <Button size="sm" variant="orange" theme="dark-purpleOrange">Team Fire</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTriggerButton variant="blue" theme="light-blue">Blue Dialog</DialogTriggerButton>
                    <DialogContent surface="cream" hasTape={true} tapePosition="event">
                      <DialogHeader>
                        <DialogTitle>Big Run Event</DialogTitle>
                        <DialogDescription>Salmonids are invading Wahoo World! Team up to defend.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTriggerButton variant="destructive" theme="light-red">Danger Dialog</DialogTriggerButton>
                    <DialogContent surface="danger" hasTape={true}>
                      <DialogHeader>
                        <DialogTitle className="text-white">Connection Lost</DialogTitle>
                        <DialogDescription className="text-white/80">Disconnected from battle lobby.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Fullscreen Dialog */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-purple">
                  Fullscreen Dialog
                </h3>
                <p className="text-xs text-white/50">Immersive overlay for media content — use fullScreen prop</p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTriggerButton variant="purple" theme="dark-purple">Open Gallery</DialogTriggerButton>
                    <DialogContent fullScreen>
                      <div className="flex flex-col items-center justify-center gap-6 p-6">
                        <img
                          src="/images/splatoon_inkling.png"
                          alt="Splatoon Inkling"
                          className="w-full max-w-4xl rounded-lg"
                        />
                        <p className="text-white/60 text-sm">Trailer screenshot — fullscreen dialog for immersive content</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Sheet + Popover */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-green">
                  Drawers & Popovers
                </h3>
                <p className="text-xs text-white/50">Side sheets, contextual menus and alerts</p>
                <div className="flex flex-wrap gap-3">
                  <Sheet>
                    <SheetTriggerButton variant="green" theme="light-green">Right Drawer</SheetTriggerButton>
                    <SheetContent side="right" className="shadow-soft-splat-lg bg-white p-6 pt-10 text-chaos-black">
                      <SheetHeader>
                        <SheetTitle className="text-xl font-black">LOBBY TERMINAL</SheetTitle>
                        <SheetDescription>Match statistics, gear catalog, and lobby features.</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        <div className="scrap-panel-tight border-2 border-chaos-black bg-white p-3 pt-6">
                          <h4 className="font-bold text-sm">Last Battle Result</h4>
                          <p className="text-xs text-muted-foreground mt-1">Turf War - Wahoo World</p>
                          <p className="inline-block bg-chaos-black px-2 py-0.5 text-xs font-black text-yellow [transform:rotate(-2deg)]">VICTORY</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Popover>
                    <PopoverTriggerButton variant="outline" theme="yellow">Popover</PopoverTriggerButton>
                    <PopoverContent align="center" className="shadow-soft-splat-sm max-w-xs bg-white p-4 pt-6 text-chaos-black">
                      <PopoverHeader>
                        <PopoverTitle className="font-black">Grizzco Industries</PopoverTitle>
                        <PopoverDescription className="text-xs">Corporate sponsorship details.</PopoverDescription>
                      </PopoverHeader>
                      <div className="py-2 text-xs">
                        <p>Recruiting part-time workers to collect Golden Eggs.</p>
                        <p className="font-bold text-red mt-1.5">Hazard pay included!</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </InView>

        </div>
      </Section>

      {/* Banner divider: Overlays → Apparel Tags */}
      <BannerDivider
        animate
        tapes={[
          { variant: "design2", rotate: "down", offsetY: [0, 0] },
          { variant: "green", rotate: "up", offsetY: [35, 45] },
        ]}
      />

      {/* ────────────────────────────────────────────────────────
         05 — Apparel Tags & Components
         ──────────────────────────────────────────────────────── */}
      <Section
        id="apparel"
        size="md"
        bgColor="bg-white"
        text="text-chaos-black"
        pattern="camo-purple"
        className="flex flex-col items-center transition-colors duration-300"
      >
        <InteractiveSplatter />
        <div className="w-full max-w-4xl space-y-16 relative z-10">
          {/* Sub-Section 1: Apparel Tags */}
          <div className="space-y-8">
            <InView direction="up" rootMargin="-50px">
            <HeadingTape>Apparel Hanging Tag Card</HeadingTape>
            <p className="text-sm font-medium text-chaos-black/60 mt-1">
              Hanging clothing-tag style container with custom clip background paths, hanger cut-outs, tilted photo layers, and integrated scotch tape.
            </p>
            </InView>

            <InViewStagger rootMargin="-30px">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 pt-6">
              {/* Yellow Tag */}
              <Card variant="rugged" ruggedTheme="yellow" rotation="-2deg">
                <CardHeader>
                  <CardTitle>Fit Check!</CardTitle>
                </CardHeader>
                <CardImage src="/official/character-inkling.png" alt="Inkling" />
                <CardContent>
                  <p className="text-[15px] font-semibold leading-snug">
                    Make a splash with the latest street wear and battle gear from the Splatsville shopping district!
                  </p>
                </CardContent>
                <CardFooter className="justify-center border-none mt-0">
                  <Button variant="blue" size="sm" theme="light-blue">
                    Equip Now
                  </Button>
                </CardFooter>
              </Card>

              {/* Blue Tag */}
              <Card variant="rugged" ruggedTheme="blue" rotation="3deg">
                <CardHeader>
                  <CardTitle>Turf War</CardTitle>
                </CardHeader>
                <CardImage src="/official/character-octoling.png" alt="Octoling" />
                <CardContent>
                  <p className="text-[15px] font-semibold leading-snug opacity-90">
                    Join standard turf battles to paint the desert grounds and defend your team colors online.
                  </p>
                </CardContent>
                <CardFooter className="justify-center border-none mt-0">
                  <Button variant="yellow" size="sm" theme="dark-yellow">
                    Ink Up
                  </Button>
                </CardFooter>
              </Card>

              {/* Purple Tag */}
              <Card variant="rugged" ruggedTheme="purple" rotation="-1deg">
                <CardHeader>
                  <CardTitle>Plaza Tour</CardTitle>
                </CardHeader>
                <CardImage src="/official/hero-image.png" alt="Splatoon Hero" />
                <CardContent>
                  <p className="text-[15px] font-semibold leading-snug opacity-90">
                    Unlock the expansion pass and travel back to the nostalgic Inkopolis Plaza!
                  </p>
                </CardContent>
                <CardFooter className="justify-center border-none mt-0">
                  <Button variant="green" size="sm" theme="light-green">
                    Travel
                  </Button>
                </CardFooter>
              </Card>
            </div>
            </InViewStagger>
          </div>

          {/* Sub-Section 2: Animation & Feedback */}
          <div className="space-y-8">
            <HeadingTape>Animation & Feedback</HeadingTape>

            <div className="grid gap-8 md:grid-cols-2">
              {/* InView Demo Card */}
              <Card variant="torn" rotation="0deg" showTape={false} className="md:col-span-2">
                <CardHeader>
                  <CardTitle>InView Animation</CardTitle>
                  <CardDescription>Scroll-triggered animation — try scrolling down &amp; back up</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InView direction="left" rootMargin="-50px">
                      <div className="rounded-lg bg-blue p-4 text-center text-sm font-black uppercase tracking-wider text-white">Left</div>
                    </InView>
                    <InView direction="up" rootMargin="-50px" delay={1}>
                      <div className="rounded-lg bg-purple p-4 text-center text-sm font-black uppercase tracking-wider text-white">Up</div>
                    </InView>
                    <InView direction="right" rootMargin="-50px" delay={2}>
                      <div className="rounded-lg bg-red p-4 text-center text-sm font-black uppercase tracking-wider text-white">Right</div>
                    </InView>
                    <InView direction="pop" rootMargin="-50px" delay={1}>
                      <div className="rounded-lg bg-yellow p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">Pop</div>
                    </InView>
                    <InView drop rootMargin="-50px" delay={2}>
                      <div className="rounded-lg bg-green p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">Drop</div>
                    </InView>
                    <InView drop="slow" rootMargin="-50px" delay={3}>
                      <div className="rounded-lg bg-orange p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">Slow Drop</div>
                    </InView>
                  </div>
                  <InViewStagger rootMargin="-30px" className="mt-6">
                    {['Stagger 1', 'Stagger 2', 'Stagger 3', 'Stagger 4'].map((label, i) => (
                      <div key={i} className="rounded-lg bg-gradient-to-r from-blue to-purple p-3 text-center text-sm font-black uppercase tracking-wider text-white mb-2 last:mb-0">
                        {label}
                      </div>
                    ))}
                  </InViewStagger>
                </CardContent>
              </Card>

              {/* Loader Card */}
              <Card variant="torn" rotation="0deg" showTape={false} className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Loader</CardTitle>
                  <CardDescription>CSS border spinner — 3px arc, 359deg rotation</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex flex-col items-center gap-2">
                    <Loader variant="default" />
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Loader variant="blue" size="1.5em" />
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Blue</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Loader variant="red" size="2em" />
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Red</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Loader variant="default" size="2em" style={{ '--color': 'var(--color-green)' } as React.CSSProperties} />
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Custom</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sub-Section 3: Tabs */}
          <div className="space-y-8">
            <HeadingTape>Tabs</HeadingTape>
            <Card variant="torn" rotation="0deg" showTape={false}>
              <CardHeader>
                <CardTitle>Tab Switcher</CardTitle>
                <CardDescription>Skewed tab triggers with ink-theme styling</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="w-full gap-4 sm:justify-center mb-6">
                    <TabsTrigger value="tab1">Weapons</TabsTrigger>
                    <TabsTrigger value="tab2">Stages</TabsTrigger>
                    <TabsTrigger value="tab3">Events</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="outline-none">
                    <div className="rounded-lg bg-blue/10 p-6 text-center">
                      <p className="text-sm font-bold uppercase tracking-wider text-blue">Shooters, Rollers, Chargers &amp; more</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="tab2" className="outline-none">
                    <div className="rounded-lg bg-green/10 p-6 text-center">
                      <p className="text-sm font-bold uppercase tracking-wider text-green">Turf War, Ranked, and Splatfest rotations</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="tab3" className="outline-none">
                    <div className="rounded-lg bg-orange/10 p-6 text-center">
                      <p className="text-sm font-bold uppercase tracking-wider text-orange">Limited-time challenges and community events</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sub-Section 4: Torn Card */}
          <div className="space-y-8">
            <HeadingTape>Torn Paper Card</HeadingTape>
            <p className="text-sm font-medium text-chaos-black/60 mt-1">
              Wide torn-paper background variant — official Save Data Bonus card from splatoon.nintendo.com.
            </p>
            <Card variant="torn" rotation="-1.5deg">
              <div className="content-spacing">
                <h2>Save Data Bonus</h2>
                <p>If you have save data on your system from the Splatoon 2 game, you&apos;ll get some neat-o bonuses to help you hit the turf running.</p>
                <ul className="content-spacing ml-10 list-disc text-left">
                  <li>Receive three Gold Sheldon Licenses. Give these to Sheldon to access your favorite weapon types more quickly, regardless of player level.</li>
                  <li>Join Anarchy Battles from the get-go, regardless of player level.</li>
                  <li>Start with a higher rank, depending on your rank in Splatoon 2.</li>
                  <li>Get matched against players who achieved a similar skill level to you in Splatoon 2.</li>
                </ul>
              </div>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              <TornCard variant="b">
                <TornCardTitle>This is an Inkling</TornCardTitle>
                <TornCardDescription>
                  These trendy cephalopods can transform from kid to squid…and back. (Whoa.)
                </TornCardDescription>
              </TornCard>
              <TornCard variant="c">
                <TornCardTitle>… And This is an Octoling</TornCardTitle>
                <TornCardDescription>
                  Same deal, different species. Play as either!
                </TornCardDescription>
              </TornCard>
            </div>
          </div>

          {/* Sub-Section 5: StapleCards */}
          <div className="space-y-8">
            <HeadingTape>Staple Card</HeadingTape>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 pt-6">
              <StapleCard image={<div className="h-full w-full bg-blue flex items-center justify-center text-white">A</div>}>
                <div className="space-y-3 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-blue">News Grid</p>
                  <h4 className="text-xl font-black">Official grid news card</h4>
                  <p className="text-sm text-chaos-black/75">Built using the new grid card layout with corner staples and tape accents.</p>
                </div>
              </StapleCard>
              <StapleCard image={<div className="h-full w-full bg-orange flex items-center justify-center text-white">B</div>}>
                <div className="space-y-3 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-orange">News Grid</p>
                  <h4 className="text-xl font-black">Secondary story block</h4>
                  <p className="text-sm text-chaos-black/75">Perfect for promotional events, limited-launch updates, and seasonal feed cards.</p>
                </div>
              </StapleCard>
              <StapleCard image={<div className="h-full w-full bg-green flex items-center justify-center text-white">C</div>}>
                <div className="space-y-3 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-green">News Grid</p>
                  <h4 className="text-xl font-black">Community update</h4>
                  <p className="text-sm text-chaos-black/75">A modular news card layout for official announcement galleries.</p>
                </div>
              </StapleCard>
              <StapleCard image={<div className="h-full w-full bg-red flex items-center justify-center text-white">D</div>}>
                <div className="space-y-3 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-red">News Grid</p>
                  <h4 className="text-xl font-black">Event highlight</h4>
                  <p className="text-sm text-chaos-black/75">Designed to mimic the official Splatoon news gallery grid style.</p>
                </div>
              </StapleCard>
            </div>
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────────
         06 — Card Grid
         ──────────────────────────────────────────────────────── */}
      <Section
        id="replicas"
        size="md"
        bgColor="bg-white"
        text="text-chaos-black"
        pattern="camo-white"
        className="flex flex-col items-center transition-colors duration-300"
        headingTape={<HeadingTape>Card Grid</HeadingTape>}
      >
        <div className="w-full max-w-6xl space-y-12">
          <p className="text-sm font-medium text-chaos-black/60 mt-1">
            Tape-framed section heading and grid layout replicating the official Splatoon magazine style.
          </p>

          <BlackTapeContainer className="p-6">
            <HeadingTape>Card Grid</HeadingTape>
            <p className="text-sm font-medium">
              Responsive card grid with automatic column wrapping and consistent spacing.
            </p>

            <CardGrid className="mt-6">
              <CardGridGroup>
                <div className="rounded-lg bg-blue p-6 text-center text-white">
                  <h4 className="text-xl font-black">Grid Item A</h4>
                  <p className="text-sm mt-2 opacity-80">Responsive grid layout</p>
                </div>
                <div className="rounded-lg bg-orange p-6 text-center text-white">
                  <h4 className="text-xl font-black">Grid Item B</h4>
                  <p className="text-sm mt-2 opacity-80">Automatic column wrapping</p>
                </div>
              </CardGridGroup>
              <CardGridGroup>
                <div className="rounded-lg bg-green p-6 text-center text-white">
                  <h4 className="text-xl font-black">Grid Item C</h4>
                  <p className="text-sm mt-2 opacity-80">Consistent spacing</p>
                </div>
                <div className="rounded-lg bg-red p-6 text-center text-white">
                  <h4 className="text-xl font-black">Grid Item D</h4>
                  <p className="text-sm mt-2 opacity-80">Magazine-style layout</p>
                </div>
              </CardGridGroup>
            </CardGrid>
              </BlackTapeContainer>
      </div>
    </Section>

      {/* Banner divider: Apparel Tags → Carousels */}
      <BannerDivider pattern="design3" color="yellow" animate />

      {/* ────────────────────────────────────────────────────────
         07 — Carousels
         ──────────────────────────────────────────────────────── */}
      <Section
        id="carousels"
        size="md"
        bgColor="bg-blue"
        text="text-white"
        pattern="tapes-purple"
        className="flex flex-col items-center transition-colors duration-300"
        headingTape={
          <div className="text-center">
            <HeadingTape color="yellow">Carousels</HeadingTape>
            <p className="text-sm font-medium text-white/80 mt-2">
              Official carousel components from splatoon.nintendo.com
            </p>
          </div>
        }
      >
        <div className="relative z-20 w-full space-y-16" style={{ maxWidth: "64rem" }}>

          {/* 3D Splat Gallery */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Feed Carousel</h3>
            <p className="text-sm font-medium text-white/80 text-center max-w-xl mx-auto">
              Swipe or click to navigate through the stacked feed cards.
            </p>
            <FeedCarousel initialIndex={2} items={homepageFeedCarouselItems} />
          </div>

          {/* Weapons Gallery Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Weapons Gallery</h3>
            <p className="text-sm font-medium text-white/80 text-center max-w-xl mx-auto">
              Photo gallery with rotation transitions and pagination dots. Navigated sequentially with arrow controls.
            </p>
            <WeaponsGalleryCarousel items={weaponsGalleryItems} />
          </div>

          {/* Shops Gallery Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Shops Gallery</h3>
            <p className="text-sm font-medium text-white/80 text-center max-w-xl mx-auto">
              Gallery with character portrait icons as pagination. Each shop has a unique keeper icon.
            </p>
            <IconPaginatedCarousel items={shopsGalleryItems} />
          </div>

          {/* Marquee Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Infinite Marquee</h3>
            <p className="text-sm font-medium text-white/80 text-center max-w-xl mx-auto">
              Continuous scrolling marquee with 22 gameplay screenshots. Duplicated for seamless looping.
            </p>
            <MarqueeCarousel items={marqueeItems} />
          </div>
        </div>
      </Section>

      {/* Banner divider: Carousels → Forms & Feedback */}
      <BannerDivider pattern="design2" color="green" animate />

      {/* ────────────────────────────────────────────────────────
         08 — Forms & Feedback
         ──────────────────────────────────────────────────────── */}
      <Section
        id="progress"
        size="md"
        bgColor="bg-black"
        text="text-white"
        pattern="camo-black"
        className="flex flex-col items-center"
        headingTape={
          <div className="text-center">
            <HeadingTape color="green">Forms & Feedback</HeadingTape>
            <p className="text-sm font-medium text-white/60 mt-2">
              Form controls, alerts, and progress indicators.
            </p>
          </div>
        }
      >
        <div className="relative z-20 w-full space-y-16" style={{ maxWidth: "48rem" }}>

          {/* Forms */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card variant="staple" surface="white">
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

            <Card variant="staple" surface="white">
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Torn-paper alert cards with tape and sticker decorations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 pt-2">
                <Alert variant="default">
                  <AlertTitle>Maintenance Notice</AlertTitle>
                  <AlertDescription>
                    Scheduled server maintenance on June 20th. Online services will be temporarily unavailable.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle textColor="#02e754">Splatfest Ending Soon</AlertTitle>
                  <AlertDescription textColor="#ffffffcc">
                    The current Splatfest ends in 30 minutes. Get your final battles in now!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bars */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Catalog Level 24</h3>
                <span className="text-sm font-bold" style={{ color: "var(--color-yellow)" }}>75 / 100</span>
              </div>
              <Progress value={75} variant="yellow" trackVariant="dark" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Turf War Coverage</h3>
                <span className="text-sm font-bold" style={{ color: "var(--color-blue)" }}>45.2%</span>
              </div>
              <Progress value={45} variant="blue" trackVariant="dark" size="lg" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Rank Reset</h3>
                <span className="text-sm font-bold" style={{ color: "var(--color-nintendo-red)" }}>10%</span>
              </div>
              <Progress value={10} variant="red" trackVariant="dark" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Splatfest Team Ink</h3>
                <span className="text-sm font-bold" style={{ color: "var(--color-green)" }}>92%</span>
              </div>
              <Progress value={92} variant="green" trackVariant="light" />
          </div>
        </div>
      </div>
    </Section>
      </div>

      {/* Warning Marquee (Bottom Decoration) */}
      <Marquee speed={20} variant="warning" direction="right" className="w-full border-t-2 border-b-2 border-chaos-black">
        <MarqueeItem>Woomy!</MarqueeItem>
        <MarqueeItem>Ngyes!</MarqueeItem>
        <MarqueeItem>Booyah!</MarqueeItem>
        <MarqueeItem>Stay Fresh!</MarqueeItem>
        <MarqueeItem>Splashdown!</MarqueeItem>
      </Marquee>

      {/* Official Splatoon Footer */}
      <Footer />
    </div>
  )
}
