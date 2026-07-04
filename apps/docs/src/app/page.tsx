'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupItem } from '@/components/ui/button-group'
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
import { List, ListItem } from '@/components/ui/list'

import { Tabs, TabsContent, TabsList, TabsPanels, TabsTrigger } from '@/components/ui/tabs'
import { TornCard, TornCardTitle, TornCardDescription } from '@/components/ui/torn-card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Play } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'
import { NavigationDialog } from '@/components/ui/navigation-dialog'
import {
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
import {
  BannerDivider,
  type BannerDividerTape,
  type BannerDividerVariant,
} from '@/components/ui/banner-divider'
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
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control'
import { Switch } from '@/components/ui/switch'
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
import { type Locale, getTranslations } from '@/lib/i18n'

function createDemoEmbed(label: string) {
  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0d0d0d;color:#eaff3d;font-family:Arial,sans-serif;overflow:hidden">
        <main style="position:relative;isolation:isolate;text-align:center;font-weight:900;letter-spacing:.12em">
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

function createTwoTapeDivider(
  pattern: BannerDividerVariant,
  color: BannerDividerVariant
): [BannerDividerTape, BannerDividerTape] {
  return [
    { variant: pattern, rotate: -1.5, offsetY: 0, enterFrom: 'left' },
    { variant: color, rotate: 1.5, offsetY: { base: 35, medium: 45 }, enterFrom: 'right' },
  ]
}

function FeedCardImage({ asset }: { asset: ImageAsset }) {
  return <AssetImage asset={asset} fill fit="cover" loading="eager" />
}

function DemoVariantLabel({
  children,
  tone = 'dark',
}: {
  children: React.ReactNode
  tone?: 'dark' | 'light'
}) {
  return (
    <span
      className={
        tone === 'light'
          ? 'font-mono text-[11px] font-bold tracking-wider text-white/55'
          : 'text-chaos-black/45 font-mono text-[11px] font-bold tracking-wider'
      }
    >
      {children}
    </span>
  )
}

// ── Page Transition Demo ────────────────────────────────────────────────────

type PageTransitionDemoProps = {
  t: ReturnType<typeof getTranslations>['pageTransition']
}

function PageTransitionDemo({ t }: PageTransitionDemoProps) {
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

  const current = t.pages[demoPage]

  return (
    <Section
      size="md"
      backgroundClassName="bg-white"
      textClassName="text-chaos-black"
      pattern="chip-white"
      bottomOverlayClearance="banner-divider"
      className="transition-colors duration-300"
      headingTape={<HeadingTape className="text-center">{t.sectionTitle}</HeadingTape>}
    >
      <InView direction="pop" rootMargin="-50px">
        <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6">
          <p className="text-chaos-black/60 text-center text-sm font-medium">
            {variant === 'webgl' ? t.webglDesc : t.squidDesc}
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
                    src={pageTransitionCharacterAssets[demoPage].src}
                    alt={pageTransitionCharacterAssets[demoPage].alt}
                    width={pageTransitionCharacterAssets[demoPage].width}
                    height={pageTransitionCharacterAssets[demoPage].height}
                    className="mx-auto h-28 w-auto object-contain drop-shadow-[3px_5px_0_rgba(0,0,0,0.2)]"
                    decoding="async"
                    draggable={false}
                    loading="lazy"
                  />
                  <h3 className="text-2xl font-black tracking-wider md:text-3xl">
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
                    src={pageTransitionCharacterAssets[demoPage].src}
                    alt={pageTransitionCharacterAssets[demoPage].alt}
                    width={pageTransitionCharacterAssets[demoPage].width}
                    height={pageTransitionCharacterAssets[demoPage].height}
                    className="mx-auto h-28 w-auto object-contain drop-shadow-[3px_5px_0_rgba(0,0,0,0.2)]"
                    decoding="async"
                    draggable={false}
                    loading="lazy"
                  />
                  <h3 className="text-2xl font-black tracking-wider md:text-3xl">
                    {current.title}
                  </h3>
                  <p className="text-chaos-black/50 text-sm font-medium">{current.subtitle}</p>
                </div>
              </div>
            </SquidMaskTransition>
          </div>

          <div className="flex justify-center">
            <DemoVariantLabel>
              {variant === 'webgl' ? '<PageTransition />' : '<SquidMaskTransition />'}
            </DemoVariantLabel>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="yellow"
              onClick={() => navigateTo('home', 'webgl', 'var(--color-true-black)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'home')}
            >
              {t.buttons.demoHub}
            </Button>
            <Button
              variant="blue"
              onClick={() => navigateTo('about', 'webgl', 'var(--color-blue)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'about')}
            >
              {t.buttons.scenes}
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigateTo('weapons', 'webgl', 'var(--color-red)')}
              disabled={isTransitioning || (variant === 'webgl' && demoPage === 'weapons')}
            >
              {t.buttons.tools}
            </Button>
            <Button
              variant="green"
              onClick={() => navigateTo('home', 'squid')}
              disabled={isTransitioning || (variant === 'squid' && demoPage === 'home')}
            >
              {t.buttons.maskCanvas}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {variant === 'webgl' ? (
              <>
                <Badge color="yellow">{t.badges.webgl[0]}</Badge>
                <Badge color="blue">{t.badges.webgl[1]}</Badge>
                <Badge color="green">{t.badges.webgl[2]}</Badge>
                <Badge color="monochrome">{t.badges.webgl[3]}</Badge>
              </>
            ) : (
              <>
                <Badge color="yellow">{t.badges.squid[0]}</Badge>
                <Badge color="blue">{t.badges.squid[1]}</Badge>
                <Badge color="green">{t.badges.squid[2]}</Badge>
                <Badge color="monochrome">{t.badges.squid[3]}</Badge>
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

export default function Home() {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [locale, setLocale] = React.useState<Locale>('zh')
  const t = getTranslations(locale)

  const loaderDemoItems: Array<{
    label: string
    variant?: React.ComponentProps<typeof Loader>['variant']
    animation?: React.ComponentProps<typeof Loader>['animation']
    size?: string
    style?: React.CSSProperties
  }> = [
    { label: t.apparel.loaderCard.items[0], variant: 'default' },
    { label: t.apparel.loaderCard.items[1], variant: 'blue', size: '1.5em' },
    { label: t.apparel.loaderCard.items[2], variant: 'red', size: '2em' },
    {
      label: t.apparel.loaderCard.items[3],
      variant: 'default',
      size: '2em',
      style: { '--color': 'var(--color-green)' } as React.CSSProperties,
    },
    { label: t.apparel.loaderCard.items[4], animation: 'morph', size: '2.25em' },
    { label: t.apparel.loaderCard.items[5], animation: 'swim', variant: 'blue', size: '2.25em' },
  ]

  const getLoaderDemoVariantLabel = ({
    animation = 'glyph',
    size,
    variant = 'default',
  }: {
    animation?: React.ComponentProps<typeof Loader>['animation']
    size?: string
    variant?: React.ComponentProps<typeof Loader>['variant']
  }) =>
    [
      `variant="${variant}"`,
      animation !== 'glyph' ? `animation="${animation}"` : null,
      size ? `size="${size}"` : null,
    ]
      .filter(Boolean)
      .join(' ')

  const homepageFeedCarouselItems = [
    {
      id: 'event-brief',
      image: <FeedCardImage asset={eventImageAssets.bigRunCallout} />,
      title: t.carousels.feedItems.eventBrief.title,
      subtitle: t.carousels.feedItems.eventBrief.subtitle,
    },
    {
      id: 'stage-panel',
      image: <FeedCardImage asset={eventImageAssets.splatnetBlade} />,
      title: t.carousels.feedItems.stagePanel.title,
      subtitle: t.carousels.feedItems.stagePanel.subtitle,
    },
    {
      id: 'battle-frame',
      image: <FeedCardImage asset={showcaseMediaAssets.turfWarLeft} />,
      title: t.carousels.feedItems.battleFrame.title,
      subtitle: t.carousels.feedItems.battleFrame.subtitle,
    },
    {
      id: 'mode-card',
      image: <FeedCardImage asset={showcaseMediaAssets.ruggedMode} />,
      title: t.carousels.feedItems.modeCard.title,
      subtitle: t.carousels.feedItems.modeCard.subtitle,
    },
    {
      id: 'gallery-shot',
      image: <FeedCardImage asset={showcaseMediaAssets.splatfestSecondary} />,
      title: t.carousels.feedItems.galleryShot.title,
      subtitle: t.carousels.feedItems.galleryShot.subtitle,
    },
    {
      id: 'graffiti-note',
      image: <FeedCardImage asset={eventImageAssets.splatnetNextPage} />,
      title: t.carousels.feedItems.graffitiNote.title,
      subtitle: t.carousels.feedItems.graffitiNote.subtitle,
    },
  ].map((item) => ({
    ...item,
    hoverTilt: true,
    action: (
      <>
        <p className="text-chaos-black/60 text-sm font-bold">{t.carousels.feedItems.actionDesc}</p>
        <Button size="sm" variant="arrow">
          {t.carousels.feedItems.read}
        </Button>
      </>
    ),
  }))

  const navLinks = [
    {
      label: t.nav.home,
      href: '#',
      selectedKey: 'home',
      hoverSplatId: 5,
      hoverSplatColor: 'var(--color-yellow)',
      hoverSplatClassName:
        '-left-[2.5em] top-1/2 h-[4em] w-[4em] -translate-y-[46%] rotate-[-18deg]',
    },
    {
      label: t.nav.docs,
      href: '/en/docs',
      selectedKey: 'docs',
      hoverSplatId: 2,
      hoverSplatColor: 'var(--color-green)',
      hoverSplatClassName:
        '-left-[2.35em] top-1/2 h-[4.1em] w-[4.1em] -translate-y-[45%] rotate-[10deg]',
    },
    {
      label: t.nav.demoReel,
      href: '#trailer',
      selectedKey: 'trailer',
      hoverSplatId: 9,
      hoverSplatColor: 'var(--color-blue)',
      hoverSplatClassName:
        '-left-[2.35em] top-1/2 h-[4.2em] w-[4.2em] -translate-y-[44%] rotate-[12deg]',
    },
    {
      label: t.nav.foundations,
      href: '#foundations',
      selectedKey: 'foundations',
      hoverSplatId: 8,
      hoverSplatColor: 'var(--color-yellow)',
      hoverSplatClassName:
        '-left-[2.45em] top-1/2 h-[4.05em] w-[4.05em] -translate-y-[45%] rotate-[14deg]',
    },
    {
      label: t.nav.actions,
      href: '#actions',
      selectedKey: 'actions',
      hoverSplatId: 11,
      hoverSplatColor: 'var(--color-blue)',
      hoverSplatClassName:
        '-left-[2.5em] top-1/2 h-[4.25em] w-[4.25em] -translate-y-[45%] rotate-[-10deg]',
    },
    {
      label: t.nav.formsControls,
      href: '#forms-controls',
      selectedKey: 'forms-controls',
      hoverSplatId: 10,
      hoverSplatColor: 'var(--color-blue)',
      hoverSplatClassName:
        '-left-[2.65em] top-1/2 h-[4.35em] w-[4.35em] -translate-y-[44%] -rotate-[18deg]',
    },
    {
      label: t.nav.navigation,
      href: '#navigation-components',
      selectedKey: 'navigation-components',
      hoverSplatId: 4,
      hoverSplatColor: 'var(--color-yellow)',
      hoverSplatClassName:
        '-left-[2.45em] top-1/2 h-[4.1em] w-[4.1em] -translate-y-[44%] rotate-[10deg]',
    },
    {
      label: t.nav.feedbackOverlays,
      href: '#feedback-overlays',
      selectedKey: 'feedback-overlays',
      hoverSplatId: 6,
      hoverSplatColor: 'var(--color-yellow)',
      hoverSplatClassName:
        '-left-[2.3em] top-1/2 h-[3.95em] w-[3.95em] -translate-y-[44%] rotate-[8deg]',
    },
    {
      label: t.nav.cardsSurfaces,
      href: '#cards-surfaces',
      selectedKey: 'cards-surfaces',
      hoverSplatId: 3,
      hoverSplatColor: 'var(--color-blue)',
      hoverSplatClassName:
        '-left-[2.45em] top-1/2 h-[4.1em] w-[4.1em] -translate-y-[44%] -rotate-[12deg]',
    },
    {
      label: t.nav.motionMedia,
      href: '#motion-media',
      selectedKey: 'motion-media',
      hoverSplatId: 12,
      hoverSplatColor: 'var(--color-blue)',
      hoverSplatClassName:
        '-left-[2.55em] top-1/2 h-[4.3em] w-[4.3em] -translate-y-[44%] rotate-[16deg]',
    },
  ]

  return (
    <div className="text-chaos-black flex min-h-screen flex-col bg-white font-sans transition-colors duration-300">
      {/* 🦑 Navigation Header Bar */}
      <Navigation
        headerDecoration={(isCollapsed) => <SplatoonHeaderDrip isCollapsed={isCollapsed} />}
        headerActions={
          <SegmentedControl
            appearance="track"
            density="compact"
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
            aria-label={t.nav.languageLabel}
            style={{ '--segmented-control-track-width': '3rem' } as React.CSSProperties}
          >
            <SegmentedControlItem value="zh">中</SegmentedControlItem>
            <SegmentedControlItem value="en">EN</SegmentedControlItem>
            <SegmentedControlItem value="ja">日</SegmentedControlItem>
          </SegmentedControl>
        }
      >
        <NavigationDialog
          navLinks={navLinks}
          highlightColor="var(--color-yellow)"
          navLabel={t.nav.navLabel}
          closeLabel={t.nav.closeMenu}
          cta={
            <Button
              variant="yellow"
              size="lg"
              theme="dark-yellow"
              leftIcon={<GitHubMark className="h-5 w-5 translate-y-px" />}
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
            { id: 'foundations', number: '02' },
            { id: 'actions', number: '03' },
            { id: 'forms-controls', number: '04' },
            { id: 'navigation-components', number: '05' },
            { id: 'feedback-overlays', number: '06' },
            { id: 'cards-surfaces', number: '07' },
            { id: 'motion-media', number: '08' },
          ]}
          navLabel={t.sideNav.navLabel}
          backToTopLabel={t.sideNav.backToTop}
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
              <Badge color="yellow">{t.hero.badge}</Badge>
              <h1
                className="font-heading text-chaos-black text-5xl font-black tracking-wider drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)] md:text-6xl"
                style={{ transform: 'rotate(-4deg)' }}
              >
                {t.hero.title}
              </h1>
              <p className="text-chaos-black/70 max-w-md text-sm font-medium md:text-base">
                {t.hero.description}
              </p>
              <Button
                variant="blue"
                leftIcon={<GitHubMark className="h-4 w-4 translate-y-px" />}
                render={
                  <a
                    href="https://github.com/YoungSx/splatoon-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Splatoon UI on GitHub"
                  />
                }
              >
                {t.hero.githubButton}
              </Button>
            </div>
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
            backgroundClassName="bg-black"
            textClassName="text-white"
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
                  {t.trailer.sectionTitle}
                </TapeTitle>

                <div className="w-full text-center">
                  <VideoDialog>
                    <VideoDialogThumbnail
                      src={showcaseMediaAssets.trailerThumbnail.src}
                      alt={showcaseMediaAssets.trailerThumbnail.alt}
                      aria-label={t.trailer.openReel}
                      width={showcaseMediaAssets.trailerThumbnail.width}
                      height={showcaseMediaAssets.trailerThumbnail.height}
                      loading="eager"
                      blobColor="var(--color-true-black)"
                      imageClassName="sm:-top-8"
                    />
                    <VideoDialogContent src={demoVideoEmbed} title={t.trailer.videoTitle} />
                  </VideoDialog>
                </div>
              </div>
            </div>
          </Section>

          {/* Banner divider: Trailer → Foundations */}
          <BannerDivider tapes={createTwoTapeDivider('design1', 'yellow')} animate />

          {/* ────────────────────────────────────────────────────────
         02 — Foundations
         ──────────────────────────────────────────────────────── */}
          <Section
            id="foundations"
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="chip-white"
            bottomOverlayClearance="banner-divider"
            className="transition-colors duration-300"
            headingTape={<HeadingTape>{t.titles.sectionTitle}</HeadingTape>}
          >
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              {/* TapeTitle variants */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.titles.tapeTitleCard.title}</CardTitle>
                    <CardDescription>{t.titles.tapeTitleCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="black">{t.titles.tapeTitleCard.demoText}</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="black"'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="red">{t.titles.tapeTitleCard.demoText}</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="red"'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <TapeTitle color="yellow">{t.titles.tapeTitleCard.demoText}</TapeTitle>
                        <span className="text-chaos-black/40 font-mono text-xs">
                          {'color="yellow"'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </InView>

              {/* HeadingTape */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.titles.headingTapeCard.title}</CardTitle>
                    <CardDescription>{t.titles.headingTapeCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-10">
                      <div className="flex w-full flex-col items-center gap-2">
                        <HeadingTape>{t.titles.headingTapeCard.sectionHeading}</HeadingTape>
                        <DemoVariantLabel>default</DemoVariantLabel>
                      </div>
                      <div className="flex w-full max-w-sm flex-col items-center gap-2">
                        <HeadingTape size="compact">
                          {t.titles.headingTapeCard.compactHeading}
                        </HeadingTape>
                        <DemoVariantLabel>{'size="compact"'}</DemoVariantLabel>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </InView>

              {/* List */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.titles.listCard.title}</CardTitle>
                    <CardDescription>{t.titles.listCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <List aria-label={t.titles.listCard.title}>
                      {t.titles.listCard.items.map((item) => (
                        <ListItem key={item}>{item}</ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </InView>
            </div>
          </Section>

          {/* Banner divider: Foundations → Actions */}
          <BannerDivider tapes={createTwoTapeDivider('design2', 'blue')} animate />

          {/* ────────────────────────────────────────────────────────
         03 — Actions
         ──────────────────────────────────────────────────────── */}
          <Section
            id="actions"
            size="lg"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="chip-white"
            bottomOverlayClearance="banner-divider"
            className="transition-colors duration-300"
            headingTape={<HeadingTape>{t.buttons.sectionTitle}</HeadingTape>}
          >
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              <InView rootMargin="-50px">
                <div className="space-y-4 text-center">
                  <p className="text-chaos-black/60 mx-auto max-w-xl text-sm font-medium">
                    {t.buttons.iconButtonDesc}
                  </p>
                </div>
              </InView>

              {/* Variants + Sizes */}
              <InView direction="pop" rootMargin="-50px">
                <div className="space-y-6">
                  <h3 className="text-center text-lg font-black tracking-wider">
                    {t.buttons.variantsTitle}
                  </h3>
                  <p className="text-chaos-black/50 text-center text-xs">
                    {t.buttons.variantsDesc}
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
                          <span className="text-[11px] font-bold tracking-wider opacity-60">
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
                        aria-label={t.buttons.sizes.sm}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.sizes.sm}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="md"
                        direction="right"
                        animation="squish"
                        aria-label={t.buttons.sizes.md}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.sizes.md}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="lg"
                        direction="right"
                        animation="squish"
                        aria-label={t.buttons.sizes.lg}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.sizes.lg}
                      </span>
                    </div>
                  </div>
                </div>
              </InView>

              {/* Behavior: animation, disabled, custom icon */}
              <InView direction="pop" rootMargin="-50px">
                <div className="space-y-6">
                  <h3 className="text-center text-lg font-black tracking-wider">
                    {t.buttons.behaviorTitle}
                  </h3>
                  <p className="text-chaos-black/50 text-center text-xs">
                    {t.buttons.behaviorDesc}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="lg"
                        direction="right"
                        animation="squish"
                        aria-label={t.buttons.squish}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.squish}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        variant="primary"
                        size="lg"
                        direction="right"
                        animation="pulse"
                        aria-label={t.buttons.pulse}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.pulse}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        size="lg"
                        direction="right"
                        disabled
                        aria-label={t.buttons.disabled}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.disabled}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <IconButton
                        variant="primary"
                        size="lg"
                        aria-label={t.buttons.customIcon}
                        icon={<Play className="h-6 w-6" fill="currentColor" strokeWidth={0} />}
                      />
                      <span className="text-[11px] font-bold tracking-wider opacity-60">
                        {t.buttons.customIcon}
                      </span>
                    </div>
                  </div>
                </div>
              </InView>

              {/* Drip Buttons */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.buttons.dripCard.title}</CardTitle>
                    <CardDescription>{t.buttons.dripCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-row flex-wrap items-start gap-4 pt-2">
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="yellow" theme="dark-yellow">
                        {t.buttons.dripCard.yellow}
                      </Button>
                      <DemoVariantLabel>{'variant="yellow"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="blue" theme="light-blue">
                        {t.buttons.dripCard.blue}
                      </Button>
                      <DemoVariantLabel>{'variant="blue"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="green" theme="light-green">
                        {t.buttons.dripCard.green}
                      </Button>
                      <DemoVariantLabel>{'variant="green"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="orange" theme="dark-purpleOrange">
                        {t.buttons.dripCard.orange}
                      </Button>
                      <DemoVariantLabel>{'variant="orange"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="purple" theme="dark-purple">
                        {t.buttons.dripCard.purple}
                      </Button>
                      <DemoVariantLabel>{'variant="purple"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="destructive" theme="light-red">
                        {t.buttons.dripCard.alert}
                      </Button>
                      <DemoVariantLabel>{'variant="destructive"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="outline" theme="yellow">
                        {t.buttons.dripCard.outline}
                      </Button>
                      <DemoVariantLabel>{'variant="outline"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="ghost">{t.buttons.dripCard.ghost}</Button>
                      <DemoVariantLabel>{'variant="ghost"'}</DemoVariantLabel>
                    </div>
                  </CardContent>
                </Card>
              </InView>

              {/* Button Groups */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.buttons.groupCard.title}</CardTitle>
                    <CardDescription>{t.buttons.groupCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 pt-2">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <ButtonGroup aria-label={t.buttons.groupCard.battleLabel}>
                          <ButtonGroupItem size="sm" variant="yellow" theme="dark-yellow">
                            {t.buttons.groupCard.turf}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="blue" theme="light-blue">
                            {t.buttons.groupCard.ranked}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="green" theme="light-green">
                            {t.buttons.groupCard.salmon}
                          </ButtonGroupItem>
                        </ButtonGroup>
                        <DemoVariantLabel>default density</DemoVariantLabel>
                      </div>
                      <div className="flex flex-col gap-2">
                        <ButtonGroup
                          density="compact"
                          aria-label={t.buttons.groupCard.catalogLabel}
                        >
                          <ButtonGroupItem size="sm" variant="outline" theme="yellow">
                            {t.buttons.groupCard.new}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="outline" theme="yellow">
                            {t.buttons.groupCard.hot}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="outline" theme="yellow">
                            {t.buttons.groupCard.saved}
                          </ButtonGroupItem>
                        </ButtonGroup>
                        <DemoVariantLabel>{'density="compact"'}</DemoVariantLabel>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <ButtonGroup aria-label={t.buttons.groupCard.loadoutLabel}>
                          <ButtonGroupItem size="sm" variant="purple" theme="dark-purple">
                            {t.buttons.groupCard.gear}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="orange" theme="dark-purpleOrange">
                            {t.buttons.groupCard.weapons}
                          </ButtonGroupItem>
                          <ButtonGroupItem size="sm" variant="destructive" theme="light-red">
                            {t.buttons.groupCard.reset}
                          </ButtonGroupItem>
                        </ButtonGroup>
                        <DemoVariantLabel>mixed variants</DemoVariantLabel>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </InView>

              {/* Badges */}
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.buttons.badgesCard.title}</CardTitle>
                    <CardDescription>{t.buttons.badgesCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex flex-wrap items-start gap-4">
                      {(
                        [
                          ['yellow', t.buttons.badgesCard.yellow],
                          ['blue', t.buttons.badgesCard.blue],
                          ['red', t.buttons.badgesCard.red],
                          ['green', t.buttons.badgesCard.green],
                          ['purple', t.buttons.badgesCard.sticker],
                          ['monochrome', t.buttons.badgesCard.torn],
                        ] as const
                      ).map(([color, label]) => (
                        <div key={color} className="flex flex-col items-center gap-2">
                          <Badge color={color}>{label}</Badge>
                          <DemoVariantLabel>{`color="${color}"`}</DemoVariantLabel>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </InView>

              <div className="flex flex-wrap justify-center gap-3">
                {Array.from(t.buttons.badgesFooter).map((label, i) => (
                  <Badge key={i} color={(['yellow', 'blue', 'green', 'monochrome'] as const)[i]}>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </Section>

          {/* Banner divider: Actions → Forms & Controls */}
          <BannerDivider tapes={createTwoTapeDivider('design2', 'green')} animate />

          {/* ────────────────────────────────────────────────────────
         04 — Forms & Controls
         ──────────────────────────────────────────────────────── */}
          <Section
            id="forms-controls"
            size="md"
            backgroundClassName="bg-black"
            textClassName="text-white"
            pattern="camo-black"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center"
            headingTape={
              <div className="text-center">
                <HeadingTape>{t.forms.sectionTitle}</HeadingTape>
                <p className="mt-2 text-sm font-medium text-white/60">{t.forms.sectionDesc}</p>
              </div>
            }
          >
            <DemoContent>
              <InViewStagger variant="pop" rootMargin="-30px">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card variant="paper" surface="white" className="w-full">
                    <CardHeader>
                      <CardTitle>{t.forms.inputCard.title}</CardTitle>
                      <CardDescription>{t.forms.inputCard.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="demo-input">{t.forms.inputCard.inputLabel}</Label>
                        <Input id="demo-input" placeholder={t.forms.inputCard.inputPlaceholder} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.forms.inputCard.selectLabel}</Label>
                        <Select defaultValue="gallery">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t.forms.inputCard.selectPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gallery">{t.forms.inputCard.gallery}</SelectItem>
                            <SelectItem value="cards">{t.forms.inputCard.cards}</SelectItem>
                            <SelectItem value="forms">{t.forms.inputCard.forms}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="paper" surface="white" className="w-full">
                    <CardHeader>
                      <CardTitle>{t.forms.controlsCard.title}</CardTitle>
                      <CardDescription>{t.forms.controlsCard.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-2">
                      <div className="flex flex-col gap-3">
                        <Label>{t.forms.controlsCard.checkboxLabel}</Label>
                        <div className="flex min-w-0 items-center gap-3">
                          <Checkbox id="demo-checkbox-1" defaultChecked />
                          <Label
                            htmlFor="demo-checkbox-1"
                            className="cursor-pointer pb-0 text-sm font-medium"
                          >
                            {t.forms.controlsCard.checked}
                          </Label>
                        </div>
                        <div className="flex min-w-0 items-center gap-3">
                          <Checkbox id="demo-checkbox-2" />
                          <Label
                            htmlFor="demo-checkbox-2"
                            className="cursor-pointer pb-0 text-sm font-medium"
                          >
                            {t.forms.controlsCard.unchecked}
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.forms.controlsCard.radioGroupLabel}</Label>
                        <RadioGroup defaultValue="buttons" className="grid gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <RadioGroupItem id="r1" value="buttons" />
                            <Label htmlFor="r1" className="cursor-pointer pb-0 text-sm font-medium">
                              {t.forms.controlsCard.radioA}
                            </Label>
                          </div>
                          <div className="flex min-w-0 items-center gap-3">
                            <RadioGroupItem id="r2" value="cards" />
                            <Label htmlFor="r2" className="cursor-pointer pb-0 text-sm font-medium">
                              {t.forms.controlsCard.radioB}
                            </Label>
                          </div>
                          <div className="flex min-w-0 items-center gap-3">
                            <RadioGroupItem id="r3" value="dialogs" />
                            <Label htmlFor="r3" className="cursor-pointer pb-0 text-sm font-medium">
                              {t.forms.controlsCard.radioC}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="paper" surface="white" className="w-full">
                    <CardHeader>
                      <CardTitle>{t.forms.toggleCard.title}</CardTitle>
                      <CardDescription>{t.forms.toggleCard.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-2">
                      <div className="flex flex-col gap-3">
                        <Label>{t.forms.toggleCard.switchLabel}</Label>
                        <div className="flex items-center justify-between gap-4">
                          <div className="grid gap-1">
                            <Label
                              htmlFor="demo-switch-1"
                              className="cursor-pointer pb-0 text-sm font-medium"
                            >
                              {t.forms.toggleCard.defaultSwitch}
                            </Label>
                            <DemoVariantLabel>{'color="yellow"'}</DemoVariantLabel>
                          </div>
                          <Switch id="demo-switch-1" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="grid gap-1">
                            <Label
                              htmlFor="demo-switch-2"
                              className="cursor-pointer pb-0 text-sm font-medium"
                            >
                              {t.forms.toggleCard.themedSwitch}
                            </Label>
                            <DemoVariantLabel>{'color="green"'}</DemoVariantLabel>
                          </div>
                          <Switch
                            id="demo-switch-2"
                            color="green"
                            onLabel={t.forms.toggleCard.on}
                            offLabel={t.forms.toggleCard.off}
                          />
                        </div>
                        <div className="flex items-center justify-between gap-4 opacity-80">
                          <div className="grid gap-1">
                            <Label
                              htmlFor="demo-switch-3"
                              className="cursor-not-allowed pb-0 text-sm font-medium"
                            >
                              {t.forms.toggleCard.disabledSwitch}
                            </Label>
                            <DemoVariantLabel>{'size="sm" disabled'}</DemoVariantLabel>
                          </div>
                          <Switch id="demo-switch-3" size="sm" disabled />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label>{t.forms.toggleCard.segmentedLabel}</Label>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="grid gap-1 text-sm font-medium">
                            <span>{t.forms.toggleCard.defaultSegmented}</span>
                            <DemoVariantLabel>{'appearance="buttons"'}</DemoVariantLabel>
                          </span>
                          <SegmentedControl
                            defaultValue="en"
                            aria-label={t.forms.toggleCard.defaultSegmented}
                          >
                            <SegmentedControlItem value="ja">JP</SegmentedControlItem>
                            <SegmentedControlItem value="en">EN</SegmentedControlItem>
                            <SegmentedControlItem value="zh">ZH</SegmentedControlItem>
                          </SegmentedControl>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="grid gap-1 text-sm font-medium">
                            <span>{t.forms.toggleCard.trackSegmented}</span>
                            <DemoVariantLabel>
                              {'appearance="track" color="green"'}
                            </DemoVariantLabel>
                          </span>
                          <SegmentedControl
                            appearance="track"
                            color="green"
                            defaultValue="salmon"
                            aria-label={t.forms.toggleCard.trackSegmented}
                          >
                            <SegmentedControlItem value="turf">
                              {t.forms.toggleCard.turf}
                            </SegmentedControlItem>
                            <SegmentedControlItem value="rank">
                              {t.forms.toggleCard.rank}
                            </SegmentedControlItem>
                            <SegmentedControlItem value="salmon">
                              {t.forms.toggleCard.run}
                            </SegmentedControlItem>
                          </SegmentedControl>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="paper" surface="white" className="w-full">
                    <CardHeader>
                      <CardTitle>{t.forms.alertsCard.title}</CardTitle>
                      <CardDescription>{t.forms.alertsCard.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 pt-2">
                      <div className="grid gap-2">
                        <Alert variant="default">
                          <AlertTitle>{t.forms.alertsCard.noticeTitle}</AlertTitle>
                          <AlertDescription>{t.forms.alertsCard.noticeDesc}</AlertDescription>
                        </Alert>
                        <DemoVariantLabel>{'variant="default"'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <Alert variant="destructive">
                          <AlertTitle textColor="var(--danger-surface-title)">
                            {t.forms.alertsCard.actionTitle}
                          </AlertTitle>
                          <AlertDescription textColor="var(--danger-surface-description)">
                            {t.forms.alertsCard.actionDesc}
                          </AlertDescription>
                        </Alert>
                        <DemoVariantLabel>{'variant="destructive"'}</DemoVariantLabel>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </InViewStagger>

              <InViewStagger variant="pop" rootMargin="-30px">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-end justify-between px-2">
                      <h3 className="text-lg font-black text-white/80">
                        {t.forms.progress.catalog.label}
                      </h3>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-yellow)' }}>
                        {t.forms.progress.catalog.value}
                      </span>
                    </div>
                    <Progress value={75} variant="yellow" trackVariant="dark" />
                    <DemoVariantLabel tone="light">
                      {'variant="yellow" trackVariant="dark"'}
                    </DemoVariantLabel>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between px-2">
                      <h3 className="text-lg font-black text-white/80">
                        {t.forms.progress.gallery.label}
                      </h3>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-blue)' }}>
                        {t.forms.progress.gallery.value}
                      </span>
                    </div>
                    <Progress value={45} variant="blue" trackVariant="dark" size="lg" />
                    <DemoVariantLabel tone="light">
                      {'variant="blue" trackVariant="dark" size="lg"'}
                    </DemoVariantLabel>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between px-2">
                      <h3 className="text-lg font-black text-white/80">
                        {t.forms.progress.reset.label}
                      </h3>
                      <span
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-nintendo-red)' }}
                      >
                        {t.forms.progress.reset.value}
                      </span>
                    </div>
                    <Progress value={10} variant="red" trackVariant="dark" />
                    <DemoVariantLabel tone="light">
                      {'variant="red" trackVariant="dark"'}
                    </DemoVariantLabel>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between px-2">
                      <h3 className="text-lg font-black text-white/80">
                        {t.forms.progress.theme.label}
                      </h3>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-green)' }}>
                        {t.forms.progress.theme.value}
                      </span>
                    </div>
                    <Progress value={92} variant="green" trackVariant="light" />
                    <DemoVariantLabel tone="light">
                      {'variant="green" trackVariant="light"'}
                    </DemoVariantLabel>
                  </div>
                </div>
              </InViewStagger>
            </DemoContent>
          </Section>

          {/* Banner divider: Forms & Controls → Navigation */}
          <BannerDivider tapes={createTwoTapeDivider('design2', 'blue')} animate />

          {/* ────────────────────────────────────────────────────────
         05 — Navigation
         ──────────────────────────────────────────────────────── */}
          <Section
            id="navigation-components"
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="chip-white"
            bottomOverlayClearance="banner-divider"
            className="transition-colors duration-300"
            headingTape={<HeadingTape>{t.apparel.tabsSection}</HeadingTape>}
          >
            <div className="relative z-10 mx-auto w-full max-w-5xl">
              <InView direction="pop" rootMargin="-50px">
                <Card variant="torn" rotation="0deg" showTape={false}>
                  <CardHeader>
                    <CardTitle>{t.apparel.tabsCard.title}</CardTitle>
                    <CardDescription>{t.apparel.tabsCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-8 pt-2">
                    <div className="grid gap-3">
                      <h3 className="font-heading text-chaos-black text-xl leading-none font-black tracking-wide">
                        {t.apparel.tabsCard.defaultVariant}
                      </h3>
                      <DemoVariantLabel>
                        {'color="yellow" decorationColor="var(--color-blue)"'}
                      </DemoVariantLabel>
                      <Tabs defaultValue="tab1" className="w-full">
                        <TabsList
                          color="yellow"
                          decorationColor="var(--color-blue)"
                          className="mb-6 w-full gap-4 sm:justify-center"
                        >
                          <TabsTrigger value="tab1">{t.apparel.tabsCard.tab1}</TabsTrigger>
                          <TabsTrigger value="tab2">{t.apparel.tabsCard.tab2}</TabsTrigger>
                          <TabsTrigger value="tab3">{t.apparel.tabsCard.tab3}</TabsTrigger>
                        </TabsList>
                        <TabsPanels swipeable>
                          <TabsContent value="tab1" className="outline-none">
                            <div className="bg-blue/10 rounded-lg p-6 text-center">
                              <p className="text-blue text-sm font-bold tracking-wider">
                                {t.apparel.tabsCard.tab1Content}
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="tab2" className="outline-none">
                            <div className="bg-green/10 rounded-lg p-6 text-center">
                              <p className="text-green text-sm font-bold tracking-wider">
                                {t.apparel.tabsCard.tab2Content}
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="tab3" className="outline-none">
                            <div className="bg-orange/10 rounded-lg p-6 text-center">
                              <p className="text-orange text-sm font-bold tracking-wider">
                                {t.apparel.tabsCard.tab3Content}
                              </p>
                            </div>
                          </TabsContent>
                        </TabsPanels>
                      </Tabs>
                    </div>
                    <div className="grid gap-3">
                      <h3 className="font-heading text-chaos-black text-xl leading-none font-black tracking-wide">
                        {t.apparel.tabsCard.trapezoidVariant}
                      </h3>
                      <Tabs
                        defaultValue="map"
                        className="w-full gap-0 overflow-visible rounded-[8px] pt-4"
                      >
                        <TabsList variant="trapezoid" className="relative z-10">
                          <TabsTrigger value="map">
                            {t.apparel.tabsCard.trapezoidTabs.map}
                          </TabsTrigger>
                          <TabsTrigger value="stages">
                            {t.apparel.tabsCard.trapezoidTabs.stages}
                          </TabsTrigger>
                          <TabsTrigger value="status">
                            {t.apparel.tabsCard.trapezoidTabs.status}
                          </TabsTrigger>
                          <TabsTrigger value="options">
                            {t.apparel.tabsCard.trapezoidTabs.options}
                          </TabsTrigger>
                        </TabsList>
                        <div className="-mt-px h-5 bg-[rgb(68_68_68)]" />
                        <TabsPanels swipeable>
                          <TabsContent value="map" className="bg-[rgb(68_68_68)] p-5 text-center">
                            <p className="font-alt text-sm font-black tracking-wider text-white/70">
                              {t.apparel.tabsCard.trapezoidTabs.mapContent}
                            </p>
                          </TabsContent>
                          <TabsContent
                            value="stages"
                            className="bg-[rgb(68_68_68)] p-5 text-center"
                          >
                            <p className="font-alt text-sm font-black tracking-wider text-white/70">
                              {t.apparel.tabsCard.trapezoidTabs.stagesContent}
                            </p>
                          </TabsContent>
                          <TabsContent
                            value="status"
                            className="bg-[rgb(68_68_68)] p-5 text-center"
                          >
                            <p className="font-alt text-sm font-black tracking-wider text-white/70">
                              {t.apparel.tabsCard.trapezoidTabs.statusContent}
                            </p>
                          </TabsContent>
                          <TabsContent
                            value="options"
                            className="bg-[rgb(68_68_68)] p-5 text-center"
                          >
                            <p className="font-alt text-sm font-black tracking-wider text-white/70">
                              {t.apparel.tabsCard.trapezoidTabs.optionsContent}
                            </p>
                          </TabsContent>
                        </TabsPanels>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </InView>
            </div>
          </Section>

          {/* Banner divider: Navigation → Feedback & Overlays */}
          <BannerDivider tapes={createTwoTapeDivider('design1', 'purple')} animate />

          {/* ────────────────────────────────────────────────────────
         06 — Feedback & Overlays
         ──────────────────────────────────────────────────────── */}
          <Section
            id="feedback-overlays"
            size="lg"
            backgroundClassName="bg-black"
            textClassName="text-white"
            pattern="camo-black"
            bottomOverlayClearance="banner-divider"
            headingTape={<HeadingTape>{t.overlays.sectionTitle}</HeadingTape>}
          >
            <div className="text-purple absolute top-6 right-6">
              <Splat3 className="h-24 w-24" />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-16">
              <InView rootMargin="-50px">
                <div className="space-y-4 text-center">
                  <p className="mx-auto max-w-xl text-sm font-medium text-white/60">
                    {t.overlays.desc}
                  </p>
                </div>
              </InView>

              {/* Dialog demos */}
              <InView direction="pop" rootMargin="-50px">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-yellow text-lg font-black tracking-wider">
                      {t.overlays.graffiti.title}
                    </h3>
                    <p className="text-xs text-white/50">{t.overlays.graffiti.desc}</p>
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex flex-col items-start gap-2">
                        <Dialog>
                          <DialogTriggerButton variant="yellow" theme="dark-yellow">
                            {t.overlays.graffiti.yellow}
                          </DialogTriggerButton>
                          <DialogContent surface="paper" hasTape={true}>
                            <DialogHeader>
                              <DialogTitle>{t.overlays.graffiti.choiceTitle}</DialogTitle>
                              <DialogDescription>
                                {t.overlays.graffiti.choiceDesc}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-chaos-black/80 font-bold">
                                {t.overlays.graffiti.chooseSurface}
                              </p>
                              <div className="mt-2 flex gap-3">
                                <Button size="sm" variant="blue" theme="light-blue">
                                  {t.overlays.graffiti.colorBlue}
                                </Button>
                                <Button size="sm" variant="orange" theme="dark-purpleOrange">
                                  {t.overlays.graffiti.colorOrange}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DemoVariantLabel tone="light">{'surface="paper"'}</DemoVariantLabel>
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        <Dialog>
                          <DialogTriggerButton variant="blue" theme="light-blue">
                            {t.overlays.graffiti.blue}
                          </DialogTriggerButton>
                          <DialogContent surface="cream" hasTape={true} tapePosition="event">
                            <DialogHeader>
                              <DialogTitle>{t.overlays.graffiti.galleryTitle}</DialogTitle>
                              <DialogDescription>
                                {t.overlays.graffiti.galleryDesc}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <DemoVariantLabel tone="light">
                          {'surface="cream" tapePosition="event"'}
                        </DemoVariantLabel>
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        <Dialog>
                          <DialogTriggerButton variant="destructive" theme="light-red">
                            {t.overlays.graffiti.danger}
                          </DialogTriggerButton>
                          <DialogContent surface="danger" hasTape={true}>
                            <DialogHeader>
                              <DialogTitle>{t.overlays.graffiti.dangerTitle}</DialogTitle>
                              <DialogDescription>
                                {t.overlays.graffiti.dangerDesc}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <DemoVariantLabel tone="light">{'surface="danger"'}</DemoVariantLabel>
                      </div>
                    </div>
                  </div>

                  {/* Fullscreen Dialog */}
                  <div className="space-y-4">
                    <h3 className="text-purple text-lg font-black tracking-wider">
                      {t.overlays.fullscreen.title}
                    </h3>
                    <p className="text-xs text-white/50">{t.overlays.fullscreen.desc}</p>
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex flex-col items-start gap-2">
                        <Dialog>
                          <DialogTriggerButton variant="purple" theme="dark-purple">
                            {t.overlays.fullscreen.openButton}
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
                                decoding="async"
                                loading="lazy"
                              />
                              <p className="text-sm text-white/60">
                                {t.overlays.fullscreen.caption}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DemoVariantLabel tone="light">fullScreen</DemoVariantLabel>
                      </div>
                    </div>
                  </div>

                  {/* Sheet + Popover */}
                  <div className="space-y-4">
                    <h3 className="text-green text-lg font-black tracking-wider">
                      {t.overlays.drawers.title}
                    </h3>
                    <p className="text-xs text-white/50">{t.overlays.drawers.desc}</p>
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex flex-col items-start gap-2">
                        <Sheet>
                          <SheetTriggerButton variant="green" theme="light-green">
                            {t.overlays.drawers.rightDrawer}
                          </SheetTriggerButton>
                          <SheetContent
                            side="right"
                            className="shadow-soft-splat-lg text-chaos-black bg-white p-6 pt-10"
                          >
                            <SheetHeader>
                              <SheetTitle className="text-xl font-black">
                                {t.overlays.drawers.lobbyTitle}
                              </SheetTitle>
                              <SheetDescription>{t.overlays.drawers.lobbyDesc}</SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 py-4">
                              <div className="scrap-panel-tight border-chaos-black border-2 bg-white p-3 pt-6">
                                <h4 className="text-sm font-bold">
                                  {t.overlays.drawers.lastBattle}
                                </h4>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {t.overlays.drawers.lastBattleRoom}
                                </p>
                                <Badge
                                  color="monochrome"
                                  className="mt-2 -rotate-2"
                                  style={
                                    {
                                      '--torn-badge-text-color': 'var(--color-yellow)',
                                    } as React.CSSProperties
                                  }
                                >
                                  {t.overlays.drawers.victory}
                                </Badge>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <DemoVariantLabel tone="light">{'side="right"'}</DemoVariantLabel>
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        <Popover>
                          <PopoverTriggerButton variant="outline" theme="yellow">
                            {t.overlays.drawers.popover}
                          </PopoverTriggerButton>
                          <PopoverContent
                            align="center"
                            className="shadow-soft-splat-sm text-chaos-black max-w-xs bg-white p-4 pt-6"
                          >
                            <PopoverHeader>
                              <PopoverTitle className="font-black">
                                {t.overlays.drawers.grizzcoTitle}
                              </PopoverTitle>
                              <PopoverDescription className="text-xs">
                                {t.overlays.drawers.grizzcoDesc}
                              </PopoverDescription>
                            </PopoverHeader>
                            <div className="py-2 text-xs">
                              <p>{t.overlays.drawers.grizzcoBody}</p>
                              <p className="text-red mt-1.5 font-bold">
                                {t.overlays.drawers.grizzcoAlert}
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <DemoVariantLabel tone="light">{'align="center"'}</DemoVariantLabel>
                      </div>
                    </div>
                  </div>
                </div>
              </InView>
            </div>
          </Section>

          {/* Banner divider: Feedback & Overlays → Cards & Surfaces */}
          <BannerDivider
            animate
            tapes={[
              { variant: 'design2', rotate: 1.5, offsetY: 0, enterFrom: 'left' },
              {
                variant: 'green',
                rotate: -1.5,
                offsetY: { base: 35, medium: 45 },
                enterFrom: 'right',
              },
            ]}
          />

          {/* ────────────────────────────────────────────────────────
         06 — Cards & Surfaces
         ──────────────────────────────────────────────────────── */}
          <Section
            id="cards-surfaces"
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="camo-white-outline"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
          >
            <InteractiveSplatter />
            <div className="relative z-10 w-full max-w-4xl space-y-16">
              {/* Sub-Section 1: Apparel Tags */}
              <div className="space-y-8">
                <InView rootMargin="-50px">
                  <div>
                    <HeadingTape>{t.apparel.sectionTitle}</HeadingTape>
                    <p className="text-chaos-black/60 mt-1 text-sm font-medium">{t.apparel.desc}</p>
                  </div>
                </InView>

                <InViewStagger variant="pop" rootMargin="-30px">
                  <div className="grid gap-12 pt-6 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <Card variant="rugged" ruggedTheme="yellow" rotation="-2deg">
                        <CardHeader>
                          <CardTitle>{t.apparel.yellowCard.title}</CardTitle>
                        </CardHeader>
                        <CardImage
                          src={showcaseMediaAssets.ruggedLookbook.src}
                          alt={showcaseMediaAssets.ruggedLookbook.alt}
                        />
                        <CardContent>
                          <p className="text-[15px] leading-snug font-semibold">
                            {t.apparel.yellowCard.body}
                          </p>
                        </CardContent>
                        <CardFooter showDivider={false} className="mt-0 justify-center">
                          <Button variant="blue" size="sm" theme="light-blue">
                            {t.apparel.yellowCard.button}
                          </Button>
                        </CardFooter>
                      </Card>
                      <DemoVariantLabel>{'variant="rugged" ruggedTheme="yellow"'}</DemoVariantLabel>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Card variant="rugged" ruggedTheme="blue" rotation="3deg">
                        <CardHeader>
                          <CardTitle>{t.apparel.blueCard.title}</CardTitle>
                        </CardHeader>
                        <CardImage
                          src={showcaseMediaAssets.ruggedMode.src}
                          alt={showcaseMediaAssets.ruggedMode.alt}
                        />
                        <CardContent>
                          <p className="text-[15px] leading-snug font-semibold opacity-90">
                            {t.apparel.blueCard.body}
                          </p>
                        </CardContent>
                        <CardFooter showDivider={false} className="mt-0 justify-center">
                          <Button variant="yellow" size="sm" theme="dark-yellow">
                            {t.apparel.blueCard.button}
                          </Button>
                        </CardFooter>
                      </Card>
                      <DemoVariantLabel>{'variant="rugged" ruggedTheme="blue"'}</DemoVariantLabel>
                    </div>
                  </div>
                </InViewStagger>
              </div>
            </div>
          </Section>

          {/* Banner divider: Card Tags → Paper Cards */}
          <BannerDivider tapes={createTwoTapeDivider('design1', 'purple')} animate />

          {/* ────────────────────────────────────────────────────────
	         Cards & Surfaces — Paper Cards
	         ──────────────────────────────────────────────────────── */}
          <Section
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="camo-white-outline"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
          >
            <div className="relative z-10 w-full max-w-4xl space-y-16">
              {/* Sub-Section 2: Torn Card */}
              <div className="space-y-8">
                <InView rootMargin="-50px">
                  <div>
                    <HeadingTape>{t.apparel.tornSection}</HeadingTape>
                    <p className="text-chaos-black/60 mt-1 text-sm font-medium">
                      {t.apparel.tornDesc}
                    </p>
                  </div>
                </InView>
                <InView direction="pop" rootMargin="-50px">
                  <div className="flex flex-col gap-3">
                    <Card variant="torn" rotation="-1.5deg">
                      <div className="content-spacing">
                        <h2>{t.apparel.tornCardContent.heading}</h2>
                        <p>{t.apparel.tornCardContent.body}</p>
                        <ul className="content-spacing ml-10 list-disc text-left">
                          {t.apparel.tornCardContent.listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                    <DemoVariantLabel>{'Card variant="torn"'}</DemoVariantLabel>
                  </div>
                </InView>

                <InViewStagger variant="pop" rootMargin="-30px">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <TornCard variant="b">
                        <TornCardTitle>{t.apparel.tornCardB.title}</TornCardTitle>
                        <TornCardDescription>{t.apparel.tornCardB.desc}</TornCardDescription>
                      </TornCard>
                      <DemoVariantLabel>{'variant="b"'}</DemoVariantLabel>
                    </div>
                    <div className="flex flex-col gap-3">
                      <TornCard variant="c">
                        <TornCardTitle>{t.apparel.tornCardC.title}</TornCardTitle>
                        <TornCardDescription>{t.apparel.tornCardC.desc}</TornCardDescription>
                      </TornCard>
                      <DemoVariantLabel>{'variant="c"'}</DemoVariantLabel>
                    </div>
                  </div>
                </InViewStagger>
              </div>

              {/* Sub-Section 3: StapleCards */}
              <div className="space-y-8">
                <InView rootMargin="-50px">
                  <HeadingTape>{t.apparel.stapleSection}</HeadingTape>
                </InView>
                <InViewStagger variant="pop" rootMargin="-30px">
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
                            decoding="async"
                            loading="lazy"
                            draggable={false}
                          />
                        </>
                      }
                    >
                      <div className="space-y-3 p-4">
                        <p className="text-blue text-sm tracking-[0.35em]">
                          {t.apparel.staple1.eyebrow}
                        </p>
                        <h4 className="text-xl font-black">{t.apparel.staple1.title}</h4>
                        <p className="text-chaos-black/75 text-sm">{t.apparel.staple1.body}</p>
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
                            decoding="async"
                            loading="lazy"
                            draggable={false}
                          />
                        </>
                      }
                    >
                      <div className="space-y-3 p-4">
                        <p className="text-orange text-sm tracking-[0.35em]">
                          {t.apparel.staple2.eyebrow}
                        </p>
                        <h4 className="text-xl font-black">{t.apparel.staple2.title}</h4>
                        <p className="text-chaos-black/75 text-sm">{t.apparel.staple2.body}</p>
                      </div>
                    </StapleCard>
                  </div>
                </InViewStagger>
              </div>
            </div>
          </Section>

          {/* Cards & Surfaces continued: Card Grid */}
          <BannerDivider tapes={createTwoTapeDivider('design2', 'purple')} animate />

          {/* ────────────────────────────────────────────────────────
         Cards & Surfaces — Card Grid
         ──────────────────────────────────────────────────────── */}
          <Section
            id="card-grid"
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="camo-white"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
            headingTape={<HeadingTape>{t.cardGrid.sectionTitle}</HeadingTape>}
          >
            <div className="w-full max-w-6xl space-y-12">
              <InView rootMargin="-50px">
                <p className="text-chaos-black/60 mt-1 text-sm font-medium">{t.cardGrid.desc}</p>
              </InView>

              <InView direction="pop" rootMargin="-50px">
                <div className="grid gap-6 lg:grid-cols-2">
                  <EventCallout
                    eyebrow={t.cardGrid.event1.eyebrow}
                    title={t.cardGrid.event1.title}
                    description={t.cardGrid.event1.description}
                    media={eventImageAssets.bigRunCallout}
                    background={eventImageAssets.splatnetNextPage}
                    icon={eventImageAssets.goldenEgg}
                    action={
                      <Button size="sm" variant="yellow">
                        {t.cardGrid.event1.action}
                      </Button>
                    }
                  />
                  <EventCallout
                    eyebrow={t.cardGrid.event2.eyebrow}
                    title={t.cardGrid.event2.title}
                    description={t.cardGrid.event2.description}
                    media={eventImageAssets.splatnetBlade}
                    background={eventImageAssets.splatnetNextPage}
                    icon={eventImageAssets.goldenEgg}
                    action={
                      <Button size="sm" variant="blue">
                        {t.cardGrid.event2.action}
                      </Button>
                    }
                  />
                </div>
              </InView>

              <InView direction="pop" rootMargin="-50px">
                <BlackTapeContainer>
                  <p className="text-sm font-medium">{t.cardGrid.blackTapeDesc}</p>

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
                          decoding="async"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black">
                            {t.cardGrid.cells.mediaFeature.title}
                          </h4>
                          <p className="mt-2 text-sm opacity-90">
                            {t.cardGrid.cells.mediaFeature.subtitle}
                          </p>
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
                          decoding="async"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black">{t.cardGrid.cells.autoFlow.title}</h4>
                          <p className="mt-2 text-sm opacity-90">
                            {t.cardGrid.cells.autoFlow.subtitle}
                          </p>
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
                          decoding="async"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black">
                            {t.cardGrid.cells.spacingToken.title}
                          </h4>
                          <p className="mt-2 text-sm opacity-90">
                            {t.cardGrid.cells.spacingToken.subtitle}
                          </p>
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
                          decoding="async"
                          loading="lazy"
                          draggable={false}
                        />
                        <h4 className="relative z-10 text-xl font-black">
                          {t.cardGrid.cells.magazineStack.title}
                        </h4>
                        <p className="relative z-10 mt-2 text-sm opacity-90">
                          {t.cardGrid.cells.magazineStack.subtitle}
                        </p>
                      </div>
                    </CardGridGroup>
                  </CardGrid>
                </BlackTapeContainer>
              </InView>
            </div>
          </Section>

          {/* Banner divider: Cards & Surfaces → Motion & Media */}
          <BannerDivider tapes={createTwoTapeDivider('design1', 'green')} animate />

          {/* ────────────────────────────────────────────────────────
         08 — Motion & Media
         ──────────────────────────────────────────────────────── */}
          <Section
            id="motion-media"
            size="md"
            backgroundClassName="bg-white"
            textClassName="text-chaos-black"
            pattern="chip-white"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
            headingTape={<HeadingTape>{t.apparel.animationSection}</HeadingTape>}
          >
            <div className="relative z-10 mx-auto w-full max-w-5xl">
              <div className="grid gap-8 md:grid-cols-2">
                <Card variant="torn" rotation="0deg" showTape={false} className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>{t.apparel.inViewCard.title}</CardTitle>
                    <CardDescription>{t.apparel.inViewCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <InView direction="left" rootMargin="-50px">
                          <div className="bg-blue rounded-lg p-4 text-center text-sm font-black tracking-wider text-white">
                            {t.apparel.inViewCard.left}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'direction="left"'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <InView direction="up" rootMargin="-50px" delay={1}>
                          <div className="bg-purple rounded-lg p-4 text-center text-sm font-black tracking-wider text-white">
                            {t.apparel.inViewCard.up}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'direction="up" delay={1}'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <InView direction="right" rootMargin="-50px" delay={2}>
                          <div className="bg-red rounded-lg p-4 text-center text-sm font-black tracking-wider text-white">
                            {t.apparel.inViewCard.right}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'direction="right" delay={2}'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <InView direction="pop" rootMargin="-50px" delay={1}>
                          <div className="bg-yellow text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider">
                            {t.apparel.inViewCard.pop}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'direction="pop" delay={1}'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <InView drop rootMargin="-50px" delay={2}>
                          <div className="bg-green text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider">
                            {t.apparel.inViewCard.drop}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'drop delay={2}'}</DemoVariantLabel>
                      </div>
                      <div className="grid gap-2">
                        <InView drop="slow" rootMargin="-50px" delay={3}>
                          <div className="bg-orange text-chaos-black rounded-lg p-4 text-center text-sm font-black tracking-wider">
                            {t.apparel.inViewCard.slowDrop}
                          </div>
                        </InView>
                        <DemoVariantLabel>{'drop="slow" delay={3}'}</DemoVariantLabel>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-2">
                      <InViewStagger rootMargin="-30px">
                        <div>
                          {t.apparel.inViewCard.staggers.map((label, i) => (
                            <div
                              key={i}
                              className="from-blue to-purple mb-2 rounded-lg bg-gradient-to-r p-3 text-center text-sm font-black tracking-wider text-white last:mb-0"
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </InViewStagger>
                      <DemoVariantLabel>InViewStagger</DemoVariantLabel>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="torn" rotation="0deg" showTape={false} className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>{t.apparel.loaderCard.title}</CardTitle>
                    <CardDescription>{t.apparel.loaderCard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 lg:grid-cols-6">
                    {loaderDemoItems.map(({ label, variant, animation, size, style }) => (
                      <div
                        key={label}
                        className="grid min-h-28 grid-rows-[1fr_auto_auto] place-items-center gap-2 px-2 py-3 text-center"
                      >
                        <Loader variant={variant} animation={animation} size={size} style={style} />
                        <span className="text-[11px] font-bold tracking-wider opacity-60">
                          {label}
                        </span>
                        <DemoVariantLabel>
                          {getLoaderDemoVariantLabel({ animation, size, variant })}
                        </DemoVariantLabel>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          {/* Banner divider: Motion primitives → Page Transition */}
          <BannerDivider tapes={createTwoTapeDivider('design2', 'yellow')} animate />

          <PageTransitionDemo t={t.pageTransition} />

          {/* Banner divider: Motion & Media → Carousels */}
          <BannerDivider tapes={createTwoTapeDivider('design3', 'yellow')} animate />

          {/* ────────────────────────────────────────────────────────
         Motion & Media — Carousels
         ──────────────────────────────────────────────────────── */}
          <Section
            id="carousels"
            size="md"
            backgroundClassName="bg-blue"
            textClassName="text-white"
            pattern="tapes-purple"
            bottomOverlayClearance="banner-divider"
            className="flex flex-col items-center transition-colors duration-300"
            headingTape={
              <div className="text-center">
                <HeadingTape>{t.carousels.sectionTitle}</HeadingTape>
                <p className="mt-2 text-sm font-medium text-white/80">{t.carousels.sectionDesc}</p>
              </div>
            }
          >
            <DemoContent>
              {/* 3D Splat Gallery */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider">
                  {t.carousels.feed.title}
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  {t.carousels.feed.desc}
                </p>
                <FeedCarousel defaultIndex={2} items={homepageFeedCarouselItems} />
              </DemoExampleGroup>

              {/* Weapons Gallery Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider">
                  {t.carousels.weapons.title}
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  {t.carousels.weapons.desc}
                </p>
                <WeaponsGalleryCarousel items={weaponsGalleryItems} />
              </DemoExampleGroup>

              {/* Shops Gallery Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider">
                  {t.carousels.shops.title}
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  {t.carousels.shops.desc}
                </p>
                <IconPaginatedCarousel items={shopsGalleryItems} />
              </DemoExampleGroup>

              {/* Marquee Carousel */}
              <DemoExampleGroup>
                <h3 className="text-center text-xl font-black tracking-wider">
                  {t.carousels.marquee.title}
                </h3>
                <p className="mx-auto max-w-xl text-center text-sm font-medium text-white/80">
                  {t.carousels.marquee.desc}
                </p>
                <MarqueeCarousel items={marqueeItems} />
              </DemoExampleGroup>
            </DemoContent>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
