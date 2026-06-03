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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Heart, Info, MoreHorizontal, Settings, Star, Zap, Skull, Flame } from 'lucide-react'

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="sticker">
            <Zap className="mr-1 h-3 w-3" />
            Component Library
          </Badge>
          <h1 className="splat-skew text-5xl font-black uppercase tracking-wider">
            Splatoon UI
          </h1>
          <p className="max-w-md text-muted-foreground font-medium">
            Scrapbook-inspired component library built on shadcn/ui + Radix
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

        

        <Tabs defaultValue="preview" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Components</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

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

          <TabsContent value="cards" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Default Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Sharp border, solid shadow, skewed title</CardDescription>
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

              {/* Torn Edge Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Card</CardTitle>
                  <CardDescription>Flat geometric edges</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with geometric borders
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* Tape Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Tape Decoration</CardTitle>
                  <CardDescription>Rotated card</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card styling
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* Ink Splatter Card */}
              <Card className="ink-splatter md:col-span-2">
                <CardHeader>
                  <CardTitle>Ink Splatter</CardTitle>
                  <CardDescription>Subtle ink overlay on the background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with a faint ink splatter effect using radial gradients.
                    Look closely at the edges for the blue and yellow ink spots.
                  </p>
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

        

        <Card className="max-w-md">
          <CardFooter className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
            <span>splatoon-ui v0.1.0</span>
            <span>Next.js + Radix + Tailwind CSS</span>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
