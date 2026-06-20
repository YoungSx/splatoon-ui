'use client'

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
import { Play, Zap } from 'lucide-react'
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
import {
  SquidMaskTransition,
  type SquidMaskTransitionHandle,
} from '@/components/ui/squid-mask-transition'

import { CardGrid, CardGridGroup } from '@/components/ui/card-grid'
import { BannerDivider } from '@/components/ui/banner-divider'
import { InkTrailCanvas } from '@/components/ui/ink-trail'
import { Loader } from '@/components/ui/loader'
import { IconButton } from '@/components/ui/icon-button'
import { InView, InViewStagger } from '@/components/ui/in-view'
import { SectionSideNav } from '@/components/ui/section-side-nav'
import { Progress } from '@/components/ui/progress'
import { Footer } from '@/components/ui/footer'
import { GitHubMark } from '@/components/ui/github-mark'
import { AssetImage, type ImageAsset } from '@/components/ui/asset-image'
import { pageTransitionCharacterAssets } from '@/components/ui/character-assets'
import { EventCallout } from '@/components/ui/event-callout'
import { DemoContent, DemoExampleGroup } from '@/components/ui/demo-layout'
import { eventImageAssets } from '@/components/ui/event-assets'
import { showcaseMediaAssets } from '@/components/ui/showcase-assets'
import {
  weaponMarqueeItems,
  weaponShopGalleryItems,
  weaponShowcaseItems,
} from '@/components/ui/weapons-assets'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTriggerButton,
} from '@/components/ui/popover'

