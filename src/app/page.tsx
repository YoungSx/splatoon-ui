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
import { Zap, Skull, Flame } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'
import { CharacterShowcase } from '@/components/ui/character-showcase'
import { InteractiveSplatter, Splat3 } from '@/components/ui/splats'
import { TrailerVideo, TrailerVideoThumbnail, TrailerVideoContent } from '@/components/ui/trailer-video'
import { NewsCarousel } from '@/components/ui/news-carousel'
import { WeaponsGalleryCarousel } from '@/components/ui/weapons-gallery-carousel'
import { ShopsGalleryCarousel } from '@/components/ui/shops-gallery-carousel'
import { MarqueeCarousel } from '@/components/ui/marquee-carousel'
import { BlackTapeContainer } from '@/components/ui/black-tape-container'
import { GridNewsCard } from '@/components/ui/grid-news-card'
import { HeadingTape } from '@/components/ui/heading-tape'
import { TapeTitle } from '@/components/ui/tape-title'
import { CategoryTitle } from '@/components/ui/category-title'
import { PageTransition, type PageTransitionHandle } from '@/components/ui/page-transition'
import { SplatoonTitle } from '@/components/ui/splatoon-title'
import { SplatoonGallery, type GalleryItem } from '@/components/ui/splatoon-gallery'
import { NewsCardsGallery, NewsCardsGalleryGroup } from '@/components/ui/news-cards-gallery'
import { StyledPhoto, StyledPhotoTape } from '@/components/ui/styled-photo'
import { Divider } from '@/components/ui/divider'
import { BannerDivider } from '@/components/ui/banner-divider'
import { WaveCanvas } from '@/components/ui/wave-canvas'
import { InkTrailCanvas } from '@/components/ui/ink-trail'
import { Loader } from '@/components/ui/loader'
import { IconButton } from '@/components/ui/icon-button'
import {
  SplatoonModal,
  SplatoonModalTrigger,
  SplatoonModalPortal,
  SplatoonModalBody,
  SplatoonModalStagger,
} from '@/components/ui/splatoon-modal'
import { InView, InViewStagger } from '@/components/ui/in-view'
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

const homepageNewsCarouselItems = [1, 2, 3, 4, 5, 6].map((item) => ({
  id: item,
  paperLabel: {
    text: `SNAP 0${item}`,
    color: item % 2 === 0 ? "yellow" as const : "blue" as const,
    placement: item % 2 === 0 ? "left" as const : "right" as const,
  },
  mediaClassName: item % 2 === 0 ? "bg-[#603bff]" : "bg-[#fa5a00]",
  media: (
    <span className="font-heading text-6xl font-black text-[#eaff3d]">
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
  const transitionRef = React.useRef<PageTransitionHandle>(null)
  const [demoPage, setDemoPage] = React.useState<'home' | 'about' | 'weapons'>('home')
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [inkColor, setInkColor] = React.useState('#000000')

  const navigateTo = React.useCallback(async (target: 'home' | 'about' | 'weapons', color: string) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setInkColor(color)

    // Phase 1: Cover with ink
    await transitionRef.current?.transitionOut({ color })
    // Phase 2: Swap content (hidden behind ink)
    setDemoPage(target)
    // Phase 3: Reveal (handled by autoReveal or manual)
    transitionRef.current?.transitionIn({ color })
  }, [isTransitioning])

  const pageContent: Record<string, { title: string; subtitle: string; emoji: string }> = {
    home: { title: 'INKopolis Square', subtitle: 'The heart of Splatoon 3', emoji: '🏙️' },
    about: { title: 'Battle Stages', subtitle: 'Where turf wars happen', emoji: '🗺️' },
    weapons: { title: 'Weapon Shop', subtitle: 'Fresh weapons for fresh squids', emoji: '🔫' },
  }

  const current = pageContent[demoPage]

  return (      <section className="bg-white text-chaos-black py-16 px-6 relative transition-colors duration-300 pattern-chip-white">
      <InView direction="up" rootMargin="-50px">
        <div className="w-full max-w-5xl mx-auto space-y-6 relative z-10">
          <HeadingTape color="green" className="mb-4 text-center">
            Page Transition
          </HeadingTape>
          <p className="text-center text-chaos-black/60 text-sm font-medium">
            WebGL ink splash screen transition — ported from official splatoon.nintendo.com shader
          </p>

        <PageTransition
          ref={transitionRef}
          inkColor={inkColor}
          durationIn={700}
          durationOut={1000}
          autoReveal={false}
          onRevealed={() => setIsTransitioning(false)}
          className="w-full h-[320px] rounded-xl overflow-hidden border-2 border-dashed border-chaos-black/20 bg-[#f5f0e8] transition-colors duration-300"
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

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="yellow"
            onClick={() => navigateTo('home', '#000000')}
            disabled={isTransitioning || demoPage === 'home'}
          >
            🏙️ Inkopolis
          </Button>
          <Button
            variant="blue"
            onClick={() => navigateTo('about', '#603bff')}
            disabled={isTransitioning || demoPage === 'about'}
          >
            🗺️ Stages
          </Button>
          <Button
            variant="destructive"
            onClick={() => navigateTo('weapons', '#ff585e')}
            disabled={isTransitioning || demoPage === 'weapons'}
          >
            🔫 Weapons
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Badge>WebGL Shader</Badge>
          <Badge variant="blue">Simplex Noise</Badge>
          <Badge variant="green">Ink Cover/Reveal</Badge>
          <Badge variant="monochrome">Official Port</Badge>
        </div>
      </div>
      </InView>
    </section>
  )
}

// ── Splatoon Title Demo ─────────────────────────────────────────────────────

function SplatoonTitleDemo() {
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null)

  return (
    <section className="bg-white text-chaos-black py-16 px-6 relative overflow-hidden transition-colors duration-300 pattern-chip-white">
      <InView direction="up" rootMargin="-50px">
      <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10">
        <HeadingTape color="purple" className="mb-4 text-center">
          Splatoon Titles
        </HeadingTape>
        <p className="text-center text-chaos-black/60 text-sm font-medium max-w-xl mx-auto">
          使用官方 Nintendo 素材的 Splatoon 标题组件 — 鼠标悬停切换图片
        </p>

        <div className="space-y-8">
          {/* Official logo */}
          <div className="text-center">
            <SplatoonTitle variant="logo" size="xl" animate>
              Splatoon Logo
            </SplatoonTitle>
          </div>

          {/* Official section titles with content images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['story', 'character', 'world'].map((section) => (
              <div
                key={section}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {/* Content image */}
                <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                  <img
                    src={`/official/nav-${section}-image.png`}
                    alt={section}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Title image */}
                <div className="text-center">
                  <SplatoonTitle
                    variant="section"
                    section={section}
                    size="md"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </SplatoonTitle>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Badge>Official Assets</Badge>
          <Badge variant="blue">3 Variants</Badge>
          <Badge variant="green">Hover Effects</Badge>
          <Badge variant="monochrome">Image + Text</Badge>
        </div>
      </div>
      </InView>
    </section>
  )
}

// ── Weapon Card Demo (FASHION Section Style) ────────────────────────────────

// ── Splatoon Gallery Demo ───────────────────────────────────────────────────

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'splatoon1',
    title: 'Splatoon',
    description: 'The original ink-based shooter that started it all.',
    image: '/official/hero-image.png',
    section: 'Area 1',
  },
  {
    id: 'splatoon2',
    title: 'Splatoon 2',
    description: 'The sequel that brought Salmon Run and new weapons.',
    image: '/official/kv-image-06.png',
    section: 'Area 2',
  },
  {
    id: 'splatoon3',
    title: 'Splatoon 3',
    description: 'The latest entry with Splatfest and Tri-Stringer.',
    image: '/official/banner_4.png',
    section: 'Area 3',
  },
  {
    id: 'splatfest',
    title: 'Splatfests',
    description: 'Team-based festival battles with unique themes.',
    image: '/official/slider_banner_1.png',
    section: 'Fest',
  },
  {
    id: 'event',
    title: 'Special Events',
    description: 'Limited-time events with exclusive rewards.',
    image: '/official/slider_banner_7.png',
    section: 'Event',
  },
  {
    id: 'graffiti',
    title: 'Graffiti',
    description: 'Street art and ink graffiti from the Splatoon world.',
    image: '/official/thumnail_112.png',
    section: 'Graffiti',
  },
]

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
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-white text-chaos-black overflow-x-hidden font-sans transition-colors duration-300">

      {/* 🦑 Navigation Header Bar */}
      <Navigation />

      {/* ────────────────────────────────────────────────────────
         SECTION 1: HERO HEADER + INK TRAIL (Interactive cursor effect)
         ──────────────────────────────────────────────────────── */}
      <InkTrailCanvas colors={['#eaff3d', '#603bff', '#ff585e', '#00c8b4', '#fa5a00']}>
        <header className="relative flex flex-col items-center justify-center pt-28 md:pt-36 pb-12 px-6 bg-white text-chaos-black gap-6 transition-colors duration-300 pattern-chip-white">
          <div className="flex flex-col items-center gap-3 text-center z-10">
            <Badge variant="sticker">
              <Zap className="mr-1 h-3.5 w-3.5 text-[#eaff3d]" />
              Component Library
            </Badge>
            <h1 className="-skew-x-6 font-heading text-5xl md:text-6xl font-black uppercase tracking-wider text-chaos-black drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
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

      {/* ────────────────────────────────────────────────────────
         SECTION 1.5: TRAILER & INTRO (Official Drip Play Button)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white text-chaos-black py-24 px-6 relative transition-colors duration-300 flex flex-col items-center pattern-tapes-black">
        {/* Decorative Splats */}
        <div className="absolute top-10 left-10 text-[#ff585e]">
          <Splat3 className="w-32 h-32" />
        </div>
        <div className="absolute bottom-10 right-10 text-[#00c8b4]">
          <Splat3 className="w-48 h-48" />
        </div>

        {/* Official column system: row max-width 1440px, column--8 (66.67%) / column-large--7 (58.33%) */}
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-3">
          {/* column--8 falls back to width:100% on mobile (parent is not flex), column-large--7 = 58.33% (1024px+) */}
          <div className="flex flex-col items-center mx-auto lg:w-[58.333%] lg:max-w-[840px]">
            <TapeTitle color="red" className="text-center lg:min-w-[400px]" id="trailer-section-title">
              Watch the trailer
            </TapeTitle>

            <div className="w-full text-center">
              <TrailerVideo>
              <TrailerVideoThumbnail
                src="/_images/screenshots/video-trailer.jpg"
                alt="Splatoon 3 Trailer"
                blobColor="#000000"
              />
              <TrailerVideoContent src="//player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1&autoplay=1&muted=0" title="Splatoon 3 - Announcement Trailer" />
            </TrailerVideo>
          </div>
        </div>
        </div>
      </section>

      {/* Banner divider: Trailer → PageTransition */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design1" rotate="up" className="top-0" />
        <BannerDivider variant="green" rotate="down" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 1.5: PAGE TRANSITION (WebGL Ink Splash)
         ──────────────────────────────────────────────────────── */}
      <PageTransitionDemo />

      {/* ────────────────────────────────────────────────────────
         SECTION 5: TYPOGRAPHY & CHARACTER (SplatoonTitle + 3D Parallax + WaveCanvas)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white text-chaos-black py-16 px-6 relative transition-colors duration-300 pattern-chip-white">
        <InView direction="up" rootMargin="-50px">
        <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10">
          <HeadingTape color="purple" className="mb-4 text-center">
            Splatoon Titles
          </HeadingTape>
          <p className="text-center text-chaos-black/60 text-sm font-medium max-w-xl mx-auto">
            使用官方 Nintendo 素材的 Splatoon 标题组件 — 鼠标悬停切换图片
          </p>

          <div className="space-y-8">
            <div className="text-center">
              <SplatoonTitle variant="logo" size="xl" animate>
                Splatoon Logo
              </SplatoonTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['story', 'character', 'world'].map((section) => (
                <div
                  key={section}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredSection(section)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                    <img
                      src={`/official/nav-${section}-image.png`}
                      alt={section}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <SplatoonTitle variant="section" section={section} size="md">
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </SplatoonTitle>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge>Official Assets</Badge>
            <Badge variant="blue">3 Variants</Badge>
            <Badge variant="green">Hover Effects</Badge>
            <Badge variant="monochrome">Image + Text</Badge>
          </div>
        </div>
        </InView>
      </section>

      {/* Sand-texture container: 3D Parallax + Cards & Weapons */}
      <div className="bg-[#f5f0e8] pattern-camo-white transition-colors duration-300">

      {/* 3D Character Parallax — merged into Typography section */}
      <section className="text-chaos-black py-16 px-6 flex flex-col items-center relative">
        <InView direction="up" rootMargin="-50px">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <HeadingTape>3D Character Parallax</HeadingTape>
          <p className="text-sm font-medium text-chaos-black/60 mt-1">
            Interactive 3D layer perspective card using framer-motion springs. Hover or move your cursor to interact.
          </p>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex justify-center items-center">
              <div className="w-full max-w-[340px] aspect-[3/4] relative">
                <CharacterShowcase
                  reducedMotion={reducedMotion}
                  boardClassName="shadow-soft-splat-lg rounded-2xl border-[3px] border-chaos-black bg-none bg-[#f5f0e8]"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-wide text-chaos-black">
                  Tactile 3D Depth
                </h3>
                <p className="text-sm font-medium text-chaos-black/75 leading-relaxed">
                  Hover or move your cursor over the character card to see layers respond with spring-based 3D rotations.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant={reducedMotion ? "destructive" : "yellow"}
                  size="sm"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  theme={reducedMotion ? "light-red" : "dark-yellow"}
                >
                  {reducedMotion ? "Motion: OFF" : "Motion: ON"}
                </Button>
                <span className="text-xs text-chaos-black/50 font-medium">
                  Toggle to disable 3D rotation
                </span>
              </div>
            </div>
          </div>
        </div>
        </InView>
      </section>
      </div>{/* end sand-texture container */}

      {/* ────────────────────────────────────────────────────────
         SECTION 6: BUTTONS & EDITIONS (Button variants + CTA)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#eaff3d] text-chaos-black py-20 px-6 relative transition-colors duration-300 pattern-octo-black">
        <div className="absolute top-4 left-4 text-[#603bff]">
          <Splat3 className="w-32 h-32" />
        </div>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10 space-y-16 text-center">
          {/* Purchase CTA */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <HeadingTape color="yellow" className="text-center">
                Get the Game
              </HeadingTape>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-wider drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
                Splatoon 3
              </h3>
              <p className="text-chaos-black/70 font-medium text-sm md:text-base max-w-md mx-auto">
                Dive into the Splatlands and experience the most chaotic ink battles yet.
              </p>
              <div className="inline-block bg-[#0d0d0d] text-[#eaff3d] px-8 py-3 rounded-xl border-[3px] border-[#0d0d0d] font-alt text-2xl font-black">
                $59.99
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button variant="blue">Buy Now</Button>
                <Button variant="blue">
                  Add to Wishlist
                </Button>
                <a href="#trailer-section-title">
                  <Button variant="arrow">Watch Trailer</Button>
                </a>
              </div>
            </div>
          </InView>

          {/* Button Variant Showcase */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <HeadingTape color="blue" className="text-center">
                Button Variants
              </HeadingTape>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="yellow">Yellow</Button>
                <Button variant="blue">Blue</Button>
                <Button variant="destructive">Red</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="arrow">Arrow</Button>
              </div>
            </div>
          </InView>

          {/* Editions */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6 w-full max-w-2xl mx-auto">
              <HeadingTape color="yellow" className="text-center">
                Editions
              </HeadingTape>
              <InViewStagger rootMargin="-30px">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card variant="plain" className="p-6 space-y-4 text-center bg-white">
                    <div className="h-1.5 w-12 rounded-full bg-[#603bff] mx-auto" />
                    <h3 className="text-lg font-black uppercase tracking-wider">Standard Edition</h3>
                    <p className="text-sm font-medium text-chaos-black/60">
                      The full base game with all launch content, stages, weapons, and modes.
                    </p>
                    <div className="font-alt text-2xl font-black text-[#603bff]">$59.99</div>
                  </Card>
                  <Card variant="plain" className="border-[#eaff3d] p-6 space-y-4 text-center relative overflow-hidden bg-white">
                    <div className="absolute top-3 right-3 bg-[#ff585e] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Special</div>
                    <div className="h-1.5 w-12 rounded-full bg-[#eaff3d] mx-auto" />
                    <h3 className="text-lg font-black uppercase tracking-wider">Expansion Pass</h3>
                    <p className="text-sm font-medium text-chaos-black/60">
                      Includes the Side Order DLC, Inkopolis Plaza, and exclusive gear sets.
                    </p>
                    <div className="font-alt text-2xl font-black text-chaos-black">$24.99</div>
                  </Card>
                </div>
              </InViewStagger>
            </div>
          </InView>
        </div>
      </section>

      {/* Banner divider: Buttons → IconButton */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design1" rotate="up" className="top-0" />
        <BannerDivider variant="green" rotate="down" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 6.5: ICON BUTTON (1:1 official replica showcase)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white text-chaos-black py-20 px-6 relative transition-colors duration-300 pattern-chip-white">
        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          <InView direction="up" rootMargin="-50px">
            <div className="text-center space-y-4">
              <HeadingTape color="blue">Icon Button</HeadingTape>
              <p className="text-chaos-black/60 text-sm font-medium max-w-xl mx-auto">
                1:1 replica of splatoon.nintendo.com circular icon button — official squish animation, ink-splatter SVG arrows, theme-driven colors.
              </p>
            </div>
          </InView>

          {/* Official carousel arrows — the exact buttons used on splatoon.nintendo.com */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Carousel Navigation</h3>
              <p className="text-xs text-chaos-black/50 text-center">Official gallery arrows with continuous squish animation — 60px circle, no border, no shadow</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" direction="left" animation="squish" aria-label="Previous" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Left squish</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" direction="right" animation="squish" aria-label="Next" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Right squish</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" disabled aria-label="Disabled" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Disabled</span>
                </div>
              </div>
            </div>
          </InView>

          {/* All size variants */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Size Variants</h3>
              <p className="text-xs text-chaos-black/50 text-center">sm=40px · md=48px · lg=60px (official default)</p>
              <div className="flex flex-wrap items-end justify-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="sm" direction="right" animation="squish" aria-label="Small" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">sm 40px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="md" direction="right" animation="squish" aria-label="Medium" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">md 48px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" direction="right" animation="squish" aria-label="Large" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">lg 60px</span>
                </div>
              </div>
            </div>
          </InView>

          {/* Color variants */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Color Variants</h3>
              <p className="text-xs text-chaos-black/50 text-center">Theme-driven via --color-primary / --color-accent CSS variables</p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" direction="right" animation="squish" aria-label="Carousel" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Carousel</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="primary" size="lg" direction="right" animation="squish" aria-label="Primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Primary</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="yellow" size="lg" direction="right" animation="squish" aria-label="Yellow" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Yellow</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="accent" size="lg" direction="right" animation="squish" aria-label="Accent" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Accent</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="ghost" size="lg" direction="right" aria-label="Ghost" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Ghost</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="outline" size="lg" direction="right" aria-label="Outline" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Outline</span>
                </div>
              </div>
            </div>
          </InView>

          {/* Animation variants */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Animations</h3>
              <p className="text-xs text-chaos-black/50 text-center">squish = official bouncy squish · pulse = gentle scale · none = static</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" direction="right" animation="squish" aria-label="Squish" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Squish</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="primary" size="lg" direction="right" animation="pulse" aria-label="Pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Pulse</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="yellow" size="lg" direction="right" animation="none" aria-label="None" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">None</span>
                </div>
              </div>
            </div>
          </InView>

          {/* Custom icon examples */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-center">Custom Icons</h3>
              <p className="text-xs text-chaos-black/50 text-center">Pass any SVG via the icon prop — replaces built-in arrow</p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="carousel" size="lg" aria-label="Close" icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  } />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Close</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="primary" size="lg" aria-label="Play" icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  } />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Play</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="yellow" size="lg" direction="up" animation="squish" aria-label="Up" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Arrow Up</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <IconButton variant="ghost" size="lg" direction="down" aria-label="Down" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Arrow Down</span>
                </div>
              </div>
            </div>
          </InView>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge>60px Circle</Badge>
            <Badge variant="blue">No Border</Badge>
            <Badge variant="green">Squish Animation</Badge>
            <Badge variant="monochrome">Theme Colors</Badge>
          </div>
        </div>
      </section>

      {/* Banner divider: IconButton → Overlays */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design1" rotate="up" className="top-0" />
        <BannerDivider variant="purple" rotate="down" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 7: OVERLAYS (Dialog, Sheet, Popover, SplatoonModal)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0d0d0d] text-white py-20 px-6 pattern-camo-black">
        <div className="absolute top-6 right-6 text-[#a51ee1]">
          <Splat3 className="w-24 h-24" />
        </div>
        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          <InView direction="up" rootMargin="-50px">
            <div className="text-center space-y-4">
              <HeadingTape color="red">Overlays & Dialogs</HeadingTape>
              <p className="text-white/60 text-sm font-medium max-w-xl mx-auto">
                Modal dialogs, side drawers, contextual popovers, and the official JP feature page modal system.
              </p>
            </div>
          </InView>

          {/* Dialog demos */}
          <InView direction="up" rootMargin="-50px">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-[#eaff3d]">
                  Graffiti Dialogs
                </h3>
                <p className="text-xs text-white/50">Paper-tear modal with rotation and caution sticker tape</p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTriggerButton variant="yellow" theme="dark-yellow">Yellow Dialog</DialogTriggerButton>
                    <DialogContent surface="paper" hasTape={true} tapeText="ALERT!" tapeColor="yellow">
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
                    <DialogContent surface="cream" hasTape={true} tapeText="EVENT INFO" tapeColor="blue" tapePosition="event">
                      <DialogHeader>
                        <DialogTitle>Big Run Event</DialogTitle>
                        <DialogDescription>Salmonids are invading Wahoo World! Team up to defend.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTriggerButton variant="destructive" theme="light-red">Danger Dialog</DialogTriggerButton>
                    <DialogContent surface="danger" hasTape={true} tapeText="DANGER!" tapeColor="red">
                      <DialogHeader>
                        <DialogTitle className="text-white">Connection Lost</DialogTitle>
                        <DialogDescription className="text-white/80">Disconnected from battle lobby.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Sheet + Popover */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-[#00c8b4]">
                  Drawers & Popovers
                </h3>
                <p className="text-xs text-white/50">Side sheets, contextual menus and alerts</p>
                <div className="flex flex-wrap gap-3">
                  <Sheet>
                    <SheetTriggerButton variant="green" theme="light-green">Right Drawer</SheetTriggerButton>
                    <SheetContent side="right" className="shadow-soft-splat-lg bg-[#f5f0e8] p-6 pt-10 text-chaos-black border-l-[3px] border-chaos-black">
                      <SheetHeader>
                        <SheetTitle className="text-xl font-black">LOBBY TERMINAL</SheetTitle>
                        <SheetDescription>Match statistics, gear catalog, and lobby features.</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        <div className="scrap-panel-tight border-2 border-chaos-black bg-white p-3 pt-6">
                          <h4 className="font-bold text-sm">Last Battle Result</h4>
                          <p className="text-xs text-muted-foreground mt-1">Turf War - Wahoo World</p>
                          <p className="inline-block bg-chaos-black px-2 py-0.5 text-xs font-black text-[#eaff3d] [transform:rotate(-2deg)]">VICTORY</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Popover>
                    <PopoverTriggerButton variant="outline" theme="yellow">Popover</PopoverTriggerButton>
                    <PopoverContent align="center" className="shadow-soft-splat-sm max-w-xs border-2 border-chaos-black bg-white p-4 pt-6 text-chaos-black">
                      <PopoverHeader>
                        <PopoverTitle className="font-black">Grizzco Industries</PopoverTitle>
                        <PopoverDescription className="text-xs">Corporate sponsorship details.</PopoverDescription>
                      </PopoverHeader>
                      <div className="py-2 text-xs">
                        <p>Recruiting part-time workers to collect Golden Eggs.</p>
                        <p className="font-bold text-[#ff585e] mt-1.5">Hazard pay included!</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </InView>

          {/* SplatoonModal */}
          <InView direction="up" rootMargin="-50px">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-[#eaff3d]">
                Splatoon Modal (トジル)
              </h3>
              <p className="text-xs text-white/50">Full-screen overlay with bounce animation and staggered content reveal</p>
              <div className="flex flex-wrap gap-3">
                <SplatoonModal>
                  <SplatoonModalTrigger className="inline-flex items-center justify-center rounded-lg bg-[#eaff3d] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-chaos-black border-[3px] border-chaos-black shadow-soft-splat-sm hover:scale-[1.03] active:scale-[0.97] transition-transform cursor-pointer">
                    Open Splatoon Modal
                  </SplatoonModalTrigger>
                  <SplatoonModalPortal>
                    <SplatoonModalBody>
                      <div className="text-center space-y-4">
                        <h2 className="font-heading text-2xl font-black uppercase tracking-wider">About Splatoon</h2>
                        <p className="text-sm text-chaos-black/70 max-w-sm mx-auto">
                          Turf War is a 4v4 team battle mode where the goal is to cover the most ground with your team's ink.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="rounded-lg bg-[#603bff] p-3 text-center text-xs font-black uppercase tracking-wider text-white">Turf War</div>
                          <div className="rounded-lg bg-[#ff585e] p-3 text-center text-xs font-black uppercase tracking-wider text-white">Splat Zones</div>
                          <div className="rounded-lg bg-[#00c8b4] p-3 text-center text-xs font-black uppercase tracking-wider text-chaos-black">Tower Control</div>
                          <div className="rounded-lg bg-[#a51ee1] p-3 text-center text-xs font-black uppercase tracking-wider text-white">Rainmaker</div>
                        </div>
                      </div>

                    </SplatoonModalBody>
                  </SplatoonModalPortal>
                </SplatoonModal>

                <SplatoonModal>
                  <SplatoonModalTrigger className="inline-flex items-center justify-center rounded-lg bg-[#603bff] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white border-[3px] border-chaos-black shadow-soft-splat-sm hover:scale-[1.03] active:scale-[0.97] transition-transform cursor-pointer">
                    Staggered Content
                  </SplatoonModalTrigger>
                  <SplatoonModalPortal>
                    <SplatoonModalBody>
                      <div className="text-center mb-4">
                        <h2 className="font-heading text-2xl font-black uppercase tracking-wider">Weapon Types</h2>
                      </div>
                      <SplatoonModalStagger className="space-y-3">
                        <div className="rounded-lg bg-[#eaff3d] p-3 text-sm font-black text-chaos-black">Shooters — Rapid-fire ink weapons</div>
                        <div className="rounded-lg bg-[#603bff] p-3 text-sm font-black text-white">Rollers — Cover ground quickly</div>
                        <div className="rounded-lg bg-[#ff585e] p-3 text-sm font-black text-white">Chargers — Long-range precision</div>
                        <div className="rounded-lg bg-[#00c8b4] p-3 text-sm font-black text-chaos-black">Sloshers — Throw ink in arcs</div>
                        <div className="rounded-lg bg-[#a51ee1] p-3 text-sm font-black text-white">Splatlings — Charged rapid-fire</div>
                      </SplatoonModalStagger>

                    </SplatoonModalBody>
                  </SplatoonModalPortal>
                </SplatoonModal>
              </div>
            </div>
          </InView>
        </div>
      </section>

      {/* Banner divider: Overlays → Apparel Tags */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design2" rotate="down" className="top-0" />
        <BannerDivider variant="green" rotate="up" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 3: APPAREL TAGS & COMPONENTS (Adapting Theme - bg-white/bg-[#0d0d0d])
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white text-chaos-black py-16 px-6 flex flex-col items-center relative transition-colors duration-300 pattern-chip-white">
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
                  <Button variant="blue" size="sm" theme="light-blue">
                    Equip Now
                  </Button>
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
                  <Button variant="yellow" size="sm" theme="dark-yellow">
                    Ink Up
                  </Button>
                </CardFooter>
              </Card>

              {/* Purple Tag */}
              <Card variant="tag" tagTheme="purple" tagRotation="-1deg">
                <CardHeader>
                  <CardTitle>Plaza Tour</CardTitle>
                </CardHeader>
                <CardImage className="bg-[#00c8b4] flex items-center justify-center p-4">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#a51ee1] fill-current">
                    <path d="M50,10 L55,25 L45,25 Z M42,25 L58,25 L55,75 L45,75 Z M35,75 L65,75 L60,95 L40,95 Z" />
                  </svg>
                </CardImage>
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

          {/* Sub-Section 2: Other Components Tab Showcase */}
          <div className="space-y-8">
            <HeadingTape>3. Interactive Component Showcase</HeadingTape>
            <p className="text-sm font-medium text-chaos-black/60 mt-1">
              Toggle between the official tab switcher styles below to preview other UI elements.
            </p>

            <Tabs defaultValue="preview" className="w-full">
              {/* TabsList rendering our high-fidelity Skewed Tab Triggers! */}
              <TabsList className="grid w-full grid-cols-2 gap-6 max-w-xl mx-auto mb-10">
                <TabsTrigger value="preview">Buttons & Badges</TabsTrigger>
                <TabsTrigger value="forms">Form Fields & Alerts</TabsTrigger>
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
                      <Button variant="yellow" theme="dark-yellow">Yellow</Button>
                      <Button variant="blue" theme="light-blue">Blue</Button>
                      <Button variant="green" theme="light-green">Green</Button>
                      <Button variant="orange" theme="dark-purpleOrange">Orange</Button>
                      <Button variant="purple" theme="dark-purple">Purple</Button>
                      <Button variant="destructive" theme="light-red">Alert</Button>
                      <Button variant="outline" theme="yellow">
                        Outline
                      </Button>
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

                  {/* InView Demo Card */}
                  <Card
                    variant="news"
                    surface="cream"
                    className="md:col-span-2"
                  >
                    <CardHeader>
                      <CardTitle>InView Animation</CardTitle>
                      <CardDescription>Official scroll-triggered animation — try scrolling down &amp; back up</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InView direction="left" rootMargin="-50px">
                          <div className="rounded-lg bg-[#603bff] p-4 text-center text-sm font-black uppercase tracking-wider text-white">
                            Left
                          </div>
                        </InView>
                        <InView direction="up" rootMargin="-50px" delay={1}>
                          <div className="rounded-lg bg-[#a51ee1] p-4 text-center text-sm font-black uppercase tracking-wider text-white">
                            Up
                          </div>
                        </InView>
                        <InView direction="right" rootMargin="-50px" delay={2}>
                          <div className="rounded-lg bg-[#ff585e] p-4 text-center text-sm font-black uppercase tracking-wider text-white">
                            Right
                          </div>
                        </InView>
                        <InView direction="pop" rootMargin="-50px" delay={1}>
                          <div className="rounded-lg bg-[#eaff3d] p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">
                            Pop
                          </div>
                        </InView>
                        <InView drop rootMargin="-50px" delay={2}>
                          <div className="rounded-lg bg-[#00c8b4] p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">
                            Drop
                          </div>
                        </InView>
                        <InView drop="slow" rootMargin="-50px" delay={3}>
                          <div className="rounded-lg bg-[#fa5a00] p-4 text-center text-sm font-black uppercase tracking-wider text-chaos-black">
                            Slow Drop
                          </div>
                        </InView>
                      </div>

                      <InViewStagger rootMargin="-30px" className="mt-6">
                        {['Stagger 1', 'Stagger 2', 'Stagger 3', 'Stagger 4'].map((label, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-gradient-to-r from-[#603bff] to-[#a51ee1] p-3 text-center text-sm font-black uppercase tracking-wider text-white mb-2 last:mb-0"
                          >
                            {label}
                          </div>
                        ))}
                      </InViewStagger>
                    </CardContent>
                  </Card>

                  {/* Loader Card — full width span in 2-col grid */}
                  <Card
                    variant="news"
                    surface="cream"
                    className="md:col-span-2"
                  >
                    <CardHeader>
                      <CardTitle>Loader</CardTitle>
                      <CardDescription>Official CSS border spinner — 3px arc, 359deg rotation</CardDescription>
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
                        <Loader variant="default" size="2em" style={{ '--color': '#00c8b4' } as React.CSSProperties} />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Custom</span>
                      </div>
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
                    <CardContent className="flex flex-col gap-4 pt-2">
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
            </Tabs>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         SECTION 3.5: OFFICIAL REPLICA COMPONENTS
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f0e8] text-chaos-black py-16 px-6 flex flex-col items-center relative transition-colors duration-300 pattern-camo-white">
        <div className="w-full max-w-6xl space-y-12">
          <HeadingTape>Official Replica Components</HeadingTape>
          <p className="text-sm font-medium text-chaos-black/60 mt-1">
            Demonstrates the newly implemented Splatoon-style UI pieces: heading tape, black tape container, styled photo, news gallery, and apparel tag card.
          </p>

          <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-6">
              <BlackTapeContainer tapeVariant="yellow" className="p-6">
                <HeadingTape className="mb-4">
                  Official Heading Tape
                </HeadingTape>
                <p className="text-sm font-medium">
                  Tape-framed section heading replicating the official Splatoon magazine layout style.
                </p>

                <StyledPhoto
                  src="/official/thumnail_113.png"
                  alt="Styled Photo Demo"
                  border="medium"
                  nested
                  className="mt-6"
                >
                  <StyledPhotoTape position="center" />
                </StyledPhoto>
              </BlackTapeContainer>

              <Card
                variant="plain"
                className="relative overflow-hidden p-6 shadow-soft-splat-sm [transform:rotate(-3deg)] hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f6ff8b] via-[#ffdc4f] to-[#ff7500] opacity-30" />
                <div className="relative z-10 space-y-4 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-chaos-black/60">Tag Card Replica</p>
                  <h3 className="text-2xl font-black uppercase text-[#603bff]">Gear Preview</h3>
                  <p className="text-sm font-medium text-chaos-black/75">
                    A hand-tagged apparel card with tilted paper geometry, custom background, and layered visual depth.
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* CategoryTitle: official full-width white section heading */}
          <div className="max-w-md mx-auto">
            <CategoryTitle
              points={<span className="inline-flex items-center gap-1 rounded-full bg-[#ff585e] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">NEW</span>}
            >
              <span className="font-alt font-black text-xl uppercase tracking-wider">Category Title</span>
            </CategoryTitle>
          </div>

          <NewsCardsGallery className="rounded-[2rem] bg-white/95 p-6 shadow-soft-splat-sm">
                <NewsCardsGalleryGroup>
                  <GridNewsCard image={<div className="h-full w-full bg-[#603bff] flex items-center justify-center text-white">A</div>}>
                    <div className="space-y-3 p-4">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#603bff]">News Grid</p>
                      <h4 className="text-xl font-black">Official grid news card</h4>
                      <p className="text-sm text-chaos-black/75">Built using the new grid card layout with corner staples and tape accents.</p>
                    </div>
                  </GridNewsCard>
                  <GridNewsCard image={<div className="h-full w-full bg-[#fa5a00] flex items-center justify-center text-white">B</div>}>
                    <div className="space-y-3 p-4">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#fa5a00]">News Grid</p>
                      <h4 className="text-xl font-black">Secondary story block</h4>
                      <p className="text-sm text-chaos-black/75">Perfect for promotional events, limited-launch updates, and seasonal feed cards.</p>
                    </div>
                  </GridNewsCard>
                </NewsCardsGalleryGroup>
                <NewsCardsGalleryGroup>
                  <GridNewsCard image={<div className="h-full w-full bg-[#11d87a] flex items-center justify-center text-white">C</div>}>
                    <div className="space-y-3 p-4">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#11d87a]">News Grid</p>
                      <h4 className="text-xl font-black">Community update</h4>
                      <p className="text-sm text-chaos-black/75">A modular news card layout for official announcement galleries.</p>
                    </div>
                  </GridNewsCard>
                  <GridNewsCard image={<div className="h-full w-full bg-[#ff585e] flex items-center justify-center text-white">D</div>}>
                    <div className="space-y-3 p-4">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#ff585e]">News Grid</p>
                      <h4 className="text-xl font-black">Event highlight</h4>
                      <p className="text-sm text-chaos-black/75">Designed to mimic the official Splatoon news gallery grid style.</p>
                    </div>
                  </GridNewsCard>
                </NewsCardsGalleryGroup>
              </NewsCardsGallery>
          </div>
        </div>
      </div>
    </section>

      {/* Banner divider: Apparel Tags → Gallery */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design3" rotate="up" className="top-0" />
        <BannerDivider variant="yellow" rotate="down" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 4: GALLERY CAROUSEL
         ──────────────────────────────────────────────────────── */}
      <section className="bg-[#603bff] text-white py-16 px-6 flex flex-col items-center relative pattern-tapes-purple">
        {/* Full height ripped borders */}
        <Divider variant="rip-left" color="custom" customColor="#0d0d0d" desktopOnly className="opacity-20" />
        <Divider variant="rip-right" color="custom" customColor="#0d0d0d" desktopOnly className="opacity-20" />
        
        <div className="relative z-20 w-full space-y-12" style={{ maxWidth: "64rem" }}>
          <div className="text-center">
            <HeadingTape color="yellow">3D Splat Gallery</HeadingTape>
            <p className="text-sm font-medium text-white/80 mt-2">
              Swipe or click to navigate through the overlapping Z-index carousel.
            </p>
          </div>

          <NewsCarousel initialIndex={2} items={homepageNewsCarouselItems} />
        </div>
      </section>

      {/* Banner divider: Gallery → Carousel Variants */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design1" rotate="down" className="top-0" />
        <BannerDivider variant="purple" rotate="up" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 4.5: CAROUSEL VARIANTS (Official carousel types)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-white text-chaos-black py-16 px-6 flex flex-col items-center relative transition-colors duration-300 pattern-chip-white">
        <div className="relative z-20 w-full space-y-16" style={{ maxWidth: "64rem" }}>
          <div className="text-center">
            <HeadingTape color="blue">Carousel Variants</HeadingTape>
            <p className="text-sm font-medium text-chaos-black/60 mt-2">
              Official carousel components from splatoon.nintendo.com/en/weapons/
            </p>
          </div>

          {/* Weapons Gallery Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Weapons Gallery</h3>
            <p className="text-sm font-medium text-chaos-black/60 text-center max-w-xl mx-auto">
              Photo gallery with rotation transitions and pagination dots. Navigated sequentially with arrow controls.
            </p>
            <WeaponsGalleryCarousel items={weaponsGalleryItems} />
          </div>

          {/* Shops Gallery Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Shops Gallery</h3>
            <p className="text-sm font-medium text-chaos-black/60 text-center max-w-xl mx-auto">
              Gallery with character portrait icons as pagination. Each shop has a unique keeper icon.
            </p>
            <ShopsGalleryCarousel items={shopsGalleryItems} />
          </div>

          {/* Marquee Carousel */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-center">Infinite Marquee</h3>
            <p className="text-sm font-medium text-chaos-black/60 text-center max-w-xl mx-auto">
              Continuous scrolling marquee with 22 gameplay screenshots. Duplicated for seamless looping.
            </p>
            <MarqueeCarousel items={marqueeItems} />
          </div>
        </div>
      </section>

      {/* Banner divider: Carousel Variants → Progress */}
      <div className="relative h-[70px] md:h-[90px] z-20">
        <BannerDivider variant="design2" rotate="up" className="top-0" />
        <BannerDivider variant="green" rotate="down" className="top-[35px] md:top-[45px]" />
      </div>

      {/* ────────────────────────────────────────────────────────
         SECTION 5: INK PROGRESS BAR
         ──────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center px-6 py-16 text-white pattern-camo-black"
        style={{ backgroundColor: "#0d0d0d" }}
      >
        <div className="relative z-20 w-full space-y-16" style={{ maxWidth: "48rem" }}>
          <div className="text-center">
            <HeadingTape color="green">Ink Progress Bar</HeadingTape>
            <p className="text-sm font-medium text-white/60 mt-2">
              SplatNet 3 style liquid physics with velocity-based splatter morphing.
            </p>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Catalog Level 24</h3>
                <span className="text-sm font-bold" style={{ color: "#eaff3d" }}>75 / 100</span>
              </div>
              <Progress value={75} variant="yellow" trackVariant="dark" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Turf War Coverage</h3>
                <span className="text-sm font-bold" style={{ color: "#4100ff" }}>45.2%</span>
              </div>
              <Progress value={45} variant="blue" trackVariant="dark" size="lg" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Rank Reset</h3>
                <span className="text-sm font-bold" style={{ color: "#e60012" }}>10%</span>
              </div>
              <Progress value={10} variant="red" trackVariant="transparent" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-lg font-black uppercase text-white/80">Splatfest Team Ink</h3>
                <span className="text-sm font-bold" style={{ color: "#11d87a" }}>92%</span>
              </div>
              <Progress value={92} variant="green" trackVariant="light" />
          </div>
        </div>
      </div>
    </section>

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