function createDemoEmbed(label: string) {
  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0d0d0d;color:#eaff3d;font-family:Arial,sans-serif;overflow:hidden">
        <main style="position:relative;isolation:isolate;text-align:center;text-transform:uppercase;font-weight:900;letter-spacing:.12em">
          <span style="position:absolute;inset:-18vh -28vw;z-index:-1;background:repeating-linear-gradient(-12deg,#603bff 0 18px,#0d0d0d 18px 42px,#ff505e 42px 56px,#0d0d0d 56px 82px);opacity:.42;transform:rotate(-3deg)"></span>
          <p style="font-size:clamp(28px,8vw,72px);margin:0;text-shadow:4px 5px 0 #000">${label}</p>
          <p style="color:#fff;font-size:14px;margin-top:18px">Component motion reel</p>
        </main>
      </body>
    </html>
  `

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
}

const demoVideoEmbed = createDemoEmbed('Splatoon UI')

function FeedCardImage({ asset }: { asset: ImageAsset }) {
  return (
    <AssetImage
      asset={asset}
      fill
      fit="cover"
      loading="eager"
    />
  )
}

const homepageFeedCarouselItems = [
  {
    id: 'event-brief',
    image: <FeedCardImage asset={eventImageAssets.bigRunCallout} />,
    title: 'Event Brief',
    subtitle: 'Image-backed feed card using curated public media.',
  },
  {
    id: 'stage-panel',
    image: <FeedCardImage asset={eventImageAssets.splatnetBlade} />,
    title: 'Stage Panel',
    subtitle: 'Tilted staple shell with curated scene artwork.',
  },
  {
    id: 'battle-frame',
    image: <FeedCardImage asset={showcaseMediaAssets.turfWarLeft} />,
    title: 'Battle Frame',
    subtitle: 'Responsive media crop for stacked carousel motion.',
  },
  {
    id: 'mode-card',
    image: <FeedCardImage asset={showcaseMediaAssets.ruggedMode} />,
    title: 'Mode Card',
    subtitle: 'Reusable feed pattern for dense fan portals.',
  },
  {
    id: 'gallery-shot',
    image: <FeedCardImage asset={showcaseMediaAssets.splatfestSecondary} />,
    title: 'Gallery Shot',
    subtitle: 'Curated art keeps the demo close to the reference language.',
  },
  {
    id: 'graffiti-note',
    image: <FeedCardImage asset={eventImageAssets.splatnetNextPage} />,
    title: 'Graffiti Note',
    subtitle: 'Graphic panel artwork for compact updates.',
  },
].map((item) => ({
  ...item,
  hoverTilt: true,
  action: (
    <>
      <p className="text-chaos-black/60 text-sm font-bold">Curated media-backed demo card</p>
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

  const navigateTo = React.useCallback(
    async (target: 'home' | 'about' | 'weapons', mode: 'webgl' | 'squid', color?: string) => {
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
    },
    [isTransitioning]
  )

  const pageContent = {
    home: {
      title: 'Demo Hub',
      subtitle: 'Interactive component preview',
      image: pageTransitionCharacterAssets.home,
    },
    about: {
      title: 'Scene Layouts',
      subtitle: 'Patterned sections and transition states',
      image: pageTransitionCharacterAssets.about,
    },
    weapons: {
      title: 'Tool Shelf',
      subtitle: 'Reusable controls for fan-made interfaces',
      image: pageTransitionCharacterAssets.weapons,
    },
  }

  const current = pageContent[demoPage]

  return (
    <Section
      size="md"
      bgColor="bg-white"
      text="text-chaos-black"
      pattern="chip-white"
      bottomOverlayClearance="banner-divider"
      className="transition-colors duration-300"
      headingTape={
        <HeadingTape color="green" className="text-center">
          Page Transition
        </HeadingTape>
      }
    >
      <InView direction="up" rootMargin="-50px">
        <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6">
          <p className="text-chaos-black/60 text-center text-sm font-medium">
            {variant === 'webgl'
              ? 'WebGL ink splash — shader-inspired ink cover and reveal'
              : 'Canvas 2D rotating squid mask — fan-made transition study'}
          </p>

          {/* Demo box — both components stacked, only active one visible */}
          <div className="relative h-[320px] w-full">
            <PageTransition
              ref={webglRef}
              color={inkColor}
              durationIn={700}
              durationOut={1000}
              autoReveal={false}
              onRevealed={() => setIsTransitioning(false)}
              className={`border-chaos-black/20 absolute inset-0 overflow-hidden rounded-xl border-2 border-dashed bg-white transition-all duration-300 ${
                variant === 'webgl' ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-3 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image.src}
                    alt={current.image.alt}
                    width={current.image.width}
                    height={current.image.height}
                    className="mx-auto h-28 w-auto object-contain drop-shadow-[3px_5px_0_rgba(0,0,0,0.2)]"
                    draggable={false}
                  />
                  <h3 className="text-2xl font-black tracking-wider uppercase md:text-3xl">
                    {current.title}
                  </h3>
                  <p className="text-chaos-black/50 text-sm font-medium">{current.subtitle}</p>
                </div>
              </div>
            </PageTransition>

            <SquidMaskTransition
              ref={squidRef}
              durationIn={700}
              durationOut={1000}
              autoReveal={false}
              onRevealed={() => setIsTransitioning(false)}
              className={`border-chaos-black/20 absolute inset-0 overflow-hidden rounded-xl border-2 border-dashed bg-white transition-all duration-300 ${
                variant === 'squid' ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-3 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image.src}
                    alt={current.image.alt}
                    width={current.image.width}
                    height={current.image.height}
                    className="mx-auto h-28 w-auto object-contain drop-shadow-[3px_5px_0_rgba(0,0,0,0.2)]"
                    draggable={false}
                  />
                  <h3 className="text-2xl font-black tracking-wider uppercase md:text-3xl">
                    {current.title}
                  </h3>
                  <p className="text-chaos-black/50 text-sm font-medium">{current.subtitle}</p>
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
              Demo Hub
            </Button>
            <Button
              variant="blue"
              onClick={() => navigateTo('about', 'webgl', 'var(--color-blue)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'about')}
            >
              Scenes
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigateTo('weapons', 'webgl', 'var(--color-red)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'weapons')}
            >
              Tools
            </Button>
            <Button
              variant="green"
              onClick={() => navigateTo('home', 'squid')}
              disabled={isTransitioning || (variant === 'squid' && demoPage === 'home')}
            >
              Mask Canvas
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {variant === 'webgl' ? (
              <>
                <Badge>WebGL Shader</Badge>
                <Badge variant="blue">Simplex Noise</Badge>
                <Badge variant="green">Ink Cover/Reveal</Badge>
                <Badge variant="monochrome">Shader Study</Badge>
              </>
            ) : (
              <>
                <Badge>Canvas 2D</Badge>
                <Badge variant="blue">Rotating Mask</Badge>
                <Badge variant="green">source-out</Badge>
                <Badge variant="monochrome">Mask Study</Badge>
              </>
            )}
          </div>
        </div>
      </InView>
    </Section>
  )
}

// ── Carousel Demo Data ──────────────────────────────────────────────────────

const weaponsGalleryItems = weaponShowcaseItems
const shopsGalleryItems = weaponShopGalleryItems
const marqueeItems = weaponMarqueeItems
const loaderDemoItems: Array<{
  label: string
  variant?: React.ComponentProps<typeof Loader>['variant']
  size?: string
  style?: React.CSSProperties
}> = [
  { label: 'Default', variant: 'default' },
  { label: 'Blue', variant: 'blue', size: '1.5em' },
  { label: 'Red', variant: 'red', size: '2em' },
  {
    label: 'Custom',
    variant: 'default',
    size: '2em',
    style: { '--color': 'var(--color-green)' } as React.CSSProperties,
  },
]

export default function Home() {
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="text-chaos-black flex min-h-screen flex-col bg-white font-sans transition-colors duration-300">
      {/* 🦑 Navigation Header Bar */}
      <Navigation
        headerDecoration={(isCollapsed) => <SplatoonHeaderDrip isCollapsed={isCollapsed} />}
      >
        <NavigationDialog
          navLinks={navLinks}
          highlightColor="var(--color-yellow)"
          cta={
            <Button
              variant="yellow"
              size="lg"
              theme="dark-yellow"
              leftIcon={<GitHubMark className="h-5 w-5" />}
              render={
                <a
                  href="https://github.com/YoungSx/splatoon-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Splatoon UI on GitHub"
                />
              }
            >
              GitHub
            </Button>
          }
          logo={(contentPhase) => <SplatoonMenuLogo contentPhase={contentPhase} />}
          menuDecorations={<SplatoonMenuDecorations />}
          overlayDecorations={(contentPhase) => (
            <SplatoonOverlayDecorations contentPhase={contentPhase} />
          )}
          renderLink={renderSplatoonLink}
          backgroundTransition={(props) => <SplatoonBackgroundTransition {...props} />}
        />
      </Navigation>

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {/* ── Section Side Nav (right-side numbered navigation) ── */}
        <SectionSideNav
          topInset={40}
          sections={[
            { id: 'trailer', number: '01' },
            { id: 'titles', number: '02' },
            { id: 'buttons-badges', number: '03' },
            { id: 'overlays', number: '04' },
            { id: 'apparel', number: '05' },
            { id: 'card-grid', number: '06' },
            { id: 'carousels', number: '07' },
            { id: 'progress', number: '08' },
          ]}
          contentRef={contentRef}
        />

        {/* ────────────────────────────────────────────────────────
         HERO: Navigation + Ink Trail cursor effect
         ──────────────────────────────────────────────────────── */}
        <InkTrailCanvas
          colors={[
            'var(--color-yellow)',
            'var(--color-blue)',
            'var(--color-red)',
            'var(--color-green)',
            'var(--color-orange)',
          ]}
        >
          <header className="text-chaos-black pattern-chip-white relative flex flex-col items-center justify-center gap-6 bg-white px-6 pt-28 pb-12 transition-colors duration-300 md:pt-36">
            <div className="z-10 flex flex-col items-center gap-3 text-center">
              <Badge variant="sticker">
                <Zap className="text-yellow mr-1 h-3.5 w-3.5" />
                Component Library
              </Badge>
              <h1
                className="font-heading text-chaos-black text-5xl font-black tracking-wider uppercase drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)] md:text-6xl"
                style={{ transform: 'rotate(-4deg)' }}
              >
                Splatoon UI
              </h1>
              <p className="text-chaos-black/70 max-w-md text-sm font-medium md:text-base">
                Fan-made React components for ink-heavy Splatoon-inspired sites
              </p>
              <Button
                variant="blue"
                leftIcon={<GitHubMark className="h-4 w-4" />}
                render={
                  <a
                    href="https://github.com/YoungSx/splatoon-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Splatoon UI on GitHub"
                  />
                }
              >
                View GitHub
              </Button>
            </div>

            {/* Marquee Tape (Neon Yellow Warning Tape) */}
            <Marquee speed={25} variant="tape" className="z-10 w-full max-w-4xl">
              <MarqueeItem>Hero Kits</MarqueeItem>
              <MarqueeItem>Dialog Lab</MarqueeItem>
              <MarqueeItem>Gallery Tools</MarqueeItem>
              <MarqueeItem>Form States</MarqueeItem>
              <MarqueeItem>Motion Tests</MarqueeItem>
              <MarqueeItem>Pattern Sets</MarqueeItem>
            </Marquee>
          </header>
        </InkTrailCanvas>

        {/* Content sections container — observed by SectionSideNav for visibility */}
        <div
          ref={contentRef}
          className="[--section-side-nav-safe-area:3.5rem] sm:[--section-side-nav-safe-area:5.5rem] lg:[--section-side-nav-safe-area:0px]"
        >
          {/* ────────────────────────────────────────────────────────
         01 — Trailer
         ──────────────────────────────────────────────────────── */}
          <Section
            id="trailer"
            size="md"
            bgColor="bg-white"
            text="text-chaos-black"
            pattern="tapes-black"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center py-24 transition-colors duration-300"
          >
            {/* Decorative Splats */}
            <div className="text-red absolute top-10 left-10">
              <Splat3 className="h-32 w-32" />
            </div>
            <div className="text-green absolute right-10 bottom-10">
              <Splat3 className="h-48 w-48" />
            </div>

            {/* Demo reel column keeps the same wide/centered rhythm as the reference layout. */}
            <div className="mx-auto w-full max-w-[1440px] px-2 sm:px-3">
              {/* Mobile uses full width; large screens narrow the media column to 58.33%. */}
              <div className="mx-auto flex flex-col items-center sm:-mt-[5%] lg:w-[58.333%] lg:max-w-[840px]">
                <TapeTitle
                  color="red"
                  className="text-center lg:min-w-[400px]"
                  id="trailer-section-title"
                >
                  Watch the demo
                </TapeTitle>

                <div className="w-full text-center">
                  <VideoDialog>
                    <VideoDialogThumbnail
                      src={showcaseMediaAssets.trailerThumbnail.src}
                      alt={showcaseMediaAssets.trailerThumbnail.alt}
                      aria-label="Open Splatoon UI demo reel"
                      width={showcaseMediaAssets.trailerThumbnail.width}
                      height={showcaseMediaAssets.trailerThumbnail.height}
                      loading="eager"
                      blobColor="var(--color-true-black)"
                      imageClassName="sm:-top-8"
                    />
                    <VideoDialogContent src={demoVideoEmbed} title="Splatoon UI demo reel" />
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
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              {/* TapeTitle variants */}
              <InView direction="up" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>TapeTitle</CardTitle>
                    <CardDescription>
                      Asymmetric SVG tape decoration with colored background — built for loud
                      fan-site section labels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="black">Watch the demo</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="black"'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="red">Watch the demo</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="red"'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="yellow">Watch the demo</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="yellow"'}
                        </span>
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
                    <CardDescription>
                      White background with responsive sticker decorations (sticker-8, sticker-12) —
                      single style, used for section headings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-10">
                      <HeadingTape>Section Heading</HeadingTape>
                      <div className="flex w-full max-w-sm justify-center">
                        <HeadingTape size="compact">Apparel Hanging Tag Card</HeadingTape>
                      </div>
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
            bottomOverlayClearance="banner-divider"
            className="transition-colors duration-300"
            headingTape={<HeadingTape color="blue">Buttons & Badges</HeadingTape>}
          >
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              <InView direction="up" rootMargin="-50px">
                <div className="space-y-4 text-center">
                  <p className="text-chaos-black/60 mx-auto max-w-xl text-sm font-medium">
                    Squishy circular icon button with ink-splatter SVG arrows and theme-driven
                    colors.
                  </p>
                </div>
              </InView>

              {/* Variants + Sizes */}
              <InView direction="up" rootMargin="-50px">
                <div className="space-y-6">
                  <h3 className="text-center text-lg font-black tracking-wider uppercase">
                    Variants &amp; Sizes
                  </h3>
                  <p className="text-chaos-black/50 text-center text-xs">
                    6 color themes · size prop overrides variant defaults
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-5">
                    {(['carousel', 'primary', 'yellow', 'accent', 'ghost', 'outline'] as const).map(
                      (v) => (
                        <div key={v} className="flex flex-col items-center gap-3">
                          <IconButton
                            variant={v}
                            size="lg"
                            direction="right"
                            animation="squish"
                            aria-label={v}
                          />
                          <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                            {v}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap items-end justify-center gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="sm"
                        direction="right"
                        animation="squish"
                        aria-label="Small"
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        sm 40px
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="md"
                        direction="right"
                        animation="squish"
                        aria-label="Medium"
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        md 48px
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="lg"
                        direction="right"
                        animation="squish"
                        aria-label="Large"
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        lg 60px
                      </span>
                    </div>
                  </div>
                </div>
              </InView>

              {/* Behavior: animation, disabled, custom icon */}
              <InView direction="up" rootMargin="-50px">
                <div className="space-y-6">
                  <h3 className="text-center text-lg font-black tracking-wider uppercase">
                    Behavior
                  </h3>
                  <p className="text-chaos-black/50 text-center text-xs">
                    squish · pulse · disabled · custom icon
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="lg"
                        direction="right"
                        animation="squish"
                        aria-label="Squish"
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        Squish
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        variant="primary"
                        size="lg"
                        direction="right"
                        animation="pulse"
                        aria-label="Pulse"
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        Pulse
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton size="lg" direction="right" disabled aria-label="Disabled" />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        Disabled
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        variant="primary"
                        size="lg"
                        aria-label="Play"
                        icon={<Play className="h-6 w-6" fill="currentColor" strokeWidth={0} />}
                      />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                        Custom Icon
                      </span>
                    </div>
                  </div>
                </div>
              </InView>

              {/* Drip Buttons */}
              <InView direction="up" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>Drip Buttons</CardTitle>
                    <CardDescription>
                      Featuring liquid-fill math & bouncy rotational physics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4 pt-2">
                    <Button variant="yellow" theme="dark-yellow">
                      Yellow
                    </Button>
                    <Button variant="blue" theme="light-blue">
                      Blue
                    </Button>
                    <Button variant="green" theme="light-green">
                      Green
                    </Button>
                    <Button variant="orange" theme="dark-purpleOrange">
                      Orange
                    </Button>
                    <Button variant="purple" theme="dark-purple">
                      Purple
                    </Button>
                    <Button variant="destructive" theme="light-red">
                      Alert
                    </Button>
                    <Button variant="outline" theme="yellow">
                      Outline
                    </Button>
                    <Button variant="ghost">Ghost</Button>
                  </CardContent>
                </Card>
              </InView>

              {/* Sticker Badges */}
              <InView direction="up" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>Sticker Badges</CardTitle>
                    <CardDescription>
                      Ink-colored badges with offset shadows and skew
                    </CardDescription>
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
            bottomOverlayClearance="banner-divider"
            headingTape={<HeadingTape color="red">Overlays & Dialogs</HeadingTape>}
          >
            <div className="text-purple absolute top-6 right-6">
              <Splat3 className="h-24 w-24" />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              <InView direction="up" rootMargin="-50px">
                <div className="space-y-4 text-center">
                  <p className="mx-auto max-w-xl text-sm font-medium text-white/60">
                    Modal dialogs, side drawers, contextual popovers, and fan-made full-screen ink
                    splash patterns.
                  </p>
                </div>
              </InView>

              {/* Dialog demos */}
              <InView direction="up" rootMargin="-50px">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-yellow text-lg font-black tracking-wider uppercase">
                      Graffiti Dialogs
                    </h3>
                    <p className="text-xs text-white/50">
                      Paper-tear modal with rotation and caution sticker tape
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Dialog>
                        <DialogTriggerButton variant="yellow" theme="dark-yellow">
                          Yellow Dialog
                        </DialogTriggerButton>
                        <DialogContent surface="paper" hasTape={true}>
                          <DialogHeader>
                            <DialogTitle>Choice Dialog</DialogTitle>
                            <DialogDescription>
                              Use dialog body slots for compact choices, confirmations, and
                              component-level actions.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-chaos-black/80 font-bold">Choose a surface:</p>
                            <div className="mt-2 flex gap-3">
                              <Button size="sm" variant="blue" theme="light-blue">
                                Blue
                              </Button>
                              <Button size="sm" variant="orange" theme="dark-purpleOrange">
                                Orange
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTriggerButton variant="blue" theme="light-blue">
                          Blue Dialog
                        </DialogTriggerButton>
                        <DialogContent surface="cream" hasTape={true} tapePosition="event">
                          <DialogHeader>
                            <DialogTitle>Gallery Event</DialogTitle>
                            <DialogDescription>
                              A featured media wall is live. Team up to review the latest cards.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTriggerButton variant="destructive" theme="light-red">
                          Danger Dialog
                        </DialogTriggerButton>
                        <DialogContent surface="danger" hasTape={true}>
                          <DialogHeader>
                            <DialogTitle className="text-white">Destructive State</DialogTitle>
                            <DialogDescription className="text-white/80">
                              High-emphasis surface for errors, removals, and blocking feedback.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Fullscreen Dialog */}
                  <div className="space-y-4">
                    <h3 className="text-purple text-lg font-black tracking-wider uppercase">
                      Fullscreen Dialog
                    </h3>
                    <p className="text-xs text-white/50">
                      Immersive overlay for media content — use fullScreen prop
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Dialog>
                        <DialogTriggerButton variant="purple" theme="dark-purple">
                          Open Gallery
                        </DialogTriggerButton>
                        <DialogContent fullScreen>
                          <div className="flex flex-col items-center justify-center gap-6 p-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={showcaseMediaAssets.fullscreenPreview.src}
                              alt={showcaseMediaAssets.fullscreenPreview.alt}
                              width={showcaseMediaAssets.fullscreenPreview.width}
                              height={showcaseMediaAssets.fullscreenPreview.height}
                              className="w-full max-w-4xl rounded-lg"
                            />
                            <p className="text-sm text-white/60">
                              Trailer screenshot — fullscreen dialog for immersive content
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Sheet + Popover */}
                  <div className="space-y-4">
                    <h3 className="text-green text-lg font-black tracking-wider uppercase">
                      Drawers & Popovers
                    </h3>
                    <p className="text-xs text-white/50">
                      Side sheets, contextual menus and alerts
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Sheet>
                        <SheetTriggerButton variant="green" theme="light-green">
                          Right Drawer
                        </SheetTriggerButton>
                        <SheetContent
                          side="right"
                          className="shadow-soft-splat-lg text-chaos-black bg-white p-6 pt-10"
                        >
                          <SheetHeader>
                            <SheetTitle className="text-xl font-black">LOBBY TERMINAL</SheetTitle>
                            <SheetDescription>
                              Match statistics, gear catalog, and lobby features.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 py-4">
                            <div className="scrap-panel-tight border-chaos-black border-2 bg-white p-3 pt-6">
                              <h4 className="text-sm font-bold">Last Battle Result</h4>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Gallery QA - Preview room
                              </p>
                              <p className="bg-chaos-black text-yellow inline-block [transform:rotate(-2deg)] px-2 py-0.5 text-xs font-black">
                                VICTORY
                              </p>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      <Popover>
                        <PopoverTriggerButton variant="outline" theme="yellow">
                          Popover
                        </PopoverTriggerButton>
                        <PopoverContent
                          align="center"
                          className="shadow-soft-splat-sm text-chaos-black max-w-xs bg-white p-4 pt-6"
                        >
                          <PopoverHeader>
                            <PopoverTitle className="font-black">Grizzco Industries</PopoverTitle>
                            <PopoverDescription className="text-xs">
                              Corporate sponsorship details.
                            </PopoverDescription>
                          </PopoverHeader>
                          <div className="py-2 text-xs">
                            <p>Recruiting part-time workers to collect Golden Eggs.</p>
                            <p className="text-red mt-1.5 font-bold">Hazard pay included!</p>
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
              { variant: 'design2', rotate: 'down', offsetY: [0, 0] },
              { variant: 'green', rotate: 'up', offsetY: [35, 45] },
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
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
          >
            <InteractiveSplatter />
            <div className="relative z-10 w-full max-w-4xl space-y-16">
              {/* Sub-Section 1: Apparel Tags */}
              <div className="space-y-8">
                <InView direction="up" rootMargin="-50px">
                  <HeadingTape>Apparel Hanging Tag Card</HeadingTape>
                  <p className="text-chaos-black/60 mt-1 text-sm font-medium">
                    Hanging clothing-tag style container with custom clip background paths, hanger
                    cut-outs, tilted photo layers, and integrated scotch tape.
                  </p>
                </InView>

                <InViewStagger rootMargin="-30px">
                  <div className="grid gap-12 pt-6 md:grid-cols-2">
                    {/* Yellow Tag */}
                    <Card variant="rugged" ruggedTheme="yellow" rotation="-2deg">
                      <CardHeader>
                        <CardTitle>Fit Check!</CardTitle>
                      </CardHeader>
                      <CardImage
                        src={showcaseMediaAssets.ruggedLookbook.src}
                        alt={showcaseMediaAssets.ruggedLookbook.alt}
                      />
                      <CardContent>
                        <p className="text-[15px] leading-snug font-semibold">
                          Present a loud product card with layered paper, tilted media, and tape
                          details.
                        </p>
                      </CardContent>
                      <CardFooter className="mt-0 justify-center border-none">
                        <Button variant="blue" size="sm" theme="light-blue">
                          Equip Now
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Blue Tag */}
                    <Card variant="rugged" ruggedTheme="blue" rotation="3deg">
                      <CardHeader>
                        <CardTitle>Mode Card</CardTitle>
                      </CardHeader>
                      <CardImage
                        src={showcaseMediaAssets.ruggedMode.src}
                        alt={showcaseMediaAssets.ruggedMode.alt}
                      />
                      <CardContent>
                        <p className="text-[15px] leading-snug font-semibold opacity-90">
                          Show a repeatable content card for game modes, event listings, or fan
                          portal sections.
                        </p>
                      </CardContent>
                      <CardFooter className="mt-0 justify-center border-none">
                        <Button variant="yellow" size="sm" theme="dark-yellow">
                          Ink Up
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
                      <CardDescription>
                        Scroll-triggered animation — try scrolling down &amp; back up
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <InView direction="left" rootMargin="-50px">
                          <div className="bg-blue rounded-lg p-4 text-center text-sm font-black tracking-wider text-white uppercase">
                            Left
                          </div>
                        </InView>
                        <InView direction="up" rootMargin="-50px" delay={1}>
                          <div className="bg-purple rounded-lg p-4 text-center text-sm font-black tracking-wider text-white uppercase">
                            Up
                          </div>
                        </InView>
                        <InView direction="right" rootMargin="-50px" delay={2}>
                          <div className="bg-red rounded-lg p-4 text-center text-sm font-black tracking-wider text-white uppercase">
                            Right
                          </div>
                        </InView>
                        <InView direction="pop" rootMargin="-50px" delay={1}>
                          <div className="bg-yellow text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider uppercase">
                            Pop
                          </div>
                        </InView>
                        <InView drop rootMargin="-50px" delay={2}>
                          <div className="bg-green text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider uppercase">
                            Drop
                          </div>
                        </InView>
                        <InView drop="slow" rootMargin="-50px" delay={3}>
                          <div className="bg-orange text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider uppercase">
                            Slow Drop
                          </div>
                        </InView>
                      </div>
                      <InViewStagger rootMargin="-30px" className="mt-6">
                        {['Stagger 1', 'Stagger 2', 'Stagger 3', 'Stagger 4'].map((label, i) => (
                          <div
                            key={i}
                            className="from-blue to-purple mb-2 rounded-lg bg-gradient-to-r p-3 text-center text-sm font-black tracking-wider text-white uppercase last:mb-0"
                          >
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
                      <CardDescription>
                        Local squid glyph asset with ink-color backing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
                      {loaderDemoItems.map(({ label, variant, size, style }) => (
                        <div
                          key={label}
                          className="grid min-h-24 grid-rows-[1fr_auto] place-items-center gap-2 px-2 py-3 text-center"
                        >
                          <Loader variant={variant} size={size} style={style} />
                          <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                            {label}
                          </span>
                        </div>
                      ))}
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
                      <TabsList className="mb-6 w-full gap-4 sm:justify-center">
                        <TabsTrigger value="tab1">Weapons</TabsTrigger>
                        <TabsTrigger value="tab2">Stages</TabsTrigger>
                        <TabsTrigger value="tab3">Events</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="outline-none">
                        <div className="bg-blue/10 rounded-lg p-6 text-center">
                          <p className="text-blue text-sm font-bold tracking-wider uppercase">
                            Buttons, cards, dialogs &amp; more
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="tab2" className="outline-none">
                        <div className="bg-green/10 rounded-lg p-6 text-center">
                          <p className="text-green text-sm font-bold tracking-wider uppercase">
                            Layouts, states, and gallery rotations
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="tab3" className="outline-none">
                        <div className="bg-orange/10 rounded-lg p-6 text-center">
                          <p className="text-orange text-sm font-bold tracking-wider uppercase">
                            Limited-time challenges and community events
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sub-Section 4: Torn Card */}
              <div className="space-y-8">
                <HeadingTape>Torn Paper Card</HeadingTape>
                <p className="text-chaos-black/60 mt-1 text-sm font-medium">
                  Wide torn-paper background variant for dense announcement cards.
                </p>
                <Card variant="torn" rotation="-1.5deg">
                  <div className="content-spacing">
                    <h2>Component Kit Bonus</h2>
                    <p>
                      Use this torn-paper card for launch notes, setup tips, or compact feature
                      callouts.
                    </p>
                    <ul className="content-spacing ml-10 list-disc text-left">
                      <li>Pair strong headings with short body copy for fast scanning.</li>
                      <li>Use list content when announcements need multiple concrete details.</li>
                      <li>Keep decorative tape and stickers outside the reading order.</li>
                      <li>Adjust color themes per section without changing card structure.</li>
                    </ul>
                  </div>
                </Card>

                <div className="grid gap-8 md:grid-cols-2">
                  <TornCard variant="b">
                    <TornCardTitle>This is a Profile Card</TornCardTitle>
                    <TornCardDescription>
                      Drop in a short bio, feature description, or contributor blurb.
                    </TornCardDescription>
                  </TornCard>
                  <TornCard variant="c">
                    <TornCardTitle>... And This is a Variant</TornCardTitle>
                    <TornCardDescription>
                      Swap the paper shape and color while keeping the same readable layout.
                    </TornCardDescription>
                  </TornCard>
                </div>
              </div>

              {/* Sub-Section 5: StapleCards */}
              <div className="space-y-8">
                <HeadingTape>Staple Card</HeadingTape>
                <div className="grid gap-12 pt-6 md:grid-cols-2">
                  <StapleCard
                    image={
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={eventImageAssets.bigRunCallout.src}
                          alt={eventImageAssets.bigRunCallout.alt}
                          width={eventImageAssets.bigRunCallout.width}
                          height={eventImageAssets.bigRunCallout.height}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                      </>
                    }
                  >
                    <div className="space-y-3 p-4">
                      <p className="text-blue text-sm tracking-[0.35em] uppercase">News Grid</p>
                      <h4 className="text-xl font-black">Grid news card</h4>
                      <p className="text-chaos-black/75 text-sm">
                        Built using the new grid card layout with corner staples and tape accents.
                      </p>
                    </div>
                  </StapleCard>
                  <StapleCard
                    image={
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={eventImageAssets.splatnetBlade.src}
                          alt={eventImageAssets.splatnetBlade.alt}
                          width={eventImageAssets.splatnetBlade.width}
                          height={eventImageAssets.splatnetBlade.height}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                      </>
                    }
                  >
                    <div className="space-y-3 p-4">
                      <p className="text-orange text-sm tracking-[0.35em] uppercase">News Grid</p>
                      <h4 className="text-xl font-black">Secondary story block</h4>
                      <p className="text-chaos-black/75 text-sm">
                        Perfect for promotional events, limited-launch updates, and seasonal feed
                        cards.
                      </p>
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
            id="card-grid"
            size="md"
            bgColor="bg-white"
            text="text-chaos-black"
            pattern="camo-white"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
            headingTape={<HeadingTape>Card Grid</HeadingTape>}
          >
            <div className="w-full max-w-6xl space-y-12">
              <p className="text-chaos-black/60 mt-1 text-sm font-medium">
                Tape-framed section heading and grid layout for energetic magazine-style fan pages.
              </p>

              <div className="grid gap-6 lg:grid-cols-2">
                <EventCallout
                  eyebrow="Event Callout"
                  title="Alert Surface"
                  description="Curated media-backed card pattern for time-sensitive announcements, status panels, and action prompts."
                  media={eventImageAssets.bigRunCallout}
                  background={eventImageAssets.splatnetNextPage}
                  icon={eventImageAssets.goldenEgg}
                  action={
                    <Button size="sm" variant="yellow">
                      Review
                    </Button>
                  }
                />
                <EventCallout
                  eyebrow="Scene Update"
                  title="Media Block"
                  description="Responsive layout with a fixed-ratio image well, graffiti backing art, and a reusable badge slot."
                  media={eventImageAssets.splatnetBlade}
                  background={eventImageAssets.splatnetNextPage}
                  icon={eventImageAssets.goldenEgg}
                  action={
                    <Button size="sm" variant="blue">
                      Inspect
                    </Button>
                  }
                />
              </div>

              <BlackTapeContainer>
                <p className="text-sm font-medium">
                  Responsive card grid with automatic column wrapping and consistent spacing.
                </p>

                <CardGrid className="mt-6">
                  <CardGridGroup>
                    <div className="bg-blue relative overflow-hidden rounded-lg p-6 text-center text-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={eventImageAssets.bigRunCallout.src}
                        alt=""
                        width={eventImageAssets.bigRunCallout.width}
                        height={eventImageAssets.bigRunCallout.height}
                        className="absolute inset-0 h-full w-full object-cover opacity-35"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="relative z-10">
                        <h4 className="text-xl font-black">Media Feature</h4>
                        <p className="mt-2 text-sm opacity-90">Responsive image-backed grid cell</p>
                      </div>
                    </div>
                    <div className="bg-orange relative overflow-hidden rounded-lg p-6 text-center text-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={eventImageAssets.splatnetBlade.src}
                        alt=""
                        width={eventImageAssets.splatnetBlade.width}
                        height={eventImageAssets.splatnetBlade.height}
                        className="absolute inset-0 h-full w-full object-cover opacity-35"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="relative z-10">
                        <h4 className="text-xl font-black">Auto Flow</h4>
                        <p className="mt-2 text-sm opacity-90">Automatic column wrapping</p>
                      </div>
                    </div>
                  </CardGridGroup>
                  <CardGridGroup>
                    <div className="bg-green relative overflow-hidden rounded-lg p-6 text-center text-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={eventImageAssets.splatnetNextPage.src}
                        alt=""
                        width={eventImageAssets.splatnetNextPage.width}
                        height={eventImageAssets.splatnetNextPage.height}
                        className="absolute inset-0 h-full w-full object-cover opacity-35"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="relative z-10">
                        <h4 className="text-xl font-black">Spacing Token</h4>
                        <p className="mt-2 text-sm opacity-90">Consistent section rhythm</p>
                      </div>
                    </div>
                    <div className="bg-red relative overflow-hidden rounded-lg p-6 text-center text-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={eventImageAssets.goldenEgg.src}
                        alt=""
                        width={eventImageAssets.goldenEgg.width}
                        height={eventImageAssets.goldenEgg.height}
                        className="absolute top-3 right-3 h-12 w-auto rotate-12 opacity-70"
                        loading="lazy"
                        draggable={false}
                      />
                      <h4 className="relative z-10 text-xl font-black">Magazine Stack</h4>
                      <p className="relative z-10 mt-2 text-sm opacity-90">Dense layout modules</p>
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
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
            headingTape={
              <div className="text-center">
                <HeadingTape color="yellow">Carousels</HeadingTape>
                <p className="mt-2 text-sm font-medium text-white/80">
                  Carousel components tuned for ink-heavy galleries and fan portals.
                </p>
              </div>
            }
          >
            <DemoContent>
              {/* 3D Splat Gallery */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider uppercase">
                  Feed Carousel
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  Swipe or click to navigate through the stacked feed cards.
                </p>
                <FeedCarousel initialIndex={2} items={homepageFeedCarouselItems} />
              </DemoExampleGroup>

              {/* Weapons Gallery Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider uppercase">
                  Weapons Gallery
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  Photo gallery with rotation transitions and pagination dots, navigated
                  sequentially with arrow controls.
                </p>
                <WeaponsGalleryCarousel items={weaponsGalleryItems} />
              </DemoExampleGroup>

              {/* Shops Gallery Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider uppercase">
                  Shops Gallery
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  Gallery with image pagination. Each content pack has a distinct local reference
                  icon.
                </p>
                <IconPaginatedCarousel items={shopsGalleryItems} />
              </DemoExampleGroup>

              {/* Marquee Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider uppercase">
                  Infinite Marquee
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  Continuous scrolling marquee with curated weapon reference art, duplicated for
                  seamless looping.
                </p>
                <MarqueeCarousel items={marqueeItems} />
              </DemoExampleGroup>
            </DemoContent>
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
                <p className="mt-2 text-sm font-medium text-white/60">
                  Form controls, alerts, and progress indicators.
                </p>
              </div>
            }
          >
            <DemoContent width="narrow">
              {/* Forms */}
              <div className="grid gap-8 md:grid-cols-2">
                <Card variant="paper" surface="white">
                  <CardHeader>
                    <CardTitle>Input & Selection</CardTitle>
                    <CardDescription>
                      Form controls with bold borders and ink theme accents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="demo-input">Display Name</Label>
                      <Input id="demo-input" placeholder="ENTER DISPLAY NAME..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout Preference</Label>
                      <Select defaultValue="gallery">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="SELECT LAYOUT" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gallery">Gallery</SelectItem>
                          <SelectItem value="cards">Cards</SelectItem>
                          <SelectItem value="forms">Forms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Notification Settings</Label>
                      <div className="flex items-center gap-3">
                        <Checkbox id="demo-checkbox-1" defaultChecked />
                        <Label
                          htmlFor="demo-checkbox-1"
                          className="cursor-pointer pb-0 text-sm font-medium"
                        >
                          Receive release notes
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="demo-checkbox-2" />
                        <Label
                          htmlFor="demo-checkbox-2"
                          className="cursor-pointer pb-0 text-sm font-medium"
                        >
                          Enable desktop sounds
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Component Family</Label>
                      <RadioGroup defaultValue="buttons">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem id="r1" value="buttons" />
                          <Label htmlFor="r1" className="cursor-pointer pb-0 text-sm font-medium">
                            Buttons
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem id="r2" value="cards" />
                          <Label htmlFor="r2" className="cursor-pointer pb-0 text-sm font-medium">
                            Cards
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem id="r3" value="dialogs" />
                          <Label htmlFor="r3" className="cursor-pointer pb-0 text-sm font-medium">
                            Dialogs
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" surface="white">
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>
                      Torn-paper alert cards with tape and sticker decorations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6 pt-2">
                    <Alert variant="default">
                      <AlertTitle>Surface Notice</AlertTitle>
                      <AlertDescription>
                        This alert state is tuned for neutral updates, validation notes, and
                        component-level status messages.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle textColor="#02e754">Action Required</AlertTitle>
                      <AlertDescription textColor="#ffffffcc">
                        Destructive alerts keep contrast high for validation failures and critical
                        component states.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bars */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-end justify-between px-2">
                    <h3 className="text-lg font-black text-white/80 uppercase">Catalog Progress</h3>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-yellow)' }}>
                      75 / 100
                    </span>
                  </div>
                  <Progress value={75} variant="yellow" trackVariant="dark" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between px-2">
                    <h3 className="text-lg font-black text-white/80 uppercase">Gallery Coverage</h3>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-blue)' }}>
                      45.2%
                    </span>
                  </div>
                  <Progress value={45} variant="blue" trackVariant="dark" size="lg" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between px-2">
                    <h3 className="text-lg font-black text-white/80 uppercase">Reset Queue</h3>
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--color-nintendo-red)' }}
                    >
                      10%
                    </span>
                  </div>
                  <Progress value={10} variant="red" trackVariant="dark" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between px-2">
                    <h3 className="text-lg font-black text-white/80 uppercase">Theme Completion</h3>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-green)' }}>
                      92%
                    </span>
                  </div>
                  <Progress value={92} variant="green" trackVariant="light" />
                </div>
              </div>
            </DemoContent>
          </Section>
        </div>

        {/* Warning Marquee (Bottom Decoration) */}
        <Marquee
          speed={20}
          variant="warning"
          direction="right"
          className="border-chaos-black w-full border-t-2 border-b-2"
        >
          <MarqueeItem>Ship Bold!</MarqueeItem>
          <MarqueeItem>Ink The UI!</MarqueeItem>
          <MarqueeItem>Review States!</MarqueeItem>
          <MarqueeItem>Stay Sharp!</MarqueeItem>
          <MarqueeItem>Motion Ready!</MarqueeItem>
        </Marquee>
      </main>

      <Footer />
    </div>
  )
}
